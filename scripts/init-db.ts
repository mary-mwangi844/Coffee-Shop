import { initDb } from '../lib/db'

async function main() {
  try {
    console.log('Initializing database...')
    await initDb()
    console.log('Database initialized successfully!')
    console.log('Tables created: users, products, orders, order_items, cart')
    console.log('Sample products inserted')
  } catch (error) {
    console.error('Error initializing database:', error)
    process.exit(1)
  }
}

main()
