"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/image-upload";
import { PackagePlus, Loader2, MapPin, Info } from "lucide-react";
import type { ScrapCategory } from "@/types";

const categories: ScrapCategory[] = [
  "Metal",
  "E-waste",
  "Plastic",
  "Paper",
  "Glass",
  "Mixed Scrap",
];

const SUB_TYPES: Record<ScrapCategory, string[]> = {
  Metal: ["HMS Grade A", "HMS Grade B", "Aluminium", "Copper", "Stainless Steel", "Iron", "Other"],
  "E-waste": ["Computers / Laptops", "Phones", "Circuit Boards", "Batteries", "Cables", "Other"],
  Plastic: ["PET", "HDPE", "PVC", "PP", "PS", "Mixed", "Other"],
  Paper: ["OCC Cardboard", "Newspaper", "Office Paper", "Mixed Paper", "Books", "Other"],
  Glass: ["Clear Glass", "Coloured Glass", "Mixed Glass", "Other"],
  "Mixed Scrap": ["Industrial Mixed", "Commercial Mixed", "Other"],
};

const units = ["kg", "ton", "pieces", "lots"];

export default function NewScrapPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<ScrapCategory>("Metal");
  const [selectedSubType, setSelectedSubType] = useState<string>("");

  useEffect(() => {
    async function fetchCompany() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from("companies")
        .select("id")
        .eq("owner_id", user.id)
        .single();
      if (data) setCompanyId(data.id);
    }
    fetchCompany();
  }, []);

  function handleCategoryChange(cat: ScrapCategory) {
    setSelectedCategory(cat);
    setSelectedSubType("");
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!companyId) {
      setError("Please set up your company profile first.");
      setLoading(false);
      return;
    }

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError("Not authenticated");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("scraps").insert({
      seller_id: user.id,
      company_id: companyId,
      title: formData.get("title") as string,
      category: selectedCategory,
      sub_type: selectedSubType || null,
      quantity: parseFloat(formData.get("quantity") as string),
      unit: formData.get("unit") as string,
      price: parseFloat(formData.get("price_expectation") as string) || 0,
      price_expectation: parseFloat(formData.get("price_expectation") as string) || null,
      description: formData.get("description") as string,
      images,
      photos: images,
      address: formData.get("address") as string,
      city: formData.get("city") as string,
      state: formData.get("state") as string,
      pincode: formData.get("pincode") as string,
      status: "live",
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
      return;
    }

    router.push("/scraps");
    router.refresh();
  }

  if (companyId === null) {
    return (
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-8 flex items-center justify-center gap-3 shadow-[var(--shadow-1)]">
          <Loader2 className="h-5 w-5 animate-spin text-[var(--forest)]" />
          <p className="text-[var(--ink-3)] text-base">Loading company info...</p>
        </div>
      </div>
    );
  }

  if (companyId === undefined) {
    return (
      <div className="mx-auto max-w-2xl animate-fade-in">
        <div className="rounded-[var(--radius-lg)] border border-[var(--warning)]/30 bg-[var(--warning)]/5 p-8 text-center">
          <p className="text-[var(--warning)] font-semibold text-lg">Company profile required</p>
          <p className="text-base text-[var(--ink-3)] mt-1">Set up your company before posting listings.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20">
          <PackagePlus className="h-5 w-5 text-[var(--forest)]" />
        </div>
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">New Scrap Listing</h1>
          <p className="text-base text-[var(--ink-3)]">Recyclers will bid on your listing.</p>
        </div>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-6 shadow-[var(--shadow-1)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section: Basic Info */}
          <div className="space-y-5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
              Listing Details
            </p>

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-[var(--ink-2)] text-base">Listing Title *</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g., 500kg HMS Grade A Steel Scrap"
                required
              />
            </div>

            {/* Category */}
            <div className="space-y-2.5">
              <Label className="text-[var(--ink-2)] text-base">Category *</Label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategoryChange(cat)}
                    className={`rounded-[var(--radius-sm)] px-4 py-2 text-base font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-[var(--forest)] text-white"
                        : "border border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink-2)] hover:bg-[var(--paper-3)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-type */}
            <div className="space-y-2.5">
              <Label className="text-[var(--ink-2)] text-base">
                Sub-type <span className="text-[var(--ink-4)]">(optional)</span>
              </Label>
              <div className="flex flex-wrap gap-2">
                {SUB_TYPES[selectedCategory].map((sub) => (
                  <button
                    key={sub}
                    type="button"
                    onClick={() => setSelectedSubType(sub === selectedSubType ? "" : sub)}
                    className={`rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-all ${
                      selectedSubType === sub
                        ? "bg-[var(--forest-tint)] text-[var(--forest)] border border-[var(--forest)]/30"
                        : "border border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink-3)] hover:bg-[var(--paper-3)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: Quantity & Price */}
          <div className="space-y-5 border-t border-[var(--line)] pt-6">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
              Quantity & Price
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-[var(--ink-2)] text-base">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit" className="text-[var(--ink-2)] text-base">Unit *</Label>
                <select
                  id="unit"
                  name="unit"
                  required
                  className="flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2 text-base text-[var(--ink)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20"
                >
                  {units.map((u) => (
                    <option key={u} value={u} className="bg-[var(--paper)] text-[var(--ink)]">{u}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price_expectation" className="text-[var(--ink-2)] text-base">
                Expected Price (₹)
              </Label>
              <Input
                id="price_expectation"
                name="price_expectation"
                type="number"
                min="0"
                step="1"
                placeholder="Recyclers will bid against this"
              />
              <p className="flex items-center gap-1.5 text-sm text-[var(--ink-4)]">
                <Info className="h-3 w-3" />
                This is a reference price. Recyclers submit their own bid offers.
              </p>
            </div>
          </div>

          {/* Section: Description & Images */}
          <div className="space-y-5 border-t border-[var(--line)] pt-6">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
              Description & Images
            </p>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[var(--ink-2)] text-base">Description</Label>
              <textarea
                id="description"
                name="description"
                rows={3}
                className="flex w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2.5 text-base text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20 resize-none"
                placeholder="Condition, grade, any relevant details..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-[var(--ink-2)] text-base">Images</Label>
              <ImageUpload
                bucket="scrap-images"
                path="scraps"
                value={images}
                onChange={setImages}
                maxImages={5}
              />
            </div>
          </div>

          {/* Section: Location */}
          <div className="space-y-5 border-t border-[var(--line)] pt-6">
            <div className="flex items-center gap-2">
              <MapPin className="h-3.5 w-3.5 text-[var(--ink-4)]" />
              <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
                Pickup Location
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
                <Label htmlFor="city" className="text-[var(--ink-2)] text-base">City *</Label>
                <Input
                  id="city"
                  name="city"
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-[var(--ink-2)] text-base">State *</Label>
                <Input
                  id="state"
                  name="state"
                  required
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

          {/* Submit */}
          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Listing"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
