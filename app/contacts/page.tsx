import ContactCard from '@/components/ContactCard'

const contactItems = [
  {
    type: 'Phone',
    value: '0701637878',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
    alt: 'Phone'
  },
  {
    type: 'Email',
    value: 'mayamwangi2004@gmail.com',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=200&fit=crop',
    alt: 'Email'
  }
]

export default function Contacts() {
  return (
    <>
      <section id="contacts" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=1920&h=1080&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed', minHeight: '100vh', paddingTop: '100px' }}>
        <h2 className="section-title">Contact Us</h2>
        <p className="section-subtitle">Get in touch with us</p>

        <div className="contacts-container">
          {contactItems.map((item) => (
            <ContactCard key={item.type} {...item} />
          ))}
        </div>
      </section>
    </>
  )
}
