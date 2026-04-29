"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/image-upload";
import { Check, ArrowRight, ArrowLeft, Factory, Building2, MapPin, Layers } from "lucide-react";

const WASTE_CATEGORIES = [
  "Metal",
  "E-waste",
  "Plastic",
  "Paper",
  "Glass",
  "Mixed Scrap",
  "Organic",
  "Hazardous",
];

const steps = [
  { label: "Company Info", icon: Building2 },
  { label: "Location", icon: MapPin },
  { label: "Waste Types", icon: Layers },
];

export default function ProducerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    industry_type: "",
    gst_number: "",
    contact_person: "",
    phone: "",
    description: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  useEffect(() => {
    async function fetchRole() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase.from("users").select("role").eq("id", user.id).single();
      setUserRole(data?.role ?? null);
    }
    fetchRole();
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function toggleCategory(cat: string) {
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]
    );
  }

  async function handleNext() {
    if (step === 1) {
      if (!form.name.trim() || !form.contact_person.trim() || !form.phone.trim()) {
        setError("Company name, contact person, and phone are required.");
        return;
      }
      setError(null);
      setStep(2);
    } else if (step === 2) {
      if (!form.city.trim() || !form.state.trim()) {
        setError("City and state are required.");
        return;
      }
      setError(null);
      setStep(3);
    }
  }

  async function handleSubmit() {
    if (selectedCategories.length === 0) {
      setError("Please select at least one waste category.");
      return;
    }

    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setError("Not authenticated"); setLoading(false); return; }

    // Upsert company (producer profile)
    const { error: companyError } = await supabase.from("companies").upsert({
      owner_id: user.id,
      name: form.name,
      industry_type: form.industry_type || null,
      gst_number: form.gst_number || null,
      contact_person: form.contact_person,
      phone: form.phone,
      description: form.description || null,
      logo_url: logoUrl[0] ?? null,
      address: form.address || null,
      city: form.city,
      state: form.state,
      pincode: form.pincode || null,
      waste_categories: selectedCategories,
      verification_status: "pending",
    }, { onConflict: "owner_id" });

    if (companyError) { setError(companyError.message); setLoading(false); return; }

    // If role is "both", send to recycler onboarding next
    // Otherwise, mark onboarding complete
    if (userRole === "both") {
      router.push("/onboarding/recycler");
      router.refresh();
      return;
    }

    // Mark onboarding complete
    const { error: userError } = await supabase
      .from("users")
      .update({ onboarding_completed: true })
      .eq("id", user.id);

    if (userError) { setError(userError.message); setLoading(false); return; }

    const dest = userRole === "waste_producer" || userRole === "both" ? "/dashboard" : "/marketplace";
    router.push(dest);
    router.refresh();
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="animate-slide-up delay-1">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20">
            <Factory className="h-5 w-5 text-[var(--forest)]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[var(--ink)]">Producer Onboarding</h1>
            <p className="text-sm text-[var(--ink-4)]">Set up your company profile to start listing</p>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex items-center gap-1 w-full">
          {steps.map((s, i) => {
            const StepIcon = s.icon;
            const isComplete = i + 1 < step;
            const isCurrent = i + 1 === step;

            return (
              <div key={s.label} className="flex items-center gap-1 flex-1">
                <div className="flex items-center gap-2 min-w-0">
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-sm)] text-xs font-semibold transition-all ${
                      isComplete
                        ? "bg-[var(--forest)] text-white"
                        : isCurrent
                        ? "bg-[var(--forest-tint)] border border-[var(--forest)] text-[var(--forest)]"
                        : "bg-[var(--paper-2)] border border-[var(--line)] text-[var(--ink-4)]"
                    }`}
                  >
                    {isComplete ? <Check className="h-4 w-4" /> : <StepIcon className="h-3.5 w-3.5" />}
                  </div>
                  <span className={`text-xs font-medium truncate ${
                    isCurrent ? "text-[var(--ink)]" : isComplete ? "text-[var(--ink-3)]" : "text-[var(--ink-4)]"
                  }`}>
                    {s.label}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <div className={`h-px flex-1 mx-2 transition-colors ${isComplete ? "bg-[var(--forest)]/40" : "bg-[var(--line)]"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Card */}
      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] overflow-hidden animate-slide-up delay-2">
        <div className="p-6 space-y-5">

          {/* Step 1: Company Info */}
          {step === 1 && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--ink-4)]">
                Company Details
              </p>

              <div className="space-y-2">
                <Label className="text-[var(--ink-3)] text-base">Company Name <span className="text-[var(--forest)]">*</span></Label>
                <Input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g., Acme Steel Industries"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--ink-3)] text-base">Industry Type</Label>
                <Input
                  name="industry_type"
                  value={form.industry_type}
                  onChange={handleChange}
                  placeholder="e.g., Steel Manufacturing, Electronics"
                />
              </div>

              <div className="h-px bg-[var(--line)] my-1" />
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--ink-4)]">
                Contact Information
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--ink-3)] text-base">Contact Person <span className="text-[var(--forest)]">*</span></Label>
                  <Input
                    name="contact_person"
                    value={form.contact_person}
                    onChange={handleChange}
                    placeholder="Full name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--ink-3)] text-base">Phone <span className="text-[var(--forest)]">*</span></Label>
                  <Input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--ink-3)] text-base">GST Number <span className="text-[var(--ink-4)] text-xs font-normal">(optional)</span></Label>
                <Input
                  name="gst_number"
                  value={form.gst_number}
                  onChange={handleChange}
                  placeholder="22AAAAA0000A1Z5"
                />
              </div>

              <div className="h-px bg-[var(--line)] my-1" />
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--ink-4)]">
                Additional Info
              </p>

              <div className="space-y-2">
                <Label className="text-[var(--ink-3)] text-base">Company Description <span className="text-[var(--ink-4)] text-xs font-normal">(optional)</span></Label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Brief description of your business..."
                  className="flex w-full rounded-[var(--radius-sm)] border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2.5 text-sm text-[var(--ink)] placeholder:text-[var(--ink-4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--forest)]/50 focus-visible:border-[var(--forest)]/30 transition-colors resize-none"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--ink-3)] text-base">Company Logo <span className="text-[var(--ink-4)] text-xs font-normal">(optional)</span></Label>
                <ImageUpload
                  bucket="company-logos"
                  path="logos"
                  value={logoUrl}
                  onChange={setLogoUrl}
                  maxImages={1}
                />
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-5 animate-fade-in">
              <p className="text-xs font-medium uppercase tracking-widest text-[var(--ink-4)]">
                Business Location
              </p>

              <div className="space-y-2">
                <Label className="text-[var(--ink-3)] text-base">Street Address <span className="text-[var(--ink-4)] text-xs font-normal">(optional)</span></Label>
                <Input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Building, street, area"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-[var(--ink-3)] text-base">City <span className="text-[var(--forest)]">*</span></Label>
                  <Input
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="e.g., Mumbai"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-[var(--ink-3)] text-base">State <span className="text-[var(--forest)]">*</span></Label>
                  <Input
                    name="state"
                    value={form.state}
                    onChange={handleChange}
                    placeholder="e.g., Maharashtra"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-[var(--ink-3)] text-base">Pincode <span className="text-[var(--ink-4)] text-xs font-normal">(optional)</span></Label>
                <Input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  placeholder="400001"
                  maxLength={6}
                />
              </div>
            </div>
          )}

          {/* Step 3: Waste Categories */}
          {step === 3 && (
            <div className="space-y-5 animate-fade-in">
              <div>
                <p className="text-xs font-medium uppercase tracking-widest text-[var(--ink-4)] mb-3">
                  Waste Categories
                </p>
                <h3 className="font-semibold text-[var(--ink)] text-lg">What types of waste do you generate?</h3>
                <p className="text-base text-[var(--ink-3)] mt-1">Select all that apply. This helps recyclers find your listings.</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {WASTE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategories.includes(cat);
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => toggleCategory(cat)}
                      className={`flex items-center gap-2.5 rounded-[var(--radius-sm)] px-4 py-3 text-base font-medium transition-all text-left ${
                        isSelected
                          ? "bg-[var(--forest-tint)] text-[var(--forest)] border border-[var(--forest)]/30 ring-1 ring-[var(--forest)]/20"
                          : "border border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink-3)] hover:bg-[var(--paper-3)] hover:text-[var(--ink)]"
                      }`}
                    >
                      <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded transition-all ${
                        isSelected
                          ? "bg-[var(--forest)] text-white"
                          : "border border-[var(--line)] bg-transparent"
                      }`}>
                        {isSelected && <Check className="h-3 w-3" />}
                      </div>
                      {cat}
                    </button>
                  );
                })}
              </div>
              {selectedCategories.length > 0 && (
                <p className="text-xs text-[var(--forest)] font-medium">
                  {selectedCategories.length} categor{selectedCategories.length === 1 ? "y" : "ies"} selected
                </p>
              )}
            </div>
          )}

          {error && (
            <div className="text-base text-[var(--danger)] bg-[var(--danger)]/10 border border-[var(--danger)]/30 rounded-[var(--radius-sm)] px-4 py-3 flex items-center gap-2 animate-scale-in">
              <div className="h-1.5 w-1.5 rounded-full bg-[var(--danger)] shrink-0" />
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 animate-slide-up delay-3">
        {step > 1 && (
          <Button
            variant="outline"
            onClick={() => { setError(null); setStep(step - 1); }}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
        )}

        {step < steps.length ? (
          <Button
            onClick={handleNext}
            className="flex-1 h-11"
          >
            Continue
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 h-11"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                {userRole === "both" ? "Next: Recycler Profile" : "Complete Setup"}
                <ArrowRight className="h-4 w-4 ml-1" />
              </>
            )}
          </Button>
        )}
      </div>

      {/* Step count footer */}
      <p className="text-center text-xs text-[var(--ink-4)]">
        Step {step} of {steps.length}
      </p>
    </div>
  );
}
