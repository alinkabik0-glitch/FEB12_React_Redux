const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 3001;
const JWT_SECRET = 'bestmarketplace-secret-key-2026';

app.use(cors());
app.use(express.json());

// ===== MOCK DATABASE =====
const users = [];
const orders = [];
const carts = {};

// Создаём тестового пользователя заранее
const hashedPassword = bcrypt.hashSync('123456', 10);
users.push({
  id: 1,
  login: 'admin',
  email: 'admin@test.com',
  password: hashedPassword
});

const products = [
  { 
    id: 1, 
    title: 'Кружка', 
    price: 1500, 
    description: 'Стильная керамическая кружка с ярким дизайном. Идеально подходит для утреннего кофе или чая. Объём 350 мл.', 
    vendor: 'Дом и уют', 
    image: 'https://storage.yandexcloud.net/rpi/66dc3760-ef62-4136-8190-b2c2e4cbd01d.jpeg' 
  },
  { 
    id: 2, 
    title: 'Дневник', 
    price: 850, 
    description: 'Красивый ежедневник с твёрдой обложкой. 200 страниц в клетку. Отлично подойдёт для учёбы или работы.', 
    vendor: 'Канцтовары', 
    image: 'https://storage.yandexcloud.net/rpi/i%20(10).webp' 
  },
  { 
    id: 3, 
    title: 'Самокат', 
    price: 4500, 
    description: 'Лёгкий алюминиевый самокат с ярким дизайном. Максимальная нагрузка до 100 кг. Складная конструкция.', 
    vendor: 'Спорт и отдых', 
    image: 'https://storage.yandexcloud.net/rpi/i%20(11).webp' 
  },
  { 
    id: 4, 
    title: 'Телефон', 
    price: 15990, 
    description: 'Современный смартфон с большим экраном 6.5". 128 ГБ памяти, отличная камера, быстрая зарядка.', 
    vendor: 'Электроника', 
    image: 'https://storage.yandexcloud.net/rpi/i%20(12).webp' 
  },
  { 
    id: 5, 
    title: 'Игрушка', 
    price: 1200, 
    description: 'Мягкая плюшевая игрушка - очаровательный поросёнок. Гипоаллергенный материал, безопасно для детей.', 
    vendor: 'Детский мир', 
    image: 'https://storage.yandexcloud.net/rpi/i%20(13).webp' 
  },
  { 
    id: 6, 
    title: 'Мишка', 
    price: 2100, 
    description: 'Большой плюшевый мишка с красным шарфиком. Высота 40 см. Отличный подарок для близких.', 
    vendor: 'Детский мир', 
    image: 'https://storage.yandexcloud.net/rpi/i%20(6).webp' 
  },
  { 
    id: 7, 
    title: 'Сумка', 
    price: 3500, 
    description: 'Стильная женская сумка из экокожи. Вместительная, с несколькими отделениями. Цвет бежевый.', 
    vendor: 'Аксессуары', 
    image: 'https://storage.yandexcloud.net/rpi/i%20(7).webp' 
  },
  { 
    id: 8, 
    title: 'Наушники', 
    price: 5900, 
    description: 'Беспроводные наушники с активным шумоподавлением. Время работы до 30 часов. Отличный звук.', 
    vendor: 'Электроника', 
    image: 'https://storage.yandexcloud.net/rpi/i%20(8).webp' 
  },
  { 
    id: 9, 
    title: 'Велосипед', 
    price: 18500, 
    description: 'Горный велосипед с алюминиевой рамой. 21 скорость, дисковые тормоза. Размер колёс 26".', 
    vendor: 'Спорт и отдых', 
    image: 'https://storage.yandexcloud.net/rpi/i%20(9).webp' 
  },
  { 
    id: 10, 
    title: 'Ручки', 
    price: 450, 
    description: 'Набор гелевых ручек (5 штук). Чёрные чернила, комфортный хват. Пишут плавно и чисто.', 
    vendor: 'Канцтовары', 
    image: 'https://storage.yandexcloud.net/rpi/i%20(14).webp' 
  }
];

// ===== MIDDLEWARE =====
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'No token provided' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// ===== AUTH ROUTES =====
app.post('/api/login', (req, res) => {
  console.log('📥 Login request:', req.body);
  const { login, password } = req.body;
  
  if (!login || !password) {
    return res.status(400).json({ message: 'Login and password are required' });
  }
  
  const user = users.find(u => u.login === login);
  
  if (!user) {
    return res.status(401).json({ message: 'User not found' });
  }
  
  const isPasswordValid = bcrypt.compareSync(password, user.password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password' });
  }
  
  const token = jwt.sign({ id: user.id, login: user.login }, JWT_SECRET, { expiresIn: '24h' });
  console.log('✅ Login successful for:', user.login);
  
  res.json({ 
    token, 
    user: { id: user.id, login: user.login, email: user.email } 
  });
});

