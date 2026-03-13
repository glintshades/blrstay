import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LocationSectionProps {
  address: {
    house: string;
    area: string;
    landmark: string;
    city: string;
  };
  nearbyPlaces: Array<{ name: string; distance: string }>;
}

export default function LocationSection({ address, nearbyPlaces }: LocationSectionProps) {
  const fullAddress = `${address.house}, ${address.area}, ${address.landmark}, ${address.city}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <section id="location" className="py-12 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4" data-testid="text-section-title">
            PG in Prime Yelahanka Location | Near Manyata Tech Park
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-justify" data-testid="text-section-description">
            Our boys PG in Honnenahalli, Yelahanka New Town offers unbeatable location advantages. Situated near Orchid International School with excellent connectivity to Manyata Tech Park, Yelahanka Railway Station, and Bangalore Airport. This prime location makes Blrstay the best paying guest accommodation in Yelahanka for IT professionals and students seeking convenient access to work, education, and transportation hubs across Bangalore North.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-3 mb-6">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-heading font-semibold text-lg mb-2" data-testid="text-address-title">
                    Our Address
                  </h3>
                  <address className="not-italic text-foreground/90 leading-relaxed" data-testid="text-full-address">
                    {address.house}<br />
                    {address.area}<br />
                    {address.landmark}<br />
                    {address.city}
                  </address>
                </div>
              </div>

              <h4 className="font-semibold mb-3" data-testid="text-nearby-title">Nearby Landmarks</h4>
              <ul className="space-y-2" data-testid="list-nearby-places">
                {nearbyPlaces.map((place, index) => (
                  <li key={index} className="flex justify-between text-sm" data-testid={`item-nearby-${index}`}>
                    <span className="text-foreground/90">{place.name}</span>
                    <span className="text-muted-foreground">{place.distance}</span>
                  </li>
                ))}
              </ul>

              <Button
                className="w-full mt-6 hover-elevate active-elevate-2"
                onClick={() => window.open(mapsUrl, '_blank')}
                data-testid="button-get-directions"
              >
                <Navigation className="w-4 h-4 mr-2" />
                Get Directions
              </Button>
            </CardContent>
          </Card>

          <div className="relative h-96 md:h-auto rounded-lg overflow-hidden">
            <iframe
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(fullAddress)}`}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0"
              data-testid="iframe-map"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
