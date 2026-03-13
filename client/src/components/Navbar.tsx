import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, MapPin } from "lucide-react";
import logoImage from "@assets/WhatsApp_Image_2026-03-07_at_9.44.22_AM-removebg-preview_1772895802233.png";

interface NavbarProps {
  onBookNowClick: () => void;
}

export default function Navbar({ onBookNowClick }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Rooms', href: '/rooms' },
    { label: 'Amenities', href: '/amenities' },
    { label: 'Location', href: '/location' },
    { label: 'Contact', href: '/contact' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        isScrolled
          ? 'bg-white/98 backdrop-blur-xl shadow-md border-b border-gray-200'
          : 'bg-white/90 backdrop-blur-md'
      }`}
      data-testid="navbar"
    >
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between h-32">
          <div className="flex-shrink-0">
            <Link href="/" data-testid="link-brand-logo" className="flex flex-col items-start gap-1">
              <img
                src={logoImage}
                alt="Blrstay - Best Men's PG in Yelahanka, Bangalore"
                className="h-24 w-auto object-contain"
                data-testid="img-brand-logo"
              />
              <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-semibold text-muted-foreground tracking-wide ml-1">
                <MapPin className="w-2.5 h-2.5 text-accent" />
                Yelahanka, Bengaluru
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 relative z-[10000]">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-semibold tracking-wide transition-colors hover-elevate px-3 py-2 rounded-md uppercase relative z-[10001] ${
                  location === link.href
                    ? 'text-accent'
                    : 'text-primary hover:text-accent'
                }`}
                data-testid={`link-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              size="default"
              onClick={onBookNowClick}
              className="font-semibold px-6"
              data-testid="button-nav-book"
            >
              Book Now
            </Button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-md text-primary"
              data-testid="button-mobile-menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200" data-testid="mobile-menu">
          <div className="px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`block w-full text-left px-4 py-2 text-sm font-semibold hover-elevate rounded-md uppercase ${
                  location === link.href ? 'text-accent' : 'text-primary'
                }`}
                data-testid={`link-mobile-${link.label.toLowerCase()}`}
              >
                {link.label}
              </Link>
            ))}
            <Button
              className="w-full mt-4"
              onClick={() => {
                setIsMobileMenuOpen(false);
                onBookNowClick();
              }}
              data-testid="button-mobile-book"
            >
              Book Now
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
