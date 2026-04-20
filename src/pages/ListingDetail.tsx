import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Check, Heart, MapPin, Share2, Star, Users } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { getListingBySlug } from "@/data/listings";
import { toast } from "sonner";
import NotFound from "./NotFound";

const ListingDetail = () => {
  const { slug } = useParams();
  const listing = slug ? getListingBySlug(slug) : undefined;
  if (!listing) return <NotFound />;

  const handleBook = () =>
    toast.success("Booking coming soon!", {
      description: "We'll launch real bookings in the next update.",
    });

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <SiteHeader />

      <div className="container mx-auto pt-6">
        <Link to="/browse" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-smooth">
          <ArrowLeft className="size-4" /> Back to results
        </Link>
      </div>

      {/* Hero image */}
      <section className="container mx-auto pt-6">
        <div className="relative aspect-[16/8] md:aspect-[16/7] rounded-3xl overflow-hidden shadow-card">
          <img
            src={listing.image}
            alt={listing.title}
            width={1600}
            height={700}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <Button variant="soft" size="icon" className="bg-card/90 backdrop-blur"><Heart className="size-4" /></Button>
            <Button variant="soft" size="icon" className="bg-card/90 backdrop-blur"><Share2 className="size-4" /></Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-10 grid lg:grid-cols-[1fr_400px] gap-12">
        {/* Main column */}
        <div>
          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2">{listing.subcategory}</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-balance leading-tight">
            {listing.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Star className="size-4 fill-accent text-accent" />
              <span className="font-semibold text-foreground">{listing.rating}</span>
              <span>({listing.reviewCount} reviews)</span>
            </span>
            <span className="flex items-center gap-1.5"><MapPin className="size-4" /> {listing.neighborhood}, {listing.city}</span>
            <span className="flex items-center gap-1.5"><Users className="size-4" /> Ages {listing.ageMin}–{listing.ageMax}</span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Hosted by <span className="text-foreground font-semibold">{listing.business}</span>
          </div>

          <div className="mt-10 prose prose-stone max-w-none">
            <h2 className="font-display text-2xl font-semibold mb-3">About this experience</h2>
            <p className="text-muted-foreground leading-relaxed">{listing.longDescription}</p>
          </div>

          <div className="mt-10">
            <h2 className="font-display text-2xl font-semibold mb-4">What's included</h2>
            <ul className="grid sm:grid-cols-2 gap-3">
              {listing.highlights.map((h) => (
                <li key={h} className="flex items-start gap-2.5">
                  <span className="mt-0.5 size-5 rounded-full bg-primary-soft text-primary flex items-center justify-center shrink-0">
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                  <span className="text-sm">{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-10 p-6 bg-muted/40 rounded-3xl border border-border/40">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="size-5 text-primary" />
              <h3 className="font-display text-lg font-semibold">Schedule</h3>
            </div>
            <p className="text-sm text-muted-foreground">{listing.schedule}</p>
          </div>
        </div>

        {/* Booking sidebar */}
        <aside>
          <div className="sticky top-24 bg-card border border-border/60 rounded-3xl p-6 shadow-card">
            <div className="flex items-baseline gap-2 mb-1">
              {listing.priceFrom === 0 ? (
                <span className="font-display text-3xl font-bold text-primary">Free</span>
              ) : (
                <>
                  <span className="font-display text-3xl font-bold">${listing.priceFrom}</span>
                  <span className="text-sm text-muted-foreground">
                    / {listing.priceUnit}
                  </span>
                </>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mb-5">
              <Star className="size-3.5 fill-accent text-accent" />
              <span className="font-semibold text-foreground">{listing.rating}</span>
              <span>· {listing.reviewCount} reviews</span>
            </div>

            <Button onClick={handleBook} variant="hero" size="lg" className="w-full">
              Book now
            </Button>
            <Button variant="outline" size="lg" className="w-full mt-2">
              Message host
            </Button>

            <div className="mt-5 pt-5 border-t border-border text-xs text-muted-foreground space-y-2">
              <div className="flex justify-between"><span>Free cancellation</span><span className="text-foreground font-semibold">Up to 7 days</span></div>
              <div className="flex justify-between"><span>Instant confirmation</span><span className="text-foreground font-semibold">Yes</span></div>
              <div className="flex justify-between"><span>Verified business</span><span className="text-foreground font-semibold">✓</span></div>
            </div>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
};

export default ListingDetail;
