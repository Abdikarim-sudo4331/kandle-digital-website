import { z } from "zod";
import type { InsertService, Service } from "./schema";

// ---------------------------------------------------------------------------
// Editable page copy. Each block is one row in `content_blocks`.
// Defaults double as the seed data and as the fallback when the DB is empty
// or unreachable, so the public site always renders.
// ---------------------------------------------------------------------------

const str = z.string().trim().min(1, "Can't be empty");
const strList = z.array(str);

export const contentSchemas = {
  global: z.object({
    email: z.string().trim().email(),
    phoneDisplay: str,
    whatsappNumber: z
      .string()
      .trim()
      .regex(/^\d{7,15}$/, "Digits only, with country code (e.g. 254700000000)"),
    location: str,
    footerTagline: str,
  }),
  home: z.object({
    heroLabel: str,
    heroTitle: str,
    heroTitleAccent: str,
    heroSubtitle: str,
    heroCta: str,
    aboutLabel: str,
    aboutTitle: str,
    aboutTitleMuted: str,
    aboutParagraphs: strList,
    servicesLabel: str,
    servicesTitle: str,
    servicesSubtitle: str,
    trustLabel: str,
    trustTitle: str,
    trustText: str,
    trustPoints: strList,
    ctaTitle: str,
    ctaTitleAccent: str,
    ctaText: str,
    ctaButton: str,
  }),
  services: z.object({
    title: str,
    titleAccent: str,
    subtitle: str,
    stats: z.array(z.object({ value: str, label: str })),
    benefitsTitle: str,
    benefitsText: str,
    benefitsCta: str,
  }),
  about: z.object({
    heroTitle: str,
    heroTitleAccent: str,
    heroText: str,
    imageUrl: z.string().trim().url(),
    imageAlt: str,
    imageCaption: str,
    mission: str,
    vision: str,
    valuesTitle: str,
    valuesSubtitle: str,
    values: z.array(z.object({ title: str, desc: str })),
    ctaTitle: str,
    ctaButton: str,
  }),
  contact: z.object({
    title: str,
    subtitle: str,
    introTitle: str,
    introText: str,
  }),
};

export type ContentKey = keyof typeof contentSchemas;
export const contentKeys = Object.keys(contentSchemas) as ContentKey[];
export type PageContent = { [K in ContentKey]: z.infer<(typeof contentSchemas)[K]> };

export const defaultContent: PageContent = {
  global: {
    email: "hello@kandledigital.com",
    phoneDisplay: "+254 700 000 000",
    whatsappNumber: "254700000000",
    location: "Nairobi, Kenya",
    footerTagline: "Less noise. More results.\nDigital marketing that actually works.",
  },
  home: {
    heroLabel: "Digital Marketing Agency",
    heroTitle: "Less Noise.",
    heroTitleAccent: "More Results.",
    heroSubtitle:
      "Kandle Digital helps businesses grow using data-driven SEO, paid ads, and smart digital strategy.",
    heroCta: "Get a Free Growth Plan",
    aboutLabel: "About Us",
    aboutTitle: "We don't do fluff.",
    aboutTitleMuted: "We do results.",
    aboutParagraphs: [
      "Kandle Digital was founded with one simple belief: marketing should make money, not waste it.",
      "We've seen too many businesses burn cash on agencies that deliver reports instead of revenue. That's not us. Every strategy we build, every ad we run, every page we optimize is designed with one goal — growth you can see in your bottom line.",
      "Based in Nairobi, we work with ambitious businesses across Kenya who are ready to scale. No buzzwords. No vanity metrics. Just honest work that moves the needle.",
    ],
    servicesLabel: "What We Do",
    servicesTitle: "Services built for growth",
    servicesSubtitle: "We focus on what actually moves the needle for your business.",
    trustLabel: "Why Kandle",
    trustTitle: "Built for\nKenyan businesses",
    trustText:
      "We understand the local market because we're part of it. From Nairobi to Mombasa, we help businesses compete and win.",
    trustPoints: [
      "Trusted by Kenyan SMEs and growing businesses",
      "Transparent pricing with no hidden fees",
      "MPESA-friendly payment options",
      "Results you can measure, not just promises",
    ],
    ctaTitle: "Ready to grow?",
    ctaTitleAccent: "Let's talk.",
    ctaText:
      "Get a free audit of your digital presence and a custom growth plan — no strings attached.",
    ctaButton: "Get Your Free Growth Plan",
  },
  services: {
    title: "Our",
    titleAccent: "Expertise",
    subtitle:
      "Comprehensive digital marketing solutions designed to help Kenyan businesses grow, scale, and succeed online.",
    stats: [
      { value: "50+", label: "Happy Clients" },
      { value: "300%", label: "Avg. ROI" },
      { value: "4+", label: "Years Experience" },
      { value: "24/7", label: "Support" },
    ],
    benefitsTitle: "Ideal for SMEs & Growing Brands",
    benefitsText:
      "We understand the unique challenges of the Kenyan market. Our services are tailored to maximize your budget and deliver tangible growth, whether you're a local startup or an established enterprise.",
    benefitsCta: "Schedule Your Free Audit",
  },
  about: {
    heroTitle: "Empowering Businesses to",
    heroTitleAccent: "Thrive Online",
    heroText:
      "Kandle Digital is a mission-driven agency dedicated to helping Kenyan and global businesses bridge the digital divide and unlock their full potential.",
    imageUrl:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2600",
    imageAlt: "Kandle Digital Team Meeting",
    imageCaption: "Strategy • Creativity • Technology",
    mission:
      "To provide accessible, high-impact digital marketing solutions that transform local businesses into recognized brands. We believe that every business, regardless of size, deserves a world-class online presence.",
    vision:
      "To be the most trusted digital growth partner in East Africa, known for integrity, innovation, and measurable results. We aim to set a new standard for digital excellence in the region.",
    valuesTitle: "Core Values",
    valuesSubtitle: "The principles that guide every decision we make.",
    values: [
      { title: "Transparency", desc: "No hidden fees, no jargon. We keep you informed every step of the way." },
      { title: "Results-First", desc: "We focus on metrics that matter to your bottom line: leads and sales." },
      { title: "Innovation", desc: "We stay ahead of digital trends so your business never falls behind." },
    ],
    ctaTitle: "Ready to work with a team that cares about your growth?",
    ctaButton: "Let's Talk",
  },
  contact: {
    title: "Contact Us",
    subtitle:
      "Ready to start your project? Get in touch with us today for a free consultation.",
    introTitle: "Get in Touch",
    introText:
      "Fill out the form and our team will get back to you within 24 hours. Or reach out to us directly via phone or WhatsApp.",
  },
};

