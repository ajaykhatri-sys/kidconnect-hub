import { Link } from "react-router-dom";
import { MapPin, Phone, Star } from "lucide-react";
import { Listing } from "@/hooks/useListings";

interface ListingCardProps {
  listing: Listing;
}

const categoryMeta: Record<string, { emoji: string; color: string }> = {
  Camps: { emoji: "🏕️", color: "bg-green-100 text-green-700" },
  Classes: { emoji: "📚", color: "bg-blue-100 text-blue-700" },
  Events: { emoji: "🎉", color: "bg-purple-100 text-purple-700" },
  "Birthday Spots": { emoji: "🎂", color: "bg-pink-100 text-pink-700" },
};

export function ListingCard({ listing }: ListingCardProps) {
  const meta = categoryMeta[listing.category] || { emoji: "🎉", color: "bg-muted text-muted-foreground" };
  const url = listing.slug ? `/listing/${listing.slug}` : `/listing/${listing.id}`;

  return (
    <Link to={url} className="group bg-card rounded-3xl shadow-soft border border-border/40 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 block">
      <div className="relative h-48 bg-muted overflow-hidden">
        {listing.photo ? (
          <img
            src={listing.photo}
            alt={listing.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image"; }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-warm">
            <span className="text-4xl">{meta.emoji}</span>
          </div>
        )}
        <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${meta.color}`}>
          {listing.category}
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-display font-semibold text-foreground text-sm leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
          {listing.name}
        </h3>
        {listing.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="text-sm font-medium text-foreground">{listing.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({listing.review_count?.toLocaleString()})</span>
          </div>
        )}
        {listing.city && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
            <MapPin className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{listing.city}</span>
          </div>
        )}
        {listing.phone && (
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Phone className="w-3 h-3 flex-shrink-0" />
            <span>{listing.phone}</span>
          </div>
        )}
        {listing.description && (
          <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{listing.description}</p>
        )}
      </div>
    </Link>
  );
}
