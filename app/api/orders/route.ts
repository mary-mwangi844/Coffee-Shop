import { getDb } from '@/lib/db'

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `ORD-${timestamp}-${random}`
}

export async function POST(req: Request) {
  try {
    const { name, email, phone, address, paymentMethod, items, total } = await req.json()
    
    const db = getDb()
    const orderNumber = generateOrderNumber()
    
    // Insert order
    const orderResult = db.prepare(
      'INSERT INTO orders (order_number, name, email, phone, address, payment_method, total) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(orderNumber, name, email, phone, address, paymentMethod, total)
    
    const orderId = orderResult.lastInsertRowid as number
    
    // Insert order items
    const insertItem = db.prepare(
      'INSERT INTO order_items (order_id, product_name, quantity, price, total) VALUES (?, ?, ?, ?, ?)'
    )
    
    for (const item of items) {
      insertItem.run(orderId, item.name, item.quantity, item.price, item.totalPrice)
    }
    
    db.close()
    
    return Response.json({ 
      success: true, 
      message: 'Order placed successfully',
      orderNumber,
      orderId
    })
  } catch (error) {
    return Response.json({ 
      error: 'Failed to place order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
