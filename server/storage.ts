import { asc, desc, eq } from "drizzle-orm";
import {
  contactInquiries,
  contentBlocks,
  services,
  type ContactInquiry,
  type InsertContactInquiry,
  type InsertService,
  type Service,
} from "@shared/schema";
import type { ContentKey } from "@shared/content";
import { db } from "./db";

export interface IStorage {
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
  listContactInquiries(): Promise<ContactInquiry[]>;
  updateContactInquiryStatus(id: number, status: ContactInquiry["status"]): Promise<ContactInquiry | undefined>;
  deleteContactInquiry(id: number): Promise<boolean>;

  listServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: number, service: InsertService): Promise<Service | undefined>;
  deleteService(id: number): Promise<boolean>;

  getContentBlocks(): Promise<Partial<Record<ContentKey, unknown>>>;
  upsertContentBlock(key: ContentKey, data: unknown): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [newInquiry] = await db.insert(contactInquiries).values(inquiry).returning();
    return newInquiry;
  }

  async listContactInquiries(): Promise<ContactInquiry[]> {
    return db.select().from(contactInquiries).orderBy(desc(contactInquiries.createdAt));
  }

  async updateContactInquiryStatus(id: number, status: ContactInquiry["status"]) {
    const [row] = await db
      .update(contactInquiries)
      .set({ status })
      .where(eq(contactInquiries.id, id))
      .returning();
    return row;
  }

  async deleteContactInquiry(id: number): Promise<boolean> {
    const rows = await db.delete(contactInquiries).where(eq(contactInquiries.id, id)).returning({ id: contactInquiries.id });
    return rows.length > 0;
  }

  async listServices(): Promise<Service[]> {
    return db.select().from(services).orderBy(asc(services.sortOrder), asc(services.id));
  }

  async createService(service: InsertService): Promise<Service> {
    const [row] = await db.insert(services).values(service).returning();
    return row;
  }

  async updateService(id: number, service: InsertService) {
    const [row] = await db
      .update(services)
      .set({ ...service, updatedAt: new Date() })
      .where(eq(services.id, id))
      .returning();
    return row;
  }

  async deleteService(id: number): Promise<boolean> {
    const rows = await db.delete(services).where(eq(services.id, id)).returning({ id: services.id });
    return rows.length > 0;
  }

  async getContentBlocks() {
    const rows = await db.select().from(contentBlocks);
    return Object.fromEntries(rows.map((r) => [r.key, r.data])) as Partial<Record<ContentKey, unknown>>;
  }

  async upsertContentBlock(key: ContentKey, data: unknown): Promise<void> {
    await db
      .insert(contentBlocks)
      .values({ key, data })
      .onConflictDoUpdate({ target: contentBlocks.key, set: { data, updatedAt: new Date() } });
  }
}

export const storage = new DatabaseStorage();