app.post('/api/signup', (req, res) => {
  console.log('📥 Signup request:', req.body);
  const { login, email, password } = req.body;
  
  if (!login || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  
  if (login.length < 3) {
    return res.status(400).json({ message: 'Login must be at least 3 characters' });
  }
  
  if (password.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }
  
  if (users.find(u => u.login === login)) {
    return res.status(400).json({ message: 'User with this login already exists' });
  }
  
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ message: 'Email already registered' });
  }
  
  const hashedPassword = bcrypt.hashSync(password, 10);
  const newUser = { 
    id: users.length + 1, 
    login, 
    email, 
    password: hashedPassword 
  };
  users.push(newUser);
  console.log('✅ User registered:', newUser.login);
  
  const token = jwt.sign({ id: newUser.id, login: newUser.login }, JWT_SECRET, { expiresIn: '24h' });
  res.status(201).json({ 
    token, 
    user: { id: newUser.id, login: newUser.login, email: newUser.email } 
  });
});

// ===== PRODUCTS ROUTES =====
app.get('/api/products', (req, res) => {
  let { search, sort } = req.query;
  let filteredProducts = [...products];
  
  if (search) {
    filteredProducts = filteredProducts.filter(p => 
      p.title.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (sort) {
    const [field, direction] = sort.split('-');
    filteredProducts.sort((a, b) => {
      if (field === 'name' || field === 'title') {
        return direction === 'asc' 
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      } else if (field === 'price') {
        return direction === 'asc' ? a.price - b.price : b.price - a.price;
      }
      return 0;
    });
  }
  
  res.json(filteredProducts);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p.id === parseInt(req.params.id));
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
});

// ===== CART ROUTES =====
app.get('/api/cart', authMiddleware, (req, res) => {
  const cart = carts[req.user.id] || [];
  res.json({ cart });
});

app.post('/api/cart', authMiddleware, (req, res) => {
  const { productId, quantity } = req.body;
  const product = products.find(p => p.id === productId);
  
  if (!product) {
    return res.status(404).json({ message: 'Product not found' });
  }
  
  if (!carts[req.user.id]) {
    carts[req.user.id] = [];
  }
  
  const existingItem = carts[req.user.id].find(item => item.productId === productId);
  
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    carts[req.user.id].push({ 
      productId, 
      quantity, 
      price: product.price,
      title: product.title,
      description: product.description,
      image: product.image
    });
  }
  
  console.log(' Cart updated for user', req.user.id, ':', carts[req.user.id]);
  res.json({ cart: carts[req.user.id] });
});

app.put('/api/cart', authMiddleware, (req, res) => {
  const { productId, quantity } = req.body;
  const cart = carts[req.user.id];
  
  if (!cart) return res.status(404).json({ message: 'Cart not found' });
  
  const item = cart.find(item => item.productId === productId);
  if (item) {
    if (quantity <= 0) {
      carts[req.user.id] = cart.filter(item => item.productId !== productId);
    } else {
      item.quantity = quantity;
    }
  }
  
  res.json({ cart: carts[req.user.id] });
});

// ===== ORDERS ROUTES =====
app.get('/api/my-orders', authMiddleware, (req, res) => {
  let userOrders = orders.filter(o => o.userId === req.user.id);
  let { sort } = req.query;
  
  if (sort) {
    const [field, direction] = sort.split('-');
    userOrders = [...userOrders].sort((a, b) => {
      if (field === 'date') {
        return direction === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      } else if (field === 'price' || field === 'total') {
        return direction === 'asc' ? a.total - b.total : b.total - a.total;
      }
      return 0;
    });
  }
  
  res.json(userOrders);
});

app.post('/api/my-orders', authMiddleware, (req, res) => {
  const { items, total } = req.body;
  
  const order = {
    id: orders.length + 1,
    userId: req.user.id,
    items,
    total,
    status: 'pending',
    deliveryAddress: 'Default delivery address',
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(),
  };
  
  orders.push(order);
  carts[req.user.id] = [];
  
  console.log(' Order created:', order.id);
  res.status(201).json(order);
});

app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(` Available products: ${products.length}`);
  console.log(`👤 Test user: login="admin", password="123456"\n`);
});