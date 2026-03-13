import { useState, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import { useLocation } from "wouter";
import type { RoomPhoto } from "@shared/schema";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TestimonialCard from "@/components/TestimonialCard";
import Footer from "@/components/Footer";
import BookingDialog from "@/components/BookingDialog";
import WhatsAppButton from "@/components/WhatsAppButton";

const ImageCarousel = lazy(() => import("@/components/ImageCarousel"));

import heroImage from "@assets/WhatsApp_Image_2026-03-07_at_9.58.13_AM_1772897947355.webp";
import commonAreaImage from "@assets/generated_images/Common_area_and_dining_space_8667e4e5.webp";
import parkingImage from "@assets/generated_images/Parking_facility_433ca375.webp";
import maleGuestImage from "@assets/generated_images/Male_guest_testimonial_photo_5785c663.webp";
import singleRoomImage from "@assets/generated_images/Single_occupancy_room_interior_74aad7ae.webp";
import doubleRoomImage from "@assets/generated_images/Double_occupancy_room_interior_f1f502c3.webp";

import { Star, Wifi, Shield, Utensils, Car, Users, Clock, Home as HomeIcon, TrendingUp, Wind, Shirt, Zap, Tv, CheckCircle, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Home() {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<string>("");
  const [location] = useLocation();
  const isSlugPage = location === "/pg-in-yelahanka-near-manyata-tech-park";

  const { data: roomPhotos } = useQuery<RoomPhoto[]>({
    queryKey: ["/api/photos"],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const getPhoto = (type: string, fallback: string) =>
    roomPhotos?.find(p => p.roomType === type)?.photoUrl ?? fallback;

  const canonicalUrl = isSlugPage
    ? "https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park"
    : "https://blrstay.com/";

  const carouselImages = [
    {
      src: heroImage,
      alt: "Blrstay PG building exterior in Honnenahalli, Yelahanka — best men's PG in Yelahanka near Orchid International School",
      caption: "Blrstay - Signature Living in Yelahanka, Bangalore",
    },
    {
      src: singleRoomImage,
      alt: "Single occupancy AC room interior at Blrstay PG in Yelahanka — fully furnished with study table, wardrobe, and attached bathroom, ₹8,000/month",
      caption: "Spacious Single Occupancy Rooms - ₹8,000/month",
    },
    {
      src: doubleRoomImage,
      alt: "Double sharing AC room interior at Blrstay men's PG in Yelahanka — two beds, wardrobes, study tables, and attached bathroom, ₹6,000/month per person",
      caption: "Comfortable Double Sharing Rooms - ₹6,000/month",
    },
    {
      src: commonAreaImage,
      alt: "Common area and dining hall at Blrstay PG in Yelahanka — spacious lounge and vegetarian meal serving area for residents",
      caption: "Vibrant Common Areas & Dining Hall",
    },
    {
      src: parkingImage,
      alt: "Covered parking facility at Blrstay PG near Manyata Tech Park, Yelahanka — secure parking for bikes and cars included in rent",
      caption: "Secure Covered Parking for Bikes & Cars",
    },
  ];

  const testimonials = [
    {
      name: "Rajesh Kumar",
      image: maleGuestImage,
      rating: 5,
      duration: "Staying for 8 months",
      comment:
        "Great location near Orchid School. The WiFi is excellent for my remote work, and the place is always clean and well-maintained. Highly recommend!",
    },
    {
      name: "Arun Mehta",
      image: maleGuestImage,
      rating: 5,
      duration: "Staying for 6 months",
      comment:
        "As a working professional, I appreciate the flexible timings and good security. The food is home-cooked and delicious. Feels like home!",
    },
    {
      name: "Vikram Singh",
      image: maleGuestImage,
      rating: 5,
      duration: "Staying for 1 year",
      comment:
        "Best PG I've stayed at in Bangalore! The rooms are spacious with proper ventilation. The staff is very cooperative and maintenance is prompt. Value for money!",
    },
    {
      name: "Pradeep Sharma",
      image: maleGuestImage,
      rating: 5,
      duration: "Staying for 4 months",
      comment:
        "Close to my office at Manyata Tech Park. The commute is easy and parking is always available. Clean rooms, good food, and peaceful environment. Couldn't ask for more!",
    },
  ];

  return (
    <div className="min-h-screen">
      <Helmet>
        <title>PG in Yelahanka | Affordable Rooms Near Manyata Tech Park</title>
        <meta
          name="description"
          content="BLRSTAY offers comfortable PG in Yelahanka with food, WiFi, and safe accommodation for students and professionals near Manyata Tech Park."
        />
        <meta property="og:title" content="PG in Yelahanka | Affordable Rooms Near Manyata Tech Park" />
        <meta property="og:description" content="BLRSTAY offers comfortable PG in Yelahanka with food, WiFi, and safe accommodation for students and professionals near Manyata Tech Park." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <link rel="canonical" href={canonicalUrl} />
        <link rel="preload" as="image" href={heroImage} />
      </Helmet>
      <Navbar onBookNowClick={() => setIsBookingDialogOpen(true)} />

      <HeroSection
        title="Best Men's PG in Yelahanka"
        subtitle="Affordable PG for Boys & Working Professionals | Near Orchid School, Yelahanka New Town, Honnenahalli"
        ctaText="Book Your Room Now"
        onCtaClick={() => setIsBookingDialogOpen(true)}
        backgroundImage={heroImage}
      />

      {/* SEO Keyword Intro Band */}
      <section className="bg-primary py-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-center text-primary-foreground/90 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
            Looking for the <a href="https://blrstay.com/" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">best men's PG in Yelahanka</a>?{" "}
            Blrstay is the top-rated <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">PG in Yelahanka</a> for students and working professionals.{" "}
            Ideal for those working at{" "}
            <a href="https://blrstay.com/location" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">PG near Manyata Tech Park</a>{" "}
            or commuting via the{" "}
            <a href="https://blrstay.com/location" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">PG near Bangalore Airport</a> corridor. Starting ₹6,000/month.
          </p>
        </div>
      </section>

      {/* Image Carousel Section */}
      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <div className="h-1 w-16 bg-accent mx-auto mb-6 rounded-full"></div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-4 tracking-tight">
              Explore Premium Rooms & Facilities at Blrstay Men's PG in Yelahanka
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Take a virtual tour of Blrstay and discover the comfort, convenience, and quality that awaits you
            </p>
          </div>
          <Suspense fallback={<div className="h-96 bg-muted animate-pulse rounded-xl" />}>
            <ImageCarousel images={carouselImages} autoplayDelay={4000} />
          </Suspense>
        </div>
      </section>

      {/* Trust / Stats Strip — Stanza Living style */}
      <section className="bg-white border-b border-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm">
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Users className="w-4 h-4 text-accent" />
              <span>50+ Happy Residents</span>
            </div>
            <span className="hidden md:block text-gray-200">|</span>
            <div className="flex items-center gap-2 font-semibold text-primary">
              <Star className="w-4 h-4 fill-accent text-accent" />
              <span>4.8 / 5 Rating</span>
            </div>
            <span className="hidden md:block text-gray-200">|</span>
            <div className="flex items-center gap-2 font-semibold text-primary">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>3+ Years of Excellence</span>
            </div>
            <span className="hidden md:block text-gray-200">|</span>
            <div className="flex items-center gap-2 font-semibold text-primary">
              <MapPin className="w-4 h-4 text-accent" />
              <span>Honnenahalli, Yelahanka New Town</span>
            </div>
            <span className="hidden md:block text-gray-200">|</span>
            <div className="flex items-center gap-2 font-semibold text-accent">
              <span>Starting ₹6,000/month</span>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Widget */}
      <section className="py-10 bg-primary/5 border-y border-primary/10" id="book-now">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-6">
            <h2 className="font-heading font-bold text-2xl md:text-3xl text-primary">Select Your Room & Enquire</h2>
            <p className="text-muted-foreground text-sm mt-1">Choose a room type below and submit your enquiry — we'll confirm within 24 hours</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-center">
            <button
              onClick={() => setSelectedRoomType(selectedRoomType === "single" ? "" : "single")}
              data-testid="button-select-single"
              className={`flex-1 max-w-xs rounded-xl border-2 p-5 text-left transition-all duration-200 cursor-pointer ${
                selectedRoomType === "single"
                  ? "border-accent bg-accent/10 shadow-lg scale-[1.02]"
                  : "border-border bg-background hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-bold text-lg text-primary">Single Occupancy</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRoomType === "single" ? "border-accent bg-accent" : "border-muted-foreground"}`}>
                  {selectedRoomType === "single" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <p className="text-accent font-bold text-xl">₹8,000<span className="text-sm font-normal text-muted-foreground">/month</span></p>
              <p className="text-xs text-muted-foreground mt-1">1 Person · AC · Attached Bath · All-Inclusive</p>
            </button>

            <button
              onClick={() => setSelectedRoomType(selectedRoomType === "double" ? "" : "double")}
              data-testid="button-select-double"
              className={`flex-1 max-w-xs rounded-xl border-2 p-5 text-left transition-all duration-200 cursor-pointer ${
                selectedRoomType === "double"
                  ? "border-accent bg-accent/10 shadow-lg scale-[1.02]"
                  : "border-border bg-background hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-heading font-bold text-lg text-primary">Double Occupancy</span>
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedRoomType === "double" ? "border-accent bg-accent" : "border-muted-foreground"}`}>
                  {selectedRoomType === "double" && <div className="w-2 h-2 rounded-full bg-white" />}
                </div>
              </div>
              <p className="text-accent font-bold text-xl">₹6,000<span className="text-sm font-normal text-muted-foreground">/person/mo</span></p>
              <p className="text-xs text-muted-foreground mt-1">2 Persons · AC · Attached Bath · Best Value</p>
            </button>

            <div className="flex flex-col gap-2 sm:self-center">
              <Button
                size="lg"
                className="px-8 font-semibold"
                onClick={() => setIsBookingDialogOpen(true)}
                disabled={!selectedRoomType}
                data-testid="button-enquire-now"
              >
                {selectedRoomType ? `Enquire Now →` : "Select a Room"}
              </Button>
              {selectedRoomType && (
                <p className="text-xs text-center text-muted-foreground">
                  {selectedRoomType === "single" ? "Single Occupancy selected" : "Double Occupancy selected"}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Room Options — Stanza Living style */}
      <section className="py-16 bg-white" id="rooms-preview">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
            <div>
              <div className="h-1 w-12 bg-accent mb-4 rounded-full" />
              <h2 className="font-heading font-bold text-3xl md:text-4xl tracking-tight">Choose Your Room</h2>
              <p className="text-muted-foreground mt-2">All rooms are fully furnished, AC, and all-inclusive</p>
            </div>
            <Link href="/rooms">
              <Button variant="outline" size="sm" className="gap-1" data-testid="link-view-all-rooms">
                View All Rooms <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Single Occupancy Card */}
            <Card className="overflow-hidden hover-elevate group" data-testid="card-room-single">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={getPhoto("Single Occupancy", singleRoomImage)}
                  alt="Single occupancy AC room at Blrstay PG Yelahanka — ₹8,000/month all-inclusive"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = singleRoomImage; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-accent text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                    Available Now
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-medium">Single Occupancy</p>
                    <p className="text-white font-bold text-2xl">₹8,000<span className="text-sm font-normal">/month</span></p>
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/30">All-Inclusive</span>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { icon: Wind, label: "AC" },
                    { icon: Wifi, label: "WiFi" },
                    { icon: Utensils, label: "3 Meals" },
                    { icon: Shield, label: "Security" },
                    { icon: Car, label: "Parking" },
                    { icon: Shirt, label: "Laundry" },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="inline-flex items-center gap-1 text-xs bg-primary/5 text-primary px-2.5 py-1 rounded-full font-medium border border-primary/10">
                      <Icon className="w-3 h-3 text-accent" />
                      {label}
                    </span>
                  ))}
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />Fully furnished with study table & wardrobe</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />Attached bathroom · Good ventilation</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />No brokerage · No hidden charges</li>
                </ul>
                <Button className="w-full" onClick={() => { setSelectedRoomType("single"); setIsBookingDialogOpen(true); }} data-testid="button-book-single">
                  Book Single Room — ₹8,000/mo
                </Button>
              </CardContent>
            </Card>

            {/* Double Occupancy Card */}
            <Card className="overflow-hidden hover-elevate group" data-testid="card-room-double">
              <div className="relative h-64 overflow-hidden">
                <img
                  src={getPhoto("Double Occupancy", doubleRoomImage)}
                  alt="Double sharing AC room at Blrstay PG Yelahanka — ₹6,000/month per person all-inclusive"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = doubleRoomImage; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute top-4 left-4">
                  <span className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow">
                    Best Value
                  </span>
                </div>
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <div>
                    <p className="text-white/80 text-xs font-medium">Double Sharing</p>
                    <p className="text-white font-bold text-2xl">₹6,000<span className="text-sm font-normal">/person/mo</span></p>
                  </div>
                  <span className="bg-white/20 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full border border-white/30">All-Inclusive</span>
                </div>
              </div>
              <CardContent className="p-5">
                <div className="flex flex-wrap gap-2 mb-4">
                  {[
                    { icon: Wind, label: "AC" },
                    { icon: Wifi, label: "WiFi" },
                    { icon: Utensils, label: "3 Meals" },
                    { icon: Shield, label: "Security" },
                    { icon: Car, label: "Parking" },
                    { icon: Tv, label: "TV Room" },
                  ].map(({ icon: Icon, label }) => (
                    <span key={label} className="inline-flex items-center gap-1 text-xs bg-primary/5 text-primary px-2.5 py-1 rounded-full font-medium border border-primary/10">
                      <Icon className="w-3 h-3 text-accent" />
                      {label}
                    </span>
                  ))}
                </div>
                <ul className="text-sm text-muted-foreground space-y-1 mb-4">
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />Two beds · Individual wardrobes & tables</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />Shared with a compatible flatmate</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-3.5 h-3.5 text-accent flex-shrink-0" />Lowest price · Maximum value</li>
                </ul>
                <Button className="w-full" onClick={() => { setSelectedRoomType("double"); setIsBookingDialogOpen(true); }} data-testid="button-book-double">
                  Book Double Room — ₹6,000/mo
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center mb-20">
            <div className="order-2 md:order-1 space-y-8">
              <div>
                <div className="h-1 w-16 bg-accent mb-6 rounded-full"></div>
                <h2 className="font-heading font-bold text-4xl md:text-5xl mb-8 leading-tight tracking-tight" data-testid="text-about-title">
                  Premium Men's PG Accommodation in Yelahanka, Bangalore
                </h2>
              </div>
              <p className="text-muted-foreground text-lg leading-relaxed text-justify" data-testid="text-about-description">
                Blrstay is the <a href="https://blrstay.com/" className="text-primary font-semibold hover:underline">best men's PG in Yelahanka</a>, Bangalore. Located in the Honnenahalli area near Orchid International School, we offer unmatched comfort, security, and convenience exclusively for male students and working professionals. We provide a home-like environment that combines modern amenities with traditional hospitality, all at accessible prices starting from ₹6,000 per month.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed text-justify" data-testid="text-about-description-2">
                Our strategic location makes us the ideal <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">PG in Yelahanka</a> for connectivity to major employment hubs. We are just 8 km from{" "}
                <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">Manyata Tech Park</a>, making us the most convenient{" "}
                <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">PG near Manyata Tech Park</a> in the area. Yelahanka Railway Station is 3 km away and{" "}
                <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">Bangalore Airport</a> is just 15 km — perfect for frequent flyers and airport staff.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed text-justify" data-testid="text-about-description-3">
                What sets us apart is our commitment to providing premium facilities at budget-friendly prices. With single and double sharing options, all accommodations include nutritious meals, high-speed WiFi, 24/7 security with CCTV surveillance, professional housekeeping, and covered parking—all within your monthly rent. Experience hassle-free living with transparent pricing and no hidden charges.
              </p>
            </div>
            <div className="order-1 md:order-2 grid grid-cols-2 gap-6">
              <img
                src={getPhoto("Common Area", commonAreaImage)}
                alt="Spacious common area and dining hall at Blrstay PG in Yelahanka — comfortable lounge for residents of the best men's PG in Yelahanka"
                className="rounded-2xl object-cover w-full h-80 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                loading="lazy"
                decoding="async"
                width={600}
                height={320}
                data-testid="img-common-area"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = commonAreaImage; }}
              />
              <img
                src={getPhoto("Parking", parkingImage)}
                alt="Secure covered parking for bikes and cars at Blrstay PG near Manyata Tech Park, Yelahanka — free parking included in rent"
                className="rounded-2xl object-cover w-full h-80 shadow-xl hover:shadow-2xl transition-shadow duration-300 mt-8"
                loading="lazy"
                decoding="async"
                width={600}
                height={320}
                data-testid="img-parking"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = parkingImage; }}
              />
              <img
                src={getPhoto("Single Occupancy", singleRoomImage)}
                alt="Furnished single occupancy AC room at Blrstay PG in Yelahanka — study table, wardrobe, attached bathroom, ₹8,000 per month all-inclusive"
                className="rounded-2xl object-cover w-full h-80 shadow-xl hover:shadow-2xl transition-shadow duration-300"
                loading="lazy"
                decoding="async"
                width={600}
                height={320}
                data-testid="img-single-room-about"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = singleRoomImage; }}
              />
              <img
                src={getPhoto("Double Occupancy", doubleRoomImage)}
                alt="Furnished double sharing AC room at Blrstay PG in Yelahanka — two beds, wardrobes, attached bathroom, ₹6,000 per person per month all-inclusive"
                className="rounded-2xl object-cover w-full h-80 shadow-xl hover:shadow-2xl transition-shadow duration-300 mt-8"
                loading="lazy"
                decoding="async"
                width={600}
                height={320}
                data-testid="img-double-room-about"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = doubleRoomImage; }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t-2 border-accent/20">
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2" data-testid="text-stat-capacity">50+</div>
              <div className="text-muted-foreground font-medium">Residents</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2" data-testid="text-stat-years">3+</div>
              <div className="text-muted-foreground font-medium">Years Experience</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2" data-testid="text-stat-rating">4.8</div>
              <div className="text-muted-foreground font-medium">Average Rating</div>
            </div>
            <div className="text-center">
              <div className="text-5xl font-bold text-accent mb-2" data-testid="text-stat-price">₹6k</div>
              <div className="text-muted-foreground font-medium">Starting From</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12">
            <div className="h-1 w-20 bg-accent mx-auto mb-6 rounded-full"></div>
            <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6 tracking-tight">
              Why Choose Blrstay — Top-Rated Men's PG in Yelahanka
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg">
              Experience the perfect blend of comfort, convenience, and community.
            </p>
          </div>

          {/* Compact amenity chip grid — Stanza Living style */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
            {[
              { icon: Wifi, title: "100 Mbps WiFi", desc: "Fiber optic · Unlimited data" },
              { icon: Utensils, title: "3 Meals Daily", desc: "Home-cooked vegetarian" },
              { icon: Shield, title: "24/7 Security", desc: "CCTV + guard on duty" },
              { icon: Car, title: "Free Parking", desc: "Bikes & cars covered" },
              { icon: Wind, title: "AC Rooms", desc: "All rooms air-conditioned" },
              { icon: Shirt, title: "Laundry", desc: "In-house facility" },
              { icon: Tv, title: "TV Lounge", desc: "Common entertainment" },
              { icon: Zap, title: "Power Backup", desc: "No power cuts" },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-gray-100 hover-elevate" data-testid={`card-feature-${title.toLowerCase().replace(/\s/g, '-')}`}>
                <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon className="w-4.5 h-4.5 text-accent" style={{ width: '18px', height: '18px' }} />
                </div>
                <div>
                  <p className="font-semibold text-sm text-primary">{title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/amenities">
              <Button variant="outline" size="lg" className="gap-2" data-testid="link-view-amenities">
                View All Amenities <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-card">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <div className="h-1 w-16 bg-accent mb-6 rounded-full"></div>
              <h2 className="font-heading font-bold text-4xl md:text-5xl mb-8 tracking-tight">
                Life at Blrstay — Men's PG in Yelahanka, Honnenahalli
              </h2>
              <div className="space-y-6">
                <div>
                  <h3 className="font-heading font-semibold text-xl mb-3">A Thriving Community at Blrstay PG in Yelahanka</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    We've created more than just a place to stay—we've built a vibrant community where friendships flourish. Residents from diverse backgrounds create a dynamic social atmosphere while maintaining a peaceful environment.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-semibold text-xl mb-3">Your Daily Experience at Our PG in Yelahanka</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Start your day with nutritious breakfast, commute easily to work or college, and return to a cleaned room. Enjoy home-cooked dinners with fellow residents and unwind in comfortable common areas.
                  </p>
                </div>

                <div>
                  <h3 className="font-heading font-semibold text-xl mb-3">Hassle-Free PG Living — All Utilities & Meals Included</h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    We handle daily essentials like meals, cleaning, and maintenance so you can focus on your career or studies. Flexible house rules respect your independence while ensuring everyone's comfort and safety.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <Card className="hover-elevate">
                <CardContent className="flex flex-wrap items-start gap-4 p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">Vibrant PG Community — Students & Working Professionals</h3>
                    <p className="text-muted-foreground">Connect with like-minded professionals and students, build lasting friendships, and network within a supportive community.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardContent className="flex flex-wrap items-start gap-4 p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">Flexible PG Timings for Working Professionals</h3>
                    <p className="text-muted-foreground">No rigid timings for working professionals. Come and go as you please while enjoying the structure of regular meal times.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardContent className="flex flex-wrap items-start gap-4 p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <HomeIcon className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">Fully Furnished PG Room — Move In Ready, No Extra Charges</h3>
                    <p className="text-muted-foreground">Everything you need is included—from furniture to utilities. Just bring your personal belongings and settle in immediately.</p>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover-elevate">
                <CardContent className="flex flex-wrap items-start gap-4 p-6">
                  <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-heading font-semibold text-lg mb-2">Focus on Career Growth at Our Stress-Free PG in Yelahanka</h3>
                    <p className="text-muted-foreground">With all your basic needs taken care of, dedicate your time and energy to advancing your career or excelling in your studies.</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="mt-16 text-center">
            <Button 
              size="lg" 
              onClick={() => setIsBookingDialogOpen(true)}
              data-testid="button-book-cta"
            >
              Experience Life at Blrstay - Book Now
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gradient-to-br from-accent/5 via-background to-accent/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNEREFGMzciIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0wLTJ2Mmgydi0yaC0yem0yLTJ2Mmgydi0yaC0yem0wLTJ2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptMC0ydjJoMnYtMmgtMnptMi0ydjJoMnYtMmgtMnptMCAwIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-40 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
          <div className="text-center mb-20">
            <div className="inline-block mb-6">
              <div className="h-1 w-20 bg-accent mx-auto mb-6 rounded-full"></div>
              <div className="inline-flex flex-wrap items-center gap-3 bg-accent/10 px-6 py-3 rounded-full mb-6 border-2 border-accent/30">
                <Star className="w-6 h-6 fill-accent text-accent" />
                <span className="font-bold text-lg text-accent uppercase tracking-wide">Guest Reviews</span>
                <Star className="w-6 h-6 fill-accent text-accent" />
              </div>
              <h2 className="font-heading font-bold text-4xl md:text-5xl mb-6 tracking-tight" data-testid="text-testimonials-title">
                Trusted by 50+ Residents — Best PG in Yelahanka Reviews
              </h2>
              <div className="h-1 w-20 bg-accent mx-auto rounded-full"></div>
            </div>
            <p className="text-muted-foreground max-w-3xl mx-auto text-lg leading-relaxed" data-testid="text-testimonials-description">
              Don't just take our word for it—hear from working professionals and students who call Blrstay home. Our residents consistently rate us highly for cleanliness, food quality, security, and value for money.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-muted-foreground text-lg mb-6">
              Join over 50+ satisfied residents who have made Blrstay their home
            </p>
            <Button 
              variant="outline"
              size="lg"
              onClick={() => setIsBookingDialogOpen(true)}
              data-testid="button-testimonial-cta"
            >
              Become Part of Our Community
            </Button>
          </div>
        </div>
      </section>

      <section className="py-12 bg-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
              Why Yelahanka is the Best Location for PG Accommodation
            </h2>
            <p className="text-muted-foreground max-w-3xl mx-auto text-justify">
              Choosing the right location is crucial for students and working professionals. Yelahanka, particularly Honnenahalli and New Town, has emerged as one of Bangalore's most sought-after areas for accommodation. Here's why this location stands out as the perfect choice for bachelors seeking quality living in Bangalore North.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-left">
              <h3 className="font-heading font-semibold text-xl mb-3">Excellent Connectivity from Yelahanka to Manyata Tech Park & Airport</h3>
              <p className="text-muted-foreground text-justify">
                The area offers unparalleled connectivity to major IT hubs—just 8 km from Manyata Tech Park, 15 km from the International Airport, and direct access to the railway station. For professionals at companies like TCS, Infosys, and Wipro, proximity to Manyata reduces commute time significantly. Well-connected by BMTC buses, upcoming metro, and auto services, it's ideal for daily commuters.
              </p>
            </div>

            <div className="text-left">
              <h3 className="font-heading font-semibold text-xl mb-3">Affordable PG Living Costs in Yelahanka — From ₹6,000/Month</h3>
              <p className="text-muted-foreground text-justify">
                Compared to expensive localities like Koramangala, Indiranagar, or Whitefield, this area offers significantly more affordable accommodation without compromising on amenities. Single rooms start at ₹8,000/month and double at ₹6,000/month—including food, WiFi, and all utilities. No brokerage fees, no hidden charges—just transparent, accessible pricing for quality living.
              </p>
            </div>

            <div className="text-left">
              <h3 className="font-heading font-semibold text-xl mb-3">Safe & Developed Area — Honnenahalli, Yelahanka, Bangalore North</h3>
              <p className="text-muted-foreground text-justify">
                This is a well-developed residential area with excellent infrastructure, safety, and urban amenities. The presence of reputed institutions like REVA University, Orchid International School, and corporate offices ensures a professional environment. With 24/7 street lighting, police patrolling, and a peaceful neighborhood, it's perfect for students and working professionals. Local markets, restaurants, hospitals, and entertainment are all within easy reach—a complete living solution.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer
        phone="+91 97405 65797"
        email="info@rakshapg.com"
        whatsapp="+919740565797"
        address="House 17, Raksha Layout, Near Orchid International School, Honnenahalli, Yelahanka, Bangalore - 560064"
      />

      <BookingDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
        defaultRoomType={selectedRoomType}
      />
      
      <WhatsAppButton />
    </div>
  );
}
