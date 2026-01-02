import { Link } from "wouter";
import { MessageCircle, Mail, Phone } from "lucide-react";
import logoImage from "@assets/Logo_1767358730163.jpeg";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-16 px-6 bg-[#0F172A] text-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Logo & Tagline */}
          <div>
            <Link href="/" data-testid="link-footer-logo" className="block mb-6">
              <img 
                src={logoImage} 
                alt="Kandle Digital" 
                className="h-14 w-auto object-contain"
              />
            </Link>
            <p className="text-white/60 leading-relaxed">
              Less noise. More results.
              <br />
              Digital marketing that actually works.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 text-white/80">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/" className="text-white/60 hover:text-[#F59E0B] transition-colors" data-testid="link-footer-home">Home</Link></li>
              <li><Link href="/services" className="text-white/60 hover:text-[#F59E0B] transition-colors" data-testid="link-footer-services">Services</Link></li>
              <li><Link href="/about" className="text-white/60 hover:text-[#F59E0B] transition-colors" data-testid="link-footer-about">About Us</Link></li>
              <li><Link href="/contact" className="text-white/60 hover:text-[#F59E0B] transition-colors" data-testid="link-footer-contact">Contact</Link></li>
            </ul>
          </div>

          {/* Contact - WhatsApp & Email Emphasis */}
          <div>
            <h4 className="font-bold mb-4 text-white/80">Get in Touch</h4>
            <div className="space-y-4">
              <a 
                href="https://wa.me/254700000000" 
                className="flex items-center gap-3 text-white/60 hover:text-[#14B8A6] transition-colors group"
                data-testid="link-footer-whatsapp"
              >
                <div className="p-2 rounded-lg bg-[#14B8A6]/10 text-[#14B8A6] group-hover:bg-[#14B8A6]/20 transition-colors">
                  <MessageCircle className="h-5 w-5" />
                </div>
                <span>WhatsApp Us</span>
              </a>
              <a 
                href="mailto:hello@kandledigital.com" 
                className="flex items-center gap-3 text-white/60 hover:text-[#14B8A6] transition-colors group"
                data-testid="link-footer-email"
              >
                <div className="p-2 rounded-lg bg-[#1E40AF]/10 text-[#1E40AF] group-hover:bg-[#1E40AF]/20 transition-colors">
                  <Mail className="h-5 w-5" />
                </div>
                <span>hello@kandledigital.com</span>
              </a>
              <a 
                href="tel:+254700000000" 
                className="flex items-center gap-3 text-white/60 hover:text-[#14B8A6] transition-colors group"
                data-testid="link-footer-phone"
              >
                <div className="p-2 rounded-lg bg-[#1E40AF]/10 text-[#1E40AF] group-hover:bg-[#1E40AF]/20 transition-colors">
                  <Phone className="h-5 w-5" />
                </div>
                <span>+254 700 000 000</span>
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-white/40">
            © {currentYear} Kandle Digital. All rights reserved.
          </p>
          <p className="text-sm text-white/40">
            Nairobi, Kenya
          </p>
        </div>
      </div>
    </footer>
  );
}
