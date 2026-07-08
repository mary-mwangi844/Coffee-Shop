import { NextResponse } from 'next/server'

const equipmentItems = [
  {
    id: 1,
    name: 'Espresso Machine',
    description: 'Our commercial-grade espresso machines maintain precise temperature and pressure to extract the perfect shot every time.',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=200&h=200&fit=crop',
    alt: 'Espresso Machine'
  },
  {
    id: 2,
    name: 'Burr Grinder',
    description: 'Consistent grind size is crucial. Our burr grinders ensure uniform particle size for optimal extraction and flavor.',
    image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=200&h=200&fit=crop',
    alt: 'Burr Grinder'
  },
  {
    id: 3,
    name: 'Milk Frother',
    description: 'Creating silky microfoam for cappuccinos and lattes with precise temperature control and texture consistency.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&h=200&fit=crop',
    alt: 'Milk Frother'
  },
  {
    id: 4,
    name: 'Pour-Over Kettle',
    description: 'Gooseneck design allows precise water flow control for manual pour-over brewing methods and delicate extractions.',
    image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200&h=200&fit=crop',
    alt: 'Pour-Over Kettle'
  },
  {
    id: 5,
    name: 'Digital Scale',
    description: 'Precision measurement to the gram ensures the perfect coffee-to-water ratio for consistent, repeatable results.',
    image: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=200&h=200&fit=crop',
    alt: 'Digital Scale'
  },
  {
    id: 6,
    name: 'Cold Brew Tower',
    description: 'Our slow-drip cold brew towers steep coarse grounds for 12-24 hours, producing smooth, low-acidity coffee concentrate.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=200&h=200&fit=crop',
    alt: 'Cold Brew Tower'
  }
]

export async function GET() {
  return NextResponse.json(equipmentItems)
}
