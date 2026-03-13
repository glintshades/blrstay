import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import AmenityCard from "@/components/AmenityCard";
import BookingDialog from "@/components/BookingDialog";
import WhatsAppButton from "@/components/WhatsAppButton";
import PageBanner from "@/components/PageBanner";
import { Wifi, Car, Shield, Utensils, Sparkles, Clock, Wind, Tv } from "lucide-react";

export default function AmenitiesPage() {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const amenities = [
    {
      icon: Wifi,
      title: "High-Speed WiFi",
      description: "Unlimited high-speed internet for all your work and entertainment needs",
    },
    {
      icon: Car,
      title: "Parking Space",
      description: "Secure covered parking for both bikes and cars",
    },
    {
      icon: Shield,
      title: "24/7 Security",
      description: "CCTV surveillance and security personnel for your safety",
    },
    {
      icon: Utensils,
      title: "Meals Included",
      description: "Nutritious vegetarian meals served three times a day",
    },
    {
      icon: Sparkles,
      title: "Housekeeping",
      description: "Daily room cleaning and weekly deep cleaning services",
    },
    {
      icon: Clock,
      title: "Flexible Timing",
      description: "No strict curfew timings, suitable for working professionals",
    },
    {
      icon: Wind,
      title: "Air Conditioning",
      description: "All rooms equipped with modern AC units",
    },
    {
      icon: Tv,
      title: "Common TV Room",
      description: "Shared entertainment area with TV and comfortable seating",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Amenities at Best PG in Yelahanka | WiFi, Food, AC, Parking | Blrstay</title>
        <meta
          name="description"
          content="Blrstay — the best men's PG in Yelahanka — offers WiFi, 3 meals/day, AC, 24/7 security, parking, and housekeeping. Ideal PG near Manyata Tech Park and Bangalore Airport. Starting ₹6,000/month."
        />
        <meta property="og:title" content="Amenities at Best PG in Yelahanka | WiFi, Food, AC, Parking | Blrstay" />
        <meta property="og:description" content="Premium PG amenities in Yelahanka: WiFi, 3 meals/day, AC, security, parking. PG near Manyata Tech Park and Bangalore Airport. Starting ₹6,000/month." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blrstay.com/amenities" />
        <link rel="canonical" href="https://blrstay.com/amenities" />
      </Helmet>
      <Navbar onBookNowClick={() => setIsBookingDialogOpen(true)} />

      <PageBanner
        title="Amenities at the Best PG in Yelahanka"
        subtitle="Experience premium facilities at Blrstay — the top-rated PG in Yelahanka. WiFi, 3 meals/day, AC, 24/7 security, and parking — all included in your rent. Perfect for IT professionals near Manyata Tech Park."
      />

      {/* Keyword SEO band */}
      <section className="bg-primary py-6">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-center text-primary-foreground/90 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
            Blrstay is the <a href="https://blrstay.com/" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">best men's PG in Yelahanka</a> with world-class amenities.{" "}
            Our <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">PG in Yelahanka</a> is the go-to choice for employees at{" "}
            <a href="https://blrstay.com/location" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">Manyata Tech Park</a> and staff near{" "}
            <a href="https://blrstay.com/location" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">Bangalore Airport</a>.{" "}
            Check our <a href="https://blrstay.com/rooms" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">room options and pricing</a>.
          </p>
        </div>
      </section>
      
      <main className="flex-1">
        <section className="py-12 bg-gradient-to-br from-accent/20 via-accent/10 to-accent/20">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {amenities.map((amenity, index) => (
                <AmenityCard key={index} {...amenity} />
              ))}
            </div>

            <div className="mt-20 space-y-16">
              <div className="max-w-6xl mx-auto">
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-12 text-center">Complete Amenities at Blrstay Men's PG in Yelahanka</h2>
                
                <div className="space-y-12">
                  <div className="bg-card rounded-2xl p-8 border-l-4 border-accent">
                    <h3 className="font-heading font-bold text-2xl mb-4 text-primary">Comfort & Convenience Amenities at Our PG in Yelahanka</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Air Conditioning</h4>
                        <p className="text-muted-foreground">All <a href="https://blrstay.com/rooms" className="text-primary font-semibold hover:underline">rooms at our PG in Yelahanka</a> feature premium split AC units with individual temperature controls. Enjoy comfortable sleep even during Bangalore's hot summers. AC maintenance included in rent—no extra electricity charges for AC usage up to reasonable limits.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Power Backup</h4>
                        <p className="text-muted-foreground">Uninterrupted power supply with full generator backup ensures your work and studies are never disrupted. Essential for IT professionals working from our <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">boys PG in Yelahanka</a>. Covers all appliances including WiFi routers, lights, and fans.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Common TV Room</h4>
                        <p className="text-muted-foreground">Relax after a long commute from <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">Manyata Tech Park</a> in our spacious common TV room equipped with large LED TV, comfortable seating, and access to streaming services. Great for watching cricket matches, movies, and socializing with fellow residents.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Laundry Facilities</h4>
                        <p className="text-muted-foreground">Dedicated laundry area with washing machines available for resident use. Professional laundry service also available at nominal charges. Ample drying space with clotheslines in ventilated areas. Enquire about full <a href="https://blrstay.com/contact" className="text-primary font-semibold hover:underline">inclusions when you contact us</a>.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-8 border-l-4 border-primary">
                    <h3 className="font-heading font-bold text-2xl mb-4 text-primary">Home-Cooked Food & Dining — 3 Meals/Day at Blrstay PG</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Nutritious Vegetarian Meals</h4>
                        <p className="text-muted-foreground mb-3">Our in-house kitchen serves fresh, hygienic vegetarian meals three times a day prepared by experienced cooks — one of the biggest reasons Blrstay is the <a href="https://blrstay.com/" className="text-primary font-semibold hover:underline">best PG with food in Yelahanka</a>. Weekly menu rotation ensures variety while maintaining high nutritional standards.</p>
                        <ul className="space-y-2 text-muted-foreground ml-4">
                          <li>• <strong>Breakfast (7:30 AM - 9:30 AM):</strong> Idli, dosa, upma, poha, parathas, bread toast with coffee/tea</li>
                          <li>• <strong>Lunch (12:30 PM - 2:30 PM):</strong> Rice, 2 rotis, dal, sambar, rasam, 2 vegetable curries, curd, pickle</li>
                          <li>• <strong>Dinner (7:30 PM - 9:30 PM):</strong> Rice, 3 rotis, dal, sambar, 2 vegetable curries, curd, dessert twice a week</li>
                        </ul>
                        <p className="text-muted-foreground mt-3">Special meals on festivals and weekends. Packed lunch available for early office-goers. Dietary preferences and restrictions accommodated with prior notice.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-8 border-l-4 border-accent">
                    <h3 className="font-heading font-bold text-2xl mb-4 text-primary">24/7 Security & Safety at Our Boys PG in Yelahanka</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">24/7 CCTV Surveillance</h4>
                        <p className="text-muted-foreground">Comprehensive CCTV coverage at all entry/exit points, common areas, and parking zones. High-definition cameras with night vision ensure complete security monitoring round the clock. Recordings maintained for 30 days.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Security Personnel</h4>
                        <p className="text-muted-foreground">Trained security guards on duty 24/7. Visitor entry management with register maintenance. Only authorized visitors allowed in common areas during designated hours (8 AM - 8 PM) with prior intimation.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Fire Safety Equipment</h4>
                        <p className="text-muted-foreground">Fire extinguishers installed on every floor. Smoke detectors in common areas. Clear evacuation routes marked. Regular fire safety drills and training for residents.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Secure Access Control</h4>
                        <p className="text-muted-foreground">Electronic locks and key cards for room access. Main gate remains locked after 11 PM—residents provided with access cards. Individual room locks with spare keys maintained by management.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-8 border-l-4 border-primary">
                    <h3 className="font-heading font-bold text-2xl mb-4 text-primary">High-Speed WiFi & Tech Connectivity at Blrstay PG Yelahanka</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">High-Speed Fiber Optic WiFi</h4>
                        <p className="text-muted-foreground">100 Mbps unlimited fiber optic internet with 99.9% uptime. Multiple access points ensure strong signal in all <a href="https://blrstay.com/rooms" className="text-primary font-semibold hover:underline">rooms at Blrstay PG</a>. Ideal for IT professionals at <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">Manyata Tech Park</a> doing work-from-home, attending virtual meetings, streaming, and online gaming. No data caps or speed throttling.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Work-from-Home Friendly</h4>
                        <p className="text-muted-foreground">Dedicated study tables with proper lighting in all <a href="https://blrstay.com/rooms" className="text-primary font-semibold hover:underline">single and double sharing rooms</a>. Quiet environment maintained during work hours. Backup power for WiFi routers ensures uninterrupted connectivity even during power cuts — a major advantage of our <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">men's PG in Yelahanka</a>.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-8 border-l-4 border-accent">
                    <h3 className="font-heading font-bold text-2xl mb-4 text-primary">Professional Housekeeping & Maintenance at Blrstay PG</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Daily Room Cleaning</h4>
                        <p className="text-muted-foreground">Professional housekeeping staff cleans all rooms daily—sweeping, mopping, dusting, and bathroom cleaning. Bed linen changed weekly. Rooms cleaned while you're at work/college.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Common Area Maintenance</h4>
                        <p className="text-muted-foreground">All common areas including dining hall, TV room, corridors, and staircases cleaned twice daily. Pest control services conducted monthly. Regular painting and maintenance to keep property in pristine condition.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">24/7 Maintenance Support</h4>
                        <p className="text-muted-foreground">Dedicated maintenance staff for immediate repairs and issues. Electrician and plumber on call for urgent requirements. AC servicing and maintenance included in rent.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Water Supply</h4>
                        <p className="text-muted-foreground">24/7 filtered water supply for drinking and cooking. Municipal water connection plus borewell backup. Water purifier (RO) installed in common area. Hot water available in all attached bathrooms.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-8 border-l-4 border-primary">
                    <h3 className="font-heading font-bold text-2xl mb-4 text-primary">Free Covered Parking & Transportation Links Near PG in Yelahanka</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Covered Parking Facility</h4>
                        <p className="text-muted-foreground">Ample covered parking space for both two-wheelers and four-wheelers — included free with your <a href="https://blrstay.com/rooms" className="text-primary font-semibold hover:underline">PG room in Yelahanka</a>. Safe, secure parking area with CCTV surveillance. No additional parking charges for residents.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Excellent Connectivity</h4>
                        <p className="text-muted-foreground">BMTC bus stop 100 meters away with direct buses to <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">Manyata Tech Park and major IT hubs</a>. Auto rickshaws readily available. Ola/Uber pickup point right outside the property. Metro station (upcoming) within 2 km — making this the most conveniently located <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">PG near Manyata Tech Park</a>.</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-card rounded-2xl p-8 border-l-4 border-accent">
                    <h3 className="font-heading font-bold text-2xl mb-4 text-primary">Flexible PG Policies for Students & Working Professionals</h3>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold text-lg mb-2">No Curfew Timings</h4>
                        <p className="text-muted-foreground">Understanding the needs of IT professionals with flexible work schedules and night shifts, we don't impose strict curfew timings. Late-night entry allowed with access cards. Just inform the security for smooth entry after 11 PM.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-lg mb-2">Visitor Policy</h4>
                        <p className="text-muted-foreground">Visitors allowed in common areas (dining hall, TV room) from 8 AM to 8 PM with prior intimation. Parents and family members welcome for property visits. Proper visitor register maintained for security.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-background/80 backdrop-blur-md border-2 border-accent/30 rounded-2xl p-8 max-w-4xl mx-auto">
                <h2 className="font-heading font-bold text-2xl md:text-3xl mb-6 text-center text-primary">
                  Why Choose Blrstay — Best PG in Yelahanka Near Manyata Tech Park?
                </h2>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p className="text-justify">
                    At Blrstay, we understand that finding the right <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">PG accommodation in Yelahanka</a> is about more than just a place to sleep. It's about finding a home away from home—whether you're a student near REVA University or a working professional at{" "}
                    <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">Manyata Tech Park</a>. That's why we've carefully curated our amenities to meet the needs of modern bachelors.
                  </p>
                  <p className="text-justify">
                    Our commitment to quality extends to every aspect of your stay—from the nutritious, home-cooked meals prepared daily by our experienced kitchen staff to the robust WiFi infrastructure that keeps you connected 24/7. We maintain strict cleanliness standards with professional housekeeping services and ensure your safety with round-the-clock CCTV surveillance and dedicated security personnel. All these facilities are included in your rent—view our{" "}
                    <a href="https://blrstay.com/rooms" className="text-primary font-semibold hover:underline">single and double room pricing</a>.
                  </p>
                  <p className="text-justify">
                    What sets us apart is our dedication to providing premium amenities at affordable prices. We believe that quality living shouldn't break the bank, which is why we offer transparent pricing with no hidden charges or brokerage fees. Choose Blrstay — the <a href="https://blrstay.com/" className="text-primary font-semibold hover:underline">best men's PG in Yelahanka</a> — for the finest value <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">boys PG in Honnenahalli</a>, Yelahanka. Ready to make a move? <a href="https://blrstay.com/contact" className="text-primary font-semibold hover:underline">Contact us</a> today.
                  </p>
                </div>
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