// Merge a stored block over its defaults, falling back to defaults entirely
// if the stored data doesn't validate (e.g. after a schema change).
export function resolveBlock<K extends ContentKey>(key: K, stored: unknown): PageContent[K] {
  const merged = { ...defaultContent[key], ...(stored && typeof stored === "object" ? stored : {}) };
  const parsed = contentSchemas[key].safeParse(merged);
  return (parsed.success ? parsed.data : defaultContent[key]) as PageContent[K];
}

// ---------------------------------------------------------------------------
// Admin form descriptors — drives the generic block editor in the CMS.
// ---------------------------------------------------------------------------

type FieldBase = { name: string; label: string; help?: string };
export type FieldDef =
  | (FieldBase & { type: "text" })
  | (FieldBase & { type: "textarea" })
  | (FieldBase & { type: "list" })
  | (FieldBase & { type: "objects"; fields: { name: string; label: string }[] });

export const contentFields: Record<ContentKey, { label: string; fields: FieldDef[] }> = {
  global: {
    label: "Contact details & footer",
    fields: [
      { name: "email", label: "Email", type: "text" },
      { name: "phoneDisplay", label: "Phone (as displayed)", type: "text" },
      { name: "whatsappNumber", label: "WhatsApp number", type: "text", help: "Digits only, with country code, e.g. 254700000000" },
      { name: "location", label: "Location", type: "text" },
      { name: "footerTagline", label: "Footer tagline", type: "textarea" },
    ],
  },
  home: {
    label: "Home page",
    fields: [
      { name: "heroLabel", label: "Hero label", type: "text" },
      { name: "heroTitle", label: "Hero title", type: "text" },
      { name: "heroTitleAccent", label: "Hero title (highlighted)", type: "text" },
      { name: "heroSubtitle", label: "Hero subtitle", type: "textarea" },
      { name: "heroCta", label: "Hero button", type: "text" },
      { name: "aboutLabel", label: "About label", type: "text" },
      { name: "aboutTitle", label: "About title", type: "text" },
      { name: "aboutTitleMuted", label: "About title (muted)", type: "text" },
      { name: "aboutParagraphs", label: "About paragraphs", type: "list" },
      { name: "servicesLabel", label: "Services label", type: "text" },
      { name: "servicesTitle", label: "Services title", type: "text" },
      { name: "servicesSubtitle", label: "Services subtitle", type: "textarea", help: "Cards come from Services marked “Show on home page”." },
      { name: "trustLabel", label: "Trust label", type: "text" },
      { name: "trustTitle", label: "Trust title", type: "textarea" },
      { name: "trustText", label: "Trust text", type: "textarea" },
      { name: "trustPoints", label: "Trust points", type: "list" },
      { name: "ctaTitle", label: "CTA title", type: "text" },
      { name: "ctaTitleAccent", label: "CTA title (highlighted)", type: "text" },
      { name: "ctaText", label: "CTA text", type: "textarea" },
      { name: "ctaButton", label: "CTA button", type: "text" },
    ],
  },
  services: {
    label: "Services page",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "titleAccent", label: "Title (highlighted)", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "textarea" },
      { name: "stats", label: "Stats", type: "objects", fields: [{ name: "value", label: "Value" }, { name: "label", label: "Label" }] },
      { name: "benefitsTitle", label: "Benefits title", type: "text" },
      { name: "benefitsText", label: "Benefits text", type: "textarea" },
      { name: "benefitsCta", label: "Benefits button", type: "text" },
    ],
  },
  about: {
    label: "About page",
    fields: [
      { name: "heroTitle", label: "Hero title", type: "text" },
      { name: "heroTitleAccent", label: "Hero title (highlighted)", type: "text" },
      { name: "heroText", label: "Hero text", type: "textarea" },
      { name: "imageUrl", label: "Image URL", type: "text" },
      { name: "imageAlt", label: "Image alt text", type: "text" },
      { name: "imageCaption", label: "Image caption", type: "text" },
      { name: "mission", label: "Mission", type: "textarea" },
      { name: "vision", label: "Vision", type: "textarea" },
      { name: "valuesTitle", label: "Values title", type: "text" },
      { name: "valuesSubtitle", label: "Values subtitle", type: "text" },
      { name: "values", label: "Values", type: "objects", fields: [{ name: "title", label: "Title" }, { name: "desc", label: "Description" }] },
      { name: "ctaTitle", label: "CTA title", type: "textarea" },
      { name: "ctaButton", label: "CTA button", type: "text" },
    ],
  },
  contact: {
    label: "Contact page",
    fields: [
      { name: "title", label: "Title", type: "text" },
      { name: "subtitle", label: "Subtitle", type: "textarea" },
      { name: "introTitle", label: "Intro title", type: "text" },
      { name: "introText", label: "Intro text", type: "textarea" },
    ],
  },
};

