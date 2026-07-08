'use client'

import { useState } from 'react'
import CoffeeCard from '@/components/CoffeeCard'
import PaymentModal from '@/components/PaymentModal'

const coffeeItems = [
  {
    name: 'Espresso',
    description: 'A concentrated, full-flavored coffee brewed by forcing hot water through finely ground beans. Rich, bold, and the foundation of all great coffee drinks.',
    price: 'KES 450',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
    alt: 'Espresso'
  },
  {
    name: 'Cappuccino',
    description: 'Equal parts espresso, steamed milk, and milk foam. Creamy, balanced, and topped with a light dusting of cocoa for the perfect morning indulgence.',
    price: 'KES 580',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    alt: 'Cappuccino'
  },
  {
    name: 'Iced Latte',
    description: 'Espresso combined with chilled milk and served over ice. Refreshing, smooth, and the perfect companion for warm afternoons.',
    price: 'KES 650',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    alt: 'Iced Latte'
  },
  {
    name: 'Mocha',
    description: 'A decadent blend of espresso, chocolate syrup, and steamed milk. Topped with whipped cream for a sweet, luxurious treat.',
    price: 'KES 720',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=300&fit=crop',
    alt: 'Mocha'
  },
  {
    name: 'Americano',
    description: 'Espresso diluted with hot water for a lighter, smoother taste that retains the rich flavor profile of the original shot.',
    price: 'KES 490',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
    alt: 'Americano'
  },
  {
    name: 'Caramel Macchiato',
    description: 'Vanilla-flavored milk marked with espresso and topped with caramel drizzle. Sweet, layered, and visually stunning.',
    price: 'KES 680',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop',
    alt: 'Caramel Macchiato'
  }
]

export default function Coffee() {
  const [orderMessage, setOrderMessage] = useState('')
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<any>(null)

  const handleOrder = (itemName: string) => {
    const item = coffeeItems.find(i => i.name === itemName)
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
          type: 'coffee',
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
      <section id="coffee" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1920&h=1080&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', paddingTop: '100px' }}>
        <h2 className="section-title">Our Coffee</h2>
        <p className="section-subtitle">Handcrafted beverages made with premium beans</p>

        <div className="coffee-grid">
          {coffeeItems.map((item) => (
            <CoffeeCard key={item.name} {...item} onOrder={handleOrder} />
          ))}
        </div>
      </section>
    </>
  )
}
