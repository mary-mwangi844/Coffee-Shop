interface ContactCardProps {
  type: string
  value: string
  image: string
  alt: string
}

export default function ContactCard({ type, value, image, alt }: ContactCardProps) {
  return (
    <div className="contact-card">
      <img src={image} alt={alt} className="contact-icon" />
      <h3>{type}</h3>
      <p>{value}</p>
    </div>
  )
}
