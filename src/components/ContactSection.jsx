import { Mail, Phone, MapPin, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    setIsSubmitting(true);

    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <section id="contact" className="py-16 px-4 relative bg-secondary/30">
      <div className="container mx-auto max-w-5xl">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 text-center">
          Get In <span className="text-primary">Touch</span>
        </h2>

        <p className="text-center text-muted-foreground mb-8 max-w-2xl mx-auto">
          Have any questions regarding our study? Reach out below
        </p>

        {/* Contact Info */}
        <div className="space-y-6 flex flex-col items-center mb-12">
          <h3 className="text-2xl font-semibold">Contact Information</h3>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Email</h4>
                <a
                  href="mailto:hello@gmail.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  hello@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-3 rounded-full bg-primary/10">
                <Phone className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Phone</h4>
                <a
                  href="tel:+11234567890"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  +1 (123) 456-7890
                </a>
              </div>
            </div>
          </div>
        </div>


        {/* Message Form */}
        <div className="bg-card p-8 rounded-lg shadow-xs max-w-xl mx-auto">
          <h3 className="text-2xl font-semibold mb-6 text-center">Send a Message</h3>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-2 text-left">
                Your Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
                placeholder="Your Name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2 text-left">
                Your Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium mb-2 text-left">
                Your Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-hidden focus:ring-2 focus:ring-primary resize-none"
                placeholder="Write your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn(
                "cosmic-button w-full flex items-center justify-center gap-2"
              )}
            >
              {isSubmitting ? "Sending..." : "Send Message"}
              <Send size={16} />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};
