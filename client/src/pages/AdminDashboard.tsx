import { useEffect, useState } from "react";
import { useLocation, Route, Switch } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LogOut, LayoutDashboard, ImagePlus, Calendar, Users, TrendingUp,
  CheckCircle, Clock, XCircle, UserCheck, IndianRupee, RefreshCw,
  BarChart2, Eye, ChevronRight, Bed, ArrowUpRight, Globe, Smartphone,
  Activity, Home, Building2, WrenchIcon,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";
import AdminBookings from "./AdminBookings";
import AdminPhotos from "./AdminPhotos";
import AdminGoogleTools from "./AdminGoogleTools";
import AdminVisitors from "./AdminVisitors";
import AdminRooms from "./AdminRooms";
import AdminTenants from "./AdminTenants";
import AdminFacilities from "./AdminFacilities";
import type { Booking } from "@shared/schema";
import logoImage from "@assets/WhatsApp_Image_2026-03-07_at_9.44.22_AM-removebg-preview_1772895802233.png";

interface RoomStats {
  totalRooms: number;
  availableRooms: number;
  occupiedRooms: number;
  singleRooms: number;
  doubleRooms: number;
  monthlyRevenue: number;
}

interface Analytics {
  total: number;
  thisMonth: number;
  thisWeek: number;
  estimatedRevenue: number;
  statusCounts: { pending: number; confirmed: number; cancelled: number; checked_in: number };
  roomTypeCounts: Record<string, number>;
  monthlyTrend: { month: string; count: number }[];
  recentBookings: Booking[];
  roomStats: RoomStats;
}

