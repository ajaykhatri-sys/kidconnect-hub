import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, Check, MapPin, Share2, Star, Users, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { ReviewsSection } from "@/components/ReviewsSection";
import { StarRating } from "@/components/StarRating";
import { getListingBySlug } from "@/data/listings";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import NotFound from "./NotFound";
import type { Database } from "@/integrations/supabase/types";

type DbListing = Database["public"]["Tables"]["listings"]["Row"];

interface DisplayListing {
  id: string | null; // null when sourced from static mock
  title: string;
  subcategory: string;
  image: string;
  city: string;
  neighborhood: string;
  ageMin: number;
  ageMax: number;
  business: string;
  longDescription: string;
  highlights: string[];
  schedule: string;
  priceFrom: number;
  priceUnit: string;
  rating: number;
  reviewCount: number;
}

const fromDb = (l: DbListing, businessName: string): DisplayListing => ({
  id: l.id,
  title: l.title,
  subcategory: l.category,
  image: l.image_url ?? "/placeholder.svg",
  city: l.city,
  neighborhood: l.address ?? "",
  ageMin: l.age_min ?? 0,
  ageMax: l.age_max ?? 18,
  business: businessName,
  longDescription: l.description ?? "",
  highlights: [],
  schedule: "",
  priceFrom: l.price_cents ? l.price_cents / 100 : 0,
  priceUnit: l.price_unit ?? "session",
  rating: 0,
  reviewCount: 0,
});

const ListingDetail = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [listing, setListing] = useState<DisplayListing | null>(null);
  const [summary, setSummary] = useState<{ count: number; average: number }>({ count: 0, average: 0 });

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      setLoading(true);
      // Try DB first (only approved listings due to RLS)
      const { data } = await supabase
        .from("listings")
        .select("*")
        .eq("slug", slug)
        .eq("status", "approved")
        .maybeSingle();

      if (data) {
        const { data: biz } = await supabase
          .from("businesses")
          .select("name")
          .eq("id", data.business_id)
          .maybeSingle();
        setListing(fromDb(data, biz?.name ?? "Local business"));
      } else {
        const mock = getListingBySlug(slug);
        if (mock) {
          setListing({
            id: null,
            title: mock.title,
            subcategory: mock.subcategory,
            image: mock.image,
            city: mock.city,
            neighborhood: mock.neighborhood,
            ageMin: mock.ageMin,
            ageMax: mock.ageMax,
            business: mock.business,
            longDescription: mock.longDescription,
            highlights: mock.highlights,
            schedule: mock.schedule,
            priceFrom: mock.priceFrom,
            priceUnit: mock.priceUnit,
            rating: mock.rating,
            reviewCount: mock.reviewCount,
          });
        } else {
          setListing(null);
        }
      }
      setLoading(false);
    };
    load();
  }, [slug]);

  const handleBook = () =>
    toast.success("Booking coming soon!", {
      description: "We'll launch real bookings in the next update.",
    });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!listing) return <NotFound />;

  const ratingValue = listing.id ? summary.average : listing.rating;
  const ratingCount = listing.id ? summary.count : listing.reviewCount;

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
            {listing.id && <FavoriteButton listingId={listing.id} />}
            <Button variant="soft" size="icon" className="bg-card/90 backdrop-blur"><Share2 className="size-4" /></Button>
          </div>
        </div>
      </section>

      <section className="container mx-auto py-10 grid lg:grid-cols-[1fr_400px] gap-12">
        {/* Main column */}
        <div>
          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 capitalize">{listing.subcategory}</div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-balance leading-tight">
            {listing.title}
          </h1>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              {ratingCount > 0 ? (
                <>
                  <Star className="size-4 fill-accent text-accent" />
                  <span className="font-semibold text-foreground">{ratingValue.toFixed(1)}</span>
                  <span>({ratingCount} review{ratingCount === 1 ? "" : "s"})</span>
                </>
              ) : (
                <span className="text-muted-foreground">No reviews yet</span>
              )}
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="size-4" /> {[listing.neighborhood, listing.city].filter(Boolean).join(", ")}
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="size-4" /> Ages {listing.ageMin}–{listing.ageMax}
            </span>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Hosted by <span className="text-foreground font-semibold">{listing.business}</span>
          </div>

          {listing.longDescription && (
            <div className="mt-10 prose prose-stone max-w-none">
              <h2 className="font-display text-2xl font-semibold mb-3">About this experience</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{listing.longDescription}</p>
            </div>
          )}

          {listing.highlights.length > 0 && (
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
          )}

          {listing.schedule && (
            <div className="mt-10 p-6 bg-muted/40 rounded-3xl border border-border/40">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-5 text-primary" />
                <h3 className="font-display text-lg font-semibold">Schedule</h3>
              </div>
              <p className="text-sm text-muted-foreground">{listing.schedule}</p>
            </div>
          )}

          {listing.id && (
            <ReviewsSection listingId={listing.id} onSummaryChange={setSummary} />
          )}
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-5">
              {ratingCount > 0 ? (
                <>
                  <StarRating value={ratingValue} size="sm" readOnly />
                  <span className="font-semibold text-foreground">{ratingValue.toFixed(1)}</span>
                  <span>· {ratingCount} review{ratingCount === 1 ? "" : "s"}</span>
                </>
              ) : (
                <span>No reviews yet</span>
              )}
            </div>

            <Button onClick={handleBook} variant="hero" size="lg" className="w-full">
              Book now
            </Button>
            {listing.id ? (
              <FavoriteButton listingId={listing.id} variant="labeled" className="w-full mt-2" />
            ) : (
              <Button variant="outline" size="lg" className="w-full mt-2">
                Message host
              </Button>
            )}

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
