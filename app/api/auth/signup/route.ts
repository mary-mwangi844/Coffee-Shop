import { getDb } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { firstName, lastName, email, phone, password } = await req.json()
    
    const db = getDb()
    
    // Check if user already exists
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    
    if (existingUser) {
      db.close()
      return Response.json({ error: 'User with this email already exists' }, { status: 400 })
    }
    
    // Hash password
    const hashedPassword = bcrypt.hashSync(password, 10)
    
    // Insert user
    const result = db.prepare(
      'INSERT INTO users (first_name, last_name, email, phone, password) VALUES (?, ?, ?, ?, ?)'
    ).run(firstName, lastName, email, phone, hashedPassword)
    
    db.close()
    
    return Response.json({ 
      success: true, 
      message: 'User created successfully',
      userId: result.lastInsertRowid
    })
  } catch (error) {
    return Response.json({ 
      error: 'Failed to create user',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
