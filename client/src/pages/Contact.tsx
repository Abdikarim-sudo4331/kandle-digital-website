import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertContactInquirySchema } from "@shared/schema";
import { useContact } from "@/hooks/use-contact";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { MapPin, Mail, Phone, MessageSquare } from "lucide-react";
import { useContent, whatsappLink } from "@/lib/site";

// Same schema the API validates against
const contactSchema = insertContactInquirySchema;

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
  const { mutate: sendMessage, isPending } = useContact();
  const content = useContent();
  const c = content.contact;
  const g = content.global;
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    sendMessage(data, {
      onSuccess: () => form.reset()
    });
  };

  return (
    <div className="pt-20">
      <section className="bg-foreground text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display font-bold text-4xl md:text-5xl mb-6">{c.title}</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            {c.subtitle}
          </p>
        </div>
      </section>

      <section className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Contact Info */}
            <div className="space-y-10">
              <div>
                <h3 className="font-display font-bold text-2xl mb-6">{c.introTitle}</h3>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {c.introText}
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Location</h4>
                    <p className="text-muted-foreground">{g.location}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Email</h4>
                    <p className="text-muted-foreground">{g.email}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground">Phone</h4>
                    <p className="text-muted-foreground">{g.phoneDisplay}</p>
                  </div>
                </div>
              </div>

              {/* WhatsApp Button */}
              <a 
                href={whatsappLink(g.whatsappNumber)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="block"
              >
                <div className="bg-[#25D366] text-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center justify-center space-x-3 cursor-pointer">
                  <MessageSquare className="h-6 w-6" />
                  <span className="font-bold text-lg">Chat on WhatsApp</span>
                </div>
              </a>
            </div>

            {/* Form */}
            <div className="bg-card p-8 md:p-10 rounded-3xl border border-border shadow-lg">
              <h3 className="font-display font-bold text-2xl mb-6">Send a Message</h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" className="h-12 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input placeholder="john@company.com" className="h-12 rounded-xl" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How can we help?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us about your project..." 
                            className="min-h-[150px] rounded-xl resize-none" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full h-12 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25"
                    disabled={isPending}
                  >
                    {isPending ? "Sending..." : "Send Message"}
                  </Button>
                </form>
              </Form>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
