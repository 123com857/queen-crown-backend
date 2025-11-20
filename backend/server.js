require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection (Railway compatible)
const pool = mysql.createPool(process.env.DATABASE_URL || {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'crown_shop',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// --- Public Routes ---

// GET All Products (Safe projection: NO costs, NO links)
app.get('/api/products', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title, price, images, stock, category FROM products');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// GET Single Product
app.get('/api/products/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT id, title, price, images, stock, category FROM products WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// POST Create Order
app.post('/api/orders', async (req, res) => {
  const { name, phone, address, total_amount, items } = req.body;
  
  // Basic encryption/hiding logic could go here, but for MVP we store raw for admin to see
  try {
    const [result] = await pool.query(
      'INSERT INTO orders (customer_name, phone, address, total_amount, items, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, phone, address, total_amount, JSON.stringify(items), 'pending']
    );
    res.json({ 
      orderId: result.insertId, 
      message: 'Order created',
      paymentInfo: { type: 'manual', account: 'Please see frontend instructions' } 
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// --- Admin Routes (Protected) ---

// Simple Auth Middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader === 'Bearer secret-admin-token') {
    next();
  } else {
    res.status(401).json({ error: 'Unauthorized' });
  }
};

// Admin Login
app.post('/api/admin/login', async (req, res) => {
  const { username, password } = req.body;
  // Hardcoded for demo, should use DB hash check
  if (username === 'admin' && password === 'admin123') {
    res.json({ username: 'admin', token: 'secret-admin-token' });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Admin: Get Orders
app.get('/api/admin/orders', authenticate, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM orders ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Admin: Update Order Status
app.put('/api/admin/orders/:id', authenticate, async (req, res) => {
  const { status } = req.body;
  try {
    await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Database error' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});