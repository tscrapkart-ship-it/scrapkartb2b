"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageUpload } from "@/components/shared/image-upload";
import { Pencil, Trash2, Loader2, MapPin, Save } from "lucide-react";
import type { Scrap, ScrapCategory } from "@/types";

const categories: ScrapCategory[] = [
  "Metal",
  "E-waste",
  "Plastic",
  "Paper",
  "Glass",
  "Mixed Scrap",
];
const units = ["kg", "ton", "pieces", "lots"];

export default function EditScrapPage() {
  const router = useRouter();
  const params = useParams();
  const [scrap, setScrap] = useState<Scrap | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<ScrapCategory>("Metal");

  useEffect(() => {
    async function fetchScrap() {
      const supabase = createClient();
      const { data } = await supabase
        .from("scraps")
        .select("*")
        .eq("id", params.id as string)
        .single();

      if (data) {
        setScrap(data);
        setImages(data.images ?? []);
        setSelectedCategory(data.category as ScrapCategory);
      }
      setFetching(false);
    }
    fetchScrap();
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!scrap) return;
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const { error } = await supabase
      .from("scraps")
      .update({
        title: formData.get("title") as string,
        category: selectedCategory,
        quantity: parseFloat(formData.get("quantity") as string),
        unit: formData.get("unit") as string,
        price: parseFloat(formData.get("price") as string),
        price_expectation: parseFloat(formData.get("price") as string),
        description: formData.get("description") as string,
        images,
        photos: images,
        address: formData.get("address") as string,
        city: formData.get("city") as string,
        state: formData.get("state") as string,
        pincode: formData.get("pincode") as string,
      })
      .eq("id", scrap.id);

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/scraps");
    router.refresh();
  }

  async function handleDelete() {
    if (!scrap || !confirm("Delete this listing?")) return;
    setDeleting(true);
    try {
      const supabase = createClient();
      await supabase.from("scraps").delete().eq("id", scrap.id);
      router.push("/scraps");
      router.refresh();
    } finally {
      setDeleting(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center py-20 text-[var(--ink-4)]">
        <Loader2 className="h-5 w-5 animate-spin mr-2 text-[var(--forest)]" />
        Loading...
      </div>
    );
  }

  if (!scrap) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <p className="text-[var(--ink-3)] text-base">Listing not found.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl animate-fade-in">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--forest-tint)] border border-[var(--forest)]/20">
            <Pencil className="h-5 w-5 text-[var(--forest)]" />
          </div>
          <div className="min-w-0">
            <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-[var(--ink)]">Edit Listing</h1>
            <p className="text-sm text-[var(--ink-3)] sm:text-base">Update your scrap listing details</p>
          </div>
        </div>
        <Button
          variant="destructive"
          size="sm"
          onClick={handleDelete}
          disabled={deleting}
          className="shrink-0"
        >
          {deleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Deleting...
            </>
          ) : (
            <>
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </>
          )}
        </Button>
      </div>

      <div className="rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-4 sm:p-6 shadow-[var(--shadow-1)]">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-5">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
              Listing Details
            </p>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-[var(--ink-2)] text-base">Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={scrap.title}
                required
              />
            </div>

            <div className="space-y-2.5">
              <Label className="text-[var(--ink-2)] text-base">Category *</Label>
              <input type="hidden" name="category" value={selectedCategory} />
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`rounded-[var(--radius-sm)] px-4 py-2 text-base font-medium transition-all ${
                      selectedCategory === cat
                        ? "bg-[var(--forest-tint)] text-[var(--forest)] border border-[var(--forest)]/30"
                        : "border border-[var(--line)] bg-[var(--paper-2)] text-[var(--ink-2)] hover:bg-[var(--paper-3)] hover:text-[var(--ink)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Quantity & Price */}
          <div className="space-y-5 border-t border-[var(--line)] pt-6">
            <p className="font-mono text-[10.5px] uppercase tracking-[0.1em] text-[var(--ink-3)] font-medium">
              Quantity & Price
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-[var(--ink-2)] text-base">Price (₹) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  defaultValue={scrap.price}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quantity" className="text-[var(--ink-2)] text-base">Quantity *</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  defaultValue={scrap.quantity}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit" className="text-[var(--ink-2)] text-base">Unit *</Label>
              <select
                id="unit"
                name="unit"
                defaultValue={scrap.unit}
                required
                className="flex h-11 w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2 text-base text-[var(--ink)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20"
              >
                {units.map((u) => (
                  <option key={u} value={u} className="bg-[var(--paper)] text-[var(--ink)]">
                    {u}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description & Images */}
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
                defaultValue={scrap.description ?? ""}
                className="flex w-full rounded-[var(--radius-md)] border border-[var(--line)] bg-[var(--paper-2)] px-3 py-2.5 text-base text-[var(--ink)] placeholder:text-[var(--ink-4)] focus:border-[var(--forest)] focus:outline-none focus:ring-2 focus:ring-[var(--forest)]/20 resize-none"
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

          {/* Location */}
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
                  defaultValue={scrap.address ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="city" className="text-[var(--ink-2)] text-base">City</Label>
                <Input
                  id="city"
                  name="city"
                  defaultValue={scrap.city ?? ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="state" className="text-[var(--ink-2)] text-base">State</Label>
                <Input
                  id="state"
                  name="state"
                  defaultValue={scrap.state ?? ""}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="pincode" className="text-[var(--ink-2)] text-base">Pincode</Label>
                <Input
                  id="pincode"
                  name="pincode"
                  defaultValue={scrap.pincode ?? ""}
                />
              </div>
            </div>
          </div>

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
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}
