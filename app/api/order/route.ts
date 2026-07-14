import { Resend } from 'resend';

const coffeePrices: { [key: string]: number } = {
  'Espresso': 200,
  'Americano': 250,
  'Cappuccino': 300,
  'Latte': 350,
  'Mocha': 400,
  'Macchiato': 320,
  'Flat White': 380,
  'Cold Brew': 280,
  'Iced Coffee': 260,
  'Affogato': 450
};

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const { name, email, phone, coffeeType, quantity, deliveryOption, address } = await req.json();

    const orderNumber = generateOrderNumber();
    const price = coffeePrices[coffeeType] || 0;
    const totalPrice = price * quantity;

    // Admin notification email
    const adminEmailText = `
New Order Received!

Order Number: ${orderNumber}

Customer Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Order Details:
- Coffee Type: ${coffeeType}
- Quantity: ${quantity}
- Unit Price: KES ${price}
- Total Price: KES ${totalPrice}

Delivery Option: ${deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}
${deliveryOption === 'delivery' ? `- Address: ${address}` : ''}

Order placed on: ${new Date().toLocaleString()}
    `.trim();

    // Customer confirmation email
    const customerEmailText = `
Order Confirmation - ${orderNumber}

Dear ${name},

Thank you for your order! We have received your order and will process it shortly.

Order Details:
- Order Number: ${orderNumber}
- Item: ${coffeeType}
- Quantity: ${quantity}
- Unit Price: KES ${price}
- Total Price: KES ${totalPrice}

Delivery Option: ${deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}
${deliveryOption === 'delivery' ? `- Address: ${address}` : ''}

We will contact you at ${phone} to confirm your order details.

Thank you for choosing Maya's Coffee Shop!

Best regards,
Maya's Coffee Shop Team
    `.trim();

    // Send admin notification
    const adminResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['mayamwangi2004@gmail.com'],
      subject: `New Order ${orderNumber} from ${name} - ${coffeeType}`,
      replyTo: email,
      text: adminEmailText,
    });

    if (adminResult.error) {
      return Response.json({ 
        error: 'Failed to send admin notification',
        details: adminResult.error.message 
      }, { status: 500 });
    }

    // Send customer confirmation
    const customerResult = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [email],
      subject: `Order Confirmation - ${orderNumber}`,
      text: customerEmailText,
    });

    if (customerResult.error) {
      return Response.json({ 
        error: 'Failed to send customer confirmation email',
        details: customerResult.error.message 
      }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: 'Order placed successfully',
      orderNumber,
      totalPrice,
      adminEmail: adminResult.data,
      customerEmail: customerResult.data
    });
  } catch (error) {
    return Response.json({ 
      error: 'Failed to process order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}