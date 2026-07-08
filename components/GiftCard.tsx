interface GiftCardProps {
  name: string
  description: string
  price: string
  image: string
  alt: string
  onOrder?: (name: string) => void
}

export default function GiftCard({ name, description, price, image, alt, onOrder }: GiftCardProps) {
  const handleOrder = () => {
    if (onOrder) {
      onOrder(name)
    }
  }

  return (
    <div className="gift-card">
      <div className="gift-img">
        <img src={image} alt={alt} />
      </div>
      <div className="gift-info">
        <h3>{name}</h3>
        <p>{description}</p>
        <span className="price">{price}</span>
        <button className="order-btn" onClick={handleOrder}>Order Now</button>
      </div>
    </div>
  )
}
