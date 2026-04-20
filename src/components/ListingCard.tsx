import { Link } from "react-router-dom";
import { Star, MapPin } from "lucide-react";
import type { Listing } from "@/data/listings";

const priceLabel = (unit: Listing["priceUnit"]) =>
  ({ session: "/ session", week: "/ week", month: "/ month", event: "/ event" }[unit]);

export const ListingCard = ({ listing }: { listing: Listing }) => {
  return (
    <Link
      to={`/listing/${listing.slug}`}
      className="group block animate-fade-up"
    >
      <article className="bg-card rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-spring hover:-translate-y-1 border border-border/40">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img
            src={listing.image}
            alt={listing.title}
            loading="lazy"
            width={1000}
            height={750}
            className="w-full h-full object-cover transition-spring group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 bg-card/95 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold text-foreground shadow-soft">
            {listing.subcategory}
          </div>
        </div>
        <div className="p-5">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-semibold leading-snug text-foreground group-hover:text-primary transition-smooth text-balance">
              {listing.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0 mt-1">
              <Star className="size-4 fill-accent text-accent" />
              <span className="text-sm font-semibold">{listing.rating}</span>
              <span className="text-xs text-muted-foreground">({listing.reviewCount})</span>
            </div>
          </div>
          <div className="mt-1.5 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {listing.neighborhood} · {listing.city}
          </div>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2">{listing.shortDescription}</p>
          <div className="mt-4 flex items-end justify-between">
            <div className="text-xs text-muted-foreground">
              Ages {listing.ageMin}–{listing.ageMax}
            </div>
            <div className="font-display">
              {listing.priceFrom === 0 ? (
                <span className="text-base font-bold text-primary">Free</span>
              ) : (
                <>
                  <span className="text-lg font-bold text-foreground">${listing.priceFrom}</span>
                  <span className="text-xs text-muted-foreground ml-1">{priceLabel(listing.priceUnit)}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
};
