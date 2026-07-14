export type MenuCategory =
  | 'espresso'
  | 'specialty'
  | 'cold'
  | 'pastry'

export type MenuItem = {
  id: number
  name: string
  price: number
  image: string
  description: string
  category: MenuCategory
  note: string
  origin?: string
  signature?: boolean
}

export const MENU_CATEGORIES: { id: MenuCategory | 'all'; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'espresso', label: 'Espresso Bar' },
  { id: 'specialty', label: 'Signatures' },
  { id: 'cold', label: 'Cold Bar' },
  { id: 'pastry', label: 'Pastry Case' },
]

export const menuCatalog: MenuItem[] = [
  {
    id: 1,
    name: 'Espresso',
    price: 220,
    image:
      'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=1000&h=1250&fit=crop',
    description:
      'A precise double ristretto—dense crema, cacao bitterness, and a lingering finish.',
    category: 'espresso',
    note: 'Ristretto · 18g',
    origin: 'Kenya AA · Nyeri',
  },
  {
    id: 2,
    name: 'Americano',
    price: 280,
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&h=1250&fit=crop',
    description:
      'Espresso stretched with hot water for a long, transparent cup with citrus lift.',
    category: 'espresso',
    note: 'Long · clean',
    origin: 'Kenya AA · Nyeri',
  },
  {
    id: 3,
    name: 'Cappuccino',
    price: 340,
    image:
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=1000&h=1250&fit=crop',
    description:
      'Equal parts espresso, steamed milk, and microfoam—classic Italian balance.',
    category: 'espresso',
    note: 'Foam · 180ml',
  },
  {
    id: 4,
    name: 'Latte',
    price: 380,
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1000&h=1250&fit=crop',
    description:
      'Silky steamed milk folded over espresso for a soft, approachable cup.',
    category: 'espresso',
    note: 'Silk · steamed',
  },
  {
    id: 5,
    name: 'Flat White',
    price: 400,
    image:
      'https://images.unsplash.com/photo-1534778101976-62847782c213?w=1000&h=1250&fit=crop',
    description:
      'Double ristretto with velvet microfoam—stronger coffee through the milk.',
    category: 'espresso',
    note: 'Velvet · dense',
  },
  {
    id: 6,
    name: 'Macchiato',
    price: 320,
    image:
      'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=1000&h=1250&fit=crop',
    description:
      'Espresso marked with a spoon of foam—short, aromatic, uncompromising.',
    category: 'espresso',
    note: 'Marked · bold',
  },
  {
    id: 7,
    name: 'Cortado',
    price: 360,
    image:
      'https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1000&h=1250&fit=crop',
    description:
      'Equal espresso and steamed milk in a glass—elegant, compact, and warm.',
    category: 'espresso',
    note: 'Equal · glass',
    signature: true,
  },
  {
    id: 8,
    name: 'Piccolo',
    price: 340,
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&h=1250&fit=crop',
    description:
      'A miniature latte built on ristretto—concentrated sweetness, tiny footprint.',
    category: 'espresso',
    note: 'Petite · intense',
  },
  {
    id: 9,
    name: 'Maya Mocha',
    price: 460,
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=1000&h=1250&fit=crop',
    description:
      'Single-origin espresso with Valrhona chocolate, steamed milk, and soft cream.',
    category: 'specialty',
    note: 'Valrhona · house',
    signature: true,
    origin: 'Maison blend',
  },
  {
    id: 10,
    name: 'Honey Lavender Latte',
    price: 480,
    image:
      'https://images.unsplash.com/photo-1497636577773-f1231844b336?w=1000&h=1250&fit=crop',
    description:
      'Wildflower honey and delicate lavender with espresso and steamed milk.',
    category: 'specialty',
    note: 'Floral · honey',
    signature: true,
  },
  {
    id: 11,
    name: 'Cardamom Cortado',
    price: 420,
    image:
      'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1000&h=1250&fit=crop',
    description:
      'Green cardamom gently crushed into a cortado—warm spice without sweetness overload.',
    category: 'specialty',
    note: 'Spice · short',
    signature: true,
  },
  {
    id: 12,
    name: 'Sea Salt Caramel Latte',
    price: 470,
    image:
      'https://images.unsplash.com/photo-1541167760492-7e3adb9c9eb8?w=1000&h=1250&fit=crop',
    description:
      'House caramel salted to taste, layered under latte foam for contrast.',
    category: 'specialty',
    note: 'Salt · caramel',
  },
  {
    id: 13,
    name: 'Matcha Espresso Fusion',
    price: 520,
    image:
      'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=1000&h=1250&fit=crop',
    description:
      'Ceremonial-grade matcha and espresso split pour—grass, cacao, and cream.',
    category: 'specialty',
    note: 'Ceremonial · split',
    signature: true,
  },
  {
    id: 14,
    name: 'Golden Turmeric Latte',
    price: 450,
    image:
      'https://images.unsplash.com/photo-1570968915860-54d95c9ae402?w=1000&h=1250&fit=crop',
    description:
      'Turmeric, black pepper, and oat milk—soothing, aromatic, caffeine-optional by request.',
    category: 'specialty',
    note: 'Golden · oat',
  },
  {
    id: 15,
    name: 'Pour Over — Kenya AA',
    price: 480,
    image:
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1000&h=1250&fit=crop',
    description:
      'V60 pour-over highlighting blackcurrant, jasmine, and a sparkling finish.',
    category: 'specialty',
    note: 'V60 · filter',
    origin: 'Nyeri · washed',
    signature: true,
  },
  {
    id: 16,
    name: 'Siphon Brew',
    price: 550,
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1000&h=1250&fit=crop',
    description:
      'Theatrical vacuum brew for a clean, tea-like clarity and fragrant aroma.',
    category: 'specialty',
    note: 'Vacuum · clear',
    signature: true,
  },
  {
    id: 17,
    name: 'Cold Brew',
    price: 380,
    image:
      'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=1000&h=1250&fit=crop',
    description:
      'Eighteen-hour steep—low acid, chocolate depth, naturally sweet.',
    category: 'cold',
    note: '18h · low acid',
  },
  {
    id: 18,
    name: 'Nitro Cold Brew',
    price: 450,
    image:
      'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=1000&h=1250&fit=crop',
    description:
      'Nitrogen cascade for a creamy head without dairy—dessert-like mouthfeel.',
    category: 'cold',
    note: 'Nitro · cascade',
    signature: true,
  },
  {
    id: 19,
    name: 'Iced Latte',
    price: 400,
    image:
      'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=1000&h=1250&fit=crop',
    description:
      'Chilled espresso over ice with cold milk—refreshing and composed.',
    category: 'cold',
    note: 'Chilled · milk',
  },
  {
    id: 20,
    name: 'Iced Spanish Latte',
    price: 460,
    image:
      'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=1000&h=1250&fit=crop',
    description:
      'Condensed milk sweetness meeting cold espresso—nostalgic and polished.',
    category: 'cold',
    note: 'Condensed · iced',
    signature: true,
  },
  {
    id: 21,
    name: 'Affogato',
    price: 520,
    image:
      'https://images.unsplash.com/photo-1594631252845-29fc4cc8cde9?w=1000&h=1250&fit=crop',
    description:
      'Madagascan vanilla gelato drowned in hot ristretto at the table.',
    category: 'cold',
    note: 'Gelato · hot',
    signature: true,
  },
  {
    id: 22,
    name: 'Sparkling Espresso Tonic',
    price: 430,
    image:
      'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1000&h=1250&fit=crop',
    description:
      'Espresso over tonic with citrus—bright, bitter, unexpectedly refreshing.',
    category: 'cold',
    note: 'Tonic · citrus',
    signature: true,
  },
  {
    id: 23,
    name: 'Shakerato',
    price: 390,
    image:
      'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1000&h=1250&fit=crop',
    description:
      'Espresso shaken with ice until frothy and ice-cold—Italian summer in a glass.',
    category: 'cold',
    note: 'Shaken · froth',
  },
  {
    id: 24,
    name: 'Chocolate Ganache Cake',
    price: 520,
    image:
      'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1000&h=1250&fit=crop',
    description:
      'Dark cocoa sponge layered with silk ganache—best beside espresso.',
    category: 'pastry',
    note: '70% · ganache',
    signature: true,
  },
  {
    id: 25,
    name: 'Red Velvet Slice',
    price: 540,
    image:
      'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=1000&h=1250&fit=crop',
    description:
      'Soft crimson crumb with cultured cream-cheese frosting, lightly soured.',
    category: 'pastry',
    note: 'Velvet · soft',
  },
  {
    id: 26,
    name: 'Burnt Basque Cheesecake',
    price: 560,
    image:
      'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=1000&h=1250&fit=crop',
    description:
      'Caramelized crown, custard centre—baked hot and served cool.',
    category: 'pastry',
    note: 'Basque · custard',
    signature: true,
  },
  {
    id: 27,
    name: 'Carrot Walnut Cake',
    price: 480,
    image:
      'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=1000&h=1250&fit=crop',
    description:
      'Warm spice, toasted walnuts, and a restrained frosting—never heavy.',
    category: 'pastry',
    note: 'Spice · nut',
  },
  {
    id: 28,
    name: 'Tiramisu Coupe',
    price: 580,
    image:
      'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=1000&h=1250&fit=crop',
    description:
      'Ladyfingers soaked in our espresso, mascarpone cream, and cocoa veil.',
    category: 'pastry',
    note: 'Espresso soak',
    signature: true,
  },
  {
    id: 29,
    name: 'Valrhona Brownie',
    price: 420,
    image:
      'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1000&h=1250&fit=crop',
    description:
      'Fudgy centre, crackled top—served slightly warm.',
    category: 'pastry',
    note: 'Fudge · crackle',
  },
  {
    id: 30,
    name: 'Almond Croissant',
    price: 380,
    image:
      'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1000&h=1250&fit=crop',
    description:
      'Butter laminate filled with frangipane, finished with toasted almonds.',
    category: 'pastry',
    note: 'Laminated · almond',
    signature: true,
  },
  {
    id: 31,
    name: 'Pain au Chocolat',
    price: 360,
    image:
      'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=1000&h=1250&fit=crop',
    description:
      'Flaky pastry wrapped around batons of dark couverture chocolate.',
    category: 'pastry',
    note: 'Couverture · flake',
  },
  {
    id: 32,
    name: 'Pistachio Kanelbullar',
    price: 340,
    image:
      'https://images.unsplash.com/photo-1509365465985-25d11c17e882?w=1000&h=1250&fit=crop',
    description:
      'Cardamom bun twisted with pistachio crème—Nordic technique, local pastry case.',
    category: 'pastry',
    note: 'Cardamom · green',
    signature: true,
  },
  {
    id: 33,
    name: 'Sourdough Toast & Cultured Butter',
    price: 320,
    image:
      'https://images.unsplash.com/photo-1484723091739-30a097e8f929?w=1000&h=1250&fit=crop',
    description:
      'House sourdough, slow toast, whipped cultured butter, and flaky salt.',
    category: 'pastry',
    note: 'Toast · salt',
  },
  {
    id: 34,
    name: 'Lemon Olive Oil Cake',
    price: 440,
    image:
      'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=1000&h=1250&fit=crop',
    description:
      'Citrus-forward loaf moistened with olive oil—bright against dark espresso.',
    category: 'pastry',
    note: 'Citrus · oil',
    signature: true,
  },
]

export function getMenuItem(id: string | number): MenuItem | undefined {
  return menuCatalog.find((item) => String(item.id) === String(id))
}

export function getMenuByCategory(category: MenuCategory | 'all'): MenuItem[] {
  if (category === 'all') return menuCatalog
  return menuCatalog.filter((item) => item.category === category)
}
