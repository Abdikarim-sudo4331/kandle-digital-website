-- Kandle Digital CMS: creates the tables and loads the current site content.
-- Safe to run more than once.

create table if not exists contact_inquiries (
  id serial primary key,
  name text not null,
  email text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamp default now()
);

create table if not exists content_blocks (
  key text primary key,
  data jsonb not null,
  updated_at timestamp default now()
);

create table if not exists services (
  id serial primary key,
  title text not null,
  summary text not null,
  description text not null,
  features text[] not null default '{}',
  icon text not null default 'Globe',
  sort_order integer not null default 0,
  featured boolean not null default false,
  published boolean not null default true,
  updated_at timestamp default now()
);

-- Lock these tables from Supabase's public API. The website's server still has full access.
alter table contact_inquiries enable row level security;
alter table content_blocks enable row level security;
alter table services enable row level security;

-- Starter content (the site's current text)
insert into content_blocks (key, data) values
  ($v$global$v$, $v${"email":"hello@kandledigital.com","phoneDisplay":"+254 700 000 000","whatsappNumber":"254700000000","location":"Nairobi, Kenya","footerTagline":"Less noise. More results.\nDigital marketing that actually works."}$v$::jsonb),
  ($v$home$v$, $v${"heroLabel":"Digital Marketing Agency","heroTitle":"Less Noise.","heroTitleAccent":"More Results.","heroSubtitle":"Kandle Digital helps businesses grow using data-driven SEO, paid ads, and smart digital strategy.","heroCta":"Get a Free Growth Plan","aboutLabel":"About Us","aboutTitle":"We don't do fluff.","aboutTitleMuted":"We do results.","aboutParagraphs":["Kandle Digital was founded with one simple belief: marketing should make money, not waste it.","We've seen too many businesses burn cash on agencies that deliver reports instead of revenue. That's not us. Every strategy we build, every ad we run, every page we optimize is designed with one goal \u2014 growth you can see in your bottom line.","Based in Nairobi, we work with ambitious businesses across Kenya who are ready to scale. No buzzwords. No vanity metrics. Just honest work that moves the needle."],"servicesLabel":"What We Do","servicesTitle":"Services built for growth","servicesSubtitle":"We focus on what actually moves the needle for your business.","trustLabel":"Why Kandle","trustTitle":"Built for\nKenyan businesses","trustText":"We understand the local market because we're part of it. From Nairobi to Mombasa, we help businesses compete and win.","trustPoints":["Trusted by Kenyan SMEs and growing businesses","Transparent pricing with no hidden fees","MPESA-friendly payment options","Results you can measure, not just promises"],"ctaTitle":"Ready to grow?","ctaTitleAccent":"Let's talk.","ctaText":"Get a free audit of your digital presence and a custom growth plan \u2014 no strings attached.","ctaButton":"Get Your Free Growth Plan"}$v$::jsonb),
  ($v$services$v$, $v${"title":"Our","titleAccent":"Expertise","subtitle":"Comprehensive digital marketing solutions designed to help Kenyan businesses grow, scale, and succeed online.","stats":[{"value":"50+","label":"Happy Clients"},{"value":"300%","label":"Avg. ROI"},{"value":"4+","label":"Years Experience"},{"value":"24/7","label":"Support"}],"benefitsTitle":"Ideal for SMEs & Growing Brands","benefitsText":"We understand the unique challenges of the Kenyan market. Our services are tailored to maximize your budget and deliver tangible growth, whether you're a local startup or an established enterprise.","benefitsCta":"Schedule Your Free Audit"}$v$::jsonb),
  ($v$about$v$, $v${"heroTitle":"Empowering Businesses to","heroTitleAccent":"Thrive Online","heroText":"Kandle Digital is a mission-driven agency dedicated to helping Kenyan and global businesses bridge the digital divide and unlock their full potential.","imageUrl":"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2600","imageAlt":"Kandle Digital Team Meeting","imageCaption":"Strategy \u2022 Creativity \u2022 Technology","mission":"To provide accessible, high-impact digital marketing solutions that transform local businesses into recognized brands. We believe that every business, regardless of size, deserves a world-class online presence.","vision":"To be the most trusted digital growth partner in East Africa, known for integrity, innovation, and measurable results. We aim to set a new standard for digital excellence in the region.","valuesTitle":"Core Values","valuesSubtitle":"The principles that guide every decision we make.","values":[{"title":"Transparency","desc":"No hidden fees, no jargon. We keep you informed every step of the way."},{"title":"Results-First","desc":"We focus on metrics that matter to your bottom line: leads and sales."},{"title":"Innovation","desc":"We stay ahead of digital trends so your business never falls behind."}],"ctaTitle":"Ready to work with a team that cares about your growth?","ctaButton":"Let's Talk"}$v$::jsonb),
  ($v$contact$v$, $v${"title":"Contact Us","subtitle":"Ready to start your project? Get in touch with us today for a free consultation.","introTitle":"Get in Touch","introText":"Fill out the form and our team will get back to you within 24 hours. Or reach out to us directly via phone or WhatsApp."}$v$::jsonb)
on conflict (key) do nothing;

insert into services (title, summary, description, features, icon, sort_order, featured, published)
select * from (values
  ($v$Digital Strategy$v$, $v$A clear roadmap built on your market, competitors and audience.$v$, $v$A comprehensive roadmap for your digital success. We analyze your market, competitors, and audience to build a winning plan.$v$, array[$v$Market Analysis$v$, $v$Competitor Research$v$, $v$Brand Positioning$v$, $v$Growth Roadmap$v$]::text[], $v$Layout$v$, 0, false, true),
  ($v$SEO & Local SEO$v$, $v$Get found by customers actively searching for what you offer.$v$, $v$Get found when it matters most. We optimize your online presence to rank higher on Google and attract local customers.$v$, array[$v$Keyword Research$v$, $v$On-Page Optimization$v$, $v$Google Business Profile$v$, $v$Link Building$v$]::text[], $v$Search$v$, 1, true, true),
  ($v$Paid Advertising$v$, $v$Stop wasting ad spend. We build campaigns that drive real sales.$v$, $v$Instant traffic and leads. We manage high-converting campaigns on Google Ads, Facebook, and Instagram.$v$, array[$v$Google Search Ads$v$, $v$Meta (FB/Insta) Ads$v$, $v$Retargeting$v$, $v$Ad Creative & Copy$v$]::text[], $v$Megaphone$v$, 2, true, true),
  ($v$Web Design & Dev$v$, $v$Fast, mobile-first sites designed to convert visitors.$v$, $v$Your 24/7 salesperson. We build fast, mobile-responsive websites designed to convert visitors into paying customers.$v$, array[$v$Custom Design$v$, $v$Mobile Responsive$v$, $v$Conversion Optimization$v$, $v$Fast Loading Speed$v$]::text[], $v$Globe$v$, 3, true, true),
  ($v$Social Media Management$v$, $v$Build a presence that turns followers into paying customers.$v$, $v$Build a community around your brand. We create engaging content and manage your profiles to build loyalty.$v$, array[$v$Content Calendar$v$, $v$Community Management$v$, $v$Visual Design$v$, $v$Monthly Reporting$v$]::text[], $v$PenTool$v$, 4, true, true),
  ($v$Google Business Profile$v$, $v$Show up when locals search for services nearby.$v$, $v$Essential for local businesses. We optimize your GMB listing to capture customers searching for services nearby.$v$, array[$v$Profile Setup$v$, $v$Review Management$v$, $v$Post Updates$v$, $v$Local Insights$v$]::text[], $v$BarChart$v$, 5, false, true)
) as v(title, summary, description, features, icon, sort_order, featured, published)
where not exists (select 1 from services);
