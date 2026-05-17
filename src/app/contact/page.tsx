import { MarketingNav } from "@/components/shared/marketing-nav";
import { MarketingFooter } from "@/components/shared/marketing-footer";
import { ContactForm } from "./contact-form";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[var(--paper)] flex flex-col">
      <MarketingNav />
      <ContactForm />
      <MarketingFooter />
    </div>
  );
}
