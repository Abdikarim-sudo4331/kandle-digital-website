import {
  pgTable,
  text,
  serial,
  timestamp,
  integer,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// All tables have RLS enabled with no policies, so the public (anon/publishable)
// key shipped to browsers can't read or write them. The API in functions/ uses
// the secret key, which bypasses RLS. Table setup SQL: supabase/setup.sql.

export const contactInquiries = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  status: text("status", { enum: ["new", "read", "archived"] })
    .notNull()
    .default("new"),
  createdAt: timestamp("created_at").defaultNow(),
}).enableRLS();

export const services = pgTable("services", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  // Short pitch shown on the home page cards
  summary: text("summary").notNull(),
  // Longer copy shown on the Services page
  description: text("description").notNull(),
  features: text("features").array().notNull().default([]),
  icon: text("icon").notNull().default("Globe"),
  sortOrder: integer("sort_order").notNull().default(0),
  featured: boolean("featured").notNull().default(false),
  published: boolean("published").notNull().default(true),
  updatedAt: timestamp("updated_at").defaultNow(),
}).enableRLS();

// Free-form page copy, one row per section key (see shared/content.ts).
export const contentBlocks = pgTable("content_blocks", {
  key: text("key").primaryKey(),
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
}).enableRLS();

export const insertContactInquirySchema = createInsertSchema(contactInquiries, {
  name: (s) => s.trim().min(2, "Name is required").max(200),
  email: (s) => s.trim().email("Invalid email address").max(320),
  message: (s) => s.trim().min(10, "Message must be at least 10 characters").max(5000),
}).omit({
  id: true,
  status: true,
  createdAt: true,
});

export const updateInquiryStatusSchema = z.object({
  status: z.enum(["new", "read", "archived"]),
});

export const insertServiceSchema = createInsertSchema(services, {
  title: (s) => s.trim().min(1, "Title is required"),
  summary: (s) => s.trim().min(1, "Summary is required"),
  description: (s) => s.trim().min(1, "Description is required"),
  features: z.array(z.string().trim().min(1)),
}).omit({
  id: true,
  updatedAt: true,
});

export type ContactInquiry = typeof contactInquiries.$inferSelect;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type ContentBlock = typeof contentBlocks.$inferSelect;
