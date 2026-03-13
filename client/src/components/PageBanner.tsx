interface PageBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
}

export default function PageBanner({ title, subtitle, backgroundImage }: PageBannerProps) {
  return (
    <section 
      className="relative pt-32 pb-20 overflow-hidden"
      style={backgroundImage ? {
        backgroundImage: `linear-gradient(rgba(92, 61, 46, 0.85), rgba(92, 61, 46, 0.85)), url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      } : undefined}
    >
      {!backgroundImage && (
        <>
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-accent/80" />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNEREFGMzciIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2Mi0oaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDB2Mmgydi0yaC0yem0wLTJ2Mmgydi0yaC0yem0yLTJ2Mmgydi0yaC0yem0wLTJ2Mmgydi0yaC0yem0tMiAwdjJoMnYtMmgtMnptMC0ydjJoMnYtMmgtMnptMi0ydjJoMnYtMmgtMnptMCAwIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        </>
      )}
      
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="text-center">
          <div className="inline-block mb-6">
            <div className="h-1 w-20 bg-accent mx-auto mb-8 rounded-full" />
            <h1 className="font-heading font-bold text-4xl md:text-6xl mb-6 text-white tracking-tight drop-shadow-lg" data-testid="banner-title">
              {title}
            </h1>
            <div className="h-1 w-20 bg-accent mx-auto rounded-full" />
          </div>
          {subtitle && (
            <p className="text-white/90 max-w-3xl mx-auto text-lg md:text-xl leading-relaxed mt-8 drop-shadow" data-testid="banner-subtitle">
              {subtitle}
            </p>
          )}
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
}
