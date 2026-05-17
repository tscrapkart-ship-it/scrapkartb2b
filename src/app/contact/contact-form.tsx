"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Loader2, CheckCircle, ArrowLeft, Send, Check } from "lucide-react";
import Link from "next/link";
import { Reveal } from "@/components/shared/reveal";

export function ContactForm() {
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
      <main className="flex-1 flex items-center justify-center py-24">
        <Reveal>
          <div className="max-w-md w-full text-center px-6">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-[var(--forest-tint)] mb-6">
              <CheckCircle className="size-7 text-[var(--forest)]" />
            </div>
            <h2 className="text-[28px] font-semibold tracking-[-0.025em]">Message sent.</h2>
            <p className="text-[15px] text-[var(--ink-2)] mt-3 leading-relaxed">
              Thanks for reaching out. Our team will get back to you within 24 hours.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 mt-7 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white px-5 py-3 rounded-[var(--radius-md)] text-[14.5px] font-medium shadow-[var(--shadow-1)] transition-colors"
            >
              <ArrowLeft className="size-4" /> Back home
            </Link>
          </div>
        </Reveal>
      </main>
    );
  }

  const inputCls =
    "h-11 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--forest)] focus:shadow-[var(--ring-forest)] transition-[border-color,box-shadow] duration-200";
  const labelCls = "text-[12.5px] font-medium text-[var(--ink-2)] mb-1.5 inline-block";

  return (
    <>
      <section className="pt-20 pb-12 md:pt-28 md:pb-16">
        <div className="container-page max-w-4xl">
          <p className="mono-caption">Talk to us</p>
          <h1 className="mt-3 text-[clamp(40px,6vw,68px)] font-semibold tracking-[var(--tracking-display)] leading-[0.98]">
            Get in <span className="italic-accent">touch.</span>
          </h1>
          <p className="mt-5 text-[17px] md:text-[18px] text-[var(--ink-2)] max-w-[600px] leading-[1.55]">
            Questions about listing, verification, or partnerships — reach us directly.
          </p>
        </div>
      </section>

      <section className="pb-[var(--section-y)] flex-1">
        <div className="container-page grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10">
          <Reveal>
            <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] shadow-[var(--shadow-1)] p-8">
              <div className="mb-7">
                <h2 className="text-[20px] font-semibold tracking-[-0.018em]">Send a message</h2>
                <p className="text-[14px] text-[var(--ink-3)] mt-1">Fill in your details — we&apos;ll respond promptly.</p>
              </div>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Name <span className="text-[var(--forest)]">*</span></label>
                    <input value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Your full name" required className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Email <span className="text-[var(--forest)]">*</span></label>
                    <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} placeholder="you@company.com" required className={inputCls} />
                  </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={labelCls}>Phone</label>
                    <input value={form.phone} onChange={(e) => update("phone", e.target.value)} placeholder="+91 98765 43210" className={inputCls} />
                  </div>
                  <div>
                    <label className={labelCls}>Subject</label>
                    <input value={form.subject} onChange={(e) => update("subject", e.target.value)} placeholder="How can we help?" className={inputCls} />
                  </div>
                </div>
                <div>
                  <label className={labelCls}>Message <span className="text-[var(--forest)]">*</span></label>
                  <textarea
                    value={form.message}
                    onChange={(e) => update("message", e.target.value)}
                    placeholder="Tell us more about your requirement..."
                    rows={5}
                    required
                    className="w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-[14.5px] text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:outline-none focus:border-[var(--forest)] focus:shadow-[var(--ring-forest)] transition-[border-color,box-shadow] duration-200 resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center justify-center gap-1.5 h-11 px-6 bg-[var(--forest)] hover:bg-[var(--forest-2)] text-white rounded-[var(--radius-md)] text-[14.5px] font-medium shadow-[var(--shadow-1)] transition-colors disabled:opacity-60"
                >
                  {loading ? <Loader2 className="size-4 animate-spin" /> : <Send className="size-4" />}
                  {loading ? "Sending..." : "Send message"}
                </button>
              </form>
            </div>
          </Reveal>

          <Reveal>
            <div className="space-y-4">
              <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper-2)] p-7">
                <h3 className="text-[16px] font-semibold tracking-[-0.015em]">Direct contact</h3>
                <ul className="mt-5 space-y-4">
                  <li>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">Email</p>
                    <p className="font-mono text-[14px] text-[var(--ink)] mt-1">support@scrapkart.in</p>
                  </li>
                  <li>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">Phone</p>
                    <p className="font-mono text-[14px] text-[var(--ink)] mt-1">+91 98765 43210</p>
                  </li>
                  <li>
                    <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)]">Location</p>
                    <p className="text-[14px] text-[var(--ink)] mt-1">Mumbai, Maharashtra, India</p>
                  </li>
                </ul>
              </div>
              <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-7">
                <h3 className="text-[16px] font-semibold tracking-[-0.015em]">Why ScrapKart</h3>
                <ul className="mt-4 space-y-3">
                  {[
                    "Verified recycler network across India",
                    "Open bidding — market-set pricing",
                    "CPCB / EPR-compliant partners",
                    "Pickup tracking with OTP verification",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-[14px] text-[var(--ink-2)] leading-relaxed">
                      <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-[var(--forest-tint)]">
                        <Check className="size-2.5 text-[var(--forest)]" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
