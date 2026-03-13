import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const bookings = pgTable("bookings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  roomType: text("room_type").notNull(),
  moveInDate: timestamp("move_in_date").notNull(),
  status: text("status").notNull().default("pending"),
  paymentStatus: text("payment_status").default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertBookingSchema = createInsertSchema(bookings).omit({
  id: true,
  createdAt: true,
  status: true,
  notes: true,
  paymentStatus: true,
}).extend({
  moveInDate: z.coerce.date(),
});

export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookings.$inferSelect;

export const pageViews = pgTable("page_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  page: text("page").notNull(),
  visitorId: text("visitor_id").notNull(),
  ipHash: text("ip_hash"),
  device: text("device").notNull().default("desktop"),
  referrer: text("referrer"),
  city: text("city"),
  region: text("region"),
  country: text("country"),
  visitedAt: timestamp("visited_at").defaultNow().notNull(),
});

export type PageView = typeof pageViews.$inferSelect;

export const roomPhotos = pgTable("room_photos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomType: text("room_type").notNull(),
  photoUrl: text("photo_url").notNull(),
  caption: text("caption"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoomPhotoSchema = createInsertSchema(roomPhotos).omit({
  id: true,
  createdAt: true,
});

export type InsertRoomPhoto = z.infer<typeof insertRoomPhotoSchema>;
export type RoomPhoto = typeof roomPhotos.$inferSelect;

export const rooms = pgTable("rooms", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  roomNumber: text("room_number").notNull(),
  type: text("type").notNull(),
  beds: integer("beds").notNull().default(1),
  price: integer("price").notNull().default(8000),
  status: text("status").notNull().default("available"),
  floor: text("floor"),
  description: text("description"),
  images: text("images").array(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertRoomSchema = createInsertSchema(rooms).omit({
  id: true,
  createdAt: true,
});

export type InsertRoom = z.infer<typeof insertRoomSchema>;
export type Room = typeof rooms.$inferSelect;

export const tenants = pgTable("tenants", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull(),
  roomId: varchar("room_id"),
  moveInDate: timestamp("move_in_date"),
  idProofUrl: text("id_proof_url"),
  idProofType: text("id_proof_type"),
  status: text("status").notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTenantSchema = createInsertSchema(tenants).omit({
  id: true,
  createdAt: true,
}).extend({
  moveInDate: z.coerce.date().nullable().optional(),
});

export type InsertTenant = z.infer<typeof insertTenantSchema>;
export type Tenant = typeof tenants.$inferSelect;

export const pgFacilities = pgTable("pg_facilities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  icon: text("icon"),
  isAvailable: boolean("is_available").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertFacilitySchema = createInsertSchema(pgFacilities).omit({
  id: true,
  updatedAt: true,
});

export type InsertFacility = z.infer<typeof insertFacilitySchema>;
export type PgFacility = typeof pgFacilities.$inferSelect;
