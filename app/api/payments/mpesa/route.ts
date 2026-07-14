/**
 * Simulated M-Pesa STK Push.
 * Structured so Safaricom Daraja credentials can replace the delay later.
 */

function normalizePhone(phone: string): string | null {
  const digits = phone.replace(/\D/g, '')
  if (/^0(7|1)\d{8}$/.test(digits)) return `254${digits.slice(1)}`
  if (/^254(7|1)\d{8}$/.test(digits)) return digits
  if (/^(7|1)\d{8}$/.test(digits)) return `254${digits}`
  return null
}

export async function POST(req: Request) {
  try {
    const { phone, amount } = await req.json()

    if (!phone || amount == null || Number(amount) <= 0) {
      return Response.json(
        { error: 'Valid phone and amount are required' },
        { status: 400 }
      )
    }

    const msisdn = normalizePhone(String(phone))
    if (!msisdn) {
      return Response.json(
        { error: 'Enter a valid Kenyan M-Pesa number' },
        { status: 400 }
      )
    }

    // Simulate STK prompt latency
    await new Promise((resolve) => setTimeout(resolve, 900))

    const paymentRef = `MPX${Date.now().toString(36).toUpperCase()}${Math.random()
      .toString(36)
      .slice(2, 6)
      .toUpperCase()}`

    return Response.json({
      success: true,
      simulated: true,
      message: 'STK push accepted (simulated). Customer confirmed payment.',
      phone: msisdn,
      amount: Number(amount),
      paymentRef,
      checkoutRequestId: `ws_CO_${Date.now()}`,
      resultCode: 0,
      resultDesc: 'The service request is processed successfully.',
    })
  } catch (error) {
    return Response.json(
      {
        error: 'M-Pesa request failed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
