"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export function VerifyRecyclerButton({
  profileId,
  userId,
}: {
  profileId: string;
  userId: string;
}) {
  const [loading, setLoading] = useState<"verify" | "reject" | null>(null);
  const [done, setDone] = useState<"verified" | "rejected" | null>(null);

  async function handle(action: "verify" | "reject") {
    setLoading(action);
    const supabase = createClient();
    const status = action === "verify" ? "verified" : "rejected";

    const { error } = await supabase
      .from("recycler_profiles")
      .update({
        verification_status: status,
        verified_at: action === "verify" ? new Date().toISOString() : null,
      })
      .eq("id", profileId);

    // Also approve the user if verifying
    if (!error && action === "verify") {
      await supabase.from("users").update({ is_approved: true }).eq("id", userId);
    }

    setLoading(null);
    if (error) {
      toast.error(error.message);
    } else {
      toast.success(action === "verify" ? "Recycler verified!" : "Recycler rejected.");
      setDone(status as "verified" | "rejected");
    }
  }

  if (done) {
    return (
      <span className={`flex items-center gap-1 text-xs ${done === "verified" ? "text-[var(--forest)]" : "text-[var(--danger)]"}`}>
        {done === "verified" ? <CheckCircle className="h-3.5 w-3.5" /> : <XCircle className="h-3.5 w-3.5" />}
        {done}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={() => handle("verify")}
        disabled={loading !== null}
      >
        {loading === "verify" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><CheckCircle className="h-3.5 w-3.5 mr-1" />Verify</>}
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handle("reject")}
        disabled={loading !== null}
      >
        {loading === "reject" ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <><XCircle className="h-3.5 w-3.5 mr-1" />Reject</>}
      </Button>
    </div>
  );
}
