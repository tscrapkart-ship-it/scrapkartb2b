import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";
import { BuyerNav } from "@/components/buyer/buyer-nav";
import { SellerNav } from "@/components/seller/seller-nav";
import { isMockMode } from "@/lib/mock-data";

// Public-but-role-aware browse layout used by the marketplace and companies
// surfaces. Anonymous visitors see the marketing nav (and footer); authed
// users see the dashboard nav matching their role. This is what lets us
// expose the live marketplace publicly while keeping a consistent shell
// for signed-in buyers and sellers.
export default async function PublicBrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let userName: string | null = null;
  let role: string | null = null;

  if (!isMockMode()) {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from("users")
        .select("name, role")
        .eq("id", user.id)
        .single();
      if (profile) {
        userName = profile.name;
        role = profile.role;
      }
    }
  }

  const isBuyer = role === "recycler" || role === "both";
  const isSeller = role === "waste_producer";

  return (
    <div className="min-h-screen overflow-x-hidden bg-[var(--paper)] text-[var(--ink)] flex flex-col">
      {isBuyer ? (
        <BuyerNav userName={userName ?? "User"} />
      ) : isSeller ? (
        <SellerNav userName={userName ?? "User"} />
      ) : (
        <MarketingNav />
      )}

      <main
        className={`flex-1 mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 ${
          isBuyer || isSeller ? "pb-20 md:pb-6" : "pb-16"
        }`}
      >
        {children}
      </main>

      {!isBuyer && !isSeller && <MarketingFooter />}
    </div>
  );
}
