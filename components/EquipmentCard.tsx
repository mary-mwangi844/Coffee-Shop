interface EquipmentCardProps {
  name: string
  description: string
  image: string
  alt: string
}

export default function EquipmentCard({ name, description, image, alt }: EquipmentCardProps) {
  return (
    <div className="equipment-card">
      <img src={image} alt={alt} className="equipment-icon" />
      <h3>{name}</h3>
      <p>{description}</p>
    </div>
  )
}
