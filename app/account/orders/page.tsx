'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { readUser, type StoredUser } from '@/lib/cart'
import { menuCatalog } from '@/lib/menu-catalog'

type OrderItem = {
  product_name: string
  quantity: number
  price: number
  total: number
}

type Order = {
  id: number
  order_number: string
  status: string
  total: number
  payment_method: string
  address: string
  phone?: string
  email?: string
  payment_ref?: string
  created_at: string
  items: OrderItem[]
}

type OrderFilter = 'all' | 'open' | 'closed' | 'awaiting'

type NavId =
  | 'orders'
  | 'inbox'
  | 'reviews'
  | 'wishlist'
  | 'addresses'
  | 'details'

function displayStatus(order: Order): string {
  const raw = (order.status || 'pending').toLowerCase()
  if (raw === 'delivered') return 'delivered'
  if (raw === 'confirmed' || raw === 'paid') return 'processing'
  if (raw === 'awaiting_payment') return 'awaiting_payment'
  if (raw === 'out_for_delivery') return 'out_for_delivery'
  if (raw === 'pending') {
    const created = new Date(order.created_at).getTime()
    const ageHours = (Date.now() - created) / (1000 * 60 * 60)
    if (ageHours >= 48) return 'delivered'
    if (ageHours >= 2) return 'out_for_delivery'
    return 'processing'
  }

  const created = new Date(order.created_at).getTime()
  const ageHours = (Date.now() - created) / (1000 * 60 * 60)
  if (ageHours >= 48) return 'delivered'
  if (ageHours >= 2) return 'out_for_delivery'
  return 'processing'
}

function statusLabel(chip: string) {
  switch (chip) {
    case 'delivered':
      return 'Delivered'
    case 'out_for_delivery':
      return 'Out for delivery'
    case 'awaiting_payment':
      return 'Awaiting payment'
    case 'processing':
      return 'Processing'
    default:
      return chip.replace(/_/g, ' ')
  }
}

function isClosed(chip: string) {
  return chip === 'delivered'
}

function isAwaiting(chip: string) {
  return chip === 'awaiting_payment'
}

function paymentLabel(method: string) {
  if (method === 'mpesa') return 'M-Pesa'
  if (method === 'cash') return 'Cash on delivery'
  if (method === 'card') return 'Card'
  return method
}

function userName(user: StoredUser | null) {
  if (!user) return 'Guest'
  const first = user.first_name || user.firstName || ''
  const last = user.last_name || user.lastName || ''
  const full = `${first} ${last}`.trim()
  if (full) return full
  if (user.email) return user.email.split('@')[0]
  return 'Guest'
}

function userInitials(user: StoredUser | null) {
  const name = userName(user)
  const parts = name.split(/\s+/).filter(Boolean)
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return name.slice(0, 2).toUpperCase()
}

function itemThumb(name: string) {
  const match = menuCatalog.find(
    (m) => m.name.toLowerCase() === name.toLowerCase()
  )
  return match?.image
}

function timelineStep(chip: string): number {
  switch (chip) {
    case 'awaiting_payment':
      return 0
    case 'processing':
      return 1
    case 'out_for_delivery':
      return 2
    case 'delivered':
      return 3
    default:
      return 1
  }
}

const SIDEBAR: { id: NavId; label: string; count?: boolean }[] = [
  { id: 'orders', label: 'Orders', count: true },
  { id: 'inbox', label: 'Inbox' },
  { id: 'reviews', label: 'Pending Reviews' },
  { id: 'wishlist', label: 'Saved items' },
  { id: 'addresses', label: 'Address Book' },
  { id: 'details', label: 'Account Details' },
]

