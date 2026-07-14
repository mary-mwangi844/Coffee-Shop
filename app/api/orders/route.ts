import { getDb } from '@/lib/db'

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

function ensurePaymentRefColumn(db: ReturnType<typeof getDb>) {
  try {
    const cols = db.prepare('PRAGMA table_info(orders)').all() as { name: string }[]
    if (!cols.some((c) => c.name === 'payment_ref')) {
      db.exec('ALTER TABLE orders ADD COLUMN payment_ref TEXT')
    }
  } catch {
    /* ignore */
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const userId = searchParams.get('userId')
    const email = searchParams.get('email')

    if (!userId && !email) {
      return Response.json(
        { error: 'userId or email is required' },
        { status: 400 }
      )
    }

    const db = getDb()
    ensurePaymentRefColumn(db)

    let orders
    if (userId) {
      orders = db
        .prepare(
          `SELECT id, user_id, order_number, name, email, phone, address,
                  payment_method, payment_ref, total, status, created_at
           FROM orders WHERE user_id = ? ORDER BY created_at DESC`
        )
        .all(Number(userId))
    } else {
      orders = db
        .prepare(
          `SELECT id, user_id, order_number, name, email, phone, address,
                  payment_method, payment_ref, total, status, created_at
           FROM orders WHERE LOWER(email) = LOWER(?) ORDER BY created_at DESC`
        )
        .all(email)
    }

    const getItems = db.prepare(
      `SELECT product_name, quantity, price, total
       FROM order_items WHERE order_id = ?`
    )

    const withItems = (orders as Record<string, unknown>[]).map((order) => ({
      ...order,
      items: getItems.all(order.id as number),
    }))

    db.close()
    return Response.json({ orders: withItems })
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to fetch orders',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {
      name,
      email,
      phone,
      address,
      paymentMethod,
      items,
      total,
      userId,
      status: requestedStatus,
      paymentRef,
    } = body

    if (!name || !email || !phone || !items?.length || total == null) {
      return Response.json(
        { error: 'Missing required order fields' },
        { status: 400 }
      )
    }

    const db = getDb()
    ensurePaymentRefColumn(db)
    const orderNumber = generateOrderNumber()

    let status = requestedStatus || 'pending'
    if (!requestedStatus) {
      if (paymentMethod === 'cash') status = 'pending'
      else if (paymentMethod === 'card') status = 'awaiting_payment'
      else if (paymentMethod === 'mpesa') status = 'confirmed'
    }

    const orderResult = db
      .prepare(
        `INSERT INTO orders
          (user_id, order_number, name, email, phone, address, payment_method, payment_ref, total, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      )
      .run(
        userId ?? null,
        orderNumber,
        name,
        email,
        phone,
        address || null,
        paymentMethod,
        paymentRef || null,
        total,
        status
      )

    const orderId = orderResult.lastInsertRowid as number

    const insertItem = db.prepare(
      `INSERT INTO order_items (order_id, product_name, quantity, price, total)
       VALUES (?, ?, ?, ?, ?)`
    )

    for (const item of items) {
      const unitPrice =
        item.price ??
        (item.quantity ? item.totalPrice / item.quantity : item.totalPrice)
      insertItem.run(
        orderId,
        item.name,
        item.quantity,
        unitPrice,
        item.totalPrice
      )
    }

    db.close()

    return Response.json({
      success: true,
      message: 'Order placed successfully',
      orderNumber,
      orderId,
      status,
      paymentRef: paymentRef || null,
    })
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to place order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
