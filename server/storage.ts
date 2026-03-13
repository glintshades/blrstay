import {
  type Booking, type InsertBooking,
  type RoomPhoto, type InsertRoomPhoto,
  type PageView,
  type Room, type InsertRoom,
  type Tenant, type InsertTenant,
  type PgFacility, type InsertFacility,
  bookings, roomPhotos, pageViews, rooms, tenants, pgFacilities,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, gte, sql } from "drizzle-orm";

export interface IStorage {
  createBooking(booking: InsertBooking): Promise<Booking>;
  getAllBookings(): Promise<Booking[]>;
  getBooking(id: string): Promise<Booking | undefined>;
  updateBooking(id: string, data: { status?: string; notes?: string; paymentStatus?: string }): Promise<Booking | undefined>;
  deleteBooking(id: string): Promise<boolean>;

  createRoomPhoto(photo: InsertRoomPhoto): Promise<RoomPhoto>;
  getAllRoomPhotos(): Promise<RoomPhoto[]>;
  getRoomPhotosByType(roomType: string): Promise<RoomPhoto[]>;
  getRoomPhotoById(id: string): Promise<RoomPhoto | undefined>;
  deleteRoomPhoto(id: string): Promise<boolean>;

  getAllRooms(): Promise<Room[]>;
  getRoomById(id: string): Promise<Room | undefined>;
  createRoom(room: InsertRoom): Promise<Room>;
  updateRoom(id: string, data: Partial<InsertRoom>): Promise<Room | undefined>;
  deleteRoom(id: string): Promise<boolean>;
  addRoomImage(id: string, imageUrl: string): Promise<Room | undefined>;

  getAllTenants(): Promise<Tenant[]>;
  getTenantById(id: string): Promise<Tenant | undefined>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: string, data: Partial<InsertTenant>): Promise<Tenant | undefined>;
  deleteTenant(id: string): Promise<boolean>;

  getAllFacilities(): Promise<PgFacility[]>;
  getFacilityById(id: string): Promise<PgFacility | undefined>;
  createFacility(facility: InsertFacility): Promise<PgFacility>;
  updateFacility(id: string, data: Partial<InsertFacility>): Promise<PgFacility | undefined>;
  deleteFacility(id: string): Promise<boolean>;
  seedDefaultFacilities(): Promise<void>;

  recordPageView(data: { page: string; visitorId: string; ipHash?: string; device: string; referrer?: string }): Promise<void>;
  getVisitorStats(): Promise<{
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
  }>;
}

