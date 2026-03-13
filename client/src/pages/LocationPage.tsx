import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LocationSection from "@/components/LocationSection";
import BookingDialog from "@/components/BookingDialog";
import WhatsAppButton from "@/components/WhatsAppButton";
import PageBanner from "@/components/PageBanner";

export default function LocationPage() {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const address = {
    house: "House 17, Raksha Layout",
    area: "Honnenahalli, Yelahanka",
    landmark: "Near Orchid International School",
    city: "Bangalore - 560064"
  };
  
  const nearbyPlaces = [
    { name: "Orchid International School", distance: "200m" },
    { name: "Manyata Tech Park", distance: "8 km" },
    { name: "Yelahanka Railway Station", distance: "3 km" },
    { name: "Bangalore International Airport", distance: "15 km" },
    { name: "REVA University", distance: "5 km" },
    { name: "Yelahanka New Town", distance: "2 km" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>PG Near Manyata Tech Park & Bangalore Airport | Blrstay Yelahanka</title>
        <meta
          name="description"
          content="Blrstay is the best PG near Manyata Tech Park (8 km) and PG near Bangalore Airport (15 km) in Yelahanka. Easy commute for IT professionals and airport staff. Book now!"
        />
        <meta property="og:title" content="PG Near Manyata Tech Park & Bangalore Airport | Blrstay Yelahanka" />
        <meta property="og:description" content="Best PG near Manyata Tech Park (8 km) and near Bangalore Airport (15 km) in Yelahanka. Affordable men's PG with food, WiFi, and AC. Starting ₹6,000/month." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blrstay.com/location" />
        <link rel="canonical" href="https://blrstay.com/location" />
      </Helmet>
      <Navbar onBookNowClick={() => setIsBookingDialogOpen(true)} />

      <PageBanner
        title="PG Near Manyata Tech Park & Bangalore Airport"
        subtitle="Blrstay is strategically located in Yelahanka — just 8 km from Manyata Tech Park and 15 km from Kempegowda International Airport. The best PG in Yelahanka for IT professionals and airport staff."
      />

      {/* Keyword SEO band */}
      <section className="bg-primary py-6">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-center text-primary-foreground/90 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
            Blrstay is the most convenient <strong className="text-accent">PG near Manyata Tech Park</strong> in Yelahanka — just 20–25 mins commute.{" "}
            Also the best <strong className="text-accent">PG near Bangalore Airport</strong> with a 30-min drive to KIAL.{" "}
            Browse our <a href="https://blrstay.com/rooms" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">room options</a> and{" "}
            <a href="https://blrstay.com/amenities" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">amenities</a> or{" "}
            <a href="https://blrstay.com/" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">view the best men's PG in Yelahanka</a>.
          </p>
        </div>
      </section>
      
      <main className="flex-1">
        <section className="py-12 bg-background">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 mb-12">
          </div>
        </section>

        <LocationSection address={address} nearbyPlaces={nearbyPlaces} />

        <section className="py-12 bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4">
                Why Blrstay is the Best <a href="https://blrstay.com/" className="text-primary hover:underline">PG in Yelahanka</a> Near Manyata Tech Park
              </h2>
              <p className="text-muted-foreground max-w-3xl mx-auto text-justify">
                Choosing the right location for your paying guest accommodation is crucial for students and working professionals. Yelahanka, particularly the Honnenahalli and Yelahanka New Town areas, has emerged as one of Bangalore's most sought-after locations for PG and hostel accommodation. Here's why Blrstay — the <a href="https://blrstay.com/" className="text-primary font-semibold hover:underline">best men's PG in Yelahanka</a> — stands out as the perfect choice for bachelors seeking quality living in Bangalore North.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-left">
                <h3 className="font-heading font-semibold text-xl mb-3 text-primary">Excellent Connectivity to Tech Parks & Airport</h3>
                <p className="text-muted-foreground text-justify">
                  Yelahanka offers unparalleled connectivity to major IT hubs. Our{" "}
                  <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">PG in Yelahanka</a>{" "}
                  is strategically located just 8 km from{" "}
                  <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">Manyata Tech Park</a>,{" "}
                  making it the top choice as a <strong>PG near Manyata Tech Park</strong> for TCS, Infosys, and Wipro professionals. At just 15 km from Kempegowda International Airport, Blrstay is equally perfect as a <strong>PG near Bangalore Airport</strong> for aviation staff and frequent travellers.
                </p>
              </div>

              <div className="text-left">
                <h3 className="font-heading font-semibold text-xl mb-3 text-primary">Affordable PG Living Costs in Yelahanka, Bangalore North</h3>
                <p className="text-muted-foreground text-justify">
                  Compared to expensive localities like Koramangala, Indiranagar, or Whitefield, Yelahanka offers significantly more affordable <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">PG accommodation in Yelahanka</a> without compromising on amenities. Our <a href="https://blrstay.com/rooms" className="text-primary font-semibold hover:underline">single sharing PG starts at ₹8,000/month and double sharing at ₹6,000/month</a>—including food, WiFi, and all utilities. This makes Blrstay one of the most budget-friendly yet premium <a href="https://blrstay.com/" className="text-primary font-semibold hover:underline">men's PG in Yelahanka</a>. No brokerage fees, no hidden charges—just transparent, affordable pricing for quality bachelor accommodation.
                </p>
              </div>

              <div className="text-left">
                <h3 className="font-heading font-semibold text-xl mb-3 text-primary">Safe & Developed Yelahanka — Ideal for Men's PG Accommodation</h3>
                <p className="text-muted-foreground text-justify">
                  Yelahanka New Town is a well-developed residential area with excellent infrastructure, safety, and urban amenities. The presence of reputed educational institutions like REVA University, Orchid International School, and multiple corporate offices ensures a professional environment. Our <a href="https://blrstay.com/" className="text-primary font-semibold hover:underline">gents PG in Yelahanka</a> benefits from 24/7 street lighting, police patrolling, and a peaceful neighborhood—perfect for students and working bachelors. Local markets, restaurants, hospitals, and entertainment options are all within easy reach. View all our <a href="https://blrstay.com/amenities" className="text-primary font-semibold hover:underline">amenities at Blrstay PG</a>.
                </p>
              </div>
            </div>

            <div className="mt-16 space-y-12">
              <div className="max-w-5xl mx-auto">
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">Commuting Guide from Blrstay PG in Yelahanka to IT Parks & Airport</h2>
                <div className="bg-card rounded-2xl p-8 border-2 border-accent/20">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="font-semibold text-xl mb-4 text-primary">Distance from Blrstay PG to Manyata Tech Park & IT Hubs</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">Manyata Tech Park</span>
                          <span className="font-semibold">20-25 mins (8 km)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">Embassy Manyata Business Park</span>
                          <span className="font-semibold">20 mins (8 km)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">Bagmane Tech Park</span>
                          <span className="font-semibold">30 mins (12 km)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">RMZ Ecoworld</span>
                          <span className="font-semibold">35 mins (14 km)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                          <span className="text-muted-foreground">Outer Ring Road Companies</span>
                          <span className="font-semibold">25-35 mins</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-xl mb-4 text-primary">Distance to Yelahanka Railway Station & Bengaluru Airport</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">Yelahanka Railway Station</span>
                          <span className="font-semibold">10 mins (3 km)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">Bangalore Airport (KIAL)</span>
                          <span className="font-semibold">30 mins (15 km)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">Yelahanka Bus Stand</span>
                          <span className="font-semibold">8 mins (2.5 km)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">BMTC Bus Stop</span>
                          <span className="font-semibold">2 mins walk (100m)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                          <span className="text-muted-foreground">Metro Station (upcoming)</span>
                          <span className="font-semibold">5 mins (2 km)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-xl mb-4 text-primary">Distance from PG to REVA University & Orchid International School</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">Orchid International School</span>
                          <span className="font-semibold">3 mins walk (200m)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">REVA University</span>
                          <span className="font-semibold">12 mins (5 km)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">Jain University</span>
                          <span className="font-semibold">15 mins (6 km)</span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                          <span className="text-muted-foreground">Christ University (Kengeri)</span>
                          <span className="font-semibold">45 mins (22 km)</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-semibold text-xl mb-4 text-primary">Shops, Hospitals & Daily Essentials Near Blrstay PG Yelahanka</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">Supermarket (More/Reliance)</span>
                          <span className="font-semibold">5 mins walk</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">Hospital/Clinic</span>
                          <span className="font-semibold">800m</span>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-muted">
                          <span className="text-muted-foreground">ATM (SBI/HDFC/ICICI)</span>
                          <span className="font-semibold">300m</span>
                        </div>
                        <div className="flex justify-between items-center pb-2">
                          <span className="text-muted-foreground">Restaurants & Cafes</span>
                          <span className="font-semibold">Within 500m</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="max-w-5xl mx-auto">
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">Weekend Hangout Spots Near Yelahanka</h2>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="bg-card rounded-xl p-6 border-2 border-accent/20">
                    <h3 className="font-semibold text-lg mb-2 text-primary">Shopping & Entertainment</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Elements Mall (3 km) - Multiplex, shopping, dining</li>
                      <li>• Yelahanka New Town Market (2 km)</li>
                      <li>• Total Mall (5 km)</li>
                      <li>• Phoenix Marketcity (12 km)</li>
                    </ul>
                  </div>

                  <div className="bg-card rounded-xl p-6 border-2 border-accent/20">
                    <h3 className="font-semibold text-lg mb-2 text-primary">Parks & Recreation</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Lumbini Gardens (8 km)</li>
                      <li>• Yelahanka Lake (3 km)</li>
                      <li>• Puttenahalli Lake Park (4 km)</li>
                      <li>• Hesaraghatta Lake (10 km)</li>
                    </ul>
                  </div>

                  <div className="bg-card rounded-xl p-6 border-2 border-accent/20">
                    <h3 className="font-semibold text-lg mb-2 text-primary">Food & Dining</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>• Multiple veg/non-veg restaurants nearby</li>
                      <li>• Fast food chains (Domino's, KFC, McDonald's)</li>
                      <li>• Local cafes and bakeries</li>
                      <li>• Authentic South Indian eateries</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="max-w-6xl mx-auto">
                <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">Neighborhood Highlights — Honnenahalli & Yelahanka New Town</h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-primary/5 to-accent/10 rounded-2xl p-8">
                    <h3 className="font-heading font-semibold text-2xl mb-4 text-primary">Safety & Security in Yelahanka's Residential Neighborhood</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <p className="text-justify">
                        <strong className="text-primary">Well-Lit Streets:</strong> The entire Honnenahalli and Raksha Layout area features excellent street lighting with regular maintenance. 24/7 illumination ensures safe movement even during late-night returns from <a href="https://blrstay.com/location" className="text-primary font-semibold hover:underline">Manyata Tech Park or Bangalore Airport</a>.
                      </p>
                      <p className="text-justify">
                        <strong className="text-primary">Police Presence:</strong> Yelahanka Police Station is just 2.5 km away. Regular police patrolling in the area, especially during night hours. Low crime rate makes it one of the safest areas for our <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">men's PG accommodation in Yelahanka</a> in Bangalore North.
                      </p>
                      <p className="text-justify">
                        <strong className="text-primary">Gated Community:</strong> Located in a well-planned residential layout with security guards at main entry points. Peaceful, family-oriented neighborhood ensures a safe living environment for working professionals and students. Learn more about our <a href="https://blrstay.com/amenities" className="text-primary font-semibold hover:underline">security features at Blrstay PG</a>.
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-accent/10 to-primary/5 rounded-2xl p-8">
                    <h3 className="font-heading font-semibold text-2xl mb-4 text-primary">Public Transportation & Metro Access Near Yelahanka PG</h3>
                    <div className="space-y-3 text-muted-foreground">
                      <p className="text-justify">
                        <strong className="text-primary">BMTC Bus Services:</strong> BMTC bus stop just 100 meters from our <a href="https://blrstay.com/" className="text-primary font-semibold hover:underline">best men's PG in Yelahanka</a> with multiple bus routes connecting to Manyata Tech Park, Yelahanka Railway Station, Hebbal, Jalahalli, and other major areas. Frequent services every 10-15 minutes during peak hours.
                      </p>
                      <p className="text-justify">
                        <strong className="text-primary">Metro Connectivity:</strong> The upcoming Namma Metro Pink Line extension will connect Yelahanka to major parts of Bangalore. The nearest metro station (under construction) will be within 2 km of our <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">boys PG in Honnenahalli</a>, making commuting even more convenient.
                      </p>
                      <p className="text-justify">
                        <strong className="text-primary">Cab Services:</strong> Excellent Ola/Uber availability throughout the day and night. Designated pickup/drop point right outside our <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-primary font-semibold hover:underline">PG near Bangalore Airport</a>. Auto rickshaws readily available with meter rates. <a href="https://blrstay.com/rooms" className="text-primary font-semibold hover:underline">View available rooms and pricing</a>.
                      </p>
                    </div>
                  </div>
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
