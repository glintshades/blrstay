import { useState } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BookingDialog from "@/components/BookingDialog";
import WhatsAppButton from "@/components/WhatsAppButton";
import FAQSection from "@/components/FAQSection";
import PageBanner from "@/components/PageBanner";
import { Phone, Mail, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContactPage() {
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false);

  const faqs = [
    {
      question: "What makes Blrstay the best PG in Yelahanka for boys?",
      answer:
        "Blrstay is the best paying guest accommodation in Yelahanka because we offer premium facilities at affordable prices. Our men's PG in Yelahanka includes fully furnished AC rooms, nutritious meals, high-speed WiFi, 24/7 security with CCTV, dedicated parking, and professional housekeeping—all starting from just ₹6,000/month. View our full list of amenities at blrstay.com/amenities. Located near Orchid International School in Honnenahalli, we provide excellent connectivity to Manyata Tech Park, Yelahanka Railway Station, and major IT hubs. See distances at blrstay.com/location.",
    },
    {
      question: "How can I book a room at Blrstay PG in Yelahanka?",
      answer:
        "Booking a room at our boys PG in Yelahanka is simple. Click the 'Book Now' button on our website, or browse room options and pricing at blrstay.com/rooms before choosing. Fill out the booking inquiry form with your details including preferred room type (single or double sharing) and tentative move-in date. Our team will contact you within 24 hours to schedule a property visit and complete the booking process. You can also call us directly at +91 97405 65797 or WhatsApp for instant responses.",
    },
    {
      question: "What facilities are included in the monthly rent?",
      answer:
        "Our all-inclusive monthly rent covers everything you need: Three nutritious vegetarian meals daily (breakfast, lunch, dinner), unlimited high-speed WiFi, 24/7 security with CCTV surveillance, daily housekeeping and weekly deep cleaning, covered parking for bikes and cars, air conditioning in all rooms, and all electricity and water charges. See the complete amenities breakdown at blrstay.com/amenities. No hidden costs or surprise bills—just transparent, affordable pricing for the best PG with food in Yelahanka.",
    },
    {
      question: "Is Blrstay exclusively for boys or also accepts girls?",
      answer:
        "Blrstay is an exclusive men's PG in Yelahanka, catering only to male students and working professionals. We are a boys PG in Yelahanka with facilities and environment designed specifically for bachelors and male guests. We do not accommodate female residents to maintain the specific character and comfort of a gents PG in Yelahanka New Town. Browse our single and double sharing room options at blrstay.com/rooms.",
    },
    {
      question: "What are the payment terms and notice period?",
      answer:
        "We require one month's rent as advance deposit along with the first month's rent at the time of check-in. Monthly rent is due on the 1st of each month. For vacating, residents must provide 30 days' notice. The advance deposit is fully refundable after deducting any damages or pending dues. We accept payments via bank transfer, UPI, or cash. No brokerage fees or extra charges for this affordable PG in Yelahanka. View current room pricing at blrstay.com/rooms.",
    },
    {
      question: "What are the house rules and timing restrictions?",
      answer:
        "We maintain a friendly yet disciplined environment at our working men's hostel in Yelahanka. There are no strict curfew timings, making it ideal for IT professionals near Manyata Tech Park with flexible work hours. However, we expect residents to maintain cleanliness, avoid loud music after 10 PM, and respect fellow residents. Smoking and alcohol consumption are strictly prohibited inside the premises. Guests are allowed in common areas during daytime hours (8 AM - 8 PM) with prior intimation. See all our amenities and policies at blrstay.com/amenities.",
    },
    {
      question: "How far is Blrstay from Manyata Tech Park and other IT hubs?",
      answer:
        "Our PG near Manyata Tech Park is strategically located just 8 kilometers away, approximately 20-25 minutes by bike or cab during normal traffic. We're also well-connected to other major employment hubs: Embassy Manyata Business Park (8 km), Yelahanka Railway Station (3 km), and Bangalore International Airport (15 km). REVA University and other educational institutions are within 5 km, making our bachelor PG in Yelahanka perfect for both students and working professionals in Bangalore North. See the full commuting guide at blrstay.com/location.",
    },
    {
      question: "Can I visit the property before booking?",
      answer:
        "Absolutely! We encourage prospective residents to visit our boys PG in Yelahanka before making a decision. Property visits can be scheduled Monday to Saturday between 10 AM and 6 PM. During your visit, you can inspect the single and double sharing rooms (see pricing at blrstay.com/rooms), common areas, dining facilities, and meet our staff. Call us at +91 97405 65797 or WhatsApp to schedule your visit to the best men's PG in Yelahanka. We're located at House 17, Raksha Layout, Near Orchid International School, Honnenahalli.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Contact Us & FAQ - Booking, Pricing, Rules for Yelahanka PG | Blrstay</title>
        <meta 
          name="description" 
          content="Get answers to frequently asked questions about Blrstay PG Yelahanka. Contact us at +91 97405 65797 for booking, pricing, facilities, and rules. WhatsApp support available 24/7." 
        />
        <meta property="og:title" content="Contact Blrstay PG - FAQ, Booking Help, Phone & WhatsApp" />
        <meta property="og:description" content="Have questions? Contact us at +91 97405 65797 or check our comprehensive FAQ for booking, facilities, and rules." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://blrstay.com/contact" />
        <link rel="canonical" href="https://blrstay.com/contact" />
      </Helmet>
      <Navbar onBookNowClick={() => setIsBookingDialogOpen(true)} />
      
      <PageBanner
        title="Contact Us"
        subtitle="Have questions? We're here to help! Reach out via phone, email, or WhatsApp for room availability, pricing, facility tours, or any inquiries."
      />

      {/* Keyword SEO band */}
      <section className="bg-primary py-6">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <p className="text-center text-primary-foreground/90 text-base md:text-lg leading-relaxed max-w-4xl mx-auto">
            Book a room at the <a href="https://blrstay.com/" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">best men's PG in Yelahanka</a>.{" "}
            Explore our <a href="https://blrstay.com/rooms" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">single and double sharing rooms</a>,{" "}
            <a href="https://blrstay.com/amenities" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">premium amenities</a>, and{" "}
            <a href="https://blrstay.com/location" className="text-accent font-semibold underline underline-offset-2 hover:text-accent/80">our location near Manyata Tech Park</a>. Call or WhatsApp to schedule your free property visit today.
          </p>
        </div>
      </section>

      <main className="flex-1">
        <section className="py-12 bg-gradient-to-br from-accent/5 via-background to-accent/10">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="bg-card border-2 border-accent/20 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">Call Blrstay PG Yelahanka</h3>
                <a
                  href="tel:+919740565797"
                  className="text-primary hover:text-accent transition-colors text-lg font-semibold"
                  data-testid="link-phone"
                >
                  +91 97405 65797
                </a>
                <p className="text-muted-foreground mt-2 text-sm">Mon-Sat: 9 AM - 7 PM</p>
              </div>

              <div className="bg-card border-2 border-accent/20 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">Email Blrstay for PG Booking Inquiry</h3>
                <a
                  href="mailto:info@rakshapg.com"
                  className="text-primary hover:text-accent transition-colors text-lg font-semibold break-all"
                  data-testid="link-email"
                >
                  info@rakshapg.com
                </a>
                <p className="text-muted-foreground mt-2 text-sm">24/7 Email Support</p>
              </div>

              <div className="bg-card border-2 border-accent/20 rounded-2xl p-8 text-center hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageCircle className="w-8 h-8 text-accent" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-3">WhatsApp Blrstay — Instant PG Booking Support</h3>
                <a
                  href="https://wa.me/919740565797?text=Hi%2C%20I'm%20interested%20in%20booking%20a%20room%20at%20Blrstay%20PG%20in%20Yelahanka.%20Can%20you%20provide%20more%20details%3F"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-accent transition-colors text-lg font-semibold"
                  data-testid="link-whatsapp"
                >
                  +91 97405 65797
                </a>
                <p className="text-muted-foreground mt-2 text-sm">Instant Responses</p>
              </div>
            </div>

            <div className="bg-card border-2 border-accent/30 rounded-2xl p-8 max-w-4xl mx-auto mb-16">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-2xl mb-3">Visit Blrstay — Men's PG in Honnenahalli, Yelahanka</h3>
                  <address className="not-italic text-muted-foreground text-lg leading-relaxed">
                    House 17, Raksha Layout<br />
                    Near Orchid International School<br />
                    Honnenahalli, Yelahanka<br />
                    Bangalore - 560064
                  </address>
                  <Button
                    className="mt-6 bg-accent text-accent-foreground hover-elevate active-elevate-2"
                    onClick={() => window.open('https://maps.google.com/?q=House+17+Raksha+Layout+Near+Orchid+International+School+Honnenahalli+Yelahanka+Bangalore+560064', '_blank')}
                    data-testid="button-get-directions"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Get Directions
                  </Button>
                </div>
              </div>
            </div>

            <div className="max-w-5xl mx-auto mt-16">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-8 text-center">How to Book a PG Room at Blrstay Yelahanka — Simple 8-Step Process</h2>
              <div className="bg-card rounded-2xl p-8 border-2 border-accent/20">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        1
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Initial Inquiry</h3>
                        <p className="text-muted-foreground">Click 'Book Now' button on our website or contact us via phone/WhatsApp at +91 97405 65797. Provide your basic details, preferred room type (single/double), and tentative move-in date.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        2
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Schedule Property Visit</h3>
                        <p className="text-muted-foreground">Our team will arrange a property visit at your convenience (Mon-Sat, 10 AM - 6 PM). Tour the rooms, common areas, and meet our staff. Ask any questions about facilities, rules, or pricing.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        3
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Room Selection & Confirmation</h3>
                        <p className="text-muted-foreground">Choose your preferred room after the visit. Rooms allocated on first-come, first-served basis. Once confirmed, we'll reserve the room for you for 2-3 days pending payment.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        4
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Documentation</h3>
                        <p className="text-muted-foreground">Submit required documents: Valid photo ID (Aadhar/PAN/Passport), proof of employment/education (offer letter/ID card/student ID), one passport-size photo, and emergency contact details.</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        5
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Payment Processing</h3>
                        <p className="text-muted-foreground">Pay one month's advance deposit (refundable) + first month's rent + ₹500 registration fee. Accept payments via bank transfer, UPI (Google Pay/PhonePe/Paytm), or cash. Receive payment receipt.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        6
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Agreement Signing</h3>
                        <p className="text-muted-foreground">Sign the rental agreement outlining terms, conditions, house rules, and policies. Both parties receive copies. Agreement valid for 11 months (renewable).</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        7
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Move-In Day</h3>
                        <p className="text-muted-foreground">Receive room key, access card, and welcome kit. Staff will show you common areas, explain facilities usage, meal timings, WiFi password, and introduce you to other residents.</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <div className="w-10 h-10 bg-accent text-accent-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        8
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Settle In!</h3>
                        <p className="text-muted-foreground">Start enjoying your comfortable, hassle-free living at Blrstay! Our team is always available for any support, maintenance requests, or queries.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 p-6 bg-accent/10 rounded-xl border-2 border-accent/30">
                  <h3 className="font-semibold text-lg mb-3 text-primary">Quick Booking Timeline</h3>
                  <p className="text-muted-foreground">
                    <strong>Same-Day Move-In Available:</strong> If you visit in the morning and have all documents ready, you can complete the booking process and move in the same day! For advance bookings, the entire process takes 1-2 days from initial inquiry to move-in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FAQSection faqs={faqs} />
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
