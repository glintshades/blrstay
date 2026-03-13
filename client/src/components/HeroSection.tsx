import { useState } from "react";
import { Button } from "@/components/ui/button";
import { MapPin, Wifi, Car, Shield, CalendarIcon, Users, Utensils, Wind, Tv, Zap, Shirt } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

interface HeroSectionProps {
  title: string;
  subtitle: string;
  ctaText: string;
  onCtaClick: () => void;
  backgroundImage: string;
}

const AMENITY_CHIPS = [
  { icon: Wifi, label: "100 Mbps WiFi" },
  { icon: Utensils, label: "3 Meals/Day" },
  { icon: Wind, label: "AC Rooms" },
  { icon: Shield, label: "24/7 Security" },
  { icon: Car, label: "Free Parking" },
  { icon: Shirt, label: "Laundry" },
  { icon: Tv, label: "TV Lounge" },
  { icon: Zap, label: "Power Backup" },
];

export default function HeroSection({
  title,
  subtitle,
  ctaText,
  onCtaClick,
  backgroundImage,
}: HeroSectionProps) {
  const [roomType, setRoomType] = useState("");
  const [moveInDate, setMoveInDate] = useState<Date>();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pb-20">
      <img
        src={backgroundImage}
        alt="Blrstay — Premium Men's PG in Yelahanka, Bangalore | Best PG near Manyata Tech Park"
        fetchpriority="high"
        loading="eager"
        decoding="sync"
        className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
        style={{ objectPosition: "75% center" }}
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#1a2a40]/80 via-[#1e3050]/70 to-[#0f1e30]/85 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 sm:px-8 text-center text-white animate-fade-in-up w-full">
        <div className="flex flex-wrap items-center justify-center gap-3 mb-8 mt-[140px]">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent text-white rounded-full text-xs font-bold uppercase tracking-widest shadow">
            <MapPin className="w-3.5 h-3.5" />
            Yelahanka, Bengaluru
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur-md rounded-full border border-white/30 text-xs font-semibold">
            Premium Men's PG
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white text-primary rounded-full text-xs font-bold shadow-lg">
            Starting ₹6,000/mo
          </div>
        </div>

        <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl xl:text-7xl mb-6 leading-tight drop-shadow-2xl px-4" data-testid="text-hero-title">
          {title}
        </h1>
        <p className="text-lg md:text-xl mb-8 text-white/90 max-w-3xl mx-auto font-light leading-relaxed px-4" data-testid="text-hero-subtitle">
          {subtitle}
        </p>

        {/* Amenity Chips Strip — Stanza Living style */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 px-4">
          {AMENITY_CHIPS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 backdrop-blur-md border border-white/25 rounded-full text-sm font-medium text-white/95 hover:bg-white/20 transition-colors"
            >
              <Icon className="w-3.5 h-3.5 text-accent flex-shrink-0" />
              {label}
            </div>
          ))}
        </div>

        {/* Availability Checker */}
        <div className="max-w-4xl mx-auto w-full">
          <div className="backdrop-blur-2xl bg-white/98 dark:bg-black/50 rounded-2xl shadow-2xl p-6 md:p-8 border border-white/40">
            <p className="text-primary font-semibold text-sm mb-4 text-left">Check Availability</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Room Type
                </label>
                <Select value={roomType} onValueChange={setRoomType}>
                  <SelectTrigger className="h-12 bg-white border text-sm font-medium text-gray-900" data-testid="select-hero-room-type">
                    <SelectValue placeholder="Select occupancy" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="single">Single Occupancy — ₹8,000/mo</SelectItem>
                    <SelectItem value="double">Double Occupancy — ₹6,000/mo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5" />
                  Move-in Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="h-12 w-full justify-start text-left font-medium bg-white border text-sm text-gray-900"
                      data-testid="button-hero-date-picker"
                    >
                      <CalendarIcon className="mr-2 h-3.5 w-3.5 text-gray-400" />
                      {moveInDate ? format(moveInDate, "PPP") : <span className="text-gray-400">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={moveInDate}
                      onSelect={setMoveInDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="flex flex-col justify-end">
                <Button
                  size="lg"
                  className="h-12 bg-accent text-white hover:bg-accent/90 transition-all shadow-lg border-0 text-sm font-bold w-full"
                  onClick={onCtaClick}
                  data-testid="button-hero-book-now"
                >
                  {ctaText}
                </Button>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex flex-wrap items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground px-0 h-auto font-normal hover:text-primary"
                onClick={() => {
                  document.getElementById('location')?.scrollIntoView({ behavior: 'smooth' });
                }}
                data-testid="button-view-location"
              >
                <MapPin className="w-3.5 h-3.5 mr-1" />
                Honnenahalli, Yelahanka New Town, Bengaluru 560064
              </Button>
              <span className="hidden md:block text-gray-200">·</span>
              <span className="text-xs text-muted-foreground">No brokerage · No hidden charges</span>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
          <div className="w-1.5 h-3 bg-white/60 rounded-full animate-scroll-indicator" />
        </div>
      </div>
    </section>
  );
}
