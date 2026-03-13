import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertBookingSchema, insertRoomPhotoSchema, insertRoomSchema, insertTenantSchema, insertFacilitySchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";
import { promises as fs } from "fs";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

const uploadDir = path.join(process.cwd(), "attached_assets", "room_photos");
const idProofDir = path.join(process.cwd(), "attached_assets", "id_proofs");
const roomImgDir = path.join(process.cwd(), "attached_assets", "room_images");

Promise.all([
  fs.mkdir(uploadDir, { recursive: true }),
  fs.mkdir(idProofDir, { recursive: true }),
  fs.mkdir(roomImgDir, { recursive: true }),
]).catch(console.error);

function makeStorage(dir: string, prefix: string) {
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dir),
    filename: (_req, file, cb) => {
      const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, prefix + "-" + unique + path.extname(file.originalname));
    },
  });
}

const imageFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowed = /jpeg|jpg|png|webp/;
  if (allowed.test(path.extname(file.originalname).toLowerCase()) && allowed.test(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  }
};

const upload = multer({ storage: makeStorage(uploadDir, "photo"), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });
const uploadIdProof = multer({ storage: makeStorage(idProofDir, "idproof"), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });
const uploadRoomImg = multer({ storage: makeStorage(roomImgDir, "room"), limits: { fileSize: 5 * 1024 * 1024 }, fileFilter: imageFilter });

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.session && req.session.isAdmin) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
}

declare module "express-session" {
  interface SessionData {
    isAdmin: boolean;
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.get("/robots.txt", (_req, res) => {
    res.type("text/plain").send(
      `User-agent: *\nAllow: /\n\nDisallow: /admin/\nDisallow: /api/\n\nSitemap: https://blrstay.com/sitemap.xml`
    );
  });

  app.get("/sitemap.xml", (_req, res) => {
    const BASE = "https://blrstay.com";
    const today = new Date().toISOString().split("T")[0];
    const urls = [
      { loc: `${BASE}/`, priority: "1.0", changefreq: "weekly" },
      { loc: `${BASE}/rooms`, priority: "0.9", changefreq: "monthly" },
      { loc: `${BASE}/amenities`, priority: "0.8", changefreq: "monthly" },
      { loc: `${BASE}/location`, priority: "0.8", changefreq: "monthly" },
      { loc: `${BASE}/contact`, priority: "0.7", changefreq: "monthly" },
    ];
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>${u.changefreq}</changefreq>\n    <priority>${u.priority}</priority>\n  </url>`).join("\n")}\n</urlset>`;
    res.type("application/xml").send(xml);
  });

