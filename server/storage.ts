import type { SupabaseClient } from "@supabase/supabase-js";
import type { ContactInquiry, InsertContactInquiry, InsertService, Service } from "../shared/schema";
import type { ContentKey } from "../shared/content";

// Database rows use snake_case; the app uses camelCase.
type InquiryRow = { id: number; name: string; email: string; message: string; status: ContactInquiry["status"]; created_at: string | null };
type ServiceRow = {
  id: number; title: string; summary: string; description: string; features: string[]; icon: string;
  sort_order: number; featured: boolean; published: boolean; updated_at: string | null;
};

const toInquiry = (r: InquiryRow): ContactInquiry => ({
  id: r.id, name: r.name, email: r.email, message: r.message, status: r.status,
  createdAt: r.created_at ? new Date(r.created_at) : null,
});

const toService = (r: ServiceRow): Service => ({
  id: r.id, title: r.title, summary: r.summary, description: r.description, features: r.features,
  icon: r.icon, sortOrder: r.sort_order, featured: r.featured, published: r.published,
  updatedAt: r.updated_at ? new Date(r.updated_at) : null,
});

const fromService = (s: InsertService) => ({
  title: s.title, summary: s.summary, description: s.description, features: s.features ?? [],
  icon: s.icon, sort_order: s.sortOrder, featured: s.featured, published: s.published,
});

function check<T>({ data, error }: { data: T; error: { message: string } | null }): T {
  if (error) throw new Error(`Database error: ${error.message}`);
  return data;
}

function one<T>(res: { data: T | null; error: { message: string } | null }): T {
  const data = check(res);
  if (data == null) throw new Error("Database error: no row returned");
  return data;
}

export class Storage {
  constructor(private db: SupabaseClient) {}

  async createContactInquiry(inquiry: InsertContactInquiry): Promise<ContactInquiry> {
    return toInquiry(one(await this.db.from("contact_inquiries").insert(inquiry).select().single()));
  }

  async listContactInquiries(): Promise<ContactInquiry[]> {
    const rows = check(await this.db.from("contact_inquiries").select().order("created_at", { ascending: false })) ?? [];
    return (rows as InquiryRow[]).map(toInquiry);
  }

  async updateContactInquiryStatus(id: number, status: ContactInquiry["status"]): Promise<ContactInquiry | undefined> {
    const row = check(await this.db.from("contact_inquiries").update({ status }).eq("id", id).select().maybeSingle());
    return row ? toInquiry(row as InquiryRow) : undefined;
  }

  async deleteContactInquiry(id: number): Promise<boolean> {
    const rows = check(await this.db.from("contact_inquiries").delete().eq("id", id).select("id")) ?? [];
    return rows.length > 0;
  }

  async listServices(): Promise<Service[]> {
    const rows = check(await this.db.from("services").select().order("sort_order").order("id")) ?? [];
    return (rows as ServiceRow[]).map(toService);
  }

  async createService(service: InsertService): Promise<Service> {
    return toService(one(await this.db.from("services").insert(fromService(service)).select().single()));
  }

  async updateService(id: number, service: InsertService): Promise<Service | undefined> {
    const row = check(
      await this.db.from("services")
        .update({ ...fromService(service), updated_at: new Date().toISOString() })
        .eq("id", id).select().maybeSingle(),
    );
    return row ? toService(row as ServiceRow) : undefined;
  }

  async deleteService(id: number): Promise<boolean> {
    const rows = check(await this.db.from("services").delete().eq("id", id).select("id")) ?? [];
    return rows.length > 0;
  }

  async getContentBlocks(): Promise<Partial<Record<ContentKey, unknown>>> {
    const rows = check(await this.db.from("content_blocks").select("key, data")) ?? [];
    return Object.fromEntries((rows as { key: string; data: unknown }[]).map((r) => [r.key, r.data]));
  }

  async upsertContentBlock(key: ContentKey, data: unknown): Promise<void> {
    check(await this.db.from("content_blocks").upsert({ key, data, updated_at: new Date().toISOString() }));
  }
}
