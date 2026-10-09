import { motion } from "framer-motion";
import { ArrowRight, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useSiteData } from "@/lib/site";
import { getIcon } from "@/lib/icons";

export default function Services() {
  const { content, services } = useSiteData();
  const c = content.services;

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
            {c.title} <span className="text-primary">{c.titleAccent}</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {c.subtitle}
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300"
              >
                <div className="bg-primary/5 w-16 h-16 rounded-xl flex items-center justify-center mb-8 text-primary group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                  <Icon className="h-8 w-8" />
                </div>
                
                <h3 className="font-display font-bold text-2xl mb-4">{service.title}</h3>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {service.description}
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
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="bg-foreground text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <div className="grid grid-cols-2 gap-6">
                {c.stats.map((stat, i) => (
                  <div key={i} className="bg-white/5 p-6 rounded-2xl border border-white/10">
                    <h3 className="font-display font-bold text-3xl text-primary mb-2">{stat.value}</h3>
                    <p className="text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="order-1 lg:order-2">
              <h2 className="font-display font-bold text-3xl md:text-4xl mb-6">{c.benefitsTitle}</h2>
              <p className="text-lg text-gray-400 mb-8 leading-relaxed">
                {c.benefitsText}
              </p>
              <Link href="/contact">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg">
                  {c.benefitsCta}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
