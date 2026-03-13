import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AmenityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export default function AmenityCard({ icon: Icon, title, description }: AmenityCardProps) {
  return (
    <Card className="hover:shadow-2xl transition-all duration-500 group border-0 bg-white shadow-lg" data-testid={`card-amenity-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-8 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-accent/10 group-hover:bg-accent/20 text-accent mb-6 transition-colors duration-300">
          <Icon className="w-10 h-10" data-testid="icon-amenity" />
        </div>
        <h3 className="font-heading font-bold text-xl mb-3 tracking-tight" data-testid="text-amenity-title">
          {title}
        </h3>
        <p className="text-base text-muted-foreground leading-relaxed" data-testid="text-amenity-description">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}
