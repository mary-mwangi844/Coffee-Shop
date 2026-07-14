const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'mayas_coffee_shop.db')

try {
  const db = new Database(dbPath)
  
  console.log('Database Verification')
  console.log('===================')
  
  // Get all tables
  const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all()
  console.log('\nTables created:')
  tables.forEach(table => console.log(`  - ${table.name}`))
  
  // Check products
  const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get()
  console.log(`\nProducts in database: ${productCount.count}`)
  
  // Sample products
  const products = db.prepare('SELECT id, name, price, category FROM products LIMIT 5').all()
  console.log('\nSample products:')
  products.forEach(p => console.log(`  - ${p.name} (KES ${p.price}) - ${p.category}`))
  
  // Check users
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
  console.log(`\nUsers in database: ${userCount.count}`)
  
  // Check orders
  const orderCount = db.prepare('SELECT COUNT(*) as count FROM orders').get()
  console.log(`\nOrders in database: ${orderCount.count}`)
  
  db.close()
  
  console.log('\n✓ Database verification complete!')
} catch (error) {
  console.error('Error verifying database:', error)
  process.exit(1)
}
