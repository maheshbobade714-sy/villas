const express = require('express');
const path = require('path');
const crypto = require('crypto');
const session = require('express-session');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = process.env.PORT || 4000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Static assets
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// Body parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// File upload configuration
app.use(fileUpload({
  createParentPath: true,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB max
}));

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || crypto.randomBytes(32).toString('hex'),
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));

// Routes
const webRoutes = require('./routes/web');
const adminRoutes = require('./routes/admin');

app.use('/', webRoutes);
app.use('/admin', adminRoutes);

// 404 Not Found Page
app.use((req, res) => {
  res.status(404).render('web/404', { title: 'Sanctuary Not Found | Aura Villas' });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`✨ Aura Luxury Villas Web Application Running!`);
  console.log(`🌐 Public Website:  http://localhost:${PORT}`);
  console.log(`🔐 Admin Panel:     http://localhost:${PORT}/admin`);
  console.log(`👤 Admin Demo:      Username: admin | Password: admin`);
  console.log(`=======================================================`);
});
