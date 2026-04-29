"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/image-upload";
import { Building2, MapPin, Loader2 } from "lucide-react";

export default function CompanySetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string[]>([]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("companies").insert({
      owner_id: user.id,
      name: formData.get("name") as string,
      industry_type: formData.get("industry_type") as string,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      description: formData.get("description") as string,
      logo_url: logoUrl[0] || null,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20">
          <Building2 className="h-5 w-5 text-[var(--forest)]" />
        </div>
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Set Up Your Company</h1>
          <p className="text-base text-[var(--ink-3)]">Create your company profile to start posting listings.</p>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-6 shadow-[var(--shadow-1)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
              Company Information
            </p>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-[var(--ink-2)] text-base">Company Name *</Label>
              <Input
                id="name"
                name="name"
                required
                placeholder="Your company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="industry_type" className="text-[var(--ink-2)] text-base">Industry Type</Label>
              <Input
                id="industry_type"
                name="industry_type"
                placeholder="e.g., Manufacturing, Construction"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--ink-2)] text-base">Company Logo</Label>
              <ImageUpload
                bucket="company-logos"
                path="logos"
                value={logoUrl}
                onChange={setLogoUrl}
                maxImages={1}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[var(--ink-2)] text-base">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2.5 text-base text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20 resize-none"
                placeholder="Brief description of your company"
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-5 border-t border-[var(--line)] pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[var(--ink-4)]" />
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
                Location
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="address" className="text-[var(--ink-2)] text-base">Address</Label>
                <Input
                  id="address"
                  name="address"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[var(--ink-2)] text-base">City</Label>
                <Input
                  id="city"
                  name="city"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-[var(--ink-2)] text-base">State</Label>
                <Input
                  id="state"
                  name="state"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-[var(--ink-2)] text-base">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  maxLength={6}
                />
              </div>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-[var(--radius-sm)] border border-[var(--danger)]/30 bg-[var(--danger)]/10 px-4 py-3 text-base text-[var(--danger)]">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Company"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
