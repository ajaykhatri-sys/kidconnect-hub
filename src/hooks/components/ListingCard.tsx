import { Link } from "react-router-dom";
import { MapPin, Phone, Star, ExternalLink } from "lucide-react";
import { Listing } from "@/hooks/useListings";

interface ListingCardProps {
  listing: Listing;
}

export function ListingCard({ listing }: ListingCardProps) {
  const categoryColors: Record<string, string> = {
    Camps: "bg-green-100 text-green-700",
    Classes: "bg-blue-100 text-blue-700",
    Events: "bg-purple-100 text-purple-700",
    "Birthday Spots": "bg-pink-100 text-pink-700",
  };

  return (
    <Link to={`/listing/${listing.id}`} className="block group">
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100">
        {/* Photo */}
        <div className="relative h-48 bg-gray-100 overflow-hidden">
          {listing.photo ? (
            <img
              src={listing.photo}
              alt={listing.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "https://placehold.co/400x300?text=No+Image";
              }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
              <span className="text-4xl">🎉</span>
            </div>
          )}
          {/* Category badge */}
          <span
            className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${
              categoryColors[listing.category] || "bg-gray-100 text-gray-700"
            }`}
          >
            {listing.category}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
            {listing.name}
          </h3>

          {/* Rating */}
          {listing.rating && (
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium text-gray-700">
                {listing.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-400">
                ({listing.review_count?.toLocaleString()})
              </span>
            </div>
          )}

          {/* Address */}
          {listing.city && (
            <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{listing.city}</span>
            </div>
          )}

          {/* Phone */}
          {listing.phone && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Phone className="w-3 h-3 flex-shrink-0" />
              <span>{listing.phone}</span>
            </div>
          )}

          {/* Description */}
          {listing.description && (
            <p className="text-xs text-gray-500 mt-2 line-clamp-2">
              {listing.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}
