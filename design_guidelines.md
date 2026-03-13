# Design Guidelines: Raksha Men's PG - Yelahanka, Bangalore

## Design Approach

**Reference-Based Approach**: Drawing inspiration from **Airbnb** and **Booking.com** for their proven hospitality design patterns that build trust and drive bookings. This approach emphasizes visual storytelling, local authenticity, and frictionless booking experiences.

**Target Audience**: Boys and men (students and working professionals)

**Color Scheme**: Brown, Gold, and Cream theme
- Primary: Rich brown (#5C3D2E / HSL 30° 45% 35%) - Represents stability, reliability, masculine energy
- Accent: Warm gold (#D4AF37 / HSL 45° 65% 55%) - Conveys premium quality and achievement
- Background: Cream/beige tones - Creates warmth and comfort

**Core Principles**:
- Trust-first design with authentic imagery and transparent information
- Local SEO optimization through content structure and hierarchy
- Mobile-first approach (most PG searches happen on mobile)
- Conversion-focused with clear booking pathways
- Masculine aesthetic with warm, professional tones

---

## Typography

**Font Stack**:
- Primary: 'Inter' (Google Fonts) - Clean, modern, excellent readability
- Accent: 'Poppins' (Google Fonts) - For headings, warm and approachable

**Hierarchy**:
- Hero Headline: Bold, 2.5rem desktop / 1.75rem mobile
- Section Headings: Semibold, 2rem desktop / 1.5rem mobile
- Subheadings: Medium, 1.25rem
- Body Text: Regular, 1rem with 1.6 line-height
- Small Print/Captions: 0.875rem

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16** for consistent rhythm
- Micro spacing: p-2, gap-2 (buttons, tight elements)
- Standard spacing: p-4, m-4, gap-4 (cards, form fields)
- Section padding: py-12 mobile, py-16 to py-20 desktop
- Component gaps: gap-8, gap-12
- Major sections: py-16 to py-24

**Grid System**:
- Mobile: Single column, full-width
- Tablet (md): 2-column for amenities/features
- Desktop (lg): 3-column max for room cards, 2-column for major content

---

## Page Structure & Sections

### 1. Hero Section (Full Viewport Impact)
- **Large hero image**: Welcoming exterior/best room shot with natural lighting
- Semi-transparent dark overlay (opacity-40) for text readability
- Centered content: Property name, tagline, primary CTA
- Key differentiator text: "Premium PG in Yelahanka | Near Orchid International School"
- Floating search/booking widget with blurred background (backdrop-blur-lg)
- Trust indicators: "WiFi • Parking • 24/7 Security" with icons

### 2. Quick Info Bar (Sticky on scroll)
- Location, starting price, instant booking badge
- Secondary CTA: "Check Availability"

### 3. Location & Accessibility
- **Two-column layout** (desktop): Left - Text content, Right - Embedded map
- Address prominently displayed with schema markup structure
- Nearby landmarks list with distances (Orchid International School, local transit)
- Neighborhood description emphasizing Yelahanka's connectivity

### 4. Room Showcases
- **Masonry-style grid** of 4-6 room images (mix of close-ups and wide shots)
- Image cards with subtle hover elevation
- Overlay on hover: Room type, price, "View Details" button with blurred background
- Clicking opens modal/lightbox with room gallery

### 5. Amenities Grid
- **3-column grid** (desktop), 2-column (tablet), 1-column (mobile)
- Icon cards with: Icon (Heroicons), amenity name, brief description
- Categories: Room Features, Common Areas, Safety & Security, Services
- Include: WiFi, Parking, Bed types, Laundry, 24/7 Security, Housekeeping, etc.

### 6. Why Choose Us / Features
- **Alternating two-column sections** (image-text, text-image pattern)
- Feature blocks: Flexible rental terms, Prime location, Modern amenities, Safety focus
- Each with supporting image and descriptive text

### 7. Testimonials & Social Proof
- **Two-column testimonial cards** with authentic guest photos
- Star ratings, guest name, duration of stay
- Quotes highlighting location, cleanliness, hospitality

### 8. Pricing & Booking
- Clear pricing table (single/double occupancy, monthly rates)
- Highlighted features included in rent
- Primary CTA: "Book Your Room Now" with blurred background treatment
- Secondary info: Deposit details, payment methods accepted

### 9. FAQ Section
- Accordion-style for common questions about booking, facilities, rules
- SEO-optimized with local search intent questions

### 10. Footer
- **Multi-column layout**: Contact info, Quick links, Address with map link, Social media
- Newsletter signup: "Get updates on special offers"
- WhatsApp contact button (floating, bottom-right)
- Trust badges: Payment methods, verified property

---

## Component Library

**Navigation**:
- Transparent on hero, solid white on scroll with subtle shadow
- Logo/Property name left, navigation center, "Book Now" CTA right
- Mobile: Hamburger menu with slide-in drawer

**Buttons**:
- Primary: Rounded-lg, py-3 px-6, medium weight text
- On images: backdrop-blur-lg with semi-transparent background
- Icons: Heroicons for consistency

**Cards**:
- Room cards: Rounded-xl, shadow-md, overflow-hidden for images
- Amenity cards: Rounded-lg, p-6, centered content, hover:shadow-lg
- Testimonial cards: Rounded-lg, p-6, border with subtle background

**Forms** (Booking/Contact):
- Floating labels for modern feel
- Rounded-lg inputs with border on focus
- Date pickers for check-in/out
- Clear validation states

**Modal/Lightbox**:
- For room image galleries
- Dark backdrop with close button
- Image navigation arrows

---

## Images

**Required Images** (10-15 high-quality photos):

1. **Hero Image**: Welcoming front exterior during golden hour or well-lit interior of best room
2. **Room Images** (4-6): Variety of room types, beds made, natural lighting, clean and organized
3. **Common Areas** (2-3): Living room, dining area, outdoor space if available
4. **Amenities**: WiFi router, parking area, kitchen/pantry
5. **Location Context**: Nearby Orchid International School, street view of Honnenahalli area
6. **Testimonial Photos**: 3-4 guest headshots (can use placeholder if unavailable)

**Image Treatment**:
- All images optimized for web (WebP format)
- Hero and room images: 16:9 or 3:2 aspect ratio
- Amenity images: Square (1:1)
- Consistent editing style: Bright, warm, welcoming tones

---

## Accessibility & SEO

- Semantic HTML5 structure (header, nav, main, section, footer)
- Schema.org markup for LocalBusiness and LodgingBusiness
- Alt text for all images with local keywords
- H1: Property name with location
- H2: Section headings with relevant local terms
- Meta description: "Premium PG accommodation in Yelahanka, Bangalore. Near Orchid International School, Honnenahalli. Fully furnished rooms with WiFi, parking, 24/7 security."
- Local keywords naturally integrated: Yelahanka PG, Honnenahalli accommodation, Orchid School area

---

## Interaction & Animation

**Minimal, Purposeful Animations**:
- Smooth scroll to sections
- Gentle fade-in for sections on scroll (intersection observer)
- Card hover elevations (subtle shadow transitions)
- Image gallery transitions
- No distracting background animations

**Performance Priority**:
- Lazy loading for images below fold
- Optimized images with srcset for responsive delivery

This design creates a trustworthy, conversion-optimized experience that showcases your PG property professionally while emphasizing local relevance for SEO.