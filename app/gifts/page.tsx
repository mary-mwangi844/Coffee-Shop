'use client'

import { useState } from 'react'
import GiftCard from '@/components/GiftCard'
import PaymentModal from '@/components/PaymentModal'

const giftItems = [
  {
    name: 'Classic Pancakes',
    description: 'Fluffy buttermilk pancakes served with maple syrup and butter. A timeless breakfast companion.',
    price: 'KES 1040',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    alt: 'Classic Pancakes'
  },
  {
    name: 'Chocolate Cake',
    description: 'Rich, moist chocolate layers with ganache frosting. Decadent and perfect with a dark roast.',
    price: 'KES 850',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    alt: 'Chocolate Cake'
  },
  {
    name: 'Coffee Cookies',
    description: 'Crunchy cookies infused with espresso and chocolate chips. Made for coffee lovers.',
    price: 'KES 450',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    alt: 'Coffee Cookies'
  },
  {
    name: 'Caramel Flan',
    description: 'Silky custard with a layer of soft caramel on top. A delicate dessert with rich flavor.',
    price: 'KES 720',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
    alt: 'Caramel Flan'
  }
]

export default function Gifts() {
  const [orderMessage, setOrderMessage] = useState('')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const handleOrder = (itemName: string) => {
    const item = giftItems.find(i => i.name === itemName)
    if (item) {
      setSelectedItem(item)
      setIsPaymentModalOpen(true)
    }
  }

  const handlePaymentConfirm = async (paymentMethod: string, paymentDetails: any, orderDetails: any) => {
    setIsPaymentModalOpen(false)
    
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          itemName: selectedItem.name,
          type: 'gift',
          price: selectedItem.price,
          paymentMethod,
          paymentDetails,
          orderDetails,
          customerInfo: {
            name: orderDetails.name,
            phone: orderDetails.phone,
            address: orderDetails.address,
            wantsDelivery: orderDetails.wantsDelivery,
            transportMode: orderDetails.transportMode
          }
        }),
      })

      const data = await response.json()
      if (data.success) {
        setOrderMessage(`Order placed for ${selectedItem.name}! Payment: ${paymentMethod}`)
        setTimeout(() => setOrderMessage(''), 3000)
      }
    } catch (error) {
      setOrderMessage('Failed to place order')
      setTimeout(() => setOrderMessage(''), 3000)
    }
  }

  return (
    <>
      {orderMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          background: '#4E342E',
          color: '#C19A6B',
          padding: '15px 25px',
          borderRadius: '10px',
          zIndex: 1000,
          boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
        }}>
          {orderMessage}
        </div>
      )}
      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onConfirm={handlePaymentConfirm}
        itemName={selectedItem?.name || ''}
        price={selectedItem?.price || ''}
      />
      <section id="gifts" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&h=1080&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', paddingTop: '100px' }}>
        <h2 className="section-title">Gifts & Snacks</h2>
        <p className="section-subtitle">Sweet treats to pair with your favorite brew</p>

        <div className="gifts-grid">
          {giftItems.map((item) => (
            <GiftCard key={item.name} {...item} onOrder={handleOrder} />
          ))}
        </div>
      </section>
    </>
  )
}
