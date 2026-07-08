import { NextResponse } from 'next/server'

const giftItems = [
  {
    id: 1,
    name: 'Classic Pancakes',
    description: 'Fluffy buttermilk pancakes served with maple syrup and butter. A timeless breakfast companion.',
    price: 'KES 1040',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&h=300&fit=crop',
    alt: 'Classic Pancakes'
  },
  {
    id: 2,
    name: 'Chocolate Cake',
    description: 'Rich, moist chocolate layers with ganache frosting. Decadent and perfect with a dark roast.',
    price: 'KES 850',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    alt: 'Chocolate Cake'
  },
  {
    id: 3,
    name: 'Coffee Cookies',
    description: 'Crunchy cookies infused with espresso and chocolate chips. Made for coffee lovers.',
    price: 'KES 450',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400&h=300&fit=crop',
    alt: 'Coffee Cookies'
  },
  {
    id: 4,
    name: 'Caramel Flan',
    description: 'Silky custard with a layer of soft caramel on top. A delicate dessert with rich flavor.',
    price: 'KES 720',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=300&fit=crop',
    alt: 'Caramel Flan'
  }
]

export async function GET() {
  return NextResponse.json(giftItems)
}
