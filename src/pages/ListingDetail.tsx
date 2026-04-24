import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft, MapPin, Phone, Globe, Star, Clock,
  Loader2, Tag, ChevronLeft, ChevronRight, Calendar,
  Share2, Heart
} from "lucide-react";
import { useListing } from "@/hooks/useListings";
import { useSchedules } from "@/hooks/useBooking";
import { useSEO } from "@/hooks/useSEO";
import { BookingModal } from "@/components/BookingModal";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";

const categoryMeta: Record<string, { emoji: string; color: string }> = {
  Camps: { emoji: "🏕️", color: "bg-green-100 text-green-700" },
  Classes: { emoji: "📚", color: "bg-blue-100 text-blue-700" },
  Events: { emoji: "🎉", color: "bg-purple-100 text-purple-700" },
  "Birthday Spots": { emoji: "🎂", color: "bg-pink-100 text-pink-700" },
};

function ListingDetailContent() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const listingId = id || slug || "";
  const { data, isLoading, isError } = useListing(listingId);
  const { data: schedulesData } = useSchedules(listingId);
  const [showBooking, setShowBooking] = useState(false);
  const [activePhoto, setActivePhoto] = useState(0);
  const [saved, setSaved] = useState(false);

  const listing = data?.data;
  const schedules = schedulesData?.data || [];
  const lowestPrice = schedules.length > 0 ? Math.min(...schedules.map((s: any) => s.price)) : null;
  const hasFree = schedules.some((s: any) => s.price === 0);

  // SEO - generates all meta tags + JSON-LD schema
  useSEO(listing ? {
    title: `${listing.name} — ${listing.category} in ${listing.city}, FL`,
    description: listing.description
      ? listing.description.slice(0, 160)
      : `${listing.name} offers ${listing.category.toLowerCase()} for kids in ${listing.city}, Florida. ${listing.rating ? `Rated ${listing.rating}/5 by ${listing.review_count} parents.` : ""} Book online at 123Kids.`,
    image: listing.photos?.[0],
    url: `/listing/${listing.id}`,
    type: "website",
    schema: {
      "@context": "https://schema.org",
      "@type": listing.category === "Events" ? "Event" : "LocalBusiness",
      "name": listing.name,
      "description": listing.description || `${listing.name} — ${listing.category} for kids in ${listing.city}, FL`,
      "image": listing.photos || [],
      "url": `https://www.123kids.com/listing/${listing.id}`,
      "telephone": listing.phone || undefined,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": listing.address?.split(",")[0] || "",
        "addressLocality": listing.city,
        "addressRegion": "FL",
        "addressCountry": "US",
        "postalCode": listing.zip || "",
      },
      "geo": listing.lat ? {
        "@type": "GeoCoordinates",
        "latitude": listing.lat,
        "longitude": listing.lng,
      } : undefined,
      ...(listing.rating ? {
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": listing.rating,
          "reviewCount": listing.review_count,
          "bestRating": 5,
          "worstRating": 1,
        }
      } : {}),
      ...(lowestPrice !== null ? {
        "priceRange": hasFree ? "Free" : `From $${lowestPrice}`,
        "offers": schedules.map((s: any) => ({
          "@type": "Offer",
          "name": s.title,
          "price": s.price,
          "priceCurrency": "USD",
        })),
      } : {}),
      "sameAs": listing.website ? [listing.website] : [],
    }
  } : {});

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-body">
        <SiteHeader />
        <div className="flex items-center justify-center flex-1">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
        <SiteFooter />
      </div>
    );
  }

  if (isError || !listing) {
    return (
      <div className="min-h-screen flex flex-col bg-background font-body">
        <SiteHeader />
        <div className="flex flex-col items-center justify-center flex-1 gap-4">
          <p className="text-muted-foreground font-body">Listing not found.</p>
          <Button variant="outline" asChild>
            <Link to="/listings">Back to listings</Link>
          </Button>
        </div>
        <SiteFooter />
      </div>
    );
  }

  const photos = listing.photos || [];
  const meta = categoryMeta[listing.category] || { emoji: "🎉", color: "bg-muted text-muted-foreground" };

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <SiteHeader />

      {/* Hero Photo Gallery */}
      <section className="relative bg-muted">
        <div className="relative h-[420px] md:h-[520px] overflow-hidden">
          {photos.length > 0 ? (
            <>
              <img
                src={photos[activePhoto]}
                alt={`${listing.name} — ${listing.category} in ${listing.city}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/1200x520?text=No+Image"; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {photos.length > 1 && (
                <>
                  <button onClick={() => setActivePhoto((p) => Math.max(0, p - 1))} disabled={activePhoto === 0}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-soft hover:bg-white transition-colors disabled:opacity-40">
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                  </button>
                  <button onClick={() => setActivePhoto((p) => Math.min(photos.length - 1, p + 1))} disabled={activePhoto === photos.length - 1}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-soft hover:bg-white transition-colors disabled:opacity-40">
                    <ChevronRight className="w-5 h-5 text-foreground" />
                  </button>
                  <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {photos.map((_: string, i: number) => (
                      <button key={i} onClick={() => setActivePhoto(i)}
                        className={`w-2 h-2 rounded-full transition-all ${i === activePhoto ? "bg-white w-4" : "bg-white/50"}`} />
                    ))}
                  </div>
                  <div className="absolute bottom-4 right-4 flex gap-1.5">
                    {photos.slice(0, 4).map((photo: string, i: number) => (
                      <button key={i} onClick={() => setActivePhoto(i)}
                        className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all ${i === activePhoto ? "border-white" : "border-white/40"}`}>
                        <img src={photo} alt={`${listing.name} photo ${i + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-warm">
              <span className="text-8xl">{meta.emoji}</span>
            </div>
          )}
          <div className="absolute top-4 left-4">
            <Link to="/listings"
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur rounded-2xl text-sm font-medium text-foreground hover:bg-white transition-colors shadow-soft">
              <ArrowLeft className="w-4 h-4" /> All listings
            </Link>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <button onClick={() => setSaved(!saved)}
              className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-soft hover:bg-white transition-colors">
              <Heart className={`w-4 h-4 ${saved ? "fill-red-500 text-red-500" : "text-foreground"}`} />
            </button>
            <button onClick={() => navigator.share?.({ title: listing.name, url: window.location.href })}
              className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-soft hover:bg-white transition-colors">
              <Share2 className="w-4 h-4 text-foreground" />
            </button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto py-10">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Left Column */}
          <div>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full ${meta.color}`}>
                  {meta.emoji} {listing.category}
                </span>
                <span className="text-xs text-muted-foreground">{listing.city}, FL</span>
              </div>
              <h1 className="font-display text-3xl md:text-4xl font-semibold text-balance text-foreground leading-tight">
                {listing.name}
              </h1>
              <div className="flex flex-wrap items-center gap-4 mt-4">
                {listing.rating && (
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < Math.round(listing.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`} />
                    ))}
                    <span className="font-semibold text-foreground ml-1">{listing.rating.toFixed(1)}</span>
                    <span className="text-muted-foreground text-sm">({listing.review_count?.toLocaleString()} reviews)</span>
                  </div>
                )}
                {listing.city && (
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <MapPin className="w-3.5 h-3.5 text-primary" />{listing.city}, FL
                  </div>
                )}
              </div>
            </div>

            {listing.description && (
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-3">About</h2>
                <p className="text-muted-foreground leading-relaxed">{listing.description}</p>
              </div>
            )}

            {schedules.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4">Options & Pricing</h2>
                <div className="space-y-3">
                  {schedules.map((s: any) => (
                    <div key={s.id} className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/40 shadow-soft">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                          <Tag className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-semibold text-foreground text-sm">{s.title}</p>
                          {s.description && <p className="text-xs text-muted-foreground mt-0.5">{s.description}</p>}
                          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                            {s.duration_minutes && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{s.duration_minutes} min</span>}
                            {s.age_min && <span>Ages {s.age_min}–{s.age_max === 99 ? "adult" : s.age_max}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary text-lg">{s.price === 0 ? "FREE" : `$${s.price}`}</p>
                        <p className="text-xs text-muted-foreground">{s.price_label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listing.hours && listing.hours.length > 0 && (
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" /> Hours
                </h2>
                <div className="bg-card rounded-2xl border border-border/40 shadow-soft overflow-hidden">
                  {listing.hours.map((h: any, i: number) => (
                    <div key={i} className={`flex justify-between px-5 py-3 text-sm ${i % 2 === 0 ? "bg-muted/30" : ""}`}>
                      <span className="font-medium text-foreground">{h.day_of_week}</span>
                      <span className="text-muted-foreground">{h.open_time}{h.close_time ? ` – ${h.close_time}` : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {listing.address && (
              <div className="mb-8">
                <h2 className="font-display text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" /> Location
                </h2>
                <div className="bg-card rounded-2xl border border-border/40 shadow-soft p-5">
                  <p className="text-muted-foreground">{listing.address}</p>
                  <a href={`https://maps.google.com/?q=${encodeURIComponent(listing.address)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-primary hover:underline">
                    <MapPin className="w-3.5 h-3.5" /> Get directions
                  </a>
                </div>
              </div>
            )}

            {/* SEO-friendly breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground flex items-center gap-1.5 mt-4">
              <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
              <span>/</span>
              <Link to="/listings" className="hover:text-foreground transition-colors">Listings</Link>
              <span>/</span>
              <Link to={`/listings?category=${encodeURIComponent(listing.category)}`} className="hover:text-foreground transition-colors">{listing.category}</Link>
              <span>/</span>
              <span className="text-foreground">{listing.name}</span>
            </nav>
          </div>

          {/* Right Column — Sticky Booking Card */}
          <div>
            <div className="sticky top-6">
              <div className="bg-card rounded-3xl border border-border/40 shadow-soft overflow-hidden">
                <div className="bg-gradient-warm p-6 border-b border-border/40">
                  {schedules.length > 0 ? (
                    <div>
                      <p className="text-sm text-muted-foreground font-medium">Starting from</p>
                      <p className="font-display text-3xl font-semibold text-foreground mt-1">
                        {hasFree ? "Free" : lowestPrice !== null ? `$${lowestPrice}` : "Book Now"}
                      </p>
                      {hasFree && <p className="text-sm text-primary font-medium mt-1">Free trial available!</p>}
                    </div>
                  ) : (
                    <p className="font-display text-2xl font-semibold text-foreground">Contact for pricing</p>
                  )}
                </div>
                <div className="p-6 space-y-3">
                  {listing.rating && (
                    <div className="flex items-center justify-between pb-4 border-b border-border/40">
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < Math.round(listing.rating) ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"}`} />
                          ))}
                        </div>
                        <span className="font-semibold text-foreground">{listing.rating.toFixed(1)}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{listing.review_count?.toLocaleString()} reviews</span>
                    </div>
                  )}
                  {schedules.length > 0 && (
                    <Button onClick={() => setShowBooking(true)} className="w-full h-12 rounded-2xl text-base font-semibold">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now{lowestPrice !== null && lowestPrice > 0 ? ` · From $${lowestPrice}` : hasFree ? " · Free Trial" : ""}
                    </Button>
                  )}
                  {listing.phone && (
                    <a href={`tel:${listing.phone}`}
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                      <Phone className="w-4 h-4 text-primary" />{listing.phone}
                    </a>
                  )}
                  {listing.website && (
                    <a href={listing.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full h-11 rounded-2xl border border-border text-sm font-medium text-foreground hover:bg-muted/50 transition-colors">
                      <Globe className="w-4 h-4 text-primary" />Visit Website
                    </a>
                  )}
                  <p className="text-xs text-center text-muted-foreground pt-2">Free cancellation on most bookings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      {showBooking && (
        <BookingModal listingId={listingId} listingName={listing.name} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}

export default ListingDetailContent;
