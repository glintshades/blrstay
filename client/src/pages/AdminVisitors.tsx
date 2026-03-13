import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Eye, Calendar, TrendingUp, Smartphone, Monitor, Tablet, Globe, Search, Share2, Link2, MapPin } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend,
} from "recharts";

interface VisitorStats {
  totalViews: number;
  today: number;
  thisWeek: number;
  thisMonth: number;
  uniqueVisitors: number;
  uniqueIPs: number;
  topPages: { page: string; views: number }[];
  dailyTrend: { date: string; views: number; unique: number }[];
  deviceBreakdown: { device: string; count: number }[];
  trafficSources: { source: string; count: number }[];
  visitorLocations: { city: string; region: string; country: string; count: number }[];
}

const PAGE_LABELS: Record<string, string> = {
  "/": "Home",
  "/rooms": "Rooms",
  "/amenities": "Amenities",
  "/location": "Location",
  "/contact": "Contact",
};

const DEVICE_COLORS: Record<string, string> = {
  Desktop: "#f97316",
  Mobile: "#3b82f6",
  Tablet: "#8b5cf6",
};

const DEVICE_ICONS: Record<string, any> = {
  Desktop: Monitor,
  Mobile: Smartphone,
  Tablet: Tablet,
};

const SOURCE_COLORS: Record<string, string> = {
  Direct: "#f97316",
  Organic: "#22c55e",
  Social: "#3b82f6",
  Referral: "#8b5cf6",
};

const SOURCE_ICONS: Record<string, any> = {
  Direct: Globe,
  Organic: Search,
  Social: Share2,
  Referral: Link2,
};

const SOURCE_DESC: Record<string, string> = {
  Direct: "Typed URL directly or no referrer",
  Organic: "Google, Bing, DuckDuckGo, etc.",
  Social: "Facebook, Instagram, WhatsApp, etc.",
  Referral: "Other websites linking to you",
};

