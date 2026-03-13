import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Maximize2 } from "lucide-react";

interface RoomCardProps {
  title: string;
  price: string;
  occupancy: string;
  size: string;
  features: string[];
  image: string;
  fallbackImage?: string;
  onBookClick: () => void;
}

export default function RoomCard({
  title,
  price,
  occupancy,
  size,
  features,
  image,
  fallbackImage,
  onBookClick,
}: RoomCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-0 shadow-xl" data-testid={`card-room-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="relative h-80 overflow-hidden">
        <img
          src={image}
          alt={`${title} — PG in Yelahanka, Bangalore | Blrstay Men's PG Honnenahalli — ${price}/month all-inclusive`}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
          decoding="async"
          width={600}
          height={320}
          data-testid="img-room"
          onError={fallbackImage ? (e) => { (e.currentTarget as HTMLImageElement).src = fallbackImage; } : undefined}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
        <div className="absolute top-6 right-6 px-6 py-3 bg-accent text-foreground rounded-full border-2 border-white shadow-2xl font-bold text-xl backdrop-blur-md" data-testid="badge-price">
          {price}
        </div>
      </div>
      
      <CardContent className="p-8">
        <h3 className="font-heading font-bold text-2xl mb-4 tracking-tight" data-testid="text-room-title">
          {title}
        </h3>
        
        <div className="flex gap-4 mb-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1" data-testid="text-occupancy">
            <Users className="w-4 h-4" />
            <span>{occupancy}</span>
          </div>
          <div className="flex items-center gap-1" data-testid="text-size">
            <Maximize2 className="w-4 h-4" />
            <span>{size}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {features.map((feature, index) => (
            <Badge key={index} variant="secondary" className="text-xs" data-testid={`badge-feature-${index}`}>
              {feature}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter className="p-8 pt-0">
        <Button
          className="w-full h-12 bg-primary text-primary-foreground hover-elevate active-elevate-2 font-semibold text-base"
          onClick={onBookClick}
          data-testid="button-book-room"
        >
          Reserve Now
        </Button>
      </CardFooter>
    </Card>
  );
}
