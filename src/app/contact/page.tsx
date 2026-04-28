"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, ArrowLeft, Check, Send } from "lucide-react";
import Link from "next/link";
import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  function update(field: string, value: string) {
    setForm((p) => ({ ...p, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("contact_submissions").insert({
      name: form.name,
      email: form.email,
      phone: form.phone || null,
      subject: form.subject || null,
      message: form.message,
      status: "new",
    });
    setLoading(false);
    if (!error) setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--paper)] flex flex-col">
        <MarketingNav />
        <main className="flex-1 flex items-center justify-center py-24">
          <div className="max-w-md w-full text-center px-6">
            <div className="mx-auto flex h-20 w-20 items-center justify-center border-2 border-[var(--ink)] bg-[var(--cat-paper)] shadow-hard mb-6">
              <CheckCircle className="h-10 w-10 text-[var(--green-deep)]" />
            </div>
            <h2 className="font-display text-3xl uppercase">Message sent.</h2>
            <p className="text-[var(--ink-2)] mt-3 leading-relaxed">
              Thanks for reaching out. Our team will get back to you within 24 hours.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-8 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] px-6 py-3 font-display text-sm uppercase tracking-[0.06em] shadow-green press-in-green"
            >
              <ArrowLeft className="h-4 w-4" />
              Back home
            </Link>
          </div>
        </main>
        <MarketingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />

      {/* Hero block */}
      <section className="border-b-2 border-[var(--ink)] py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-display text-4xl md:text-6xl uppercase">
            Get in{" "}
            <em
              className="font-serif-italic text-[var(--green-deep)]"
              style={{ fontStyle: "italic" }}
            >
              touch.
            </em>
          </h1>
          <p className="text-base md:text-lg mt-5 max-w-xl text-[var(--ink-2)]">
            Questions about listing, verification, or partnerships — reach us directly.
          </p>
        </div>
      </section>

      {/* Form + info */}
      <section className="py-16 flex-1">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-10">

          {/* Contact Form */}
          <div className="border-2 border-[var(--ink)] bg-[var(--paper)] shadow-hard p-8">
            <div className="mb-8">
              <h2 className="font-display text-xl uppercase">Send a message</h2>
              <p className="text-sm text-[var(--ink-3)] mt-1">
                Fill in the details below and we&apos;ll respond promptly.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                    Name <span className="text-[var(--green-deep)]">*</span>
                  </label>
                  <input
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Your full name"
                    required
                    className="h-11 w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--green)] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                    Email <span className="text-[var(--green-deep)]">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="you@company.com"
                    required
                    className="h-11 w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--green)] transition-colors"
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                    Phone
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    placeholder="+91 98765 43210"
                    className="h-11 w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--green)] transition-colors"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                    Subject
                  </label>
                  <input
                    value={form.subject}
                    onChange={(e) => update("subject", e.target.value)}
                    placeholder="How can we help?"
                    className="h-11 w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--green)] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">
                  Message <span className="text-[var(--green-deep)]">*</span>
                </label>
                <textarea
                  value={form.message}
                  onChange={(e) => update("message", e.target.value)}
                  placeholder="Tell us more about your requirement..."
                  rows={5}
                  required
                  className="w-full border-2 border-[var(--ink)] bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--green)] transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 h-11 px-8 border-2 border-[var(--ink)] bg-[var(--ink)] text-[var(--paper)] font-display text-sm uppercase tracking-[0.06em] shadow-green press-in-green disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                {loading ? "Sending..." : "Send message"}
              </button>
            </form>
          </div>

          {/* Info card */}
          <div className="space-y-0">
            <div className="border-2 border-[var(--ink)] bg-[var(--cat-mixed)] shadow-hard p-8">
              <h3 className="font-display text-lg uppercase">Direct contact</h3>
              <ul className="mt-6 space-y-4 font-mono text-sm text-[var(--ink-2)]">
                <li className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">Email</span>
                  <span>support@scrapkart.in</span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">Phone</span>
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex flex-col gap-0.5">
                  <span className="text-[10px] uppercase tracking-[0.14em] text-[var(--ink-3)]">Location</span>
                  <span>Mumbai, Maharashtra, India</span>
                </li>
              </ul>
            </div>

            {/* Why ScrapKart — adapted from existing */}
            <div className="border-2 border-t-0 border-[var(--ink)] bg-[var(--paper)] p-8">
              <h3 className="font-display text-base uppercase">Why ScrapKart?</h3>
              <ul className="mt-5 space-y-3">
                {[
                  "Verified recycler network across India",
                  "Competitive bidding — get the best price",
                  "Compliance-first (CPCB, EPR certified partners)",
                  "End-to-end pickup tracking with OTP verification",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-[var(--ink-2)]">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center border-2 border-[var(--green-deep)] bg-[var(--green-tint)]">
                      <Check className="h-3 w-3 text-[var(--green-deep)]" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <MarketingFooter />
    </div>
  );
}
