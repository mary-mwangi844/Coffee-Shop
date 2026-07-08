interface CoffeeCardProps {
  name: string
  description: string
  price: string
  image: string
  alt: string
  onOrder?: (name: string) => void
}

export default function CoffeeCard({ name, description, price, image, alt, onOrder }: CoffeeCardProps) {
  const handleOrder = () => {
    if (onOrder) {
      onOrder(name)
    }
  }

  return (
    <div className="coffee-card">
      <div className="coffee-img">
        <img src={image} alt={alt} />
      </div>
      <div className="coffee-info">
        <h3>{name}</h3>
        <p>{description}</p>
        <span className="price">{price}</span>
        <button className="order-btn" onClick={handleOrder}>Order Now</button>
      </div>
    </div>
  )
}