export default function AccountOrdersPage() {
  const router = useRouter()
  const [user, setUser] = useState<StoredUser | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState<OrderFilter>('all')
  const [query, setQuery] = useState('')
  const [nav, setNav] = useState<NavId>('orders')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [mobileNav, setMobileNav] = useState(false)

  const load = async (u: StoredUser) => {
    setLoading(true)
    setError('')
    try {
      const qs = u.id
        ? `userId=${u.id}`
        : `email=${encodeURIComponent(u.email || '')}`
      const res = await fetch(`/api/orders?${qs}`)
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to load orders')
      setOrders(data.orders || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const u = readUser()
    if (!u) {
      router.replace('/login?next=/account/orders')
      return
    }
    setUser(u)
    load(u)
  }, [router])

  const markDelivered = async (orderNumber: string) => {
    const res = await fetch(`/api/orders/${encodeURIComponent(orderNumber)}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'delivered' }),
    })
    if (res.ok && user) await load(user)
  }

  const logout = () => {
    localStorage.removeItem('user')
    window.dispatchEvent(new Event('auth-change'))
    router.push('/')
  }

  const enriched = useMemo(
    () =>
      orders.map((order) => ({
        order,
        chip: displayStatus(order),
      })),
    [orders]
  )

  const counts = useMemo(() => {
    let open = 0
    let closed = 0
    let awaiting = 0
    for (const { chip } of enriched) {
      if (isAwaiting(chip)) awaiting += 1
      else if (isClosed(chip)) closed += 1
      else open += 1
    }
    return { all: enriched.length, open, closed, awaiting }
  }, [enriched])

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase()
    return enriched.filter(({ order, chip }) => {
      if (filter === 'open' && (isClosed(chip) || isAwaiting(chip))) return false
      if (filter === 'closed' && !isClosed(chip)) return false
      if (filter === 'awaiting' && !isAwaiting(chip)) return false
      if (!q) return true
      const hay = [
        order.order_number,
        order.address,
        order.payment_method,
        ...(order.items || []).map((i) => i.product_name),
      ]
        .join(' ')
        .toLowerCase()
      return hay.includes(q)
    })
  }, [enriched, filter, query])

  if (loading && !user) {
    return <div className="account-hub page-loading" />
  }

  return (
    <div className="account-hub">
      <div className="account-hub-bg" aria-hidden="true" />

      <header className="account-greet anim-rise">
        <div className="account-greet-inner">
          <div className="account-greet-left">
            <div className="account-avatar" aria-hidden="true">
              {userInitials(user)}
            </div>
            <div>
              <p className="account-greet-eyebrow">My Maya Account</p>
              <h1>
                Hi, <em>{userName(user).split(' ')[0]}</em>
              </h1>
              <p className="account-greet-meta">
                {user?.email || user?.phone || 'Manage orders & deliveries'}
              </p>
            </div>
          </div>
          <div className="account-greet-actions">
            <Link href="/menu" className="btn btn-secondary account-shop-btn">
              Continue shopping
            </Link>
            <button type="button" className="account-logout" onClick={logout}>
              Log out
            </button>
          </div>
        </div>
      </header>

      <div className="account-shell">
        <button
          type="button"
          className="account-nav-toggle"
          onClick={() => setMobileNav((v) => !v)}
          aria-expanded={mobileNav}
        >
          {SIDEBAR.find((s) => s.id === nav)?.label || 'Account menu'}
          <span aria-hidden="true">{mobileNav ? '▴' : '▾'}</span>
        </button>

        <aside className={`account-sidebar ${mobileNav ? 'is-open' : ''}`}>
          <p className="account-side-label">My Account</p>
          <nav aria-label="Account sections">
            <ul>
              {SIDEBAR.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    className={nav === item.id ? 'is-active' : undefined}
                    onClick={() => {
                      setNav(item.id)
                      setMobileNav(false)
                    }}
                  >
                    <span>{item.label}</span>
                    {item.count && counts.all > 0 && (
                      <span className="account-side-count">{counts.all}</span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
          <button type="button" className="account-side-logout" onClick={logout}>
            Log out
          </button>
        </aside>

        <main className="account-main anim-rise anim-rise-2">
          {nav === 'orders' ? (
            <>
              <div className="account-panel-head">
                <div>
                  <h2>Orders</h2>
                  <p>Track deliveries the way you would on a national storefront.</p>
                </div>
                <label className="account-order-search">
                  <span className="sr-only">Search orders</span>
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by order no. or item"
                  />
                </label>
              </div>

              <div className="account-tabs" role="tablist" aria-label="Order filters">
                {(
                  [
                    { id: 'all', label: 'All', n: counts.all },
                    { id: 'open', label: 'Open orders', n: counts.open },
                    { id: 'closed', label: 'Closed orders', n: counts.closed },
                    {
                      id: 'awaiting',
                      label: 'Awaiting payment',
                      n: counts.awaiting,
                    },
                  ] as const
                ).map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={filter === tab.id}
                    className={filter === tab.id ? 'is-active' : undefined}
                    onClick={() => setFilter(tab.id)}
                  >
                    {tab.label}
                    <em>{tab.n}</em>
                  </button>
                ))}
              </div>

              {error && <p className="error-message">{error}</p>}

              {loading ? (
                <div className="account-empty-panel">
                  <div className="account-skeleton" />
                  <div className="account-skeleton" />
                </div>
              ) : visible.length === 0 ? (
                <div className="account-empty-panel">
                  <div className="account-empty-icon" aria-hidden="true">
                    ☐
                  </div>
                  <h3>You have no {filter === 'all' ? '' : `${filter} `}orders</h3>
                  <p>
                    {query
                      ? `Nothing matches “${query.trim()}”.`
                      : 'When you order from the menu, your history lands here.'}
                  </p>
                  <Link href="/menu" className="btn btn-primary">
                    Start shopping
                  </Link>
                </div>
              ) : (
                <ul className="account-orders">
                  {visible.map(({ order, chip }, index) => {
                    const step = timelineStep(chip)
                    const open = expanded === order.order_number
                    return (
                      <li
                        key={order.id}
                        className={`account-order ${open ? 'is-open' : ''}`}
                        style={{
                          animationDelay: `${Math.min(index, 8) * 45}ms`,
                        }}
                      >
                        <div className="account-order-top">
                          <div>
                            <p className="account-order-no">
                              Order <strong>{order.order_number}</strong>
                            </p>
                            <p className="account-order-placed">
                              Placed on{' '}
                              {new Date(order.created_at).toLocaleString(
                                undefined,
                                {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                }
                              )}
                            </p>
                          </div>
                          <span className={`status-chip status-${chip}`}>
                            {statusLabel(chip)}
                          </span>
                        </div>

                        <ol className="account-track" aria-label="Delivery progress">
                          {['Confirmed', 'Processing', 'On the way', 'Delivered'].map(
                            (label, i) => (
                              <li
                                key={label}
                                className={
                                  i < step
                                    ? 'is-done'
                                    : i === step
                                      ? 'is-current'
                                      : undefined
                                }
                              >
                                <span className="account-track-dot" />
                                <span className="account-track-label">{label}</span>
                              </li>
                            )
                          )}
                        </ol>

                        <ul className="account-order-items">
                          {(order.items || []).map((item, i) => {
                            const thumb = itemThumb(item.product_name)
                            return (
                              <li key={`${order.id}-${i}`}>
                                <div className="account-item-media">
                                  {thumb ? (
                                    <img src={thumb} alt="" />
                                  ) : (
                                    <span aria-hidden="true">M</span>
                                  )}
                                </div>
                                <div className="account-item-copy">
                                  <h3>{item.product_name}</h3>
                                  <p>
                                    Qty: {item.quantity} · KES {item.total}
                                  </p>
                                </div>
                              </li>
                            )
                          })}
                        </ul>

                        <div className="account-order-foot">
                          <div className="account-order-total">
                            <span>Total</span>
                            <strong>KES {order.total}</strong>
                            <em>{paymentLabel(order.payment_method)}</em>
                          </div>
                          <div className="account-order-actions">
                            <button
                              type="button"
                              className="account-action-ghost"
                              onClick={() =>
                                setExpanded(open ? null : order.order_number)
                              }
                            >
                              {open ? 'Hide details' : 'See details'}
                            </button>
                            {chip !== 'delivered' && (
                              <button
                                type="button"
                                className="account-action-primary"
                                onClick={() => markDelivered(order.order_number)}
                              >
                                Mark delivered
                              </button>
                            )}
                            {chip === 'delivered' && (
                              <Link href="/menu" className="account-action-primary">
                                Buy again
                              </Link>
                            )}
                          </div>
                        </div>

                        {open && (
                          <div className="account-order-detail">
                            <div>
                              <h4>Delivery address</h4>
                              <p>{order.address || '—'}</p>
                            </div>
                            <div>
                              <h4>Payment</h4>
                              <p>
                                {paymentLabel(order.payment_method)}
                                {order.payment_ref
                                  ? ` · Ref ${order.payment_ref}`
                                  : ''}
                              </p>
                            </div>
                            <div>
                              <h4>Contact</h4>
                              <p>
                                {order.phone || user?.phone || '—'}
                                {order.email || user?.email
                                  ? ` · ${order.email || user?.email}`
                                  : ''}
                              </p>
                            </div>
                          </div>
                        )}
                      </li>
                    )
                  })}
                </ul>
              )}
            </>
          ) : (
            <PlaceholderPanel
              title={SIDEBAR.find((s) => s.id === nav)?.label || 'Account'}
              onBack={() => setNav('orders')}
              user={user}
            />
          )}
        </main>
      </div>
    </div>
  )
}

function PlaceholderPanel({
  title,
  onBack,
  user,
}: {
  title: string
  onBack: () => void
  user: StoredUser | null
}) {
  const isDetails = title === 'Account Details'
  return (
    <div className="account-placeholder">
      <button type="button" className="account-back" onClick={onBack}>
        ← Back to orders
      </button>
      <h2>{title}</h2>
      {isDetails ? (
        <dl className="account-details-grid">
          <div>
            <dt>Name</dt>
            <dd>{userName(user)}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user?.email || '—'}</dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{user?.phone || '—'}</dd>
          </div>
        </dl>
      ) : (
        <p>
          This section mirrors Jumia’s account menu. For this coffee shop pass,
          order tracking is live — {title.toLowerCase()} is ready for a later
          expansion.
        </p>
      )}
      <Link href="/menu" className="btn btn-secondary">
        Browse menu
      </Link>
    </div>
  )
}
