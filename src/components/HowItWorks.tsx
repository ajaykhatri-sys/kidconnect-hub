import { Search, CalendarCheck, Sparkles } from "lucide-react";

const steps = [
  {
    icon: Search,
    title: "Discover",
    body: "Search by city, age, and interest. Read real reviews from local parents.",
  },
  {
    icon: CalendarCheck,
    title: "Book in seconds",
    body: "Reserve a spot, request info, or message the business directly — all in one place.",
  },
  {
    icon: Sparkles,
    title: "Make memories",
    body: "Show up and have fun. Leave a review to help other families find their next favorite.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="bg-gradient-warm py-20">
      <div className="container mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">How it works</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-balance">
            From curious to confirmed — in three easy steps.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="bg-card rounded-3xl p-8 shadow-soft border border-border/40 transition-smooth hover:shadow-card-hover hover:-translate-y-1"
            >
              <div className="size-14 rounded-2xl bg-primary-soft flex items-center justify-center text-primary mb-5">
                <step.icon className="size-7" />
              </div>
              <div className="text-xs font-semibold text-muted-foreground mb-1">STEP {i + 1}</div>
              <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
