import { Badge } from "@/components/ui/badge";
import { ChevronRight, Calendar } from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-[var(--warning)]/10 text-[var(--warning)] border-[var(--warning)]/20",
  confirmed: "bg-[var(--forest-tint)] text-[var(--forest)] border-[var(--forest)]/20",
  collected: "bg-[var(--paper-2)] text-[var(--ink-3)] border-[var(--line)]",
  cancelled: "bg-[var(--danger)]/10 text-[var(--danger)] border-[var(--danger)]/20",
};

interface BookingCardProps {
  booking: {
    id: string;
    status: string;
    created_at: string;
    scraps?: { title: string; category: string; price: number } | null;
  };
  counterpartyName?: string;
  role: "buyer" | "seller";
}

export function BookingCard({
  booking,
  counterpartyName,
  role,
}: BookingCardProps) {
  return (
    <div className="group overflow-hidden rounded-[var(--radius-lg)] border border-[var(--line)] bg-[var(--paper)] p-5 transition-all duration-300 hover:border-[var(--forest)]/20 hover:shadow-[var(--shadow-2)]">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-[var(--ink)] group-hover:text-[var(--ink)] transition-colors">
            {booking.scraps?.title ?? "Scrap Item"}
          </h3>
          {counterpartyName && (
            <p className="mt-0.5 text-sm text-[var(--ink-3)]">
              {role === "buyer" ? "Seller" : "Buyer"}: {counterpartyName}
            </p>
          )}
          {booking.scraps?.price && (
            <p className="mt-1.5 text-base font-bold text-[var(--forest)]">
              ₹{booking.scraps.price.toLocaleString("en-IN")}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2.5 shrink-0 ml-4">
          <Badge
            className={`border capitalize ${
              statusColors[booking.status] ??
              "bg-[var(--paper-2)] text-[var(--ink-3)] border-[var(--line)]"
            }`}
          >
            {booking.status}
          </Badge>
          <ChevronRight className="h-4 w-4 text-[var(--ink-4)] group-hover:text-[var(--forest)] transition-colors" />
        </div>
      </div>
      <div className="mt-3 flex items-center gap-1.5 border-t border-[var(--line)] pt-3">
        <Calendar className="h-3.5 w-3.5 text-[var(--ink-4)]" />
        <span className="text-xs text-[var(--ink-3)]">
          {new Date(booking.created_at).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}
