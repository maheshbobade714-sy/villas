-- Database schema for Aura Luxury Villas CMS
CREATE DATABASE IF NOT EXISTS `villas_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `villas_db`;

-- 1. Admin login table
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `admin_users` (`username`, `password`, `name`, `email`) 
VALUES ('admin', 'admin123', 'Aura Concierge Admin', 'admin@auravillas.com')
ON DUPLICATE KEY UPDATE `username`=`username`;

-- 2. Website settings & Hero configuration
CREATE TABLE IF NOT EXISTS `site_settings` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `site_name` VARCHAR(150) DEFAULT 'Aura Luxury Villas',
  `tagline` VARCHAR(255) DEFAULT 'Bespoke Private Sanctuaries & Coastal Escapes',
  `hero_title` VARCHAR(255) DEFAULT 'Discover Unrivaled Coastal Luxury',
  `hero_subtitle` VARCHAR(500) DEFAULT 'Handcrafted private estates, crystal infinity pools, and round-the-clock bespoke concierge services across the world’s most coveted destinations.',
  `contact_email` VARCHAR(150) DEFAULT 'reservations@auravillas.com',
  `contact_phone` VARCHAR(50) DEFAULT '+1 (800) 589-2872',
  `contact_address` VARCHAR(255) DEFAULT '742 Ocean Boulevard, Malibu Coast, CA 90265',
  `hero_image` VARCHAR(255) DEFAULT 'hero-villa.jpg'
);

INSERT INTO `site_settings` (`id`, `site_name`, `tagline`, `hero_title`, `hero_subtitle`, `contact_email`, `contact_phone`, `contact_address`, `hero_image`)
VALUES (1, 'Aura Luxury Villas', 'Bespoke Private Sanctuaries & Coastal Escapes', 'Discover Unrivaled Coastal Luxury', 'Handcrafted private estates, crystal infinity pools, and round-the-clock bespoke concierge services across the world’s most coveted destinations.', 'reservations@auravillas.com', '+1 (800) 589-2872', '742 Ocean Boulevard, Malibu Coast, CA 90265', 'hero-villa.jpg')
ON DUPLICATE KEY UPDATE `id`=1;

-- 3. Villas table
CREATE TABLE IF NOT EXISTS `villas` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(200) NOT NULL,
  `slug` VARCHAR(200) NOT NULL,
  `location` VARCHAR(150) NOT NULL,
  `price_per_night` DECIMAL(10,2) NOT NULL,
  `bedrooms` INT NOT NULL,
  `bathrooms` INT NOT NULL,
  `guests` INT NOT NULL,
  `area_sqft` INT NOT NULL,
  `description` TEXT NOT NULL,
  `featured` TINYINT(1) DEFAULT 0,
  `image` VARCHAR(255) NOT NULL,
  `gallery` TEXT,
  `amenities` TEXT,
  `rating` DECIMAL(2,1) DEFAULT 4.9,
  `reviews_count` INT DEFAULT 18,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO `villas` (`id`, `title`, `slug`, `location`, `price_per_night`, `bedrooms`, `bathrooms`, `guests`, `area_sqft`, `description`, `featured`, `image`, `gallery`, `amenities`, `rating`, `reviews_count`) VALUES
(1, 'Villa Solaria Cliffside', 'villa-solaria-cliffside', 'Amalfi Coast, Italy', 1450.00, 5, 6, 10, 6800, 'Perched majestically above the Tyrrhenian Sea, Villa Solaria offers panoramic azure vistas, tiered lemon orchards, a heated glass-edge cliffside infinity pool, and a private funicular elevator directly to the private cove.', 1, 'villa-1.jpg', 'villa-1-a.jpg,villa-1-b.jpg,villa-1-c.jpg', 'Infinity Pool,Private Sea Access,Private Chef,Butler Service,Helipad,Wine Cellar,Spa Pavilion,High-Speed Starlink', 4.9, 28),
(2, 'The Obsidian Azure Haven', 'the-obsidian-azure-haven', 'Santorini, Greece', 1850.00, 4, 5, 8, 5400, 'Carved seamlessly into the volcanic Caldera cliffs with timeless cycladic curves, Obsidian Azure boasts sunken marble fire pits, sunset plunge pools, outdoor rainfall showers, and twilight champagne service.', 1, 'villa-2.jpg', 'villa-2-a.jpg,villa-2-b.jpg,villa-2-c.jpg', 'Caldera Sunset Views,Heated Plunge Pool,Cave Spa,Daily Gourmet Breakfast,Yacht Charter,Dedicated Chauffeur,Smart Home Automation', 5.0, 34),
(3, 'Elysian Palms Oasis', 'elysian-palms-oasis', 'Uluwatu, Bali', 980.00, 6, 7, 12, 8200, 'A tropical sanctuary seamlessly blending sustainable teak wood, open-air pavilion architecture, koi lily ponds, yoga shala, and an expansive 25-meter lap pool overlooking dramatic limestone ocean cliffs.', 1, 'villa-3.jpg', 'villa-3-a.jpg,villa-3-b.jpg,villa-3-c.jpg', '25m Lap Pool,Open-Air Living,Private Yoga Shala,Cinema Room,Organic Garden Dining,Full Villa Staff,Outdoor Stone Baths', 4.9, 22),
(4, 'Villa Miramar Bay', 'villa-miramar-bay', 'Cote dAzur, France', 2200.00, 7, 8, 14, 9500, 'Ultra-luxury modern French Riviera architecture with floor-to-ceiling glass walls, manicured cypress gardens, direct yacht mooring, private screening theater, and master suites with private rooftop sundecks.', 1, 'villa-4.jpg', 'villa-4-a.jpg,villa-4-b.jpg,villa-4-c.jpg', 'Private Yacht Dock,Cinema Hall,Heated Saltwater Pool,Tennis Court,Michelin Star Chef Option,Security Detail,Gym & Sauna', 5.0, 19),
(5, 'Casa Del Mar Celeste', 'casa-del-mar-celeste', 'Tulum, Mexico', 850.00, 4, 4, 8, 4900, 'Eco-luxury beachfront haven tucked amidst lush Mayan jungle and powdery white sands. Features rooftop stargazing deck, cenote-style dipping pools, and artisanal minimalist stone interiors.', 0, 'villa-5.jpg', 'villa-5-a.jpg,villa-5-b.jpg,villa-5-c.jpg', 'Private Beachfront,Cenote Plunge Pool,Rooftop Stargazing,Bespoke Mezcal Bar,Daily Housekeeping,Surf Equipment', 4.8, 15),
(6, 'The Alpine Panorama Chalet', 'the-alpine-panorama-chalet', 'Zermatt, Switzerland', 2600.00, 5, 6, 10, 7200, 'A masterpiece of contemporary alpine luxury offering uninterrupted Matterhorn views, custom cedar hot tubs, glass wine tasting room, ski-in ski-out access, and roaring granite fireplaces.', 0, 'villa-6.jpg', 'villa-6-a.jpg,villa-6-b.jpg,villa-6-c.jpg', 'Ski-in Ski-out,Matterhorn Views,Cedar Outdoor Hot Tub,Finnish Sauna,Fireplace Lounges,Ski Butler,Private Sommelier', 5.0, 41)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 4. Amenities / Luxury Services table
CREATE TABLE IF NOT EXISTS `services` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `title` VARCHAR(150) NOT NULL,
  `icon` VARCHAR(100) NOT NULL,
  `summary` TEXT NOT NULL,
  `display_order` INT DEFAULT 0
);

INSERT INTO `services` (`id`, `title`, `icon`, `summary`, `display_order`) VALUES
(1, 'Private In-Villa Chefs', 'fa-utensils', 'World-class Michelin-trained private chefs designing personalized tasting menus using organic local produce paired with vintage wines.', 1),
(2, 'Luxury Yacht & Jet Charter', 'fa-ship', 'Private helicopter helipad transfers and luxury catamarans ready at dock for island hopping and sunset champagne cruises.', 2),
(3, '24/7 Dedicated Concierge', 'fa-concierge-bell', 'From reserving coveted VIP tables to arranging custom excursions, your personal villa manager handles every detail effortlessly.', 3),
(4, 'Wellness & Private Spa', 'fa-spa', 'In-villa massages, sound therapy, private yoga masters, and curated skincare treatments in the comfort of your sanctuary.', 4),
(5, 'Chauffeur & Exotic Cars', 'fa-car', 'Complimentary luxury SUV airport pick-up, on-demand executive fleet, and bespoke convertible roadsters for scenic drives.', 5),
(6, 'Pre-Arrival Custom Stocking', 'fa-wine-glass', 'Your refrigerator and wine cellar fully stocked with your favorite artisanal snacks, champagne, and delicacies upon arrival.', 6)
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 5. Inquiries & Booking Requests table
CREATE TABLE IF NOT EXISTS `inquiries` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `villa_id` INT DEFAULT NULL,
  `villa_title` VARCHAR(200) DEFAULT 'General Inquiry',
  `guest_name` VARCHAR(150) NOT NULL,
  `email` VARCHAR(150) NOT NULL,
  `phone` VARCHAR(50) NOT NULL,
  `check_in` VARCHAR(50) DEFAULT NULL,
  `check_out` VARCHAR(50) DEFAULT NULL,
  `guests_count` INT DEFAULT 2,
  `message` TEXT NOT NULL,
  `status` ENUM('pending', 'contacted', 'confirmed', 'cancelled') DEFAULT 'pending',
  `created_date` VARCHAR(50) NOT NULL
);

INSERT INTO `inquiries` (`id`, `villa_id`, `villa_title`, `guest_name`, `email`, `phone`, `check_in`, `check_out`, `guests_count`, `message`, `status`, `created_date`) VALUES
(1, 1, 'Villa Solaria Cliffside', 'Elena Rostova', 'elena.rostova@monaco.mc', '+377 93 15 28 00', '2026-11-10', '2026-11-18', 6, 'Requesting availability for anniversary celebration. Need private chef service for 3 nights.', 'pending', '08-10-2026'),
(2, 2, 'The Obsidian Azure Haven', 'Julian Vance', 'julian.vance@techventures.co', '+1 (415) 890-4321', '2026-12-20', '2026-12-28', 4, 'Looking for Caldera view villa with private heated plunge pool over Christmas week.', 'confirmed', '05-10-2026')
ON DUPLICATE KEY UPDATE `id`=`id`;

-- 6. Guest Reviews / Testimonials table
CREATE TABLE IF NOT EXISTS `reviews` (
  `id` INT AUTO_INCREMENT PRIMARY KEY,
  `guest_name` VARCHAR(150) NOT NULL,
  `guest_location` VARCHAR(150) NOT NULL,
  `villa_name` VARCHAR(150) NOT NULL,
  `rating` INT DEFAULT 5,
  `review_text` TEXT NOT NULL,
  `stay_date` VARCHAR(50) DEFAULT 'Summer 2026',
  `avatar` VARCHAR(255) DEFAULT 'guest-default.jpg'
);

INSERT INTO `reviews` (`id`, `guest_name`, `guest_location`, `villa_name`, `rating`, `review_text`, `stay_date`, `avatar`) VALUES
(1, 'Alexandra & David Thorne', 'London, United Kingdom', 'Villa Solaria Cliffside', 5, 'An unforgettable escape. The cliffside pool overlooking the Amalfi coast took our breath away every morning. The concierge team anticipated our every request seamlessly.', 'August 2026', 'guest-1.jpg'),
(2, 'Marcus Sterling', 'New York, USA', 'The Obsidian Azure Haven', 5, 'Santorini at its pinnacle. Private sunset views without the tourist crowds, exquisite in-villa dining, and the utmost privacy. We have already rebooked for next year.', 'July 2026', 'guest-2.jpg'),
(3, 'Camilla Lindqvist', 'Stockholm, Sweden', 'Elysian Palms Oasis', 5, 'Pure serenity. The tropical architecture harmonizes with nature so gracefully. Waking up to ocean breezes and private yoga sessions was pure rejuvenation.', 'September 2026', 'guest-3.jpg')
ON DUPLICATE KEY UPDATE `id`=`id`;
