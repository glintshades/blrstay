import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CarouselImage {
  src: string;
  alt: string;
  caption?: string;
}

interface ImageCarouselProps {
  images: CarouselImage[];
  autoplayDelay?: number;
}

export default function ImageCarousel({ images, autoplayDelay = 5000 }: ImageCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })]
  );
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const scrollPrev = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollPrev();
    }
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) {
      emblaApi.scrollNext();
    }
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    
    setIsReady(true);
    onSelect();
    
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  return (
    <div className="relative w-full" data-testid="carousel-container">
      <div className="overflow-hidden rounded-2xl" ref={emblaRef}>
        <div className="flex">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-[0_0_100%] min-w-0 relative"
              data-testid={`carousel-slide-${index}`}
            >
              <div className="relative aspect-[16/9] w-full">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  decoding={index === 0 ? "sync" : "async"}
                  // @ts-ignore
                  fetchpriority={index === 0 ? "high" : "low"}
                  data-testid={`carousel-image-${index}`}
                />
                {image.caption && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-primary/90 to-transparent p-6">
                    <p className="text-white text-lg font-medium text-center drop-shadow-lg">
                      {image.caption}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          scrollPrev();
        }}
        disabled={!isReady}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background border-accent/30 hover:border-accent backdrop-blur-sm z-20"
        data-testid="button-carousel-prev"
      >
        <ChevronLeft className="w-6 h-6 text-accent" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        onClick={(e) => {
          e.preventDefault();
          scrollNext();
        }}
        disabled={!isReady}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-background/90 hover:bg-background border-accent/30 hover:border-accent backdrop-blur-sm z-20"
        data-testid="button-carousel-next"
      >
        <ChevronRight className="w-6 h-6 text-accent" />
      </Button>

      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-6" data-testid="carousel-dots">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(index);
            }}
            disabled={!isReady}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === selectedIndex
                ? "w-12 bg-accent"
                : "w-3 bg-accent/30 hover:bg-accent/50"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            data-testid={`button-carousel-dot-${index}`}
          />
        ))}
      </div>
    </div>
  );
}
