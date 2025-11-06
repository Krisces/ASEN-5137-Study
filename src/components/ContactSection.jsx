import { Mail, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const ContactSection = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const team = [
    { name: "Kristin Boeckmann", email: "kristin.boeckmann@colorado.edu" },
    { name: "Alexander Cunningham", email: "alexander.cunningham@colorado.edu" },
    { name: "Zackary Bacon", email: "zackary.bacon@colorado.edu" },
    { name: "Jonathan Hale", email: "jonathan.hale@colorado.edu" },
  ];

  const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const formData = {
    name: e.target.name.value,
    email: e.target.email.value,
    message: e.target.message.value,
  };

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.message || "Failed to send message");

    toast({
      title: "Message sent!",
      description: "Thank you for your message. We'll get back to you soon.",
    });

    e.target.reset();
  } catch (err) {
    toast({
      title: "Error",
      description: err.message,
    });
  } finally {
    setIsSubmitting(false);
  }
};


  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      toast({ title: "Copied", description: `${email} copied to clipboard` });
    } catch {
      toast({ title: "Could not copy", description: "Try copying manually" });
    }
  };

  return (
    <section id="contact" className="py-16 px-4 relative bg-secondary/30 pb-20">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-3xl">
            {team.map((person) => (
              <div
                key={person.email}
                className="relative flex items-start gap-4 p-3 rounded-lg bg-card border border-input"
              >
                <div className="flex-shrink-0 p-3 rounded-full bg-primary/10">
                  <Mail className="h-6 w-6 text-primary" />
                </div>

                {/* text column gets right padding to make room for absolute button */}
                <div className="flex-1 min-w-0 pr-10">
                  <h4 className="font-medium">{person.name}</h4>
                  <a
                    href={`mailto:${person.email}`}
                    className="block text-sm text-muted-foreground hover:text-primary mt-1 truncate"
                  >
                    {person.email}
                  </a>
                </div>

                {/* absolute copy button so it doesn't affect text alignment */}
                <button
                  type="button"
                  onClick={() => copyEmail(person.email)}
                  className="absolute top-3 right-3 inline-flex items-center gap-2 text-sm px-2 py-1 rounded-md border border-transparent hover:bg-muted"
                  aria-label={`Copy ${person.email}`}
                >
                  Copy
                </button>
              </div>
            ))}
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
                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
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
                className="w-full px-4 py-3 rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                placeholder="Write your message here..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className={cn("cosmic-button w-full flex items-center justify-center gap-2")}
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
