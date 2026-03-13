import { ExternalLink, CheckCircle, AlertCircle, BarChart2, Search, Users, Eye, MousePointer, TrendingUp, Globe, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar,
} from "recharts";

interface GaData {
  configured: boolean;
  message?: string;
  error?: string;
  summary?: { activeUsers: number; sessions: number; pageViews: number; bounceRate: number };
  daily?: { date: string; sessions: number; users: number }[];
  topPages?: { page: string; views: number }[];
}

interface GscData {
  configured: boolean;
  message?: string;
  error?: string;
  summary?: { clicks: number; impressions: number; ctr: number; position: number };
  daily?: { date: string; clicks: number; impressions: number }[];
  topQueries?: { query: string; clicks: number; impressions: number; position: number }[];
  topPages?: { page: string; clicks: number; impressions: number }[];
}

function StatCard({ icon: Icon, label, value, color, sub }: { icon: any; label: string; value: string | number; color: string; sub?: string }) {
  return (
    <Card>
      <CardContent className="pt-5">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="text-xl font-bold">{value}</p>
            {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function NotConfiguredCard({ title, icon: Icon, iconColor, steps, envVars, link }: {
  title: string; icon: any; iconColor: string;
  steps: string[]; envVars: string[]; link: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Icon className={`w-5 h-5 ${iconColor}`} />
          {title}
          <span className="ml-auto flex items-center gap-1 text-xs font-normal text-yellow-700 bg-yellow-100 px-2 py-0.5 rounded-full">
            <AlertCircle className="w-3 h-3" /> Setup Required
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ol className="space-y-2">
          {steps.map((s, i) => (
            <li key={i} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">{i + 1}</span>
              <span className="text-muted-foreground">{s}</span>
            </li>
          ))}
        </ol>
        <div className="bg-muted rounded-md p-3 font-mono text-xs space-y-1">
          {envVars.map((v) => <p key={v} className="text-primary font-semibold">{v}</p>)}
        </div>
        <Button asChild size="sm" variant="outline" className="w-full">
          <a href={link} target="_blank" rel="noopener noreferrer">
            Open {title} <ExternalLink className="w-3 h-3 ml-2" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}

function formatDate(d: string) {
  if (!d || d.length < 8) return d;
  return `${d.slice(6, 8)}/${d.slice(4, 6)}`;
}

export default function AdminGoogleTools() {
  const { data: ga, isLoading: gaLoading } = useQuery<GaData>({ queryKey: ["/api/admin/ga-analytics"], staleTime: 5 * 60 * 1000 });
  const { data: gsc, isLoading: gscLoading } = useQuery<GscData>({ queryKey: ["/api/admin/search-console"], staleTime: 5 * 60 * 1000 });

  return (
    <div className="p-8 space-y-10">
      <div>
        <h2 className="text-3xl font-heading font-bold">Google Tools</h2>
        <p className="text-muted-foreground mt-1">Live data from Google Analytics & Search Console — last 30 days</p>
      </div>

      {/* ── GOOGLE ANALYTICS ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-orange-500" />
          <h3 className="text-xl font-semibold">Google Analytics 4</h3>
          {!gaLoading && ga?.configured && (
            <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" /> Connected
            </span>
          )}
          {ga?.configured && (
            <Button asChild size="sm" variant="outline" className="ml-auto">
              <a href="https://analytics.google.com" target="_blank" rel="noopener noreferrer">
                Open GA4 <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          )}
        </div>

        {gaLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Card key={i}><CardContent className="pt-5 h-20 animate-pulse bg-muted/50 rounded" /></Card>)}
          </div>
        )}

        {!gaLoading && !ga?.configured && (
          <NotConfiguredCard
            title="Google Analytics 4"
            icon={BarChart2}
            iconColor="text-orange-500"
            link="https://analytics.google.com"
            steps={[
              "Go to analytics.google.com → Create property for blrstay.com → get the Property ID (a number like 123456789).",
              "In Google Cloud Console → create a Service Account → download the JSON key file.",
              "Grant the service account 'Viewer' access to your GA4 property.",
              "In Replit Secrets, add GOOGLE_SERVICE_ACCOUNT_KEY = (paste the full JSON content) and GA4_PROPERTY_ID = your property number.",
              "Redeploy the website — data will appear here instantly.",
            ]}
            envVars={["GOOGLE_SERVICE_ACCOUNT_KEY = { ...json... }", "GA4_PROPERTY_ID = 123456789"]}
          />
        )}

        {!gaLoading && ga?.configured && ga.summary && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Active Users (30d)" value={ga.summary.activeUsers.toLocaleString()} color="bg-orange-100 text-orange-600" />
              <StatCard icon={Globe} label="Sessions (30d)" value={ga.summary.sessions.toLocaleString()} color="bg-blue-100 text-blue-600" />
              <StatCard icon={Eye} label="Page Views (30d)" value={ga.summary.pageViews.toLocaleString()} color="bg-purple-100 text-purple-600" />
              <StatCard icon={TrendingUp} label="Bounce Rate" value={`${ga.summary.bounceRate}%`} color="bg-red-100 text-red-600" />
            </div>

            {ga.daily && ga.daily.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Daily Traffic — Last 30 Days</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <LineChart data={ga.daily.map(d => ({ ...d, date: formatDate(d.date) }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={4} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="sessions" stroke="#f97316" strokeWidth={2} dot={false} name="Sessions" />
                      <Line type="monotone" dataKey="users" stroke="#3b82f6" strokeWidth={2} dot={false} name="Users" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {ga.topPages && ga.topPages.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Top Pages by Views</CardTitle></CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead><tr className="border-b"><th className="text-left py-2 font-semibold text-muted-foreground">Page</th><th className="text-right py-2 font-semibold text-muted-foreground">Views</th></tr></thead>
                      <tbody>
                        {ga.topPages.map((p, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2 text-muted-foreground font-mono text-xs">{p.page}</td>
                            <td className="py-2 text-right font-semibold">{p.views.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </section>

      {/* ── GOOGLE SEARCH CONSOLE ── */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-blue-500" />
          <h3 className="text-xl font-semibold">Google Search Console</h3>
          {!gscLoading && gsc?.configured && (
            <span className="flex items-center gap-1 text-xs text-green-700 bg-green-100 px-2 py-0.5 rounded-full">
              <CheckCircle className="w-3 h-3" /> Connected
            </span>
          )}
          {gsc?.configured && (
            <Button asChild size="sm" variant="outline" className="ml-auto">
              <a href="https://search.google.com/search-console" target="_blank" rel="noopener noreferrer">
                Open Search Console <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </Button>
          )}
        </div>

        {gscLoading && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => <Card key={i}><CardContent className="pt-5 h-20 animate-pulse bg-muted/50 rounded" /></Card>)}
          </div>
        )}

        {!gscLoading && !gsc?.configured && (
          <NotConfiguredCard
            title="Google Search Console"
            icon={Search}
            iconColor="text-blue-500"
            link="https://search.google.com/search-console"
            steps={[
              "Go to search.google.com/search-console → Add property → URL prefix → https://blrstay.com/",
              "Verify ownership using the HTML meta tag method (add VITE_GSC_VERIFICATION to Replit Secrets).",
              "In Google Cloud Console, grant the same Service Account 'Owner' access to your GSC property.",
              "Add GSC_SITE_URL = https://blrstay.com/ to Replit Secrets (if not set, defaults to blrstay.com).",
              "Redeploy — GSC search data will appear here within 24-48 hours of first data.",
            ]}
            envVars={["GOOGLE_SERVICE_ACCOUNT_KEY = { ...json... } (shared with GA4)", "GSC_SITE_URL = https://blrstay.com/"]}
          />
        )}

        {!gscLoading && gsc?.configured && gsc.summary && (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={MousePointer} label="Total Clicks (28d)" value={gsc.summary.clicks.toLocaleString()} color="bg-blue-100 text-blue-600" />
              <StatCard icon={Eye} label="Impressions (28d)" value={gsc.summary.impressions.toLocaleString()} color="bg-indigo-100 text-indigo-600" />
              <StatCard icon={TrendingUp} label="Avg. CTR" value={`${gsc.summary.ctr}%`} color="bg-green-100 text-green-600" />
              <StatCard icon={Search} label="Avg. Position" value={gsc.summary.position} color="bg-purple-100 text-purple-600" sub="Lower is better" />
            </div>

            {gsc.daily && gsc.daily.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="text-base">Search Traffic — Last 28 Days</CardTitle></CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={gsc.daily}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" tick={{ fontSize: 11 }} interval={6} />
                      <YAxis tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="clicks" fill="#3b82f6" name="Clicks" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="impressions" fill="#a5b4fc" name="Impressions" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {gsc.topQueries && gsc.topQueries.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Top Search Queries</CardTitle></CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead><tr className="border-b"><th className="text-left py-2 font-semibold text-muted-foreground">Query</th><th className="text-right py-2 font-semibold text-muted-foreground">Clicks</th><th className="text-right py-2 font-semibold text-muted-foreground">Pos.</th></tr></thead>
                      <tbody>
                        {gsc.topQueries.map((q, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2 text-xs text-muted-foreground truncate max-w-[180px]">{q.query}</td>
                            <td className="py-2 text-right font-semibold">{q.clicks}</td>
                            <td className="py-2 text-right text-muted-foreground">{q.position}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}

              {gsc.topPages && gsc.topPages.length > 0 && (
                <Card>
                  <CardHeader><CardTitle className="text-base">Top Pages from Search</CardTitle></CardHeader>
                  <CardContent>
                    <table className="w-full text-sm">
                      <thead><tr className="border-b"><th className="text-left py-2 font-semibold text-muted-foreground">Page</th><th className="text-right py-2 font-semibold text-muted-foreground">Clicks</th><th className="text-right py-2 font-semibold text-muted-foreground">Impr.</th></tr></thead>
                      <tbody>
                        {gsc.topPages.map((p, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-2 text-xs font-mono text-muted-foreground">{p.page}</td>
                            <td className="py-2 text-right font-semibold">{p.clicks}</td>
                            <td className="py-2 text-right text-muted-foreground">{p.impressions}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </CardContent>
                </Card>
              )}
            </div>
          </>
        )}
      </section>

      {/* ── SETUP GUIDE ── */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Settings className="w-4 h-4" /> One Service Account — Both Tools
          </CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground space-y-2">
          <p>Both GA4 and Search Console use the same Google Service Account JSON key. You only need to set it up once:</p>
          <ol className="space-y-1 list-decimal list-inside">
            <li>Go to <strong>console.cloud.google.com</strong> → Create project → Enable <em>Google Analytics Data API</em> and <em>Google Search Console API</em></li>
            <li>Create a <strong>Service Account</strong> → Download JSON key</li>
            <li>In <strong>GA4</strong>: Admin → Property Access Management → add service account email as Viewer</li>
            <li>In <strong>Search Console</strong>: Settings → Users and permissions → add service account email as Owner</li>
            <li>In <strong>Replit Secrets</strong> (lock icon): paste the full JSON as <code className="bg-background px-1 rounded">GOOGLE_SERVICE_ACCOUNT_KEY</code>, set <code className="bg-background px-1 rounded">GA4_PROPERTY_ID</code>, and <code className="bg-background px-1 rounded">GSC_SITE_URL</code></li>
            <li>Click <strong>Deploy</strong> — all data appears instantly in this panel</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
