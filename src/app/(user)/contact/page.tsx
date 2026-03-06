import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us - Cyfotok Academy",
  description:
    "Get in touch with Cyfotok Academy for course inquiries, partnerships, or support.",
};

export default function ContactPage() {
  return (
    <main className="mt-28 mx-6 max-md:mx-3">
      <section className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-muted-foreground mb-8">
          Have questions about our courses, partnerships, or need support? Fill
          out the form below and our team will get back to you shortly.
        </p>

        <form
          className="space-y-6 bg-card border border-border rounded-xl p-6 md:p-8"
          action="https://formspree.io/f/mayzpgzr"
          method="POST"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="subject" className="text-sm font-medium">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              required
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="message" className="text-sm font-medium">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            Send Message
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Prefer email? Reach us at{" "}
          <Link
            href="mailto:info@cyfotok.com"
            className="text-blue-500 hover:underline"
          >
            info@cyfotok.com
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

