import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useContent } from "@/lib/site";

export default function About() {
  const c = useContent().about;

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-background py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl mb-8">
              {c.heroTitle} <span className="text-primary">{c.heroTitleAccent}</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {c.heroText}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[600px] shadow-2xl">
            <img 
              src={c.imageUrl} 
              alt={c.imageAlt} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-white font-display font-bold text-3xl md:text-5xl text-center px-4">
                {c.imageCaption}
              </h2>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display font-bold text-3xl mb-6">Our Mission</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {c.mission}
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display font-bold text-3xl mb-6">Our Vision</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {c.vision}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">{c.valuesTitle}</h2>
            <p className="text-muted-foreground">{c.valuesSubtitle}</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {c.values.map((value, i) => (
              <div key={i} className="bg-card p-8 rounded-2xl border border-border shadow-sm text-center">
                <h3 className="font-display font-bold text-xl mb-4 text-primary">{value.title}</h3>
                <p className="text-muted-foreground">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* CTA */}
      <section className="py-24 bg-primary text-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">{c.ctaTitle}</h2>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-6 text-lg font-bold shadow-lg">
              {c.ctaButton}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
