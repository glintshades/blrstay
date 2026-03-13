import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  image: string;
  rating: number;
  duration: string;
  comment: string;
}

export default function TestimonialCard({
  name,
  image,
  rating,
  duration,
  comment,
}: TestimonialCardProps) {
  return (
    <Card className="h-full hover:shadow-2xl transition-all duration-500 border-2 border-accent/20 bg-gradient-to-br from-white to-accent/5 shadow-lg" data-testid={`card-testimonial-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-8">
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="w-16 h-16 border-2 border-accent/30">
            <AvatarImage src={image} alt={name} data-testid="img-avatar" />
            <AvatarFallback className="bg-accent/20 text-accent font-bold text-xl">{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-lg text-foreground" data-testid="text-guest-name">{name}</h4>
            <p className="text-sm text-muted-foreground font-medium" data-testid="text-duration">{duration}</p>
          </div>
        </div>
        
        <div className="flex gap-1 mb-4 bg-accent/10 inline-flex p-2 rounded-full" data-testid="rating-stars">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < rating ? 'fill-accent text-accent' : 'text-muted'
              }`}
            />
          ))}
        </div>
        
        <p className="text-base text-foreground/90 leading-relaxed italic" data-testid="text-comment">
          "{comment}"
        </p>
      </CardContent>
    </Card>
  );
}
