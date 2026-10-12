const mysql = require('mysql2');
const util = require('util');

// Configuration for MySQL database
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'villas_db'
};

// Initial in-memory dataset to ensure zero-downtime if MySQL server is not active
const memoryStore = {
  site_settings: [
    {
      id: 1,
      site_name: 'Aura Luxury Villas',
      tagline: 'Bespoke Private Sanctuaries & Coastal Escapes',
      hero_title: 'Discover Unrivaled Coastal Luxury',
      hero_subtitle: 'Handcrafted private estates, crystal infinity pools, and round-the-clock bespoke concierge services across the world’s most coveted destinations.',
      contact_email: 'reservations@auravillas.com',
      contact_phone: '+1 (800) 589-2872',
      contact_address: '742 Ocean Boulevard, Malibu Coast, CA 90265',
      hero_image: 'hero-villa.jpg'
    }
  ],
  villas: [
    {
      id: 1,
      title: 'Villa Solaria Cliffside',
      slug: 'villa-solaria-cliffside',
      location: 'Amalfi Coast, Italy',
      price_per_night: 1450,
      bedrooms: 5,
      bathrooms: 6,
      guests: 10,
      area_sqft: 6800,
      description: 'Perched majestically above the Tyrrhenian Sea, Villa Solaria offers panoramic azure vistas, tiered lemon orchards, a heated glass-edge cliffside infinity pool, and a private funicular elevator directly to the private cove.',
      featured: 1,
      image: 'villa-1.jpg',
      gallery: 'villa-1-a.jpg,villa-1-b.jpg,villa-1-c.jpg',
      amenities: 'Infinity Pool,Private Sea Access,Private Chef,Butler Service,Helipad,Wine Cellar,Spa Pavilion,High-Speed Starlink',
      rating: 4.9,
      reviews_count: 28
    },
    {
      id: 2,
      title: 'The Obsidian Azure Haven',
      slug: 'the-obsidian-azure-haven',
      location: 'Santorini, Greece',
      price_per_night: 1850,
      bedrooms: 4,
      bathrooms: 5,
      guests: 8,
      area_sqft: 5400,
      description: 'Carved seamlessly into the volcanic Caldera cliffs with timeless cycladic curves, Obsidian Azure boasts sunken marble fire pits, sunset plunge pools, outdoor rainfall showers, and twilight champagne service.',
      featured: 1,
      image: 'villa-2.jpg',
      gallery: 'villa-2-a.jpg,villa-2-b.jpg,villa-2-c.jpg',
      amenities: 'Caldera Sunset Views,Heated Plunge Pool,Cave Spa,Daily Gourmet Breakfast,Yacht Charter,Dedicated Chauffeur,Smart Home Automation',
      rating: 5.0,
      reviews_count: 34
    },
    {
      id: 3,
      title: 'Elysian Palms Oasis',
      slug: 'elysian-palms-oasis',
      location: 'Uluwatu, Bali',
      price_per_night: 980,
      bedrooms: 6,
      bathrooms: 7,
      guests: 12,
      area_sqft: 8200,
      description: 'A tropical sanctuary seamlessly blending sustainable teak wood, open-air pavilion architecture, koi lily ponds, yoga shala, and an expansive 25-meter lap pool overlooking dramatic limestone ocean cliffs.',
      featured: 1,
      image: 'villa-3.jpg',
      gallery: 'villa-3-a.jpg,villa-3-b.jpg,villa-3-c.jpg',
      amenities: '25m Lap Pool,Open-Air Living,Private Yoga Shala,Cinema Room,Organic Garden Dining,Full Villa Staff,Outdoor Stone Baths',
      rating: 4.9,
      reviews_count: 22
    },
    {
      id: 4,
      title: 'Villa Miramar Bay',
      slug: 'villa-miramar-bay',
      location: 'Cote dAzur, France',
      price_per_night: 2200,
      bedrooms: 7,
      bathrooms: 8,
      guests: 14,
      area_sqft: 9500,
      description: 'Ultra-luxury modern French Riviera architecture with floor-to-ceiling glass walls, manicured cypress gardens, direct yacht mooring, private screening theater, and master suites with private rooftop sundecks.',
      featured: 1,
      image: 'villa-4.jpg',
      gallery: 'villa-4-a.jpg,villa-4-b.jpg,villa-4-c.jpg',
      amenities: 'Private Yacht Dock,Cinema Hall,Heated Saltwater Pool,Tennis Court,Michelin Star Chef Option,Security Detail,Gym & Sauna',
      rating: 5.0,
      reviews_count: 19
    },
    {
      id: 5,
      title: 'Casa Del Mar Celeste',
      slug: 'casa-del-mar-celeste',
      location: 'Tulum, Mexico',
      price_per_night: 850,
      bedrooms: 4,
      bathrooms: 4,
      guests: 8,
      area_sqft: 4900,
      description: 'Eco-luxury beachfront haven tucked amidst lush Mayan jungle and powdery white sands. Features rooftop stargazing deck, cenote-style dipping pools, and artisanal minimalist stone interiors.',
      featured: 0,
      image: 'villa-5.jpg',
      gallery: 'villa-5-a.jpg,villa-5-b.jpg,villa-5-c.jpg',
      amenities: 'Private Beachfront,Cenote Plunge Pool,Rooftop Stargazing,Bespoke Mezcal Bar,Daily Housekeeping,Surf Equipment',
      rating: 4.8,
      reviews_count: 15
    },
    {
      id: 6,
      title: 'The Alpine Panorama Chalet',
      slug: 'the-alpine-panorama-chalet',
      location: 'Zermatt, Switzerland',
      price_per_night: 2600,
      bedrooms: 5,
      bathrooms: 6,
      guests: 10,
      area_sqft: 7200,
      description: 'A masterpiece of contemporary alpine luxury offering uninterrupted Matterhorn views, custom cedar hot tubs, glass wine tasting room, ski-in ski-out access, and roaring granite fireplaces.',
      featured: 0,
      image: 'villa-6.jpg',
      gallery: 'villa-6-a.jpg,villa-6-b.jpg,villa-6-c.jpg',
      amenities: 'Ski-in Ski-out,Matterhorn Views,Cedar Outdoor Hot Tub,Finnish Sauna,Fireplace Lounges,Ski Butler,Private Sommelier',
      rating: 5.0,
      reviews_count: 41
    }
  ],
  services: [
    {
      id: 1,
      title: 'Private In-Villa Chefs',
      icon: 'fa-utensils',
      summary: 'World-class Michelin-trained private chefs designing personalized tasting menus using organic local produce paired with vintage wines.',
      display_order: 1
    },
    {
      id: 2,
      title: 'Luxury Yacht & Jet Charter',
      icon: 'fa-ship',
      summary: 'Private helicopter helipad transfers and luxury catamarans ready at dock for island hopping and sunset champagne cruises.',
      display_order: 2
    },
    {
      id: 3,
      title: '24/7 Dedicated Concierge',
      icon: 'fa-bell-concierge',
      summary: 'From reserving coveted VIP tables to arranging custom excursions, your personal villa manager handles every detail effortlessly.',
      display_order: 3
    },
    {
      id: 4,
      title: 'Wellness & Private Spa',
      icon: 'fa-spa',
      summary: 'In-villa massages, sound therapy, private yoga masters, and curated skincare treatments in the comfort of your sanctuary.',
      display_order: 4
    },
    {
      id: 5,
      title: 'Chauffeur & Exotic Fleet',
      icon: 'fa-car',
      summary: 'Complimentary luxury SUV airport pick-up, on-demand executive fleet, and bespoke convertible roadsters for scenic coastal drives.',
      display_order: 5
    },
    {
      id: 6,
      title: 'Pre-Arrival Custom Stocking',
      icon: 'fa-wine-glass',
      summary: 'Your refrigerator and temperature-controlled wine cellar fully stocked with your favorite artisanal snacks, champagne, and delicacies.',
      display_order: 6
    }
  ],
  inquiries: [
    {
      id: 1,
      villa_id: 1,
      villa_title: 'Villa Solaria Cliffside',
      guest_name: 'Elena Rostova',
      email: 'elena.rostova@monaco.mc',
      phone: '+377 93 15 28 00',
      check_in: '2026-11-10',
      check_out: '2026-11-18',
      guests_count: 6,
      message: 'Requesting availability for anniversary celebration. Need private chef service for 3 nights.',
      status: 'pending',
      created_date: '08-10-2026'
    },
    {
      id: 2,
      villa_id: 2,
      villa_title: 'The Obsidian Azure Haven',
      guest_name: 'Julian Vance',
      email: 'julian.vance@techventures.co',
      phone: '+1 (415) 890-4321',
      check_in: '2026-12-20',
      check_out: '2026-12-28',
      guests_count: 4,
      message: 'Looking for Caldera view villa with private heated plunge pool over Christmas week.',
      status: 'confirmed',
      created_date: '05-10-2026'
    }
  ],
  reviews: [
    {
      id: 1,
      guest_name: 'Alexandra & David Thorne',
      guest_location: 'London, United Kingdom',
      villa_name: 'Villa Solaria Cliffside',
      rating: 5,
      review_text: 'An unforgettable escape. The cliffside pool overlooking the Amalfi coast took our breath away every morning. The concierge team anticipated our every request seamlessly.',
      stay_date: 'August 2026',
      avatar: 'guest-1.jpg'
    },
    {
      id: 2,
      guest_name: 'Marcus Sterling',
      guest_location: 'New York, USA',
      villa_name: 'The Obsidian Azure Haven',
      rating: 5,
      review_text: 'Santorini at its pinnacle. Private sunset views without the tourist crowds, exquisite in-villa dining, and the utmost privacy. We have already rebooked for next year.',
      stay_date: 'July 2026',
      avatar: 'guest-2.jpg'
    },
    {
      id: 3,
      guest_name: 'Camilla Lindqvist',
      guest_location: 'Stockholm, Sweden',
      villa_name: 'Elysian Palms Oasis',
      rating: 5,
      review_text: 'Pure serenity. The tropical architecture harmonizes with nature so gracefully. Waking up to ocean breezes and private yoga sessions was pure rejuvenation.',
      stay_date: 'September 2026',
      avatar: 'guest-3.jpg'
    }
  ],
  admin_users: [
    {
      id: 1,
      username: 'admin',
      password: 'admin',
      name: 'Aura Concierge Admin',
      email: 'admin@auravillas.com'
    }
  ]
};

