import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RoomCard from "@/components/RoomCard";
import BookingDialog from "@/components/BookingDialog";
import WhatsAppButton from "@/components/WhatsAppButton";
import PageBanner from "@/components/PageBanner";
import singleRoomImage from "@assets/generated_images/Single_occupancy_room_interior_74aad7ae.webp";
import doubleRoomImage from "@assets/generated_images/Double_occupancy_room_interior_f1f502c3.webp";
import type { RoomPhoto } from "@shared/schema";

export default function RoomsPage() {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const { data: roomPhotos } = useQuery<RoomPhoto[]>({
    queryKey: ["/api/photos"],
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const singlePhotos = roomPhotos?.filter(p => p.roomType === "Single Occupancy") ?? [];
  const doublePhotos = roomPhotos?.filter(p => p.roomType === "Double Occupancy" || p.roomType === "Double Sharing") ?? [];

  const rooms = [
    {
      title: "Single Occupancy",
      price: "₹8,000",
      occupancy: "1 Person",
      size: "120 sq ft",
      features: ["AC", "Attached Bath", "Study Table", "Wardrobe"],
      image: singlePhotos[0]?.photoUrl ?? singleRoomImage,
      fallbackImage: singleRoomImage,
      gallery: singlePhotos,
    },
    {
      title: "Double Occupancy",
      price: "₹6,000",
      occupancy: "2 Persons",
      size: "150 sq ft",
      features: ["AC", "Attached Bath", "Study Tables", "Wardrobes"],
      image: doublePhotos[0]?.photoUrl ?? doubleRoomImage,
      fallbackImage: doubleRoomImage,
      gallery: doublePhotos,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>PG in Yelahanka Rooms & Pricing | Single & Double Sharing | Blrstay</title>
        <meta
          name="description"
          content="Affordable PG in Yelahanka rooms starting ₹6,000/month. Single occupancy ₹8,000 and double sharing ₹6,000 — AC, attached bath, WiFi, food included. Best PG near Manyata Tech Park."
        />
        <meta property="og:title" content="PG in Yelahanka Rooms — Single & Double Sharing | Starting ₹6,000" />
        <meta property="og:description" content="Affordable PG in Yelahanka rooms with AC, food, WiFi. Near Manyata Tech Park and Bangalore Airport. Single ₹8,000, Double ₹6,000/month." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blrstay.com/rooms" />
        <link rel="canonical" href="https://blrstay.com/rooms" />
      </Helmet>
      <Navbar onBookNowClick={() => setIsBookingDialogOpen(true)} />

      <PageBanner
        title="PG in Yelahanka — Rooms & Pricing"
        subtitle="Choose from our single and double occupancy AC rooms at the best PG in Yelahanka. Fully furnished with attached bathrooms, study tables, and wardrobes. Near Manyata Tech Park."
      />

      {/* Keyword SEO band */}
      <section className="bg-primary py-6">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-center text-primary-foreground/90 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
            Blrstay is the <a href="https://blrstay.com/" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">best men's PG in Yelahanka</a> with fully furnished AC rooms.{" "}
            Our <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">PG in Yelahanka</a> is ideal for professionals at{" "}
            <a href="https://blrstay.com/location" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">Manyata Tech Park</a> and those needing a{" "}
            <a href="https://blrstay.com/location" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">PG near Bangalore Airport</a>. Starting ₹6,000/month all-inclusive.
          </p>
        </div>
      </section>
      
      <main className="flex-1">
        <section className="py-12 bg-gradient-to-b from-background via-card to-background">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
              {rooms.map((room, index) => (
                <div key={index} className="flex flex-col gap-4">
                  <RoomCard
                    title={room.title}
                    price={room.price}
                    occupancy={room.occupancy}
                    size={room.size}
                    features={room.features}
                    image={room.image}
                    fallbackImage={room.fallbackImage}
                    onBookClick={() => setIsBookingDialogOpen(true)}
                  />
                  {room.gallery.length > 1 && (
                    <div data-testid={`gallery-${room.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <p className="text-sm font-medium text-muted-foreground mb-2">
                        More photos ({room.gallery.length})
                      </p>
                      <div className="grid grid-cols-3 gap-2">
                        {room.gallery.map((photo, i) => (
                          <img
                            key={photo.id}
                            src={photo.photoUrl}
                            alt={photo.caption || `${room.title} photo ${i + 1} at Blrstay PG Yelahanka`}
                            className="w-full h-24 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                            loading="lazy"
                            decoding="async"
                            data-testid={`gallery-img-${photo.id}`}
                            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-20 space-y-16">
              <div className="bg-accent/10 border-2 border-accent/30 rounded-2xl p-8 max-w-4xl mx-auto">
                <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4 text-primary">
                  All-Inclusive PG Room Pricing in Yelahanka — No Hidden Charges
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed text-justify mb-6">
                  Our monthly rent includes everything you need: nutritious vegetarian meals (breakfast, lunch, dinner), high-speed WiFi, 24/7 security with CCTV surveillance, housekeeping services, covered parking, and all utilities. No hidden charges, no brokerage fees — just transparent, affordable pricing for the{" "}
                  <a href="https://blrstay.com/" className="text-primary font-semibold hover:underline">best men's PG in Yelahanka</a>.{" "}
                  Perfectly suited for employees at <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">Manyata Tech Park</a>{" "}
                  and those looking for a <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">PG near Bangalore Airport</a>.
                </p>
                <div className="grid md:grid-cols-2 gap-6 mt-6">
                  <div className="bg-card/50 p-6 rounded-xl">
                    <h3 className="font-semibold text-lg mb-3 text-primary">Included in Your Rent</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>✓ 3 Vegetarian Meals Daily (Breakfast, Lunch, Dinner)</li>
                      <li>✓ Unlimited High-Speed WiFi</li>
                      <li>✓ Daily Housekeeping & Weekly Deep Cleaning</li>
                      <li>✓ 24/7 CCTV Surveillance & Security</li>
                      <li>✓ Covered Parking for Bikes & Cars</li>
                      <li>✓ All Electricity & Water Charges</li>
                      <li>✓ AC & Furniture Maintenance</li>
                    </ul>
                  </div>
                  <div className="bg-card/50 p-6 rounded-xl">
                    <h3 className="font-semibold text-lg mb-3 text-primary">One-Time Charges</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Advance Deposit: 1 Month Rent (Refundable)</li>
                      <li>• Registration Fee: ₹500 (One-time)</li>
                      <li>• Lock-in Period: None</li>
                      <li>• Notice Period: 30 Days</li>
                      <li>• Brokerage: Zero</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="max-w-5xl mx-auto">
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">Single & Double PG Room Specifications at Blrstay, Yelahanka</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-card rounded-2xl p-8 border-2 border-accent/20">
                    <h3 className="font-heading font-bold text-2xl mb-6 text-primary">Single Occupancy AC Room — Fully Furnished, ₹8,000/Month</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Room Size</h4>
                        <p className="text-lg">120 sq ft (Well-ventilated with large windows)</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Furniture Included</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Queen-size bed with premium mattress</li>
                          <li>• Study table with ergonomic chair</li>
                          <li>• 3-door wardrobe with mirror</li>
                          <li>• Wall-mounted shelves & hooks</li>
                          <li>• Bedside table with lamp</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Attached Bathroom</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• 24/7 hot & cold water</li>
                          <li>• Western toilet with geyser</li>
                          <li>• Premium bathroom fittings</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Best For</h4>
                        <p className="text-muted-foreground">Working professionals who value privacy, remote workers needing dedicated workspace, or students preparing for competitive exams.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-8 border-2 border-accent/20">
                    <h3 className="font-heading font-bold text-2xl mb-6 text-primary">Double Sharing AC Room — ₹6,000/Month Per Person, Yelahanka</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Room Size</h4>
                        <p className="text-lg">150 sq ft (Spacious with excellent natural light)</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Furniture Included (Per Person)</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• Individual queen-size beds with mattresses</li>
                          <li>• Separate study tables with chairs</li>
                          <li>• Individual 3-door wardrobes</li>
                          <li>• Personal storage space & shelves</li>
                          <li>• Bedside tables for both occupants</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Attached Bathroom</h4>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>• 24/7 hot & cold water supply</li>
                          <li>• Western toilet with geyser</li>
                          <li>• Spacious bathroom with premium fittings</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase mb-2">Best For</h4>
                        <p className="text-muted-foreground">Students, freshers, or working professionals seeking affordable accommodation with a friendly roommate. Great for building professional networks.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-4xl mx-auto bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl p-8">
                <h2 className="font-heading font-bold text-2xl md:text-3xl mb-6 text-center">PG Room Policies & House Rules at Blrstay Yelahanka</h2>
                <div className="space-y-4 text-muted-foreground text-justify">
                  <p className="text-lg">
                    <strong className="text-primary">Age Requirement:</strong> Residents must be 18 years or above. Valid government-issued ID (Aadhar, PAN, or Passport) and proof of employment/education required at check-in.
                  </p>
                  <p className="text-lg">
                    <strong className="text-primary">Gender Policy:</strong> Blrstay is an exclusive men's PG in Yelahanka. We accommodate only male students and working professionals to maintain a focused, comfortable living environment for bachelors.
                  </p>
                  <p className="text-lg">
                    <strong className="text-primary">Room Allocation:</strong> Rooms are allocated on a first-come, first-served basis upon payment confirmation. For double occupancy, we carefully match roommates based on profession, lifestyle preferences, and working hours when possible.
                  </p>
                  <p className="text-lg">
                    <strong className="text-primary">Move-in Flexibility:</strong> Immediate move-in available for most rooms. Mid-month joiners receive pro-rated rent for the remaining days. Advance booking recommended during peak seasons (June-July, December-January).
                  </p>
                  <p className="text-lg">
                    <strong className="text-primary">Room Change:</strong> Current residents can request room upgrades or changes subject to availability. Single to double (or vice versa) transfers allowed with 7 days' notice and minimal charges.
                  </p>
                </div>
              </div>

              <div className="text-center bg-accent/20 rounded-2xl p-8 max-w-3xl mx-auto">
                <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Book Your PG Room in Yelahanka — Limited Rooms Available</h2>
                <p className="text-muted-foreground text-lg mb-6">
                  Visit us for a free property tour Monday-Saturday (10 AM - 6 PM). See the rooms, meet our staff, and make an informed decision.
                </p>
                <button 
                  onClick={() => setIsBookingDialogOpen(true)}
                  className="bg-primary text-primary-foreground px-8 py-4 rounded-full font-semibold text-lg hover:opacity-90 transition-opacity"
                  data-testid="button-book-room-bottom"
                >
                  Book Now - Starting ₹6,000/month
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer
        phone="+91 97405 65797"
        email="info@rakshapg.com"
        whatsapp="+919740565797"
        address="House 17, Raksha Layout, Near Orchid International School, Honnenahalli, Yelahanka, Bangalore - 560064"
      />

      <BookingDialog
        open={isBookingDialogOpen}
        onOpenChange={setIsBookingDialogOpen}
      />
      
      <WhatsAppButton />
    </div>
  );
}
