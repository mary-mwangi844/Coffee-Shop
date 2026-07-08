import { useState } from 'react'

interface OrderFormProps {
  itemName: string
  price: string
  onSubmit: (formData: any) => void
}

export default function OrderForm({ itemName, price, onSubmit }: OrderFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    wantsDelivery: false,
    transportMode: ''
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="order-form">
      <div className="order-form-header">
        <h3>Order Details</h3>
        <p>Item: {itemName}</p>
        <p>Price: {price}</p>
        <p className="contact-hint">Or call us at 0701637878 to order</p>
      </div>

      <div className="form-group">
        <label htmlFor="name">Full Name *</label>
        <input
          type="text"
          id="name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Enter your full name"
        />
      </div>

      <div className="form-group">
        <label htmlFor="phone">Phone Number *</label>
        <input
          type="tel"
          id="phone"
          required
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="Enter your phone number"
        />
      </div>

      <div className="form-group">
        <label htmlFor="address">Address *</label>
        <input
          type="text"
          id="address"
          required
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="Enter your address"
        />
      </div>

      <div className="form-group">
        <label htmlFor="delivery">Do you want delivery?</label>
        <select
          id="delivery"
          value={formData.wantsDelivery ? 'yes' : 'no'}
          onChange={(e) => setFormData({ ...formData, wantsDelivery: e.target.value === 'yes' })}
        >
          <option value="no">No - I'll pick it up</option>
          <option value="yes">Yes - Deliver to me</option>
        </select>
      </div>

      {formData.wantsDelivery && (
        <div className="form-group">
          <label htmlFor="transport">Transportation Mode *</label>
          <select
            id="transport"
            required
            value={formData.transportMode}
            onChange={(e) => setFormData({ ...formData, transportMode: e.target.value })}
          >
            <option value="">Select transport mode</option>
            <option value="bodaboda">Bodaboda (Motorcycle)</option>
            <option value="car">Car Delivery</option>
          </select>
        </div>
      )}

      <button type="submit" className="submit-order-btn">Continue to Payment</button>
    </form>
  )
}
