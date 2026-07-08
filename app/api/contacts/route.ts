import { NextResponse } from 'next/server'

const contactInfo = {
  phone: '0701637878',
  email: 'mayamwangi2004@gmail.com',
  location: 'Nairobi, Kenya',
  founded: '2015'
}

export async function GET() {
  return NextResponse.json(contactInfo)
}
