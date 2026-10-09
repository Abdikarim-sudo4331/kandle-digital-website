import { z } from 'zod';
import {
  insertContactInquirySchema,
  insertServiceSchema,
  updateInquiryStatusSchema,
  contactInquiries,
} from './schema';
import { serviceIcons } from './content';

export type { InsertContactInquiry } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const serviceInputSchema = insertServiceSchema.extend({
  icon: z.enum(serviceIcons),
});

export const api = {
  site: {
    get: { method: 'GET' as const, path: '/api/site' },
  },
  contact: {
    submit: {
      method: 'POST' as const,
      path: '/api/contact',
      input: insertContactInquirySchema,
      responses: {
        201: z.custom<typeof contactInquiries.$inferSelect>(),
        400: errorSchemas.validation,
        500: errorSchemas.internal,
      },
    },
  },
  admin: {
    me: { method: 'GET' as const, path: '/api/admin/me' },
    inquiries: {
      list: { method: 'GET' as const, path: '/api/admin/inquiries' },
      update: { method: 'PATCH' as const, path: '/api/admin/inquiries/:id', input: updateInquiryStatusSchema },
      delete: { method: 'DELETE' as const, path: '/api/admin/inquiries/:id' },
    },
    services: {
      list: { method: 'GET' as const, path: '/api/admin/services' },
      create: { method: 'POST' as const, path: '/api/admin/services', input: serviceInputSchema },
      update: { method: 'PUT' as const, path: '/api/admin/services/:id', input: serviceInputSchema },
      delete: { method: 'DELETE' as const, path: '/api/admin/services/:id' },
    },
    content: {
      list: { method: 'GET' as const, path: '/api/admin/content' },
      update: { method: 'PUT' as const, path: '/api/admin/content/:key' },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
