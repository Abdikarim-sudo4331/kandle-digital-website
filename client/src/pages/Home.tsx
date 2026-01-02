import { Link } from "wouter";
import { ArrowRight, Search, Target, Share2, Globe, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const services = [
  { 
    icon: Search, 
    title: "SEO That Ranks", 
    desc: "Get found by customers actively searching for what you offer.",
  },
  { 
    icon: Target, 
    title: "Google Ads That Convert", 
    desc: "Stop wasting ad spend. We build campaigns that drive real sales.",
  },
  { 
    icon: Share2, 
    title: "Social Media That Sells", 
    desc: "Build a presence that turns followers into paying customers.",
  },
  { 
    icon: Globe, 
    title: "Websites That Work", 
    desc: "Fast, mobile-first sites designed to convert visitors.",
  },
];

const trustPoints = [
  "Trusted by Kenyan SMEs and growing businesses",
  "Transparent pricing with no hidden fees",
  "MPESA-friendly payment options",
  "Results you can measure, not just promises",
];

export default function Home() {
  return (
    <div className="bg-background text-foreground overflow-hidden">
      {/* Hero Section - Editorial Left-Aligned */}
      <section className="min-h-screen flex items-center px-6 pt-28 pb-16 md:pb-0 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto w-full">
          <div className="max-w-3xl">
            <p className="text-[#F59E0B] font-semibold text-sm tracking-wide uppercase mb-6 animate-fade-in" data-testid="text-hero-label">
              Digital Marketing Agency
            </p>
            
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold text-[#0F172A] leading-[0.95] tracking-tight mb-8 animate-fade-in-delay-1">
              Less Noise.
              <br />
              <span className="text-[#F59E0B]">More Results.</span>
            </h1>

            <p className="text-xl md:text-2xl text-[#475569] max-w-xl mb-10 leading-relaxed animate-fade-in-delay-2">
              Kandle Digital helps businesses grow using data-driven SEO, paid ads, and smart digital strategy.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-4 animate-fade-in-delay-3">
              <Link href="/contact">
                <Button size="lg" className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#FB923C] rounded-md px-8 h-14 text-base font-bold" data-testid="button-hero-cta">
                  Get a Free Growth Plan
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
            <p className="text-[#F59E0B] font-semibold text-sm tracking-wide uppercase mb-4">About Us</p>
            <h2 className="text-3xl md:text-5xl font-bold mb-8 leading-tight">
              We don't do fluff.
              <br />
              <span className="text-white/60">We do results.</span>
            </h2>
            <div className="space-y-6 text-lg text-white/70 leading-relaxed">
              <p>
                Kandle Digital was founded with one simple belief: marketing should make money, not waste it.
              </p>
              <p>
                We've seen too many businesses burn cash on agencies that deliver reports instead of revenue. That's not us. Every strategy we build, every ad we run, every page we optimize is designed with one goal — <span className="text-white font-medium">growth you can see in your bottom line.</span>
              </p>
              <p>
                Based in Nairobi, we work with ambitious businesses across Kenya who are ready to scale. No buzzwords. No vanity metrics. Just honest work that moves the needle.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-24 px-6 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <p className="text-[#F59E0B] font-semibold text-sm tracking-wide uppercase mb-4">What We Do</p>
            <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-4">
              Services built for growth
            </h2>
            <p className="text-xl text-[#475569] max-w-xl">
              We focus on what actually moves the needle for your business.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {services.map((service, i) => (
              <div
                key={i}
                className="group p-8 border border-[#E5E7EB] rounded-lg bg-white hover:border-[#14B8A6] transition-colors duration-300"
                data-testid={`card-service-${i}`}
              >
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] group-hover:bg-[#14B8A6] group-hover:text-white transition-colors duration-300">
                    <service.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#0F172A] mb-2">{service.title}</h3>
                    <p className="text-[#475569]">{service.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[#F59E0B] font-semibold text-sm tracking-wide uppercase mb-4">Why Kandle</p>
              <h2 className="text-3xl md:text-5xl font-bold text-[#0F172A] mb-6 leading-tight">
                Built for
                <br />
                Kenyan businesses
              </h2>
              <p className="text-xl text-[#475569] mb-8">
                We understand the local market because we're part of it. From Nairobi to Mombasa, we help businesses compete and win.
              </p>
            </div>

            <div className="space-y-4">
              {trustPoints.map((point, i) => (
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
            Ready to grow?
            <br />
            <span className="text-[#F59E0B]">Let's talk.</span>
          </h2>
          <p className="text-xl text-white/70 max-w-xl mx-auto mb-10">
            Get a free audit of your digital presence and a custom growth plan — no strings attached.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#FB923C] rounded-md px-8 h-14 text-base font-bold" data-testid="button-cta-contact">
                Get Your Free Growth Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
