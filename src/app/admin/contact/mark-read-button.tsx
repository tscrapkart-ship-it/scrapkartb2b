"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Loader2, CheckCheck } from "lucide-react";
import { toast } from "sonner";

export function MarkReadButton({ submissionId }: { submissionId: string }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleMarkRead() {
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase
      .from("contact_submissions")
      .update({ status: "read", read_at: new Date().toISOString() })
      .eq("id", submissionId);

    setLoading(false);
    if (error) {
      toast.error(error.message);
    } else {
      setDone(true);
    }
  }

  if (done) return <CheckCheck className="h-4 w-4 text-[var(--forest)]" />;

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleMarkRead}
      disabled={loading}
    >
      {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Mark read"}
    </Button>
  );
}
