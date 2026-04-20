import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const benefits = [
  "Reach thousands of local parents",
  "Free listing — pay only for visibility",
  "Built-in bookings & secure payouts",
  "Beautiful business profile & reviews",
];

export const BusinessCTA = () => {
  return (
    <section className="container mx-auto py-20">
      <div className="relative overflow-hidden rounded-3xl bg-secondary text-secondary-foreground p-8 md:p-16 shadow-elegant">
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-primary/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
        <div className="relative grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-sm font-semibold text-primary-glow uppercase tracking-wider mb-3">For businesses</p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-balance leading-tight">
              Fill your classes. Sell out your camps.
            </h2>
            <p className="mt-4 text-secondary-foreground/80 text-lg max-w-md">
              Join hundreds of local kids' businesses growing with 123kids.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button variant="hero" size="lg" asChild>
                <Link to="/dashboard">List your business</Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-secondary-foreground/20 bg-transparent text-secondary-foreground hover:bg-secondary-foreground/10 hover:border-secondary-foreground/40">
                <Link to="/for-business">See pricing</Link>
              </Button>
            </div>
          </div>
          <ul className="space-y-3">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <span className="mt-0.5 size-6 rounded-full bg-primary/20 text-primary-glow flex items-center justify-center shrink-0">
                  <Check className="size-3.5" strokeWidth={3} />
                </span>
                <span className="text-secondary-foreground/90">{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
