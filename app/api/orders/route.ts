import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { itemName, type, price, paymentMethod, paymentDetails, orderDetails, customerInfo } = body

    // In a real application, you would:
    // 1. Validate the input
    // 2. Save to a database
    // 3. Send confirmation email
    // 4. Process payment based on paymentMethod (M-Pesa, credit card, bank transfer, etc.)
    // 5. Arrange delivery if requested (bodaboda or car)

    // For now, we'll just log the order and return a success response
    console.log('New order received:', { 
      itemName, 
      type, 
      price, 
      paymentMethod, 
      paymentDetails, 
      orderDetails,
      customerInfo 
    })

    // Calculate delivery fee if delivery is requested
    let deliveryFee = 0
    let transportMethod = 'pickup'
    
    if (orderDetails?.wantsDelivery) {
      if (orderDetails?.transportMode === 'bodaboda') {
        deliveryFee = 100 // KES 100 for bodaboda
        transportMethod = 'bodaboda'
      } else if (orderDetails?.transportMode === 'car') {
        deliveryFee = 200 // KES 200 for car delivery
        transportMethod = 'car'
      }
    }

    return NextResponse.json({
      success: true,
      message: `Order placed successfully for ${itemName} using ${paymentMethod}`,
      order: {
        id: Date.now(),
        itemName,
        type,
        price,
        paymentMethod,
        paymentDetails,
        orderDetails,
        customerInfo,
        deliveryFee,
        transportMethod,
        totalAmount: parseInt(price.replace(/\D/g, '')) + deliveryFee,
        status: 'pending',
        createdAt: new Date().toISOString()
      }
    }, { status: 201 })
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: 'Failed to place order'
    }, { status: 500 })
  }
}
