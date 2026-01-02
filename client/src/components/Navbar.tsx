import { Link, useLocation } from "wouter";
import { useState, useRef, useEffect } from "react";
import { Menu, X, Search, Target, Share2, Globe, ChevronDown, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import logoImage from "@assets/Logo_1767358730163.jpeg";

const services = [
  { icon: Search, title: "SEO Optimization", desc: "Get found on Google", href: "/services" },
  { icon: Target, title: "Google Ads", desc: "Ads that convert", href: "/services" },
  { icon: Share2, title: "Social Media", desc: "Build your presence", href: "/services" },
  { icon: Globe, title: "Web Development", desc: "Sites that work", href: "/services" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [location] = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const links = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setServicesOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed top-0 w-full z-50 bg-[#F9FAFB] border-b border-[#E5E7EB]">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center shrink-0" data-testid="link-logo">
          <img 
            src={logoImage} 
            alt="Kandle Digital" 
            className="h-12 md:h-14 w-auto object-contain"
          />
        </Link>
        
        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-1">
          {links.slice(0, 1).map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                location === link.href 
                  ? "text-[#1E40AF]" 
                  : "text-[#0F172A] hover:text-[#1E40AF]"
              }`}
              data-testid={`link-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}

          {/* Services Dropdown */}
          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setServicesOpen(!servicesOpen)}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors inline-flex items-center gap-1 ${
                location === "/services" || servicesOpen
                  ? "text-[#1E40AF]" 
                  : "text-[#0F172A] hover:text-[#1E40AF]"
              }`}
              data-testid="button-nav-services"
            >
              Services
              <ChevronDown className={`h-4 w-4 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
            </button>

            {/* Dropdown Panel */}
            {servicesOpen && (
              <div className="absolute top-full left-0 mt-2 w-[320px] bg-white border border-border rounded-lg shadow-xl p-4 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-1">
                  {services.map((service, i) => (
                    <Link
                      key={i}
                      href={service.href}
                      onClick={() => setServicesOpen(false)}
                      className="flex items-center gap-4 p-3 rounded-md hover:bg-[hsl(222,47%,11%)]/5 transition-colors group"
                      data-testid={`link-dropdown-service-${i}`}
                    >
                      <div className="p-2 rounded-md bg-[#14B8A6]/10 text-[#14B8A6] group-hover:bg-[#14B8A6] group-hover:text-white transition-colors">
                        <service.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[hsl(222,47%,11%)]">{service.title}</p>
                        <p className="text-xs text-[hsl(215,19%,35%)]">{service.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Dropdown Footer */}
                <div className="mt-4 pt-4 border-t border-border">
                  <Link 
                    href="/contact" 
                    onClick={() => setServicesOpen(false)}
                    className="flex items-center justify-between p-3 rounded-md bg-[hsl(222,47%,11%)]/5 hover:bg-[hsl(222,47%,11%)]/10 transition-colors"
                    data-testid="link-dropdown-contact"
                  >
                    <span className="text-sm font-semibold text-[hsl(222,47%,11%)]">Need a custom solution?</span>
                    <ArrowRight className="h-4 w-4 text-[hsl(40,96%,53%)]" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          {links.slice(1).map((link) => (
            <Link 
              key={link.href} 
              href={link.href}
              className={`px-5 py-2 rounded-md text-sm font-semibold transition-colors ${
                location === link.href 
                  ? "text-[#1E40AF]" 
                  : "text-[#0F172A] hover:text-[#1E40AF]"
              }`}
              data-testid={`link-nav-${link.label.toLowerCase()}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center">
          <Link href="/contact">
            <Button className="bg-[#F59E0B] text-[#0F172A] hover:bg-[#FB923C] rounded-md px-6 h-10 text-sm font-bold" data-testid="button-nav-cta">
              Get Started
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-[hsl(222,47%,11%)] p-2 focus:outline-none"
            data-testid="button-mobile-menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="lg:hidden bg-[#F9FAFB] border-b border-[#E5E7EB] animate-in slide-in-from-top-5 fade-in duration-200">
          <div className="px-6 pt-2 pb-6 space-y-1">
            <Link 
              href="/"
              onClick={() => setIsOpen(false)}
              className={`block py-3 px-4 rounded-md text-base font-semibold transition-colors ${
                location === "/" 
                  ? "text-[#1E40AF]" 
                  : "text-[#0F172A] hover:text-[#1E40AF]"
              }`}
              data-testid="link-mobile-home"
            >
              Home
            </Link>

            {/* Mobile Services Accordion */}
            <div>
              <button
                onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                className={`w-full flex items-center justify-between py-3 px-4 rounded-md text-base font-semibold transition-colors ${
                  location === "/services" 
                    ? "text-[#1E40AF]" 
                    : "text-[#0F172A] hover:text-[#1E40AF]"
                }`}
                data-testid="button-mobile-services"
              >
                Services
                <ChevronDown className={`h-5 w-5 transition-transform ${mobileServicesOpen ? "rotate-180" : ""}`} />
              </button>
              
              {mobileServicesOpen && (
                <div className="mt-1 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-150">
                  {services.map((service, i) => (
                    <Link
                      key={i}
                      href={service.href}
                      onClick={() => { setIsOpen(false); setMobileServicesOpen(false); }}
                      className="flex items-center gap-3 py-3 px-4 rounded-md text-sm text-[#475569] hover:text-[#0F172A] transition-colors"
                      data-testid={`link-mobile-service-${i}`}
                    >
                      <service.icon className="h-4 w-4 text-[#14B8A6]" />
                      {service.title}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Link 
              href="/about"
              onClick={() => setIsOpen(false)}
              className={`block py-3 px-4 rounded-md text-base font-semibold transition-colors ${
                location === "/about" 
                  ? "text-[#1E40AF]" 
                  : "text-[#0F172A] hover:text-[#1E40AF]"
              }`}
              data-testid="link-mobile-about"
            >
              About
            </Link>

            <Link 
              href="/contact"
              onClick={() => setIsOpen(false)}
              className={`block py-3 px-4 rounded-md text-base font-semibold transition-colors ${
                location === "/contact" 
                  ? "text-[#1E40AF]" 
                  : "text-[#0F172A] hover:text-[#1E40AF]"
              }`}
              data-testid="link-mobile-contact"
            >
              Contact
            </Link>

            <div className="pt-4">
              <Link href="/contact" onClick={() => setIsOpen(false)}>
                <Button className="w-full bg-[#F59E0B] text-[#0F172A] hover:bg-[#FB923C] rounded-md font-bold text-base py-5" data-testid="button-mobile-cta">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
