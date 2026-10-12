const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const db = require('../db');

// Authentication middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.adminUser) {
    res.locals.adminUser = req.session.adminUser;
    next();
  } else {
    res.redirect('/admin');
  }
}

// 1. Admin Login Page
router.get('/', (req, res) => {
  if (req.session && req.session.adminUser) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { error: req.query.error });
});

// 2. Admin Login Action
router.post('/login_check', async (req, res) => {
  const { username, password } = req.body;
  try {
    const users = await db.execute('SELECT * FROM admin_users WHERE username = ? AND password = ?', [username, password]);
    if (users && users.length > 0) {
      req.session.adminUser = {
        id: users[0].id,
        username: users[0].username,
        name: users[0].name,
        email: users[0].email
      };
      res.redirect('/admin/dashboard');
    } else {
      res.redirect('/admin?error=invalid');
    }
  } catch (err) {
    console.error('Login error:', err);
    res.redirect('/admin?error=server');
  }
});

// 3. Admin Logout
router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin');
  });
});

// 4. Dashboard
router.get('/dashboard', requireAuth, async (req, res) => {
  try {
    const villas = await db.execute('SELECT * FROM villas');
    const inquiries = await db.execute('SELECT * FROM inquiries');
    const services = await db.execute('SELECT * FROM services');
    const reviews = await db.execute('SELECT * FROM reviews');

    const pendingInquiries = inquiries.filter(i => i.status === 'pending');
    const confirmedBookings = inquiries.filter(i => i.status === 'confirmed');

    res.render('admin/dashboard', {
      title: 'Dashboard | Aura Villas CMS',
      villasCount: villas.length,
      inquiriesCount: inquiries.length,
      pendingCount: pendingInquiries.length,
      confirmedCount: confirmedBookings.length,
      recentInquiries: inquiries.slice(0, 5),
      villas: villas.slice(0, 4),
      activeTab: 'dashboard'
    });
  } catch (err) {
    console.error('Dashboard error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 5. Villas List
router.get('/villas', requireAuth, async (req, res) => {
  try {
    const villas = await db.execute('SELECT * FROM villas');
    res.render('admin/villas_list', {
      title: 'Manage Villas | Aura CMS',
      villas,
      activeTab: 'villas'
    });
  } catch (err) {
    console.error('Admin villas error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 6. Add Villa Form
router.get('/add_villa', requireAuth, (req, res) => {
  res.render('admin/villa_form', {
    title: 'Add New Luxury Villa | Aura CMS',
    villa: null,
    isEdit: false,
    activeTab: 'villas'
  });
});

// 7. Save Villa (Create)
router.post('/save_villa', requireAuth, async (req, res) => {
  try {
    const { title, location, price_per_night, bedrooms, bathrooms, guests, area_sqft, description, featured, amenities } = req.body;
    let imageName = 'villa-1.jpg';

    if (req.files && req.files.image) {
      const file = req.files.image;
      imageName = 'villa_' + Date.now() + path.extname(file.name);
      const uploadPath = path.join(__dirname, '../public/uploads', imageName);
      await file.mv(uploadPath);
    }

    const sql = `INSERT INTO villas (title, location, price_per_night, bedrooms, bathrooms, guests, area_sqft, description, featured, image, gallery, amenities)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '', ?)`;

    await db.execute(sql, [
      title,
      location,
      price_per_night,
      bedrooms,
      bathrooms,
      guests,
      area_sqft,
      description,
      featured ? 1 : 0,
      imageName,
      amenities
    ]);

    res.redirect('/admin/villas');
  } catch (err) {
    console.error('Save villa error:', err);
    res.status(500).send('Error saving villa');
  }
});

// 8. Edit Villa Form
router.get('/edit_villa/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    const result = await db.execute('SELECT * FROM villas WHERE id = ?', [id]);
    if (!result || result.length === 0) {
      return res.redirect('/admin/villas');
    }
    res.render('admin/villa_form', {
      title: 'Edit Villa | Aura CMS',
      villa: result[0],
      isEdit: true,
      activeTab: 'villas'
    });
  } catch (err) {
    console.error('Edit villa error:', err);
    res.redirect('/admin/villas');
  }
});

// 9. Update Villa
router.post('/update_villa', requireAuth, async (req, res) => {
  try {
    const { id, title, location, price_per_night, bedrooms, bathrooms, guests, area_sqft, description, featured, amenities, old_image } = req.body;
    let imageName = old_image || 'villa-1.jpg';

    if (req.files && req.files.image) {
      const file = req.files.image;
      imageName = 'villa_' + Date.now() + path.extname(file.name);
      const uploadPath = path.join(__dirname, '../public/uploads', imageName);
      await file.mv(uploadPath);
    }

    const sql = `UPDATE villas 
                 SET title=?, location=?, price_per_night=?, bedrooms=?, bathrooms=?, guests=?, area_sqft=?, description=?, featured=?, image=?, amenities=?
                 WHERE id=?`;

    await db.execute(sql, [
      title,
      location,
      price_per_night,
      bedrooms,
      bathrooms,
      guests,
      area_sqft,
      description,
      featured ? 1 : 0,
      imageName,
      amenities,
      id
    ]);

    res.redirect('/admin/villas');
  } catch (err) {
    console.error('Update villa error:', err);
    res.status(500).send('Error updating villa');
  }
});

// 10. Delete Villa
router.get('/delete_villa/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute('DELETE FROM villas WHERE id = ?', [id]);
    res.redirect('/admin/villas');
  } catch (err) {
    console.error('Delete villa error:', err);
    res.redirect('/admin/villas');
  }
});

// 11. Inquiries & Reservations List
router.get('/inquiries', requireAuth, async (req, res) => {
  try {
    const inquiries = await db.execute('SELECT * FROM inquiries');
    res.render('admin/inquiries_list', {
      title: 'Guest Inquiries & Bookings | Aura CMS',
      inquiries,
      activeTab: 'inquiries'
    });
  } catch (err) {
    console.error('Inquiries list error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 12. Update Inquiry Status
router.post('/update_inquiry_status', requireAuth, async (req, res) => {
  try {
    const { id, status } = req.body;
    await db.execute('UPDATE inquiries SET status = ? WHERE id = ?', [status, id]);
    res.redirect('/admin/inquiries');
  } catch (err) {
    console.error('Update inquiry status error:', err);
    res.redirect('/admin/inquiries');
  }
});

// 13. Delete Inquiry
router.get('/delete_inquiry/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute('DELETE FROM inquiries WHERE id = ?', [id]);
    res.redirect('/admin/inquiries');
  } catch (err) {
    console.error('Delete inquiry error:', err);
    res.redirect('/admin/inquiries');
  }
});

// 14. Manage Bespoke Services
router.get('/services', requireAuth, async (req, res) => {
  try {
    const services = await db.execute('SELECT * FROM services');
    res.render('admin/services_list', {
      title: 'Manage Bespoke Services | Aura CMS',
      services,
      activeTab: 'services'
    });
  } catch (err) {
    console.error('Services list error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 15. Save Service
router.post('/save_service', requireAuth, async (req, res) => {
  try {
    const { title, icon, summary, display_order } = req.body;
    const sql = `INSERT INTO services (title, icon, summary, display_order) VALUES (?, ?, ?, ?)`;
    await db.execute(sql, [title, icon, summary, display_order || 1]);
    res.redirect('/admin/services');
  } catch (err) {
    console.error('Save service error:', err);
    res.redirect('/admin/services');
  }
});

// 16. Delete Service
router.get('/delete_service/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute('DELETE FROM services WHERE id = ?', [id]);
    res.redirect('/admin/services');
  } catch (err) {
    console.error('Delete service error:', err);
    res.redirect('/admin/services');
  }
});

// 17. Manage Reviews
router.get('/reviews', requireAuth, async (req, res) => {
  try {
    const reviews = await db.execute('SELECT * FROM reviews');
    res.render('admin/reviews_list', {
      title: 'Manage Guest Reviews | Aura CMS',
      reviews,
      activeTab: 'reviews'
    });
  } catch (err) {
    console.error('Reviews list error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 18. Delete Review
router.get('/delete_review/:id', requireAuth, async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute('DELETE FROM reviews WHERE id = ?', [id]);
    res.redirect('/admin/reviews');
  } catch (err) {
    console.error('Delete review error:', err);
    res.redirect('/admin/reviews');
  }
});

// 19. Site Settings Page
router.get('/settings', requireAuth, async (req, res) => {
  try {
    const settingsResult = await db.execute('SELECT * FROM site_settings WHERE id = 1');
    const settings = settingsResult[0] || {};
    res.render('admin/settings', {
      title: 'Site Settings & Brand Info | Aura CMS',
      settings,
      activeTab: 'settings',
      saved: req.query.saved === 'true'
    });
  } catch (err) {
    console.error('Settings view error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 20. Update Site Settings
router.post('/update_settings', requireAuth, async (req, res) => {
  try {
    const { site_name, tagline, hero_title, hero_subtitle, contact_email, contact_phone, contact_address } = req.body;
    const sql = `UPDATE site_settings SET site_name=?, tagline=?, hero_title=?, hero_subtitle=?, contact_email=?, contact_phone=?, contact_address=? WHERE id=1`;
    await db.execute(sql, [site_name, tagline, hero_title, hero_subtitle, contact_email, contact_phone, contact_address]);
    res.redirect('/admin/settings?saved=true');
  } catch (err) {
    console.error('Settings update error:', err);
    res.redirect('/admin/settings?error=true');
  }
});

module.exports = router;
