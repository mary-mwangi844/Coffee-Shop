import { getDb } from '@/lib/db'

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

export async function GET(
  _req: Request,
  context: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await context.params
    const db = getDb()
    ensurePaymentRefColumn(db)

    const order = db
      .prepare(
        `SELECT id, user_id, order_number, name, email, phone, address,
                payment_method, payment_ref, total, status, created_at
         FROM orders WHERE order_number = ?`
      )
      .get(orderNumber) as Record<string, unknown> | undefined

    if (!order) {
      db.close()
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }

    const items = db
      .prepare(
        `SELECT product_name, quantity, price, total
         FROM order_items WHERE order_id = ?`
      )
      .all(order.id as number)

    db.close()
    return Response.json({ order: { ...order, items } })
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to fetch order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  req: Request,
  context: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await context.params
    const { status } = await req.json()
    if (!status || typeof status !== 'string') {
      return Response.json({ error: 'status is required' }, { status: 400 })
    }

    const db = getDb()
    const result = db
      .prepare('UPDATE orders SET status = ? WHERE order_number = ?')
      .run(status, orderNumber)

    db.close()

    if (result.changes === 0) {
      return Response.json({ error: 'Order not found' }, { status: 404 })
    }

    return Response.json({ success: true, orderNumber, status })
  } catch (error) {
    return Response.json(
      {
        error: 'Failed to update order',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
