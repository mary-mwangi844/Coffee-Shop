const Database = require('better-sqlite3')
const path = require('path')

const dbPath = path.join(__dirname, '..', 'mayas_coffee_shop.db')

function initDb() {
  const db = new Database(dbPath)
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      image TEXT,
      category TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      order_number TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT,
      payment_method TEXT NOT NULL,
      total REAL NOT NULL,
      status TEXT DEFAULT 'pending',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS order_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id INTEGER NOT NULL,
      product_id INTEGER,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      price REAL NOT NULL,
      total REAL NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );

    CREATE TABLE IF NOT EXISTS cart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      product_id INTEGER,
      quantity INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (product_id) REFERENCES products(id)
    );
  `)
  
  const insertProducts = db.prepare(`
    INSERT OR IGNORE INTO products (name, description, price, image, category) VALUES
    ('Espresso', 'Rich and bold espresso shot', 200, 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400&h=400&fit=crop', 'drink'),
    ('Americano', 'Smooth americano with hot water', 250, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=400&h=400&fit=crop', 'drink'),
    ('Cappuccino', 'Creamy cappuccino with foam', 300, 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop', 'drink'),
    ('Latte', 'Smooth latte with steamed milk', 350, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 'drink'),
    ('Mocha', 'Chocolate mocha with whipped cream', 400, 'https://images.unsplash.com/photo-1578319439584-104c94d37305?w=400&h=400&fit=crop', 'drink'),
    ('Macchiato', 'Espresso with a dollop of foam', 320, 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400&h=400&fit=crop', 'drink'),
    ('Flat White', 'Velvety flat white with microfoam', 380, 'https://images.unsplash.com/photo-1534778101976-62847782c213?w=400&h=400&fit=crop', 'drink'),
    ('Cold Brew', 'Smooth cold brew coffee', 280, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=400&h=400&fit=crop', 'drink'),
    ('Iced Coffee', 'Refreshing iced coffee', 260, 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400&h=400&fit=crop', 'drink'),
    ('Affogato', 'Espresso over vanilla ice cream', 450, 'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=400&h=400&fit=crop', 'drink'),
    ('Chocolate Cake', 'Decadent chocolate cake', 450, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=400&fit=crop', 'cake'),
    ('Red Velvet Cake', 'Classic red velvet with cream cheese frosting', 480, 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=400&h=400&fit=crop', 'cake'),
    ('Cheesecake', 'Creamy New York cheesecake', 420, 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400&h=400&fit=crop', 'cake'),
    ('Carrot Cake', 'Moist carrot cake with walnuts', 400, 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400&h=400&fit=crop', 'cake'),
    ('Tiramisu', 'Classic Italian tiramisu', 500, 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&h=400&fit=crop', 'cake'),
    ('Brownie', 'Fudgy chocolate brownie', 350, 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400&h=400&fit=crop', 'cake')
  `)
  
  insertProducts.run()
  db.close()
}

try {
  console.log('Initializing database...')
  initDb()
  console.log('Database initialized successfully!')
  console.log('Tables created: users, products, orders, order_items, cart')
  console.log('Sample products inserted')
} catch (error) {
  console.error('Error initializing database:', error)
  process.exit(1)
}