function StatCard({ icon: Icon, label, value, sub, color }: { icon: any; label: string; value: string | number; sub?: string; color: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-2xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function AdminVisitors() {
  const { data: stats, isLoading } = useQuery<VisitorStats>({
    queryKey: ["/api/admin/visitors"],
    refetchInterval: 30000,
  });

  if (isLoading) {
    return (
      <div className="p-8 space-y-6">
        <div>
          <h2 className="text-3xl font-heading font-bold">Website Visitors</h2>
          <p className="text-muted-foreground mt-1">Loading visitor data...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i}><CardContent className="pt-5 h-24 animate-pulse bg-muted/50 rounded" /></Card>
          ))}
        </div>
      </div>
    );
  }

  if (!stats) return null;

  const total = stats.deviceBreakdown.reduce((s, d) => s + d.count, 0);

  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-3xl font-heading font-bold">Website Visitors</h2>
        <p className="text-muted-foreground mt-1">Real-time tracking — all visits recorded automatically. Refreshes every 30 seconds.</p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard icon={Eye} label="Total Page Views" value={stats.totalViews} color="bg-orange-100 text-orange-600" />
        <StatCard icon={Users} label="Unique Visitors" value={stats.uniqueVisitors} sub="by IP + browser" color="bg-blue-100 text-blue-600" />
        <StatCard icon={MapPin} label="Unique IPs" value={stats.uniqueIPs} sub="1 IP = 1 count" color="bg-teal-100 text-teal-600" />
        <StatCard icon={Calendar} label="Today" value={stats.today} sub="page views" color="bg-green-100 text-green-600" />
        <StatCard icon={TrendingUp} label="This Week" value={stats.thisWeek} sub="page views" color="bg-purple-100 text-purple-600" />
        <StatCard icon={TrendingUp} label="This Month" value={stats.thisMonth} sub="page views" color="bg-red-100 text-red-600" />
      </div>

      {/* Daily Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Daily Visitors — Last 30 Days</CardTitle>
        </CardHeader>
        <CardContent>
          {stats.dailyTrend.every((d) => d.views === 0) ? (
            <div className="h-56 flex items-center justify-center text-muted-foreground text-sm">
              No visitor data yet. Visits will appear here as people browse the website.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={stats.dailyTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="views" stroke="#f97316" strokeWidth={2} dot={false} name="Page Views" />
                <Line type="monotone" dataKey="unique" stroke="#3b82f6" strokeWidth={2} dot={false} name="Unique Visitors" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Most Visited Pages</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.topPages.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No page data yet.</p>
            ) : (
              <div className="space-y-3">
                {stats.topPages.map((p, i) => {
                  const label = PAGE_LABELS[p.page] || p.page;
                  const maxViews = stats.topPages[0]?.views || 1;
                  const pct = Math.round((p.views / maxViews) * 100);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium">{label}</span>
                        <span className="text-muted-foreground font-mono">{p.views.toLocaleString()} views</span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Device Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visitor Devices</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.deviceBreakdown.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No device data yet.</p>
            ) : (
              <div className="space-y-4">
                <ResponsiveContainer width="100%" height={160}>
                  <PieChart>
                    <Pie data={stats.deviceBreakdown} dataKey="count" nameKey="device" cx="50%" cy="50%" outerRadius={70} label={({ device, percent }) => `${device} ${(percent * 100).toFixed(0)}%`} labelLine={false}>
                      {stats.deviceBreakdown.map((entry, i) => (
                        <Cell key={i} fill={DEVICE_COLORS[entry.device] || "#9ca3af"} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2">
                  {stats.deviceBreakdown.map((d, i) => {
                    const Icon = DEVICE_ICONS[d.device] || Monitor;
                    const pct = total > 0 ? Math.round((d.count / total) * 100) : 0;
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: DEVICE_COLORS[d.device] + "22", color: DEVICE_COLORS[d.device] }}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium flex-1">{d.device}</span>
                        <span className="text-sm text-muted-foreground">{d.count.toLocaleString()} ({pct}%)</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Traffic Sources */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Traffic Sources</CardTitle>
        </CardHeader>
        <CardContent>
          {(!stats.trafficSources || stats.trafficSources.every((s) => s.count === 0)) ? (
            <p className="text-sm text-muted-foreground py-4">No traffic data yet. Sources will appear as visitors arrive.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {stats.trafficSources.map((s) => {
                  const Icon = SOURCE_ICONS[s.source] || Globe;
                  const pct = stats.totalViews > 0 ? Math.round((s.count / stats.totalViews) * 100) : 0;
                  return (
                    <div key={s.source} className="space-y-1">
                      <div className="flex items-center gap-2 justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ backgroundColor: SOURCE_COLORS[s.source] + "22", color: SOURCE_COLORS[s.source] }}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold leading-none">{s.source}</p>
                            <p className="text-xs text-muted-foreground">{SOURCE_DESC[s.source]}</p>
                          </div>
                        </div>
                        <span className="text-sm font-bold tabular-nums">{s.count.toLocaleString()} <span className="text-muted-foreground font-normal text-xs">({pct}%)</span></span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: SOURCE_COLORS[s.source] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={stats.trafficSources.filter((s) => s.count > 0)} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={80} label={({ source, percent }) => percent > 0.05 ? `${source} ${(percent * 100).toFixed(0)}%` : ""} labelLine={false}>
                    {stats.trafficSources.map((entry) => (
                      <Cell key={entry.source} fill={SOURCE_COLORS[entry.source] || "#9ca3af"} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} visits`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Visitor Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            Visitor Locations — Where Are People Visiting From?
          </CardTitle>
        </CardHeader>
        <CardContent>
          {(!stats.visitorLocations || stats.visitorLocations.length === 0) ? (
            <div className="py-6 text-sm text-muted-foreground text-center">
              No location data yet. Visitor cities will appear here as people browse from public IPs.
              <p className="mt-1 text-xs opacity-70">(Local/private IPs like 192.168.x.x are not geolocated)</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">Top cities by visit count (last {stats.visitorLocations.length} unique locations)</p>
                {stats.visitorLocations.slice(0, 10).map((loc, i) => {
                  const maxCount = stats.visitorLocations[0]?.count || 1;
                  const pct = Math.round((loc.count / maxCount) * 100);
                  return (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span className="font-medium truncate max-w-[200px]">
                          {loc.city}
                          {loc.region && loc.region !== loc.city ? <span className="text-muted-foreground font-normal">, {loc.region}</span> : null}
                        </span>
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-xs text-muted-foreground">{loc.country}</span>
                          <span className="text-sm font-bold tabular-nums">{loc.count}</span>
                        </div>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={stats.visitorLocations.slice(0, 8)} layout="vertical" margin={{ left: 8, right: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                  <YAxis type="category" dataKey="city" tick={{ fontSize: 11 }} width={90} />
                  <Tooltip formatter={(value) => [`${value} visits`, "Count"]} />
                  <Bar dataKey="count" fill="#f97316" radius={[0, 3, 3, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Live tracking note */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-5">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">How it works: </span>
            Every page visit is recorded automatically — page path, device type, and anonymized IDs (no personal data stored). <span className="font-semibold text-foreground">Unique Visitors</span> = distinct IP + browser combinations (same person on two browsers counts twice). <span className="font-semibold text-foreground">Unique IPs</span> = one count per IP address, regardless of browser — this is the "1 IP = 1 count" metric. Stats refresh every 30 seconds.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
