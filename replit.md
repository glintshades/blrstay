# blrstay - Premium Men's PG Accommodation Website

## Overview
blrstay is developing a professional multi-page website for its premium men's paying guest (PG) accommodation in Yelahanka, Bangalore. The primary goal is to showcase the property, provide detailed information about rooms and amenities, and enable online booking inquiries. The website is optimized for local SEO to attract potential guests searching for men's PG accommodations in the Yelahanka area, particularly targeting keywords around "Men's PG in Yelahanka," "Boys PG Honnenahalli," and "near Orchid International School." The project aims to provide a seamless user experience, clear property details, and a robust backend for managing bookings.

## User Preferences
I want iterative development and prefer to be asked before major changes are made to the codebase. Ensure the communication is clear and concise, focusing on practical outcomes.

## System Architecture
The blrstay website employs a multi-page architecture built with a modern technology stack.

**Technology Stack:**
- **Frontend**: React, TypeScript, Tailwind CSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL (Drizzle ORM)
- **Routing**: Wouter
- **State Management**: TanStack Query
- **Forms**: React Hook Form with Zod validation

**UI/UX and Design:**
- **Target Audience**: Boys and men (students and working professionals).
- **Color Scheme**: Primary rich brown (HSL 30° 45% 35%), accent warm gold (HSL 45° 65% 55%), and cream/beige tones for backgrounds.
- **Typography**: Inter for body text, Poppins for headings.
- **Components**: Utilizes Shadcn UI for consistent and accessible components.
- **Aesthetic**: Masculine, warm, and professional, with subtle hover elevations and smooth transitions.
- **Responsiveness**: Mobile-first approach ensuring optimal viewing across all screen sizes with a sticky navigation and hamburger menu for mobile.

**Core Features & Pages:**
- **Multi-Page Navigation**: Dedicated pages for Home, Rooms, Amenities, Location, and Contact, navigable via a consistent navbar and footer.
- **SEO Optimization**: Each page includes unique, keyword-optimized title tags, meta descriptions, and Open Graph tags using `react-helmet-async`. Content is structured to be Schema.org ready, incorporating primary and long-tail keywords relevant to local search.
- **Dynamic Content**:
    - **Image Carousel**: An interactive, autoplaying image carousel (using `embla-carousel-react`) on the Home page showcasing property images.
    - **Page Banners**: Reusable gradient banners for consistent page headers on all sub-pages.
- **Home Page**: Features a hero section, image carousel, property statistics, "Why Choose blrstay" section, "Life at blrstay" section, testimonials, and a "Why Yelahanka" section.
- **Rooms Page**: Details single and double occupancy options with specifications, pricing, images, and booking CTAs.
- **Amenities Page**: Showcases 8 key amenities with descriptions, organized into themed sections.
- **Location Page**: Displays the full address, embedded Google Maps, nearby landmarks, commuting information, and local highlights.
- **Contact Page**: Includes an FAQ section with accordion-style questions, an 8-step booking guide, and contact information with a floating WhatsApp button.
- **Online Booking System**: A modal dialog form for booking inquiries with fields for name, email, phone, room type, move-in date (with date picker), and form validation.
- **Admin Panel**: Accessible via `/admin/login`, protected by authentication. Features include:
    - **Analytics Dashboard**: Displays booking statistics, room stats (total/available/occupied/revenue), monthly trends, room type distribution, visitor trends, and recent bookings using `recharts`.
    - **Room Management** (`/admin/rooms`): Add/edit/delete rooms with room number, type, floor, beds, price, status, description, and per-room photo upload.
    - **Bookings Management** (`/admin/bookings`): Table view of all bookings with sorting, searching, filtering by status/room type, inline booking status and payment status changes, admin notes, and CSV export.
    - **Tenant Management** (`/admin/tenants`): Add/edit/delete tenants with name, contact, room assignment, move-in date, ID proof upload, and status.
    - **PG Facilities** (`/admin/facilities`): Manage facility cards (WiFi, Parking, Meals, etc.) with availability toggles, icon selection, and descriptions. Auto-seeded with 10 defaults.
    - **Room Photos Management** (`/admin/photos`): Allows uploading, captioning, viewing, and deleting room photos (JPEG, JPG, PNG, WEBP, max 5MB).

