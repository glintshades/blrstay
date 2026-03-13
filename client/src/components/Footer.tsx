import { Phone, Mail, MapPin } from "lucide-react";
import { FaWhatsapp } from "react-icons/fa";
import { Button } from "@/components/ui/button";

interface FooterProps {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
}

export default function Footer({ phone, email, whatsapp, address }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary border-t border-accent/30" id="contact">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-heading font-bold text-2xl mb-4 text-accent" data-testid="text-footer-brand">
              Blrstay
            </h3>
            <p className="text-base text-white/90 mb-4 leading-relaxed" data-testid="text-footer-tagline">
              The best <a href="https://blrstay.com/" className="text-accent hover:underline font-semibold">men's PG in Yelahanka</a>, Bangalore. Premium accommodation for students and working professionals at affordable prices.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white">Quick Links</h4>
            <nav className="space-y-3" aria-label="Footer navigation">
              <div>
                <a href="https://blrstay.com/" className="text-white/85 hover:text-accent transition-colors text-sm font-medium block leading-snug" data-testid="link-footer-home">
                  Best Men's PG in Yelahanka
                </a>
              </div>
              <div>
                <a href="https://blrstay.com/rooms" className="text-white/85 hover:text-accent transition-colors text-sm font-medium block leading-snug" data-testid="link-footer-rooms">
                  PG Rooms &amp; Pricing
                </a>
              </div>
              <div>
                <a href="https://blrstay.com/amenities" className="text-white/85 hover:text-accent transition-colors text-sm font-medium block leading-snug" data-testid="link-footer-amenities">
                  Amenities — WiFi, Food, AC
                </a>
              </div>
              <div>
                <a href="https://blrstay.com/location" className="text-white/85 hover:text-accent transition-colors text-sm font-medium block leading-snug" data-testid="link-footer-location">
                  PG near Manyata Tech Park
                </a>
              </div>
              <div>
                <a href="https://blrstay.com/contact" className="text-white/85 hover:text-accent transition-colors text-sm font-medium block leading-snug" data-testid="link-footer-contact">
                  Contact &amp; Book Now
                </a>
              </div>
              <div>
                <a href="https://blrstay.com/pg-in-yelahanka-near-manyata-tech-park" className="text-white/85 hover:text-accent transition-colors text-sm font-medium block leading-snug" data-testid="link-footer-seo">
                  PG in Yelahanka — All Info
                </a>
              </div>
            </nav>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white" data-testid="text-footer-contact-title">Contact Us</h4>
            <div className="space-y-4">
              <a
                href={`tel:${phone}`}
                className="flex items-center gap-3 text-base text-white/90 hover:text-accent transition-colors hover-elevate p-2 rounded-md font-medium"
                data-testid="link-phone"
              >
                <Phone className="w-5 h-5" />
                <span>{phone}</span>
              </a>
              <a
                href={`mailto:${email}`}
                className="flex items-center gap-3 text-base text-white/90 hover:text-accent transition-colors hover-elevate p-2 rounded-md font-medium"
                data-testid="link-email"
              >
                <Mail className="w-5 h-5" />
                <span>{email}</span>
              </a>
              <a
                href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-base text-white/90 hover:text-accent transition-colors hover-elevate p-2 rounded-md font-medium"
                data-testid="link-whatsapp"
              >
                <FaWhatsapp className="w-5 h-5" />
                <span>WhatsApp Us</span>
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-lg mb-6 text-white" data-testid="text-footer-address-title">Address</h4>
            <div className="flex gap-3 text-base text-white/90 font-medium">
              <MapPin className="w-5 h-5 mt-1 flex-shrink-0" />
              <address className="not-italic leading-relaxed" data-testid="text-footer-address">
                {address}
              </address>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/20 text-center text-base text-white/70" data-testid="text-copyright">
          <p>&copy; {currentYear} Blrstay. All rights reserved.</p>
        </div>
      </div>

      <Button
        size="icon"
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-green-500 hover:bg-green-600 text-white z-40"
        onClick={() => window.open(`https://wa.me/${whatsapp.replace(/\D/g, '')}`, '_blank')}
        data-testid="button-whatsapp-float"
      >
        <FaWhatsapp className="w-7 h-7" />
      </Button>
    </footer>
  );
}
