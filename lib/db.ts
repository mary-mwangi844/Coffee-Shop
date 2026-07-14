import Database from 'better-sqlite3'
import path from 'path'
import crypto from 'crypto'

const dbPath = path.join(process.cwd(), 'mayas_coffee_shop.db')

export function getDb() {
  const db = new Database(dbPath)
  ensureAuthSchema(db)
  return db
}

function hasColumn(db: Database.Database, table: string, column: string) {
  const cols = db.prepare(`PRAGMA table_info(${table})`).all() as Array<{
    name: string
  }>
  return cols.some((c) => c.name === column)
}

function ensureAuthSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      first_name TEXT NOT NULL,
      last_name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      password TEXT,
      provider TEXT NOT NULL DEFAULT 'local',
      provider_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS password_reset_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT NOT NULL UNIQUE,
      expires_at DATETIME NOT NULL,
      used INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS oauth_handoffs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT NOT NULL UNIQUE,
      user_json TEXT NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `)

  if (!hasColumn(db, 'users', 'provider')) {
    db.exec(`ALTER TABLE users ADD COLUMN provider TEXT NOT NULL DEFAULT 'local'`)
  }
  if (!hasColumn(db, 'users', 'provider_id')) {
    db.exec(`ALTER TABLE users ADD COLUMN provider_id TEXT`)
  }
}

export function createToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

export function looksLikePhone(value: string): boolean {
  const trimmed = value.trim()
  if (!trimmed || trimmed.includes('@')) return false
  const digits = trimmed.replace(/\D/g, '')
  return digits.length >= 9 && /^[\d+\s()-]+$/.test(trimmed)
}

export function phoneVariants(raw: string): string[] {
  const digits = raw.replace(/\D/g, '')
  const variants = new Set<string>([raw.trim(), digits])

  let national = digits
  if (digits.startsWith('254') && digits.length >= 12) {
    national = digits.slice(3)
  } else if (digits.startsWith('0') && digits.length >= 10) {
    national = digits.slice(1)
  }

  if (national.length >= 9) {
    variants.add(national)
    variants.add(`0${national}`)
    variants.add(`254${national}`)
    variants.add(`+254${national}`)
  }

  return Array.from(variants)
}

export function findUserByIdentifier(db: Database.Database, identifier: string) {
  const id = identifier.trim()
  if (looksLikePhone(id)) {
    const variants = phoneVariants(id)
    const placeholders = variants.map(() => '?').join(', ')
    return db
      .prepare(
        `SELECT * FROM users WHERE phone IN (${placeholders}) OR email = ?`
      )
      .get(...variants, id) as Record<string, unknown> | undefined
  }

  return db
    .prepare('SELECT * FROM users WHERE email = ? COLLATE NOCASE')
    .get(id) as Record<string, unknown> | undefined
}

export function toPublicUser(user: Record<string, unknown>) {
  const { password: _, ...rest } = user
  return rest
}

export function initDb() {
  const db = getDb()

  db.exec(`
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
      payment_ref TEXT,
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

  db.prepare(`
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
  `).run()

  db.close()
}