let isConnectedToMySQL = false;
let conn = null;

try {
  conn = mysql.createConnection(dbConfig);
  conn.connect((err) => {
    if (err) {
      console.log('⚠️ [Aura Villas DB] MySQL connection not active or database not found. Running in resilient mock memory mode.');
      console.log('💡 Note: You can import `database.sql` into MySQL at any time to switch to live MySQL.');
      isConnectedToMySQL = false;
    } else {
      console.log('✅ [Aura Villas DB] Connected to MySQL database successfully!');
      isConnectedToMySQL = true;
    }
  });
} catch (e) {
  isConnectedToMySQL = false;
}

// Universal query executor that seamlessly handles MySQL or in-memory fallback
async function executeQuery(sql, params = []) {
  if (isConnectedToMySQL && conn) {
    return new Promise((resolve, reject) => {
      conn.query(sql, params, (err, results) => {
        if (err) {
          console.warn('MySQL query error, using resilient fallback:', err.message);
          resolve(handleMemoryQuery(sql, params));
        } else {
          resolve(results);
        }
      });
    });
  } else {
    return handleMemoryQuery(sql, params);
  }
}

function handleMemoryQuery(sql, params) {
  const cleanSql = sql.trim().toLowerCase();

  // SELECT queries
  if (cleanSql.startsWith('select')) {
    if (cleanSql.includes('from site_settings')) {
      return [...memoryStore.site_settings];
    }
    if (cleanSql.includes('from villas')) {
      let results = [...memoryStore.villas];
      if (cleanSql.includes('where id = ?') || cleanSql.includes('where id=?')) {
        const id = Number(params[0]);
        return results.filter(v => v.id === id);
      }
      if (cleanSql.includes('where featured = 1') || cleanSql.includes('where featured=1')) {
        results = results.filter(v => v.featured === 1);
      }
      return results;
    }
    if (cleanSql.includes('from services')) {
      return [...memoryStore.services].sort((a,b) => a.display_order - b.display_order);
    }
    if (cleanSql.includes('from inquiries')) {
      let results = [...memoryStore.inquiries];
      if (cleanSql.includes('where id = ?') || cleanSql.includes('where id=?')) {
        const id = Number(params[0]);
        return results.filter(i => i.id === id);
      }
      return results.reverse();
    }
    if (cleanSql.includes('from reviews')) {
      return [...memoryStore.reviews];
    }
    if (cleanSql.includes('from admin_users')) {
      if (cleanSql.includes('where username=? and password=?') || cleanSql.includes('where username = ? and password = ?')) {
        const [u, p] = params;
        return memoryStore.admin_users.filter(user => user.username === u && user.password === p);
      }
      return [...memoryStore.admin_users];
    }
    return [];
  }

  // INSERT queries
  if (cleanSql.startsWith('insert into')) {
    if (cleanSql.includes('insert into inquiries')) {
      const newInquiry = {
        id: memoryStore.inquiries.length + 1,
        villa_id: params[0] || null,
        villa_title: params[1] || 'General Inquiry',
        guest_name: params[2],
        email: params[3],
        phone: params[4],
        check_in: params[5],
        check_out: params[6],
        guests_count: params[7] || 2,
        message: params[8],
        status: params[9] || 'pending',
        created_date: params[10] || new Date().toISOString().split('T')[0]
      };
      memoryStore.inquiries.push(newInquiry);
      return { insertId: newInquiry.id, affectedRows: 1 };
    }

    if (cleanSql.includes('insert into villas')) {
      const newVilla = {
        id: memoryStore.villas.length ? Math.max(...memoryStore.villas.map(v => v.id)) + 1 : 1,
        title: params[0],
        slug: params[0].toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        location: params[1],
        price_per_night: Number(params[2]),
        bedrooms: Number(params[3]),
        bathrooms: Number(params[4]),
        guests: Number(params[5]),
        area_sqft: Number(params[6]),
        description: params[7],
        featured: Number(params[8] || 0),
        image: params[9] || 'villa-1.jpg',
        gallery: params[10] || '',
        amenities: params[11] || '',
        rating: 5.0,
        reviews_count: 0
      };
      memoryStore.villas.push(newVilla);
      return { insertId: newVilla.id, affectedRows: 1 };
    }

    if (cleanSql.includes('insert into services')) {
      const newService = {
        id: memoryStore.services.length + 1,
        title: params[0],
        icon: params[1],
        summary: params[2],
        display_order: Number(params[3] || 1)
      };
      memoryStore.services.push(newService);
      return { insertId: newService.id, affectedRows: 1 };
    }
  }

  // UPDATE queries
  if (cleanSql.startsWith('update')) {
    if (cleanSql.includes('update inquiries')) {
      const status = params[0];
      const id = Number(params[1]);
      const inquiry = memoryStore.inquiries.find(i => i.id === id);
      if (inquiry) inquiry.status = status;
      return { affectedRows: 1 };
    }

    if (cleanSql.includes('update site_settings')) {
      memoryStore.site_settings[0] = {
        ...memoryStore.site_settings[0],
        site_name: params[0],
        tagline: params[1],
        hero_title: params[2],
        hero_subtitle: params[3],
        contact_email: params[4],
        contact_phone: params[5],
        contact_address: params[6]
      };
      return { affectedRows: 1 };
    }

    if (cleanSql.includes('update villas')) {
      const id = Number(params[params.length - 1]);
      const idx = memoryStore.villas.findIndex(v => v.id === id);
      if (idx !== -1) {
        memoryStore.villas[idx] = {
          ...memoryStore.villas[idx],
          title: params[0],
          location: params[1],
          price_per_night: Number(params[2]),
          bedrooms: Number(params[3]),
          bathrooms: Number(params[4]),
          guests: Number(params[5]),
          area_sqft: Number(params[6]),
          description: params[7],
          featured: Number(params[8]),
          image: params[9] || memoryStore.villas[idx].image,
          amenities: params[10]
        };
      }
      return { affectedRows: 1 };
    }
  }

  // DELETE queries
  if (cleanSql.startsWith('delete from')) {
    if (cleanSql.includes('from villas')) {
      const id = Number(params[0]);
      memoryStore.villas = memoryStore.villas.filter(v => v.id !== id);
      return { affectedRows: 1 };
    }
    if (cleanSql.includes('from inquiries')) {
      const id = Number(params[0]);
      memoryStore.inquiries = memoryStore.inquiries.filter(i => i.id !== id);
      return { affectedRows: 1 };
    }
    if (cleanSql.includes('from services')) {
      const id = Number(params[0]);
      memoryStore.services = memoryStore.services.filter(s => s.id !== id);
      return { affectedRows: 1 };
    }
  }

  return { affectedRows: 0 };
}

module.exports = {
  execute: executeQuery,
  isConnected: () => isConnectedToMySQL,
  store: memoryStore
};
