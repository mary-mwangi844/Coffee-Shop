import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const { name, email, phone, coffeeType, quantity, deliveryOption, address } = await req.json();

    const emailText = `
New Order Received!

Customer Details:
- Name: ${name}
- Email: ${email}
- Phone: ${phone}

Order Details:
- Coffee Type: ${coffeeType}
- Quantity: ${quantity}

Delivery Option: ${deliveryOption === 'delivery' ? 'Delivery' : 'Pickup'}
${deliveryOption === 'delivery' ? `- Address: ${address}` : ''}

Order placed on: ${new Date().toLocaleString()}
    `.trim();

    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: ['Akellovictor@gmail.com'],
      subject: `New Order from ${name} - ${coffeeType}`,
      replyTo: email,
      text: emailText,
    });

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ 
      success: true, 
      message: 'Order placed successfully',
      data 
    });
  } catch (error) {
    return Response.json({ 
      error: 'Failed to process order',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
