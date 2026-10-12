const express = require('express');
const router = express.Router();
const db = require('../db');

// Helper to get site settings
async function getSettings() {
  const settings = await db.execute('SELECT * FROM site_settings WHERE id = 1');
  return settings[0] || {
    site_name: 'Aura Luxury Villas',
    tagline: 'Bespoke Private Sanctuaries & Coastal Escapes',
    hero_title: 'Discover Unrivaled Coastal Luxury',
    hero_subtitle: 'Handcrafted private estates, crystal infinity pools, and round-the-clock bespoke concierge services across the world’s most coveted destinations.',
    contact_email: 'reservations@auravillas.com',
    contact_phone: '+1 (800) 589-2872',
    contact_address: '742 Ocean Boulevard, Malibu Coast, CA 90265',
    hero_image: 'hero-villa.jpg'
  };
}

// 1. Home Page
router.get('/', async (req, res) => {
  try {
    const settings = await getSettings();
    const featuredVillas = await db.execute('SELECT * FROM villas WHERE featured = 1');
    const allVillas = await db.execute('SELECT * FROM villas');
    const services = await db.execute('SELECT * FROM services');
    const reviews = await db.execute('SELECT * FROM reviews');

    res.render('web/index', {
      title: 'Aura Luxury Villas | Private Estates & Coastal Sanctuaries',
      settings,
      featuredVillas: featuredVillas.length > 0 ? featuredVillas : allVillas.slice(0, 4),
      allVillas,
      services,
      reviews,
      currentPath: '/'
    });
  } catch (err) {
    console.error('Home route error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 2. Villas Catalog / Listing Page
router.get('/villas', async (req, res) => {
  try {
    const settings = await getSettings();
    let villas = await db.execute('SELECT * FROM villas');

    const { location, guests, minPrice, maxPrice, sort } = req.query;

    if (location && location !== 'all') {
      villas = villas.filter(v => v.location.toLowerCase().includes(location.toLowerCase()));
    }
    if (guests) {
      villas = villas.filter(v => v.guests >= Number(guests));
    }
    if (minPrice) {
      villas = villas.filter(v => v.price_per_night >= Number(minPrice));
    }
    if (maxPrice) {
      villas = villas.filter(v => v.price_per_night <= Number(maxPrice));
    }

    if (sort === 'price_asc') {
      villas.sort((a, b) => a.price_per_night - b.price_per_night);
    } else if (sort === 'price_desc') {
      villas.sort((a, b) => b.price_per_night - a.price_per_night);
    } else if (sort === 'guests_desc') {
      villas.sort((a, b) => b.guests - a.guests);
    }

    res.render('web/villas', {
      title: 'Exclusive Villa Collection | Aura Luxury Villas',
      settings,
      villas,
      filters: req.query,
      currentPath: '/villas'
    });
  } catch (err) {
    console.error('Villas route error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 3. Villa Details Page
router.get('/villa/:id', async (req, res) => {
  try {
    const settings = await getSettings();
    const id = req.params.id;
    const result = await db.execute('SELECT * FROM villas WHERE id = ?', [id]);

    if (!result || result.length === 0) {
      return res.status(404).render('web/404', { title: 'Villa Not Found' });
    }

    const villa = result[0];
    const allVillas = await db.execute('SELECT * FROM villas');
    const relatedVillas = allVillas.filter(v => v.id != villa.id).slice(0, 3);
    const reviews = await db.execute('SELECT * FROM reviews');

    res.render('web/villa_detail', {
      title: `${villa.title} | Aura Luxury Villas`,
      settings,
      villa,
      relatedVillas,
      reviews,
      query: req.query,
      currentPath: '/villas'
    });
  } catch (err) {
    console.error('Villa detail route error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 4. About Us Page
router.get('/about', async (req, res) => {
  try {
    const settings = await getSettings();
    res.render('web/about', {
      title: 'Our Heritage & Philosophy | Aura Luxury Villas',
      settings,
      currentPath: '/about'
    });
  } catch (err) {
    console.error('About route error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 5. Amenities & Bespoke Services Page
router.get('/amenities', async (req, res) => {
  try {
    const settings = await getSettings();
    const services = await db.execute('SELECT * FROM services');
    res.render('web/amenities', {
      title: 'Bespoke Amenities & Signature Experiences | Aura Luxury Villas',
      settings,
      services,
      currentPath: '/amenities'
    });
  } catch (err) {
    console.error('Amenities route error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 6. Visual Gallery Page
router.get('/gallery', async (req, res) => {
  try {
    const settings = await getSettings();
    const villas = await db.execute('SELECT * FROM villas');
    res.render('web/gallery', {
      title: 'Visual Sanctuary Gallery | Aura Luxury Villas',
      settings,
      villas,
      currentPath: '/gallery'
    });
  } catch (err) {
    console.error('Gallery route error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 7. Verified Guest Reviews Page
router.get('/reviews', async (req, res) => {
  try {
    const settings = await getSettings();
    const reviews = await db.execute('SELECT * FROM reviews');
    res.render('web/reviews', {
      title: 'Guest Testimonials & Praise | Aura Luxury Villas',
      settings,
      reviews,
      currentPath: '/reviews'
    });
  } catch (err) {
    console.error('Reviews route error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 8. Contact & Concierge Inquiry Page
router.get('/contact', async (req, res) => {
  try {
    const settings = await getSettings();
    res.render('web/contact', {
      title: 'Private Concierge & Reservations | Aura Luxury Villas',
      settings,
      successMessage: req.query.sent === 'true' ? 'Thank you. Your inquiry has been transmitted to our senior private concierge.' : null,
      currentPath: '/contact'
    });
  } catch (err) {
    console.error('Contact route error:', err);
    res.status(500).send('Internal Server Error');
  }
});

// 9. Booking Inquiry Submission
router.post('/book_inquiry', async (req, res) => {
  try {
    const { villa_id, villa_title, guest_name, email, phone, check_in, check_out, guests_count, message } = req.body;
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;

    const sql = `INSERT INTO inquiries (villa_id, villa_title, guest_name, email, phone, check_in, check_out, guests_count, message, status, created_date)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?)`;

    await db.execute(sql, [
      villa_id ? Number(villa_id) : null,
      villa_title || 'General Villa Inquiry',
      guest_name,
      email,
      phone,
      check_in || '',
      check_out || '',
      Number(guests_count) || 2,
      message || 'Requesting availability and booking quote.',
      dateFormatted
    ]);

    if (villa_id) {
      res.redirect(`/villa/${villa_id}?inquiry_success=true`);
    } else {
      res.redirect('/contact?sent=true');
    }
  } catch (err) {
    console.error('Booking inquiry error:', err);
    res.redirect('/contact?error=true');
  }
});

// 10. General Contact Submission
router.post('/contact_save', async (req, res) => {
  try {
    const { name, email, phone, message, villa_name } = req.body;
    const now = new Date();
    const dateFormatted = `${String(now.getDate()).padStart(2,'0')}-${String(now.getMonth()+1).padStart(2,'0')}-${now.getFullYear()}`;

    const sql = `INSERT INTO inquiries (villa_id, villa_title, guest_name, email, phone, check_in, check_out, guests_count, message, status, created_date)
                 VALUES (NULL, ?, ?, ?, ?, '', '', 2, ?, 'pending', ?)`;

    await db.execute(sql, [
      villa_name || 'General Inquiry',
      name,
      email,
      phone || 'Not provided',
      message,
      dateFormatted
    ]);

    res.redirect('/contact?sent=true');
  } catch (err) {
    console.error('Contact save error:', err);
    res.redirect('/contact?error=true');
  }
});

module.exports = router;
