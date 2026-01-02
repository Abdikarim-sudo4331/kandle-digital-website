import { motion } from "framer-motion";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function About() {
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
              Empowering Businesses to <span className="text-primary">Thrive Online</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Kandle Digital is a mission-driven agency dedicated to helping Kenyan and global businesses bridge the digital divide and unlock their full potential.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image Section */}
      <section className="pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl overflow-hidden h-[400px] md:h-[600px] shadow-2xl">
            {/* Unsplash: Diverse team meeting in creative office */}
            <img 
              src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=2600" 
              alt="Kandle Digital Team Meeting" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <h2 className="text-white font-display font-bold text-3xl md:text-5xl text-center px-4">
                Strategy • Creativity • Technology
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
                To provide accessible, high-impact digital marketing solutions that transform local businesses into recognized brands. We believe that every business, regardless of size, deserves a world-class online presence.
              </p>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h3 className="font-display font-bold text-3xl mb-6">Our Vision</h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                To be the most trusted digital growth partner in East Africa, known for integrity, innovation, and measurable results. We aim to set a new standard for digital excellence in the region.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Core Values</h2>
            <p className="text-muted-foreground">The principles that guide every decision we make.</p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: "Transparency", desc: "No hidden fees, no jargon. We keep you informed every step of the way." },
              { title: "Results-First", desc: "We focus on metrics that matter to your bottom line: leads and sales." },
              { title: "Innovation", desc: "We stay ahead of digital trends so your business never falls behind." },
            ].map((value, i) => (
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
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-8">Ready to work with a team that cares about your growth?</h2>
          <Link href="/contact">
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 rounded-full px-10 py-6 text-lg font-bold shadow-lg">
              Let's Talk
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
