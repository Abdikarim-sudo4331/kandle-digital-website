import { contactInquiries, type InsertContactInquiry, type ContactInquiry } from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry>;
}

export class DatabaseStorage implements IStorage {
  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    const [newInquiry] = await db
      .insert(contactInquiries)
      .values(inquiry)
      .returning();
    return newInquiry;
  }
}

export const storage = new DatabaseStorage();