// ---------------------------------------------------------------------------
// Services
// ---------------------------------------------------------------------------

// Icons the CMS can pick from (lucide-react component names).
export const serviceIcons = [
  "Search", "Target", "Share2", "Globe", "Layout", "Megaphone", "PenTool",
  "BarChart", "TrendingUp", "Smartphone", "Mail", "Camera", "Video", "ShoppingCart",
] as const;

export type PublicService = Pick<
  Service,
  "id" | "title" | "summary" | "description" | "features" | "icon" | "featured"
>;

export const defaultServices: InsertService[] = [
  {
    title: "Digital Strategy",
    summary: "A clear roadmap built on your market, competitors and audience.",
    description: "A comprehensive roadmap for your digital success. We analyze your market, competitors, and audience to build a winning plan.",
    features: ["Market Analysis", "Competitor Research", "Brand Positioning", "Growth Roadmap"],
    icon: "Layout", sortOrder: 0, featured: false, published: true,
  },
  {
    title: "SEO & Local SEO",
    summary: "Get found by customers actively searching for what you offer.",
    description: "Get found when it matters most. We optimize your online presence to rank higher on Google and attract local customers.",
    features: ["Keyword Research", "On-Page Optimization", "Google Business Profile", "Link Building"],
    icon: "Search", sortOrder: 1, featured: true, published: true,
  },
  {
    title: "Paid Advertising",
    summary: "Stop wasting ad spend. We build campaigns that drive real sales.",
    description: "Instant traffic and leads. We manage high-converting campaigns on Google Ads, Facebook, and Instagram.",
    features: ["Google Search Ads", "Meta (FB/Insta) Ads", "Retargeting", "Ad Creative & Copy"],
    icon: "Megaphone", sortOrder: 2, featured: true, published: true,
  },
  {
    title: "Web Design & Dev",
    summary: "Fast, mobile-first sites designed to convert visitors.",
    description: "Your 24/7 salesperson. We build fast, mobile-responsive websites designed to convert visitors into paying customers.",
    features: ["Custom Design", "Mobile Responsive", "Conversion Optimization", "Fast Loading Speed"],
    icon: "Globe", sortOrder: 3, featured: true, published: true,
  },
  {
    title: "Social Media Management",
    summary: "Build a presence that turns followers into paying customers.",
    description: "Build a community around your brand. We create engaging content and manage your profiles to build loyalty.",
    features: ["Content Calendar", "Community Management", "Visual Design", "Monthly Reporting"],
    icon: "PenTool", sortOrder: 4, featured: true, published: true,
  },
  {
    title: "Google Business Profile",
    summary: "Show up when locals search for services nearby.",
    description: "Essential for local businesses. We optimize your GMB listing to capture customers searching for services nearby.",
    features: ["Profile Setup", "Review Management", "Post Updates", "Local Insights"],
    icon: "BarChart", sortOrder: 5, featured: false, published: true,
  },
];

export type SiteData = { content: PageContent; services: PublicService[] };

export const defaultSiteData: SiteData = {
  content: defaultContent,
  services: defaultServices.map((s, i) => ({
    id: -(i + 1),
    title: s.title,
    summary: s.summary,
    description: s.description,
    features: s.features ?? [],
    icon: s.icon ?? "Globe",
    featured: s.featured ?? false,
  })),
};
