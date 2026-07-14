export type CartItem = {
  id: number
  name: string
  price: number
  image: string
  description?: string
  quantity: number
  totalPrice: number
  [key: string]: unknown
}

export function readCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('cart')
    if (!raw) return []
    const items = JSON.parse(raw)
    return Array.isArray(items) ? items : []
  } catch {
    return []
  }
}

export function writeCart(items: CartItem[]) {
  localStorage.setItem('cart', JSON.stringify(items))
  window.dispatchEvent(new Event('cart-change'))
}

export function cartCount(items: CartItem[] = readCart()): number {
  return items.reduce((sum, item) => sum + (item.quantity || 1), 0)
}

export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.totalPrice || item.price * item.quantity), 0)
}

/** Jumia-style: merge same product id by increasing quantity */
export function addToCart(
  product: {
    id: number
    name: string
    price: number
    image: string
    description?: string
  },
  quantity = 1
): CartItem[] {
  const cart = readCart()
  const qty = Math.max(1, quantity)
  const existingIndex = cart.findIndex((item) => item.id === product.id)

  if (existingIndex >= 0) {
    const existing = cart[existingIndex]
    const nextQty = existing.quantity + qty
    cart[existingIndex] = {
      ...existing,
      quantity: nextQty,
      totalPrice: existing.price * nextQty,
    }
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      description: product.description,
      quantity: qty,
      totalPrice: product.price * qty,
    })
  }

  writeCart(cart)
  return cart
}

export function updateCartQuantity(index: number, quantity: number): CartItem[] {
  const cart = readCart()
  if (index < 0 || index >= cart.length) return cart
  if (quantity < 1) {
    return removeCartItem(index)
  }
  cart[index] = {
    ...cart[index],
    quantity,
    totalPrice: cart[index].price * quantity,
  }
  writeCart(cart)
  return cart
}

export function removeCartItem(index: number): CartItem[] {
  const cart = readCart().filter((_, i) => i !== index)
  writeCart(cart)
  return cart
}

export function clearCart() {
  writeCart([])
}

export type StoredUser = {
  id?: number
  first_name?: string
  last_name?: string
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
}

export function readUser(): StoredUser | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}
