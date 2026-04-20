import { Link } from "react-router-dom";
import { Star, Shield, Heart } from "lucide-react";
import hero from "@/assets/hero-kids.jpg";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { SearchBar } from "@/components/SearchBar";
import { CategoryTiles } from "@/components/CategoryTiles";
import { ListingCard } from "@/components/ListingCard";
import { HowItWorks } from "@/components/HowItWorks";
import { BusinessCTA } from "@/components/BusinessCTA";
import { getFeatured } from "@/data/listings";

const Index = () => {
  const featured = getFeatured();

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <SiteHeader />

      {/* Hero */}
      <section className="relative">
        <div className="relative h-[640px] md:h-[720px] overflow-hidden">
          <img
            src={hero}
            alt="Children playing joyfully at a summer camp"
            width={1920}
            height={1080}
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/30 via-foreground/10 to-background" />
        </div>

        <div className="absolute inset-0 flex flex-col justify-center">
          <div className="container mx-auto">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-card/80 backdrop-blur px-4 py-1.5 rounded-full text-xs font-semibold text-foreground shadow-soft mb-6 animate-fade-in">
                <Heart className="size-3.5 text-primary" fill="currentColor" />
                Trusted by 50,000+ families nationwide
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-semibold leading-[1.05] text-balance text-primary-foreground drop-shadow-md animate-fade-up">
                Find amazing things <br className="hidden md:block" />for your kids to do.
              </h1>
              <p className="mt-5 text-lg md:text-xl text-primary-foreground/90 max-w-xl drop-shadow animate-fade-up" style={{ animationDelay: "0.1s" }}>
                Camps, classes, weekend events and birthday spots — discovered by parents, loved by kids.
              </p>
            </div>

            <div className="mt-10 max-w-4xl animate-fade-up" style={{ animationDelay: "0.2s" }}>
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="container mx-auto pt-16 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Star, label: "4.8 average rating", sub: "across 12,000+ reviews" },
            { icon: Shield, label: "Verified businesses", sub: "background-checked operators" },
            { icon: Heart, label: "Curated locally", sub: "vetted by real parents" },
            { icon: Star, label: "Easy refunds", sub: "if plans change" },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center gap-2">
              <item.icon className="size-5 text-primary" />
              <div className="font-display font-semibold text-foreground">{item.label}</div>
              <div className="text-xs text-muted-foreground">{item.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured listings */}
      <section className="container mx-auto py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Featured this week</p>
            <h2 className="font-display text-3xl md:text-5xl font-semibold text-balance max-w-2xl">
              Parent picks worth booking now.
            </h2>
          </div>
          <Link to="/browse" className="hidden md:inline-flex text-sm font-semibold text-primary hover:underline underline-offset-4">
            See all listings →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
      </section>

      <CategoryTiles />
      <HowItWorks />
      <BusinessCTA />

      <SiteFooter />
    </div>
  );
};

export default Index;