  // ── Public booking ────────────────────────────────────────────────────────
  app.post("/api/bookings", async (req, res) => {
    try {
      const data = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(data);
      res.json(booking);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "Invalid booking data", details: error.errors });
      } else {
        console.error("Error creating booking:", error);
        res.status(500).json({ error: "Failed to create booking" });
      }
    }
  });

  app.get("/api/bookings", requireAuth, async (_req, res) => {
    try {
      res.json(await storage.getAllBookings());
    } catch {
      res.status(500).json({ error: "Failed to fetch bookings" });
    }
  });

  app.get("/api/bookings/:id", requireAuth, async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) return res.status(404).json({ error: "Booking not found" });
      res.json(booking);
    } catch {
      res.status(500).json({ error: "Failed to fetch booking" });
    }
  });

  // ── Auth ──────────────────────────────────────────────────────────────────
  app.post("/api/admin/login", async (req, res) => {
    const { password } = req.body;
    if (password === ADMIN_PASSWORD) {
      req.session.isAdmin = true;
      req.session.save((err) => {
        if (err) res.status(500).json({ error: "Failed to save session" });
        else res.json({ success: true });
      });
    } else {
      res.status(401).json({ error: "Invalid password" });
    }
  });

  app.post("/api/admin/logout", async (req, res) => {
    req.session.destroy((err) => {
      if (err) res.status(500).json({ error: "Failed to logout" });
      else res.json({ success: true });
    });
  });

  app.get("/api/admin/check", async (req, res) => {
    res.set("Cache-Control", "no-store, no-cache, must-revalidate");
    res.json({ isAuthenticated: !!(req.session && req.session.isAdmin) });
  });

  // ── Room Photos ───────────────────────────────────────────────────────────
  app.post("/api/admin/photos", requireAuth, upload.single("photo"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No photo file uploaded" });
      const photoUrl = `/attached_assets/room_photos/${req.file.filename}`;
      const data = insertRoomPhotoSchema.parse({ roomType: req.body.roomType, photoUrl, caption: req.body.caption || null });
      res.json(await storage.createRoomPhoto(data));
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: "Invalid photo data", details: error.errors });
      else res.status(500).json({ error: "Failed to upload photo" });
    }
  });

  app.get("/api/photos", async (_req, res) => {
    try {
      res.json(await storage.getAllRoomPhotos());
    } catch {
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  app.get("/api/photos/:roomType", async (req, res) => {
    try {
      res.json(await storage.getRoomPhotosByType(req.params.roomType));
    } catch {
      res.status(500).json({ error: "Failed to fetch photos" });
    }
  });

  app.delete("/api/admin/photos/:id", requireAuth, async (req, res) => {
    try {
      const photo = await storage.getRoomPhotoById(req.params.id);
      if (!photo) return res.status(404).json({ error: "Photo not found" });
      await storage.deleteRoomPhoto(req.params.id);
      try { await fs.unlink(path.join(process.cwd(), photo.photoUrl)); } catch {}
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete photo" });
    }
  });

  // ── Admin Bookings ────────────────────────────────────────────────────────
  app.patch("/api/admin/bookings/:id", requireAuth, async (req, res) => {
    try {
      const { status, notes, paymentStatus } = req.body;
      const validStatuses = ["pending", "confirmed", "cancelled", "checked_in"];
      const validPayment = ["pending", "paid", "partial"];
      if (status && !validStatuses.includes(status)) return res.status(400).json({ error: "Invalid status" });
      if (paymentStatus && !validPayment.includes(paymentStatus)) return res.status(400).json({ error: "Invalid payment status" });
      const updated = await storage.updateBooking(req.params.id, { status, notes, paymentStatus });
      if (!updated) return res.status(404).json({ error: "Booking not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update booking" });
    }
  });

  app.delete("/api/admin/bookings/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteBooking(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Booking not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete booking" });
    }
  });

  // ── Rooms Management ──────────────────────────────────────────────────────
  app.get("/api/admin/rooms", requireAuth, async (_req, res) => {
    try {
      res.json(await storage.getAllRooms());
    } catch {
      res.status(500).json({ error: "Failed to fetch rooms" });
    }
  });

  app.get("/api/admin/rooms/:id", requireAuth, async (req, res) => {
    try {
      const room = await storage.getRoomById(req.params.id);
      if (!room) return res.status(404).json({ error: "Room not found" });
      res.json(room);
    } catch {
      res.status(500).json({ error: "Failed to fetch room" });
    }
  });

  app.post("/api/admin/rooms", requireAuth, async (req, res) => {
    try {
      const data = insertRoomSchema.parse(req.body);
      res.json(await storage.createRoom(data));
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: "Invalid room data", details: error.errors });
      else res.status(500).json({ error: "Failed to create room" });
    }
  });

  app.patch("/api/admin/rooms/:id", requireAuth, async (req, res) => {
    try {
      const updated = await storage.updateRoom(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Room not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update room" });
    }
  });

  app.delete("/api/admin/rooms/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteRoom(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Room not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete room" });
    }
  });

  app.post("/api/admin/rooms/:id/photos", requireAuth, uploadRoomImg.single("photo"), async (req, res) => {
    try {
      if (!req.file) return res.status(400).json({ error: "No photo uploaded" });
      const imageUrl = `/attached_assets/room_images/${req.file.filename}`;
      const updated = await storage.addRoomImage(req.params.id, imageUrl);
      if (!updated) return res.status(404).json({ error: "Room not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to upload room photo" });
    }
  });

  // ── Tenants Management ────────────────────────────────────────────────────
  app.get("/api/admin/tenants", requireAuth, async (_req, res) => {
    try {
      res.json(await storage.getAllTenants());
    } catch {
      res.status(500).json({ error: "Failed to fetch tenants" });
    }
  });

  app.post("/api/admin/tenants", requireAuth, uploadIdProof.single("idProof"), async (req, res) => {
    try {
      const body = { ...req.body };
      if (req.file) body.idProofUrl = `/attached_assets/id_proofs/${req.file.filename}`;
      if (body.moveInDate === "" || body.moveInDate === undefined) delete body.moveInDate;
      const data = insertTenantSchema.parse(body);
      res.json(await storage.createTenant(data));
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: "Invalid tenant data", details: error.errors });
      else res.status(500).json({ error: "Failed to create tenant" });
    }
  });

  app.patch("/api/admin/tenants/:id", requireAuth, uploadIdProof.single("idProof"), async (req, res) => {
    try {
      const body = { ...req.body };
      if (req.file) body.idProofUrl = `/attached_assets/id_proofs/${req.file.filename}`;
      if (body.moveInDate === "") body.moveInDate = null;
      if (body.beds) body.beds = parseInt(body.beds);
      const updated = await storage.updateTenant(req.params.id, body);
      if (!updated) return res.status(404).json({ error: "Tenant not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update tenant" });
    }
  });

  app.delete("/api/admin/tenants/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteTenant(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Tenant not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete tenant" });
    }
  });

  // ── PG Facilities ─────────────────────────────────────────────────────────
  app.get("/api/admin/facilities", requireAuth, async (_req, res) => {
    try {
      await storage.seedDefaultFacilities();
      res.json(await storage.getAllFacilities());
    } catch {
      res.status(500).json({ error: "Failed to fetch facilities" });
    }
  });

  app.post("/api/admin/facilities", requireAuth, async (req, res) => {
    try {
      const data = insertFacilitySchema.parse(req.body);
      res.json(await storage.createFacility(data));
    } catch (error) {
      if (error instanceof z.ZodError) res.status(400).json({ error: "Invalid facility data", details: error.errors });
      else res.status(500).json({ error: "Failed to create facility" });
    }
  });

  app.patch("/api/admin/facilities/:id", requireAuth, async (req, res) => {
    try {
      const updated = await storage.updateFacility(req.params.id, req.body);
      if (!updated) return res.status(404).json({ error: "Facility not found" });
      res.json(updated);
    } catch {
      res.status(500).json({ error: "Failed to update facility" });
    }
  });

  app.delete("/api/admin/facilities/:id", requireAuth, async (req, res) => {
    try {
      const deleted = await storage.deleteFacility(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Facility not found" });
      res.json({ success: true });
    } catch {
      res.status(500).json({ error: "Failed to delete facility" });
    }
  });

  // ── Analytics ─────────────────────────────────────────────────────────────
  app.get("/api/admin/analytics", requireAuth, async (_req, res) => {
    try {
      const [allBookings, allRooms] = await Promise.all([storage.getAllBookings(), storage.getAllRooms()]);
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      const statusCounts = { pending: 0, confirmed: 0, cancelled: 0, checked_in: 0 };
      const roomTypeCounts: Record<string, number> = {};
      const monthlyData: Record<string, number> = {};

      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = d.toLocaleString("default", { month: "short", year: "2-digit" });
        monthlyData[key] = 0;
      }

      let thisMonthCount = 0, thisWeekCount = 0, estimatedRevenue = 0;

      for (const b of allBookings) {
        const s = (b.status as keyof typeof statusCounts) || "pending";
        if (s in statusCounts) statusCounts[s]++;
        roomTypeCounts[b.roomType] = (roomTypeCounts[b.roomType] || 0) + 1;
        const created = new Date(b.createdAt);
        const key = created.toLocaleString("default", { month: "short", year: "2-digit" });
        if (key in monthlyData) monthlyData[key]++;
        if (created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()) thisMonthCount++;
        if (created >= weekAgo) thisWeekCount++;
        if (b.status === "confirmed" || b.status === "checked_in") {
          estimatedRevenue += b.roomType === "single" ? 8000 : 6000;
        }
      }

      const totalRooms = allRooms.length;
      const availableRooms = allRooms.filter((r) => r.status === "available").length;
      const occupiedRooms = allRooms.filter((r) => r.status === "occupied").length;
      const singleRooms = allRooms.filter((r) => r.type === "Single Occupancy").length;
      const doubleRooms = allRooms.filter((r) => r.type === "Double Occupancy").length;
      const monthlyRevenue = allRooms
        .filter((r) => r.status === "occupied")
        .reduce((sum, r) => sum + r.price, 0);

      res.json({
        total: allBookings.length,
        thisMonth: thisMonthCount,
        thisWeek: thisWeekCount,
        estimatedRevenue,
        statusCounts,
        roomTypeCounts,
        monthlyTrend: Object.entries(monthlyData).map(([month, count]) => ({ month, count })),
        recentBookings: allBookings.slice(0, 5),
        roomStats: { totalRooms, availableRooms, occupiedRooms, singleRooms, doubleRooms, monthlyRevenue },
      });
    } catch (error) {
      console.error("Error fetching analytics:", error);
      res.status(500).json({ error: "Failed to fetch analytics" });
    }
  });

  app.post("/api/track", async (req, res) => {
    try {
      const { page, device, referrer } = req.body;
      const ip = (req.headers["x-forwarded-for"] as string || req.socket.remoteAddress || "unknown").split(",")[0].trim();
      const ua = req.headers["user-agent"] || "";
      const crypto = await import("crypto");
      const visitorId = crypto.createHash("sha256").update(ip + ua).digest("hex").slice(0, 16);
      const ipHash = crypto.createHash("sha256").update(ip).digest("hex").slice(0, 16);
      const detectedDevice = /mobile/i.test(ua) ? "Mobile" : /tablet|ipad/i.test(ua) ? "Tablet" : "Desktop";

      let city: string | undefined;
      let region: string | undefined;
      let country: string | undefined;
      const isPrivate = !ip || ip === "unknown" || ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168.") || ip === "::1";
      if (!isPrivate) {
        try {
          const geo = await fetch(`http://ip-api.com/json/${ip}?fields=city,regionName,country,status`, { signal: AbortSignal.timeout(2000) });
          const geoData = await geo.json() as { status: string; city?: string; regionName?: string; country?: string };
          if (geoData.status === "success") {
            city = geoData.city;
            region = geoData.regionName;
            country = geoData.country;
          }
        } catch {
        }
      }

      await storage.recordPageView({ page: page || "/", visitorId, ipHash, device: device || detectedDevice, referrer, city, region, country });
      res.json({ ok: true });
    } catch {
      res.json({ ok: false });
    }
  });

  app.get("/api/admin/visitors", requireAuth, async (_req, res) => {
    try {
      res.json(await storage.getVisitorStats());
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  app.get("/api/admin/ga-analytics", requireAuth, async (_req, res) => {
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const propertyId = process.env.GA4_PROPERTY_ID;
    if (!serviceAccountKey || !propertyId) {
      return res.json({ configured: false, message: "GA4 credentials not configured." });
    }
    try {
      const { google } = await import("googleapis");
      const credentials = JSON.parse(serviceAccountKey);
      const auth = new google.auth.GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/analytics.readonly"] });
      const analyticsData = google.analyticsdata({ version: "v1beta", auth });
      const [summaryResp, dailyResp, pagesResp] = await Promise.all([
        analyticsData.properties.runReport({ property: `properties/${propertyId}`, requestBody: { dateRanges: [{ startDate: "30daysAgo", endDate: "today" }], metrics: [{ name: "activeUsers" }, { name: "sessions" }, { name: "screenPageViews" }, { name: "bounceRate" }] } }),
        analyticsData.properties.runReport({ property: `properties/${propertyId}`, requestBody: { dateRanges: [{ startDate: "30daysAgo", endDate: "today" }], dimensions: [{ name: "date" }], metrics: [{ name: "sessions" }, { name: "activeUsers" }], orderBys: [{ dimension: { dimensionName: "date" } }] } }),
        analyticsData.properties.runReport({ property: `properties/${propertyId}`, requestBody: { dateRanges: [{ startDate: "30daysAgo", endDate: "today" }], dimensions: [{ name: "pagePath" }], metrics: [{ name: "screenPageViews" }], orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }], limit: 10 } }),
      ]);
      const summary = summaryResp.data.rows?.[0]?.metricValues ?? [];
      return res.json({ configured: true, summary: { activeUsers: parseInt(summary[0]?.value ?? "0"), sessions: parseInt(summary[1]?.value ?? "0"), pageViews: parseInt(summary[2]?.value ?? "0"), bounceRate: parseFloat((parseFloat(summary[3]?.value ?? "0") * 100).toFixed(1)) }, daily: (dailyResp.data.rows ?? []).map((r) => ({ date: r.dimensionValues?.[0]?.value ?? "", sessions: parseInt(r.metricValues?.[0]?.value ?? "0"), users: parseInt(r.metricValues?.[1]?.value ?? "0") })), topPages: (pagesResp.data.rows ?? []).map((r) => ({ page: r.dimensionValues?.[0]?.value ?? "", views: parseInt(r.metricValues?.[0]?.value ?? "0") })) });
    } catch (err: any) {
      return res.status(500).json({ configured: false, error: err.message });
    }
  });

  app.get("/api/admin/search-console", requireAuth, async (_req, res) => {
    const serviceAccountKey = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
    const siteUrl = process.env.GSC_SITE_URL || "https://blrstay.com/";
    if (!serviceAccountKey) return res.json({ configured: false, message: "GSC credentials not configured." });
    try {
      const { google } = await import("googleapis");
      const credentials = JSON.parse(serviceAccountKey);
      const auth = new google.auth.GoogleAuth({ credentials, scopes: ["https://www.googleapis.com/auth/webmasters.readonly"] });
      const sc = google.searchconsole({ version: "v1", auth });
      const endDate = new Date().toISOString().split("T")[0];
      const startDate = new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0];
      const [ov, daily, queries, pages] = await Promise.all([
        sc.searchanalytics.query({ siteUrl, requestBody: { startDate, endDate, dimensions: [] } }),
        sc.searchanalytics.query({ siteUrl, requestBody: { startDate, endDate, dimensions: ["date"], rowLimit: 30 } }),
        sc.searchanalytics.query({ siteUrl, requestBody: { startDate, endDate, dimensions: ["query"], rowLimit: 10 } }),
        sc.searchanalytics.query({ siteUrl, requestBody: { startDate, endDate, dimensions: ["page"], rowLimit: 10 } }),
      ]);
      const o = ov.data.rows?.[0] ?? {};
      return res.json({ configured: true, summary: { clicks: o.clicks ?? 0, impressions: o.impressions ?? 0, ctr: parseFloat(((o.ctr ?? 0) * 100).toFixed(1)), position: parseFloat((o.position ?? 0).toFixed(1)) }, daily: (daily.data.rows ?? []).map((r) => ({ date: r.keys?.[0] ?? "", clicks: r.clicks ?? 0, impressions: r.impressions ?? 0 })), topQueries: (queries.data.rows ?? []).map((r) => ({ query: r.keys?.[0] ?? "", clicks: r.clicks ?? 0, impressions: r.impressions ?? 0, position: parseFloat((r.position ?? 0).toFixed(1)) })), topPages: (pages.data.rows ?? []).map((r) => ({ page: (r.keys?.[0] ?? "").replace(siteUrl, "/"), clicks: r.clicks ?? 0, impressions: r.impressions ?? 0 })) });
    } catch (err: any) {
      return res.status(500).json({ configured: false, error: err.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
