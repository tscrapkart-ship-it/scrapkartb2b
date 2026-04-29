"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShoppingBag, Info, Loader2 } from "lucide-react";

export function BookScrapDialog({
  scrapId,
  scrapTitle,
  sellerId,
}: {
  scrapId: string;
  scrapTitle: string;
  sellerId: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleBook() {
    setLoading(true);
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    // Create booking
    const { data: booking, error: bookingError } = await supabase
      .from("bookings")
      .insert({
        buyer_id: user.id,
        seller_id: sellerId,
        scrap_id: scrapId,
        status: "confirmed",
      })
      .select()
      .single();

    if (bookingError) {
      alert(bookingError.message);
      setLoading(false);
      return;
    }

    // Update scrap status
    await supabase
      .from("scraps")
      .update({ status: "booked" })
      .eq("id", scrapId);

    router.push(`/bookings/${booking.id}`);
    router.refresh();
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button className="w-full bg-[var(--forest)] text-white hover:bg-[var(--forest-2)] shadow-[var(--shadow-1)]" size="lg" />
        }
      >
        <ShoppingBag className="mr-2 h-4 w-4" />
        Book Now
      </AlertDialogTrigger>
      <AlertDialogContent className="border-[var(--line)] bg-[var(--paper)] text-[var(--ink)]">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-[var(--ink)]">Confirm Booking</AlertDialogTitle>
          <AlertDialogDescription className="text-[var(--ink-3)]">
            You are about to book &quot;{scrapTitle}&quot;. The seller will be
            notified and you can communicate via chat.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-start gap-2 rounded-[var(--radius-md)] bg-[var(--forest-tint)] p-3 text-base text-[var(--ink-2)]">
          <Info className="mt-0.5 h-4 w-4 shrink-0 text-[var(--forest)]" />
          Payment integration coming soon. This is a booking confirmation only.
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="border-[var(--line)] bg-[var(--paper)] text-[var(--ink)] hover:bg-[var(--paper-2)] hover:text-[var(--ink)]">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleBook}
            disabled={loading}
            className="bg-[var(--forest)] text-white hover:bg-[var(--forest-2)] shadow-[var(--shadow-1)]"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              "Confirm Booking"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
