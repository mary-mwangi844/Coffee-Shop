import { Resend } from 'resend';

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  const { name, email, message } = await req.json();

  const { data, error } = await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: ['mayamwangi2004@gmail.com'],
    subject: `New message from ${name}`,
    replyTo: email,
    text: message,
  });

  if (error) {
    return Response.json({ error }, { status: 500 });
  }
  return Response.json({ data });
}