**Backend & API:**
- **API Endpoints**:
    - `POST /api/bookings`: Create new booking inquiry.
    - `GET /api/bookings`: Retrieve all bookings.
    - `GET /api/bookings/:id`: Retrieve a specific booking.
    - `PATCH /api/admin/bookings/:id`: Update booking status, payment status, and/or notes.
    - `DELETE /api/admin/bookings/:id`: Delete a booking.
    - `GET /api/admin/rooms`: Get all rooms.
    - `POST /api/admin/rooms`: Create a room.
    - `PATCH /api/admin/rooms/:id`: Update a room.
    - `DELETE /api/admin/rooms/:id`: Delete a room.
    - `POST /api/admin/rooms/:id/photos`: Upload a photo for a specific room.
    - `GET /api/admin/tenants`: Get all tenants.
    - `POST /api/admin/tenants`: Create a tenant (with optional ID proof file upload).
    - `PATCH /api/admin/tenants/:id`: Update a tenant.
    - `DELETE /api/admin/tenants/:id`: Delete a tenant.
    - `GET /api/admin/facilities`: Get all PG facilities (auto-seeds defaults on first call).
    - `POST /api/admin/facilities`: Create a facility.
    - `PATCH /api/admin/facilities/:id`: Update a facility (e.g. toggle availability).
    - `DELETE /api/admin/facilities/:id`: Delete a facility.
    - `GET /api/admin/analytics`: Returns booking + room stats and chart data for the admin dashboard.
    - `POST /api/track`: Record a page view (no auth, called from frontend on every page change).
    - `GET /api/admin/visitors`: Returns full visitor stats (requires auth).
    - `GET /api/admin/ga-analytics`: Fetches GA4 data (requires GOOGLE_SERVICE_ACCOUNT_KEY + GA4_PROPERTY_ID).
    - `GET /api/admin/search-console`: Fetches GSC data (requires GOOGLE_SERVICE_ACCOUNT_KEY + GSC_SITE_URL).
- **Data Model**: `bookings` has `id`, `name`, `email`, `phone`, `roomType`, `moveInDate`, `status`, `paymentStatus`, `notes`, `createdAt`. `rooms` has `id`, `roomNumber`, `type`, `beds`, `price`, `status`, `floor`, `description`, `images[]`. `tenants` has `id`, `name`, `phone`, `email`, `roomId`, `moveInDate`, `idProofUrl`, `idProofType`, `status`, `notes`. `pg_facilities` has `id`, `name`, `description`, `icon`, `isAvailable`. `room_photos` for gallery management. `page_views` for visitor analytics.

## Stanza Living-Style Design Features
- **Compact Amenity Chips**: Hero section now shows 8 horizontal pill chips (WiFi, Meals, AC, Security, Parking, Laundry, TV, Power Backup) instead of 3 large blocks — matches modern PG listing sites
- **Trust Strip**: Horizontal stats bar after the carousel — 50+ Residents · 4.8★ · 3+ Years · Yelahanka, Bengaluru · Starting ₹6,000
- **Photo-First Room Cards**: "Choose Your Room" section with two Stanza-style cards — large photo, price badge overlay, amenity chips, availability badge, book CTA
- **Compact Why-Choose Grid**: 2×4 icon+text compact chip grid instead of 4 large cards
- **Location Badge in Navbar**: Small "Yelahanka, Bengaluru" label with MapPin icon below logo
- **Location Badge in Hero**: "Yelahanka, Bengaluru" pill chip above the H1 title

## Visitor Location Tracking
- **Schema**: `page_views` table now has `city`, `region`, `country` columns
- **Backend**: `/api/track` endpoint calls `http://ip-api.com/json/{ip}` (free, no key) with 2s timeout to resolve city/region/country from visitor IP; private IPs (127.x, 10.x, 192.168.x) skipped gracefully
- **Admin Panel**: `AdminVisitors.tsx` now has a "Visitor Locations" card with:
  - City progress bars showing relative visit counts
  - Horizontal bar chart (top 8 cities) powered by recharts
  - Shows "No location data yet" placeholder for local/private IPs

## Performance Optimizations
- **Code Splitting**: `React.lazy()` used in App.tsx for all admin pages and secondary public pages. AdminDashboard (recharts ~521KB) only loads when `/admin` is visited — reduces initial JS by ~45% for public visitors.
- **Hero LCP**: Hero background converted from CSS `background-image` to `<img fetchpriority="high">` so the browser's LCP scanner can properly identify and preload it.
- **Lazy Carousel**: `ImageCarousel` (embla-carousel) is lazily imported — only loads when the below-fold carousel section renders.
- **Gzip Compression**: `compression` Express middleware compresses all HTTP responses (JS, CSS, HTML, JSON).
- **Image Caching**: `/attached_assets` served with `Cache-Control: max-age=7d` for uploaded photos.
- **Query Caching**: Photos query `staleTime` increased to 5 minutes (was 0) to avoid unnecessary API requests on every page visit.

## External Dependencies
- **Google Maps**: Embedded for location display.
- **WhatsApp**: Direct linking for communication.
- **Multer**: Middleware for file uploads in the admin panel.
- **recharts**: JavaScript charting library for admin analytics.
- **compression**: Express gzip compression middleware.
- **embla-carousel-react**: React carousel library for image display.