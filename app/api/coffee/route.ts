import { NextResponse } from 'next/server'

const coffeeItems = [
  {
    id: 1,
    name: 'Espresso',
    description: 'A concentrated, full-flavored coffee brewed by forcing hot water through finely ground beans. Rich, bold, and the foundation of all great coffee drinks.',
    price: 'KES 450',
    image: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=300&fit=crop',
    alt: 'Espresso'
  },
  {
    id: 2,
    name: 'Cappuccino',
    description: 'Equal parts espresso, steamed milk, and milk foam. Creamy, balanced, and topped with a light dusting of cocoa for the perfect morning indulgence.',
    price: 'KES 580',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=300&fit=crop',
    alt: 'Cappuccino'
  },
  {
    id: 3,
    name: 'Iced Latte',
    description: 'Espresso combined with chilled milk and served over ice. Refreshing, smooth, and the perfect companion for warm afternoons.',
    price: 'KES 650',
    image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=300&fit=crop',
    alt: 'Iced Latte'
  },
  {
    id: 4,
    name: 'Mocha',
    description: 'A decadent blend of espresso, chocolate syrup, and steamed milk. Topped with whipped cream for a sweet, luxurious treat.',
    price: 'KES 720',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400&h=300&fit=crop',
    alt: 'Mocha'
  },
  {
    id: 5,
    name: 'Americano',
    description: 'Espresso diluted with hot water for a lighter, smoother taste that retains the rich flavor profile of the original shot.',
    price: 'KES 490',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=300&fit=crop',
    alt: 'Americano'
  },
  {
    id: 6,
    name: 'Caramel Macchiato',
    description: 'Vanilla-flavored milk marked with espresso and topped with caramel drizzle. Sweet, layered, and visually stunning.',
    price: 'KES 680',
    image: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=300&fit=crop',
    alt: 'Caramel Macchiato'
  }
]

export async function GET() {
  return NextResponse.json(coffeeItems)
}
