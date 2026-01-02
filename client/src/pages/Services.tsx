import { motion } from "framer-motion";
import { ArrowRight, BarChart, Globe, Layout, Search, Megaphone, PenTool, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const services = [
  {
    icon: Layout,
    title: "Digital Strategy",
    desc: "A comprehensive roadmap for your digital success. We analyze your market, competitors, and audience to build a winning plan.",
    features: ["Market Analysis", "Competitor Research", "Brand Positioning", "Growth Roadmap"]
  },
  {
    icon: Search,
    title: "SEO & Local SEO",
    desc: "Get found when it matters most. We optimize your online presence to rank higher on Google and attract local customers.",
    features: ["Keyword Research", "On-Page Optimization", "Google Business Profile", "Link Building"]
  },
  {
    icon: Megaphone,
    title: "Paid Advertising",
    desc: "Instant traffic and leads. We manage high-converting campaigns on Google Ads, Facebook, and Instagram.",
    features: ["Google Search Ads", "Meta (FB/Insta) Ads", "Retargeting", "Ad Creative & Copy"]
  },
  {
    icon: Globe,
    title: "Web Design & Dev",
    desc: "Your 24/7 salesperson. We build fast, mobile-responsive websites designed to convert visitors into paying customers.",
    features: ["Custom Design", "Mobile Responsive", "Conversion Optimization", "Fast Loading Speed"]
  },
  {
    icon: PenTool,
    title: "Social Media Management",
    desc: "Build a community around your brand. We create engaging content and manage your profiles to build loyalty.",
    features: ["Content Calendar", "Community Management", "Visual Design", "Monthly Reporting"]
  },
  {
    icon: BarChart,
    title: "Google Business Profile",
    desc: "Essential for local businesses. We optimize your GMB listing to capture customers searching for services nearby.",
    features: ["Profile Setup", "Review Management", "Post Updates", "Local Insights"]
  }
];

export default function Services() {
  return (
    <div className="pt-20">
      {/* Header */}
      <section className="bg-muted/30 py-20 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-6"
          >
            Our <span className="text-primary">Expertise</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            Comprehensive digital marketing solutions designed to help Kenyan businesses grow, scale, and succeed online.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <service.icon className="h-8 w-8" />
                </div>
                
                <h3 className="font-display font-bold text-2xl mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {service.desc}
                </p>
                
                <div className="space-y-3 mb-8">
                  {service.features.map((feature, i) => (
                    <div key={i} className="flex items-center text-sm font-medium text-foreground/80">
                      <CheckCircle className="h-4 w-4 text-primary mr-3" />
                      {feature}
                    </div>
                  ))}
                </div>

                <Link href="/contact">
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-foreground text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="font-display font-bold text-3xl text-primary mb-2">50+</h3>
                  <p className="text-gray-400">Happy Clients</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="font-display font-bold text-3xl text-primary mb-2">300%</h3>
                  <p className="text-gray-400">Avg. ROI</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="font-display font-bold text-3xl text-primary mb-2">4+</h3>
                  <p className="text-gray-400">Years Experience</p>
                </div>
                <div className="bg-white/5 p-6 rounded-2xl border border-white/10">
                  <h3 className="font-display font-bold text-3xl text-primary mb-2">24/7</h3>
                  <p className="text-gray-400">Support</p>
                </div>
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">Ideal for SMEs & Growing Brands</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                We understand the unique challenges of the Kenyan market. Our services are tailored to maximize your budget and deliver tangible growth, whether you're a local startup or an established enterprise.
              </p>
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg">
                  Schedule Your Free Audit
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
