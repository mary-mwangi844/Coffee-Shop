'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

type Snapshot = {
  orderNumber: string
  items: { name: string; quantity: number; totalPrice: number }[]
  address: string
  paymentMethod: string
  status: string
  total: number
  paymentRef?: string
  name?: string
}

function paymentLabel(method: string) {
  if (method === 'mpesa') return 'M-Pesa'
  if (method === 'cash') return 'Cash on delivery'
  if (method === 'card') return 'Card'
  return method
}

function ConfirmationInner() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get('order') || ''
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null)
  const [apiOrder, setApiOrder] = useState<Record<string, unknown> | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!orderNumber) {
      setReady(true)
      return
    }

    try {
      const raw = sessionStorage.getItem(`order-snapshot-${orderNumber}`)
      if (raw) setSnapshot(JSON.parse(raw) as Snapshot)
    } catch {
      /* ignore */
    }

    ;(async () => {
      try {
        const res = await fetch(
          `/api/orders/${encodeURIComponent(orderNumber)}`
        )
        if (res.ok) {
          const data = await res.json()
          setApiOrder(data.order)
        }
      } catch {
        /* ignore */
      } finally {
        setReady(true)
      }
    })()
  }, [orderNumber])

  if (!ready) {
    return <div className="confirm-page page-loading" />
  }

  if (!orderNumber) {
    return (
      <div className="confirm-page">
        <header className="page-intro anim-rise">
          <h1>No order found</h1>
          <Link href="/menu" className="btn btn-primary">
            Continue shopping
          </Link>
        </header>
      </div>
    )
  }

  const status =
    (apiOrder?.status as string) || snapshot?.status || 'pending'
  const address =
    (apiOrder?.address as string) || snapshot?.address || '—'
  const paymentMethod =
    (apiOrder?.payment_method as string) ||
    snapshot?.paymentMethod ||
    '—'
  const total = (apiOrder?.total as number) ?? snapshot?.total
  const items =
    snapshot?.items ||
    (
      (apiOrder?.items as {
        product_name: string
        quantity: number
        total: number
      }[]) || []
    ).map((i) => ({
      name: i.product_name,
      quantity: i.quantity,
      totalPrice: i.total,
    }))

  return (
    <div className="confirm-page">
      <header className="page-intro anim-rise">
        <p className="section-eyebrow">Thank you</p>
        <h1>Order confirmed</h1>
        <p>
          We received <strong>{orderNumber}</strong>. You’ll see it under My
          Orders.
        </p>
      </header>

      <div className="confirm-layout">
        <section className="confirm-card anim-rise">
          <h2>Summary</h2>
          <dl className="confirm-meta">
            <div>
              <dt>Order</dt>
              <dd>{orderNumber}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>
                <span className={`status-chip status-${status}`}>{status}</span>
              </dd>
            </div>
            <div>
              <dt>Payment</dt>
              <dd>{paymentLabel(paymentMethod)}</dd>
            </div>
            {Boolean(snapshot?.paymentRef || apiOrder?.payment_ref) ? (
              <div>
                <dt>Payment ref</dt>
                <dd>
                  {String(snapshot?.paymentRef || apiOrder?.payment_ref || '')}
                </dd>
              </div>
            ) : null}
            <div>
              <dt>Delivery</dt>
              <dd>{address}</dd>
            </div>
            {total != null && (
              <div>
                <dt>Total</dt>
                <dd>KES {total}</dd>
              </div>
            )}
          </dl>

          {items.length > 0 && (
            <>
              <h3>Items</h3>
              <ul className="confirm-items">
                {items.map((item, i) => (
                  <li key={`${item.name}-${i}`}>
                    <span>
                      {item.name} ×{item.quantity}
                    </span>
                    <span>KES {item.totalPrice}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </section>

        <aside className="confirm-actions anim-rise anim-rise-2">
          <Link href="/account/orders" className="btn btn-primary">
            My Orders
          </Link>
          <Link href="/menu" className="btn btn-secondary">
            Continue shopping
          </Link>
        </aside>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div className="confirm-page page-loading" />}>
      <ConfirmationInner />
    </Suspense>
  )
}
