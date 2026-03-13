import { lazy, Suspense, useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider, Helmet } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/pages/Home";
import { initGA, trackPageView, GA_MEASUREMENT_ID, GSC_VERIFICATION } from "@/lib/analytics";

const RoomsPage = lazy(() => import("@/pages/RoomsPage"));
const AmenitiesPage = lazy(() => import("@/pages/AmenitiesPage"));
const LocationPage = lazy(() => import("@/pages/LocationPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));
const AdminLogin = lazy(() => import("@/pages/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/AdminDashboard"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );
}

function GoogleAnalyticsTracker() {
  const [location] = useLocation();
  useEffect(() => { trackPageView(location); }, [location]);
  return null;
}

function VisitorTracker() {
  const [location] = useLocation();
  useEffect(() => {
    if (location.startsWith("/admin")) return;
    const device = /mobile/i.test(navigator.userAgent)
      ? "Mobile"
      : /tablet|ipad/i.test(navigator.userAgent)
      ? "Tablet"
      : "Desktop";
    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ page: location, device, referrer: document.referrer || null }),
    }).catch(() => {});
  }, [location]);
  return null;
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/pg-in-yelahanka-near-manyata-tech-park" component={Home} />
        <Route path="/rooms" component={RoomsPage} />
        <Route path="/amenities" component={AmenitiesPage} />
        <Route path="/location" component={LocationPage} />
        <Route path="/contact" component={ContactPage} />
        <Route path="/admin/login" component={AdminLogin} />
        <Route path="/admin/:rest*" component={AdminDashboard} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  useEffect(() => { initGA(); }, []);

  return (
    <HelmetProvider>
      <Helmet>
        {GSC_VERIFICATION && (
          <meta name="google-site-verification" content={GSC_VERIFICATION} />
        )}
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          {GA_MEASUREMENT_ID && <GoogleAnalyticsTracker />}
          <VisitorTracker />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

export default App;
