import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

const tiers = [
  {
    name: "Starter",
    price: "Free",
    description: "Get listed and start collecting reviews.",
    features: ["1 listing", "Business profile", "Parent reviews", "Direct messages"],
    cta: "Start free",
    featured: false,
  },
  {
    name: "Growth",
    price: "$49",
    period: "/ month",
    description: "Stand out, get bookings, grow your roster.",
    features: ["Up to 5 listings", "Featured placement (city)", "Online bookings", "Photo gallery", "Priority support"],
    cta: "Try Growth",
    featured: true,
  },
  {
    name: "Pro",
    price: "$129",
    period: "/ month",
    description: "Multi-location operators and franchises.",
    features: ["Unlimited listings", "Top homepage placement", "Advanced analytics", "Bulk scheduling", "Dedicated manager"],
    cta: "Talk to sales",
    featured: false,
  },
];

const ForBusiness = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <SiteHeader />

      <section className="bg-gradient-warm">
        <div className="container mx-auto py-20 text-center max-w-3xl">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">For businesses</p>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-balance leading-tight">
            Grow your kids' business with the parents who matter most — local ones.
          </h1>
          <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto">
            Reach families ready to book in your area. List for free, upgrade when you're ready.
          </p>
          <div className="mt-8 flex justify-center gap-3">
            <Button variant="hero" size="lg">Create your listing</Button>
            <Button variant="outline" size="lg" asChild><Link to="/">See how parents browse</Link></Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-20">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-balance">Simple pricing. Powerful results.</h2>
          <p className="mt-3 text-muted-foreground">Start free. Upgrade only when you're ready to scale.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`relative rounded-3xl p-8 border transition-spring hover:-translate-y-1 ${
                tier.featured
                  ? "bg-secondary text-secondary-foreground border-transparent shadow-elegant"
                  : "bg-card border-border/60 shadow-soft hover:shadow-card-hover"
              }`}
            >
              {tier.featured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <h3 className="font-display text-2xl font-semibold mb-1">{tier.name}</h3>
              <p className={`text-sm mb-5 ${tier.featured ? "text-secondary-foreground/70" : "text-muted-foreground"}`}>
                {tier.description}
              </p>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="font-display text-4xl font-bold">{tier.price}</span>
                {tier.period && (
                  <span className={tier.featured ? "text-secondary-foreground/70" : "text-muted-foreground"}>
                    {tier.period}
                  </span>
                )}
              </div>
              <Button
                variant={tier.featured ? "hero" : "outline"}
                size="lg"
                className="w-full mb-6"
              >
                {tier.cta}
              </Button>
              <ul className="space-y-3">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <span className={`mt-0.5 size-5 rounded-full flex items-center justify-center shrink-0 ${
                      tier.featured ? "bg-primary/30 text-primary-glow" : "bg-primary-soft text-primary"
                    }`}>
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
};

export default ForBusiness;
