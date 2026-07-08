import { useState } from 'react'
import OrderForm from './OrderForm'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (paymentMethod: string, paymentDetails: any, orderDetails: any) => void
  itemName: string
  price: string
}

interface PaymentDetails {
  method: string
  phone?: string
  cardNumber?: string
  accountNumber?: string
}

export default function PaymentModal({ isOpen, onClose, onConfirm, itemName, price }: PaymentModalProps) {
  const [showPaymentOptions, setShowPaymentOptions] = useState(false)
  const [orderDetails, setOrderDetails] = useState<any>(null)

  if (!isOpen) return null

  const handleOrderFormSubmit = (formData: any) => {
    setOrderDetails(formData)
    setShowPaymentOptions(true)
  }

  const handlePaymentSelect = (method: string) => {
    const paymentDetails: PaymentDetails = { method }
    
    if (method === 'mpesa') {
      const phone = prompt('Enter M-Pesa phone number:')
      if (!phone) return
      paymentDetails.phone = phone
    } else if (method === 'credit-card') {
      const cardNumber = prompt('Enter credit card number:')
      if (!cardNumber) return
      paymentDetails.cardNumber = cardNumber
    } else if (method === 'bank-transfer') {
      const accountNumber = prompt('Enter bank account number:')
      if (!accountNumber) return
      paymentDetails.accountNumber = accountNumber
    }
    
    onConfirm(method, paymentDetails, orderDetails)
  }

  const handleBack = () => {
    setShowPaymentOptions(false)
  }

  return (
    <div className="payment-modal-overlay" onClick={onClose}>
      <div className="payment-modal" onClick={(e) => e.stopPropagation()}>
        <div className="payment-modal-header">
          <h2>{showPaymentOptions ? 'Select Payment Method' : 'Complete Your Order'}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="payment-modal-body">
          {!showPaymentOptions ? (
            <OrderForm 
              itemName={itemName} 
              price={price} 
              onSubmit={handleOrderFormSubmit} 
            />
          ) : (
            <>
              {showPaymentOptions && (
                <button className="back-btn" onClick={handleBack}>← Back to Order Details</button>
              )}
              <div className="order-summary">
                <p><strong>Item:</strong> {itemName}</p>
                <p><strong>Price:</strong> {price}</p>
                <p><strong>Name:</strong> {orderDetails?.name}</p>
                <p><strong>Phone:</strong> {orderDetails?.phone}</p>
                <p><strong>Address:</strong> {orderDetails?.address}</p>
                <p><strong>Delivery:</strong> {orderDetails?.wantsDelivery ? 'Yes' : 'No'}</p>
                {orderDetails?.wantsDelivery && (
                  <p><strong>Transport:</strong> {orderDetails?.transportMode === 'bodaboda' ? 'Bodaboda' : 'Car'}</p>
                )}
              </div>
              <div className="payment-options">
                <button className="payment-option" onClick={() => handlePaymentSelect('cash')}>
                  <span className="payment-icon">💵</span>
                  <span className="payment-label">Cash</span>
                </button>
                <button className="payment-option" onClick={() => handlePaymentSelect('mpesa')}>
                  <span className="payment-icon">📱</span>
                  <span className="payment-label">M-Pesa</span>
                </button>
                <button className="payment-option" onClick={() => handlePaymentSelect('credit-card')}>
                  <span className="payment-icon">💳</span>
                  <span className="payment-label">Credit Card</span>
                </button>
                <button className="payment-option" onClick={() => handlePaymentSelect('bank-transfer')}>
                  <span className="payment-icon">🏦</span>
                  <span className="payment-label">Bank Transfer</span>
                </button>
                <button className="payment-option" onClick={() => handlePaymentSelect('online')}>
                  <span className="payment-icon">🌐</span>
                  <span className="payment-label">Online Payment</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