interface VisitorStats {
  totalViews: number;
  today: number;
  thisWeek: number;
  uniqueVisitors: number;
  dailyTrend: { date: string; views: number; unique: number }[];
  deviceBreakdown: { device: string; count: number }[];
  trafficSources: { source: string; count: number }[];
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800 border border-amber-200",
  confirmed: "bg-emerald-100 text-emerald-800 border border-emerald-200",
  cancelled: "bg-red-100 text-red-800 border border-red-200",
  checked_in: "bg-blue-100 text-blue-800 border border-blue-200",
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  cancelled: "Cancelled",
  checked_in: "Checked In",
};

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_STYLES[status] || "bg-gray-100 text-gray-700"}`}>
      {STATUS_LABELS[status] || status}
    </span>
  );
}

function SkeletonCard() {
  return <div className="h-28 rounded-xl bg-muted/60 animate-pulse" />;
}

function DashboardHome() {
  const { data: analytics, isLoading: aLoading, refetch, isFetching } = useQuery<Analytics>({
    queryKey: ["/api/admin/analytics"],
    staleTime: 0,
    refetchOnMount: true,
  });

  const { data: visitors, isLoading: vLoading } = useQuery<VisitorStats>({
    queryKey: ["/api/admin/visitors"],
    staleTime: 0,
    refetchOnMount: true,
  });

  const isLoading = aLoading || vLoading;

  const bookingCards = [
    { label: "Total Inquiries", value: analytics?.total, icon: Users, grad: "from-orange-500 to-amber-500", sub: "all time" },
    { label: "This Month", value: analytics?.thisMonth, icon: Calendar, grad: "from-blue-500 to-indigo-500", sub: "booking requests" },
    { label: "This Week", value: analytics?.thisWeek, icon: TrendingUp, grad: "from-violet-500 to-purple-600", sub: "new this week" },
    { label: "Estimated Revenue", value: analytics ? `₹${analytics.estimatedRevenue.toLocaleString("en-IN")}` : undefined, icon: IndianRupee, grad: "from-emerald-500 to-teal-500", sub: "based on confirmed" },
  ];

  const statusCards = [
    { label: "Pending", value: analytics?.statusCounts.pending, icon: Clock, color: "text-amber-600", bg: "bg-amber-50 border border-amber-100" },
    { label: "Confirmed", value: analytics?.statusCounts.confirmed, icon: CheckCircle, color: "text-emerald-600", bg: "bg-emerald-50 border border-emerald-100" },
    { label: "Checked In", value: analytics?.statusCounts.checked_in, icon: UserCheck, color: "text-blue-600", bg: "bg-blue-50 border border-blue-100" },
    { label: "Cancelled", value: analytics?.statusCounts.cancelled, icon: XCircle, color: "text-red-500", bg: "bg-red-50 border border-red-100" },
  ];

  const roomCards = [
    { label: "Total Rooms", value: analytics?.roomStats?.totalRooms, icon: Home, grad: "from-slate-500 to-gray-600", sub: "configured" },
    { label: "Available", value: analytics?.roomStats?.availableRooms, icon: CheckCircle, grad: "from-emerald-500 to-teal-500", sub: "vacant rooms" },
    { label: "Occupied", value: analytics?.roomStats?.occupiedRooms, icon: Users, grad: "from-blue-500 to-indigo-500", sub: "currently occupied" },
    { label: "Monthly Revenue", value: analytics?.roomStats ? `₹${analytics.roomStats.monthlyRevenue.toLocaleString("en-IN")}` : undefined, icon: IndianRupee, grad: "from-amber-500 to-orange-500", sub: "from occupied rooms" },
  ];

  const visitorCards = [
    { label: "Page Views Today", value: visitors?.today, icon: Eye, grad: "from-cyan-500 to-sky-500", sub: "today" },
    { label: "This Week", value: visitors?.thisWeek, icon: Activity, grad: "from-pink-500 to-rose-500", sub: "page views" },
    { label: "Unique Visitors", value: visitors?.uniqueVisitors, icon: Globe, grad: "from-lime-500 to-green-500", sub: "all time" },
    { label: "Total Views", value: visitors?.totalViews, icon: Smartphone, grad: "from-slate-500 to-gray-600", sub: "all pages" },
  ];

  const pieData = analytics
    ? Object.entries(analytics.roomTypeCounts).map(([name, value]) => ({
        name: name === "single" ? "Single Occ." : "Double Occ.",
        value,
      }))
    : [];

  const now = new Date();

  return (
    <div className="p-6 md:p-8 space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-heading font-bold">Overview</h2>
          <p className="text-muted-foreground mt-0.5 text-sm">
            {format(now, "EEEE, dd MMMM yyyy")} · Last updated {format(now, "h:mm a")}
          </p>
        </div>
        <Button variant="outline" onClick={() => refetch()} disabled={isFetching} data-testid="button-refresh-dashboard" size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${isFetching ? "animate-spin" : ""}`} />
          {isFetching ? "Refreshing..." : "Refresh"}
        </Button>
      </div>

      {/* Room stats */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Rooms</p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {isLoading ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />) : roomCards.map((c) => (
            <div key={c.label} className={`rounded-xl bg-gradient-to-br ${c.grad} p-5 text-white shadow-sm`} data-testid={`room-stat-${c.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="flex items-start justify-between">
                <p className="text-white/80 text-xs font-medium">{c.label}</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <c.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{c.value ?? "—"}</p>
              <p className="text-white/70 text-xs mt-1">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking stat cards */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Bookings</p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {isLoading ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />) : bookingCards.map((c) => (
            <div key={c.label} className={`rounded-xl bg-gradient-to-br ${c.grad} p-5 text-white shadow-sm`} data-testid={`stat-card-${c.label.toLowerCase().replace(/\s+/g, "-")}`}>
              <div className="flex items-start justify-between">
                <p className="text-white/80 text-xs font-medium">{c.label}</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <c.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{c.value ?? "—"}</p>
              <p className="text-white/70 text-xs mt-1">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Status mini-cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {isLoading ? [...Array(4)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted/60 animate-pulse" />) :
          statusCards.map((s) => (
            <div key={s.label} className={`rounded-xl ${s.bg} px-4 py-3 flex items-center gap-3`}>
              <s.icon className={`w-5 h-5 flex-shrink-0 ${s.color}`} />
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className={`text-xl font-bold ${s.color}`}>{s.value ?? "—"}</p>
              </div>
            </div>
          ))}
      </div>

      {/* Visitor stat cards */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Website Visitors</p>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {vLoading ? [...Array(4)].map((_, i) => <SkeletonCard key={i} />) : visitorCards.map((c) => (
            <div key={c.label} className={`rounded-xl bg-gradient-to-br ${c.grad} p-5 text-white shadow-sm`}>
              <div className="flex items-start justify-between">
                <p className="text-white/80 text-xs font-medium">{c.label}</p>
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <c.icon className="w-4 h-4 text-white" />
                </div>
              </div>
              <p className="text-2xl font-bold mt-2">{c.value?.toLocaleString() ?? "—"}</p>
              <p className="text-white/70 text-xs mt-1">{c.sub}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Charts row */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Monthly Booking Trend</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">Loading…</div> : (
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={analytics?.monthlyTrend || []} margin={{ top: 4, right: 8, left: -24, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} cursor={{ fill: "hsl(var(--muted))" }} />
                  <Bar dataKey="count" name="Bookings" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Room Type Split</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">Loading…</div> :
              pieData.length === 0 ? <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">No data yet</div> : (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={pieData} cx="50%" cy="45%" outerRadius={72} innerRadius={30} dataKey="value" label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={12}>
                      {pieData.map((_, i) => <Cell key={i} fill={i === 0 ? "hsl(var(--primary))" : "hsl(var(--accent))"} />)}
                    </Pie>
                    <Legend iconType="circle" iconSize={10} />
                  </PieChart>
                </ResponsiveContainer>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Visitor trend + recent bookings */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Visitor Trend — Last 30 Days</CardTitle>
          </CardHeader>
          <CardContent>
            {vLoading ? <div className="h-52 flex items-center justify-center text-muted-foreground text-sm">Loading…</div> : (
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={visitors?.dailyTrend || []} margin={{ top: 4, right: 8, left: -24, bottom: 4 }}>
                  <defs>
                    <linearGradient id="gViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="gUnique" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                  <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={6} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Area type="monotone" dataKey="views" stroke="#f97316" strokeWidth={2} fill="url(#gViews)" name="Views" dot={false} />
                  <Area type="monotone" dataKey="unique" stroke="#3b82f6" strokeWidth={2} fill="url(#gUnique)" name="Unique" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Recent Inquiries</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? <p className="text-muted-foreground text-sm">Loading…</p> :
              !analytics?.recentBookings.length ? <p className="text-muted-foreground text-sm py-4 text-center">No bookings yet</p> : (
                <div className="space-y-3">
                  {analytics.recentBookings.map((b) => (
                    <div key={b.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 text-primary text-xs font-bold uppercase">
                        {b.name.slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm leading-tight truncate">{b.name}</p>
                        <p className="text-xs text-muted-foreground">{b.roomType === "single" ? "Single" : "Double"} · {format(new Date(b.createdAt), "dd MMM")}</p>
                      </div>
                      <StatusPill status={b.status} />
                    </div>
                  ))}
                </div>
              )}
          </CardContent>
        </Card>
      </div>

      {/* Traffic sources mini */}
      {visitors?.trafficSources && visitors.trafficSources.some((s) => s.count > 0) && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Traffic Sources</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { source: "Direct", color: "#f97316" },
              { source: "Organic", color: "#22c55e" },
              { source: "Social", color: "#3b82f6" },
              { source: "Referral", color: "#8b5cf6" },
            ].map(({ source, color }) => {
              const s = visitors.trafficSources.find((x) => x.source === source);
              const pct = visitors.totalViews > 0 ? Math.round(((s?.count || 0) / visitors.totalViews) * 100) : 0;
              return (
                <div key={source} className="rounded-xl bg-card border p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                    <p className="text-xs font-semibold text-muted-foreground">{source}</p>
                  </div>
                  <p className="text-2xl font-bold">{(s?.count || 0).toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{pct}% of all visits</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const NAV_SECTIONS = [
  {
    label: "Main",
    items: [
      { path: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    ],
  },
  {
    label: "Manage",
    items: [
      { path: "/admin/rooms", label: "Rooms", icon: Home },
      { path: "/admin/bookings", label: "Bookings", icon: Calendar },
      { path: "/admin/tenants", label: "Tenants", icon: Users },
      { path: "/admin/facilities", label: "PG Facilities", icon: Building2 },
      { path: "/admin/photos", label: "Room Photos", icon: ImagePlus },
    ],
  },
  {
    label: "Analytics",
    items: [
      { path: "/admin/visitors", label: "Visitors", icon: Eye },
      { path: "/admin/google-tools", label: "Google Tools", icon: BarChart2 },
    ],
  },
];

export default function AdminDashboard() {
  const [location, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/check");
        const data = await response.json();
        if (!data.isAuthenticated) setLocation("/admin/login");
      } catch {
        setLocation("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [setLocation]);

  const handleLogout = async () => {
    try {
      await apiRequest("POST", "/api/admin/logout", undefined);
      toast({ title: "Logged out", description: "You have been logged out successfully" });
      setLocation("/admin/login");
    } catch {
      toast({ title: "Logout failed", description: "Failed to logout. Please try again.", variant: "destructive" });
    }
  };

  const currentLabel = NAV_SECTIONS.flatMap((s) => s.items).find((i) => i.path === location)?.label || "Admin";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto" />
          <p className="text-muted-foreground text-sm">Loading admin panel…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{ background: "hsl(215 40% 18%)" }}>
        <div className="px-5 pt-6 pb-4 border-b border-white/10">
          <img src={logoImage} alt="Blrstay" className="h-10 w-auto object-contain brightness-0 invert mb-3" />
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white" />
            </div>
            <div>
              <p className="text-white text-xs font-semibold">Admin Panel</p>
              <p className="text-white/50 text-xs">Blrstay · Yelahanka</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="text-white/40 text-xs font-semibold uppercase tracking-widest px-3 mb-2">{section.label}</p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = location === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => setLocation(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        active ? "bg-white/15 text-white shadow-sm" : "text-white/60 hover:text-white hover:bg-white/8"
                      }`}
                      data-testid={`link-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    >
                      <div className={`w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0 ${active ? "bg-primary" : "bg-white/10"}`}>
                        <item.icon className="w-3.5 h-3.5 text-white" />
                      </div>
                      <span>{item.label}</span>
                      {active && <ChevronRight className="w-3.5 h-3.5 ml-auto text-white/50" />}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="px-3 pb-4 space-y-2">
          <div className="rounded-xl bg-white/8 px-4 py-3 border border-white/10">
            <p className="text-white/50 text-xs mb-1">Property</p>
            <p className="text-white text-xs font-semibold leading-snug">House 17, Raksha Layout</p>
            <p className="text-white/40 text-xs">Honnenahalli, Yelahanka</p>
          </div>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="w-full text-white/60 hover:text-white hover:bg-white/10 text-sm justify-start px-3"
            data-testid="button-logout"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="bg-background border-b px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Admin</span>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="font-semibold">{currentLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold leading-none">Blrstay Admin</p>
              <p className="text-xs text-muted-foreground">administrator</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
              BA
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-muted/20">
          <Switch>
            <Route path="/admin/dashboard" component={DashboardHome} />
            <Route path="/admin/rooms" component={AdminRooms} />
            <Route path="/admin/bookings" component={AdminBookings} />
            <Route path="/admin/tenants" component={AdminTenants} />
            <Route path="/admin/facilities" component={AdminFacilities} />
            <Route path="/admin/visitors" component={AdminVisitors} />
            <Route path="/admin/photos" component={AdminPhotos} />
            <Route path="/admin/google-tools" component={AdminGoogleTools} />
          </Switch>
        </main>
      </div>
    </div>
  );
}