export class DatabaseStorage implements IStorage {
  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db.insert(bookings).values(insertBooking).returning();
    return booking;
  }

  async getAllBookings(): Promise<Booking[]> {
    return await db.select().from(bookings).orderBy(desc(bookings.createdAt));
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking;
  }

  async updateBooking(id: string, data: { status?: string; notes?: string; paymentStatus?: string }): Promise<Booking | undefined> {
    const [updated] = await db.update(bookings).set(data).where(eq(bookings.id, id)).returning();
    return updated;
  }

  async deleteBooking(id: string): Promise<boolean> {
    const result = await db.delete(bookings).where(eq(bookings.id, id)).returning();
    return result.length > 0;
  }

  async createRoomPhoto(insertPhoto: InsertRoomPhoto): Promise<RoomPhoto> {
    const [photo] = await db.insert(roomPhotos).values(insertPhoto).returning();
    return photo;
  }

  async getAllRoomPhotos(): Promise<RoomPhoto[]> {
    return await db.select().from(roomPhotos).orderBy(desc(roomPhotos.createdAt));
  }

  async getRoomPhotosByType(roomType: string): Promise<RoomPhoto[]> {
    return await db.select().from(roomPhotos)
      .where(eq(roomPhotos.roomType, roomType))
      .orderBy(desc(roomPhotos.createdAt));
  }

  async getRoomPhotoById(id: string): Promise<RoomPhoto | undefined> {
    const [photo] = await db.select().from(roomPhotos).where(eq(roomPhotos.id, id));
    return photo;
  }

  async deleteRoomPhoto(id: string): Promise<boolean> {
    const result = await db.delete(roomPhotos).where(eq(roomPhotos.id, id)).returning();
    return result.length > 0;
  }

  async getAllRooms(): Promise<Room[]> {
    return await db.select().from(rooms).orderBy(rooms.roomNumber);
  }

  async getRoomById(id: string): Promise<Room | undefined> {
    const [room] = await db.select().from(rooms).where(eq(rooms.id, id));
    return room;
  }

  async createRoom(room: InsertRoom): Promise<Room> {
    const [created] = await db.insert(rooms).values({ ...room, images: room.images ?? [] }).returning();
    return created;
  }

  async updateRoom(id: string, data: Partial<InsertRoom>): Promise<Room | undefined> {
    const [updated] = await db.update(rooms).set(data).where(eq(rooms.id, id)).returning();
    return updated;
  }

  async deleteRoom(id: string): Promise<boolean> {
    const result = await db.delete(rooms).where(eq(rooms.id, id)).returning();
    return result.length > 0;
  }

  async addRoomImage(id: string, imageUrl: string): Promise<Room | undefined> {
    const room = await this.getRoomById(id);
    if (!room) return undefined;
    const existing = room.images ?? [];
    const [updated] = await db.update(rooms)
      .set({ images: [...existing, imageUrl] })
      .where(eq(rooms.id, id))
      .returning();
    return updated;
  }

  async getAllTenants(): Promise<Tenant[]> {
    return await db.select().from(tenants).orderBy(desc(tenants.createdAt));
  }

  async getTenantById(id: string): Promise<Tenant | undefined> {
    const [tenant] = await db.select().from(tenants).where(eq(tenants.id, id));
    return tenant;
  }

  async createTenant(tenant: InsertTenant): Promise<Tenant> {
    const [created] = await db.insert(tenants).values(tenant).returning();
    return created;
  }

  async updateTenant(id: string, data: Partial<InsertTenant>): Promise<Tenant | undefined> {
    const [updated] = await db.update(tenants).set(data).where(eq(tenants.id, id)).returning();
    return updated;
  }

  async deleteTenant(id: string): Promise<boolean> {
    const result = await db.delete(tenants).where(eq(tenants.id, id)).returning();
    return result.length > 0;
  }

  async getAllFacilities(): Promise<PgFacility[]> {
    return await db.select().from(pgFacilities).orderBy(pgFacilities.name);
  }

  async getFacilityById(id: string): Promise<PgFacility | undefined> {
    const [facility] = await db.select().from(pgFacilities).where(eq(pgFacilities.id, id));
    return facility;
  }

  async createFacility(facility: InsertFacility): Promise<PgFacility> {
    const [created] = await db.insert(pgFacilities).values(facility).returning();
    return created;
  }

  async updateFacility(id: string, data: Partial<InsertFacility>): Promise<PgFacility | undefined> {
    const [updated] = await db.update(pgFacilities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(pgFacilities.id, id))
      .returning();
    return updated;
  }

  async deleteFacility(id: string): Promise<boolean> {
    const result = await db.delete(pgFacilities).where(eq(pgFacilities.id, id)).returning();
    return result.length > 0;
  }

  async seedDefaultFacilities(): Promise<void> {
    const existing = await this.getAllFacilities();
    if (existing.length > 0) return;
    const defaults: InsertFacility[] = [
      { name: "WiFi", description: "100 Mbps high-speed fiber optic internet", icon: "Wifi", isAvailable: true },
      { name: "Parking", description: "Covered parking for bikes and cars", icon: "Car", isAvailable: true },
      { name: "Meals", description: "3 vegetarian meals daily — breakfast, lunch, dinner", icon: "Utensils", isAvailable: true },
      { name: "Hot Water", description: "24/7 hot and cold water with geyser in every bathroom", icon: "Droplets", isAvailable: true },
      { name: "Security Guard", description: "Dedicated security personnel at the entrance", icon: "Shield", isAvailable: true },
      { name: "CCTV", description: "24/7 CCTV surveillance covering all common areas", icon: "Video", isAvailable: true },
      { name: "Laundry", description: "Washing machine facility available for residents", icon: "WashingMachine", isAvailable: true },
      { name: "Housekeeping", description: "Daily room cleaning and weekly deep cleaning", icon: "Sparkles", isAvailable: true },
      { name: "AC", description: "Air conditioning in all rooms", icon: "Wind", isAvailable: true },
      { name: "Power Backup", description: "Generator backup for common areas", icon: "Zap", isAvailable: true },
    ];
    for (const f of defaults) {
      await this.createFacility(f);
    }
  }

  async recordPageView(data: { page: string; visitorId: string; ipHash?: string; device: string; referrer?: string; city?: string; region?: string; country?: string }): Promise<void> {
    await db.insert(pageViews).values(data);
  }

  private classifyReferrer(referrer: string | null | undefined): string {
    if (!referrer || referrer.trim() === "") return "Direct";
    const r = referrer.toLowerCase();
    const search = ["google.", "bing.", "yahoo.", "duckduckgo.", "baidu.", "yandex.", "ecosia.", "ask.com", "aol.com"];
    const social = ["facebook.", "instagram.", "twitter.", "x.com", "t.co", "linkedin.", "whatsapp.", "youtube.", "pinterest.", "reddit.", "telegram.", "tiktok.", "snapchat."];
    if (search.some((s) => r.includes(s))) return "Organic";
    if (social.some((s) => r.includes(s))) return "Social";
    return "Referral";
  }

  async getVisitorStats() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now.getTime() - 7 * 86400000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [allViews, todayViews, weekViews, monthViews] = await Promise.all([
      db.select().from(pageViews),
      db.select().from(pageViews).where(gte(pageViews.visitedAt, startOfToday)),
      db.select().from(pageViews).where(gte(pageViews.visitedAt, startOfWeek)),
      db.select().from(pageViews).where(gte(pageViews.visitedAt, startOfMonth)),
    ]);

    const uniqueVisitors = new Set(allViews.map((v) => v.visitorId)).size;
    const uniqueIPs = new Set(allViews.map((v) => v.ipHash).filter(Boolean)).size;

    const pageCounts: Record<string, number> = {};
    for (const v of allViews) {
      pageCounts[v.page] = (pageCounts[v.page] || 0) + 1;
    }
    const topPages = Object.entries(pageCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([page, views]) => ({ page, views }));

    const dailyMap: Record<string, { views: number; visitors: Set<string> }> = {};
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      const key = d.toISOString().split("T")[0];
      dailyMap[key] = { views: 0, visitors: new Set() };
    }
    for (const v of allViews) {
      const key = v.visitedAt.toISOString().split("T")[0];
      if (dailyMap[key]) {
        dailyMap[key].views++;
        dailyMap[key].visitors.add(v.visitorId);
      }
    }
    const dailyTrend = Object.entries(dailyMap).map(([date, d]) => ({
      date: date.slice(5),
      views: d.views,
      unique: d.visitors.size,
    }));

    const deviceCounts: Record<string, number> = {};
    for (const v of allViews) {
      deviceCounts[v.device] = (deviceCounts[v.device] || 0) + 1;
    }
    const deviceBreakdown = Object.entries(deviceCounts).map(([device, count]) => ({ device, count }));

    const sourceCounts: Record<string, number> = {};
    for (const v of allViews) {
      const source = this.classifyReferrer(v.referrer);
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    }
    const trafficSources = ["Direct", "Organic", "Social", "Referral"].map((source) => ({
      source,
      count: sourceCounts[source] || 0,
    }));

    const locationCounts: Record<string, { city: string; region: string; country: string; count: number }> = {};
    for (const v of allViews) {
      if (v.city) {
        const key = `${v.city}||${v.region || ""}||${v.country || ""}`;
        if (!locationCounts[key]) locationCounts[key] = { city: v.city, region: v.region || "", country: v.country || "", count: 0 };
        locationCounts[key].count++;
      }
    }
    const visitorLocations = Object.values(locationCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);

    return {
      totalViews: allViews.length,
      today: todayViews.length,
      thisWeek: weekViews.length,
      thisMonth: monthViews.length,
      uniqueVisitors,
      uniqueIPs,
      topPages,
      dailyTrend,
      deviceBreakdown,
      trafficSources,
      visitorLocations,
    };
  }
}

export const storage = new DatabaseStorage();
