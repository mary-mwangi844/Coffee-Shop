import { getDb } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    
    const db = getDb()
    
    // Find user by email
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email) as any
    
    if (!user) {
      db.close()
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    // Verify password
    const isValidPassword = bcrypt.compareSync(password, user.password)
    
    if (!isValidPassword) {
      db.close()
      return Response.json({ error: 'Invalid email or password' }, { status: 401 })
    }
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user
    
    db.close()
    
    return Response.json({ 
      success: true, 
      message: 'Login successful',
      user: userWithoutPassword
    })
  } catch (error) {
    return Response.json({ 
      error: 'Failed to login',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
