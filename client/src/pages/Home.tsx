import { Link } from "wouter";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSiteData } from "@/lib/site";
import { getIcon } from "@/lib/icons";

export default function Home() {
  const { content, services: allServices } = useSiteData();
  const c = content.home;
  const services = allServices.filter((s) => s.featured);

  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* Hero Section - Editorial Left-Aligned */}
      <section className="min-h-screen flex items-center px-6 pt-28 pb-16 md:pb-0 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            <p className="text-[#F59E0B] font-semibold text-sm tracking-wide uppercase mb-6 animate-fade-in" data-testid="text-hero-label">
              {c.heroLabel}
            </p>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#0F172A] leading-[0.95] tracking-tight mb-8 animate-fade-in-delay-1">
              {c.heroTitle}
              <br />
              <span className="text-[#F59E0B]">{c.heroTitleAccent}</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#475569] max-w-xl mb-10 leading-relaxed animate-fade-in-delay-2">
              {c.heroSubtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-delay-3">
              <Link href="/contact">
                <Button size="lg" className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#FB923C] rounded-md px-8 h-14 text-base font-bold" data-testid="button-hero-cta">
                  {c.heroCta}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/services" className="group inline-flex items-center gap-2 text-base font-semibold text-[#0F172A] px-4 py-4 hover-underline" data-testid="link-hero-services">
                See Our Services
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* About Section - Story Style */}
      <section className="py-24 px-6 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="text-[#F59E0B] font-semibold text-sm tracking-wide uppercase mb-4">{c.aboutLabel}</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              {c.aboutTitle}
              <br />
              <span className="text-white/60">{c.aboutTitleMuted}</span>
            </h2>
            <div className="space-y-6 text-lg text-white/70 leading-relaxed">
              {c.aboutParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-[#F59E0B] font-semibold text-sm tracking-wide uppercase mb-4">{c.servicesLabel}</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-4">
              {c.servicesTitle}
            </h2>
            <p className="text-xl text-[#475569] max-w-xl">
              {c.servicesSubtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => {
              const Icon = getIcon(service.icon);
              return (
              <div
                key={service.id}
                className="group p-8 border border-[#E5E7EB] rounded-lg bg-white hover:border-[#14B8A6] transition-colors duration-300"
                data-testid={`card-service-${i}`}
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] group-hover:bg-[#14B8A6] group-hover:text-white transition-colors duration-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">{service.title}</h3>
                    <p className="text-[#475569]">{service.summary}</p>
                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#F59E0B] font-semibold text-sm tracking-wide uppercase mb-4">{c.trustLabel}</p>
              <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight whitespace-pre-line">
                {c.trustTitle}
              </h2>
              <p className="text-xl text-[#475569] mb-8">
                {c.trustText}
              </p>
            </div>

            <div className="space-y-4">
              {c.trustPoints.map((point, i) => (
                <div key={i} className="flex items-start gap-4 p-5 bg-[#F9FAFB] rounded-lg border border-[#E5E7EB]" data-testid={`trust-point-${i}`}>
                  <CheckCircle className="h-6 w-6 text-[#14B8A6] shrink-0 mt-0.5" />
                  <span className="text-lg text-[#0F172A] font-medium">{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 bg-[#0F172A] text-white">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight">
            {c.ctaTitle}
            <br />
            <span className="text-[#F59E0B]">{c.ctaTitleAccent}</span>
          </h2>
          <p className="text-xl text-white/70 max-w-xl mx-auto mb-10">
            {c.ctaText}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#FB923C] rounded-md px-8 h-14 text-base font-bold" data-testid="button-cta-contact">
                {c.ctaButton}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
