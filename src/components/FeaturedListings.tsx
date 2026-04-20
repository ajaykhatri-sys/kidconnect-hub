import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight, Loader2 } from "lucide-react";
import { useFeaturedListings } from "@/hooks/useListings";

const categoryColors: Record<string, string> = {
  Camps: "bg-green-100 text-green-700",
  Classes: "bg-blue-100 text-blue-700",
  Events: "bg-purple-100 text-purple-700",
  "Birthday Spots": "bg-pink-100 text-pink-700",
};

export function FeaturedListings() {
  const { data, isLoading } = useFeaturedListings();
  const listings = data?.data || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (!listings.length) return null;

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              ⭐ Top Rated in Palm Beach County
            </h2>
            <p className="text-gray-500 mt-1">
              Highest rated camps, classes & more for kids
            </p>
          </div>
          <Link
            to="/listings"
            className="hidden sm:flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium text-sm transition-colors"
          >
            View all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {listings.map((listing) => (
            <Link
              key={listing.id}
              to={`/listing/${listing.id}`}
              className="block group bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
            >
              {/* Photo */}
              <div className="relative h-40 bg-gray-100 overflow-hidden">
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
                    <span className="text-3xl">🎉</span>
                  </div>
                )}
                <span
                  className={`absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                    categoryColors[listing.category] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {listing.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 mb-1.5 group-hover:text-blue-600 transition-colors">
                  {listing.name}
                </h3>
                <div className="flex items-center justify-between">
                  {listing.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium text-gray-700">
                        {listing.rating.toFixed(1)}
                      </span>
                      <span className="text-xs text-gray-400">
                        ({listing.review_count})
                      </span>
                    </div>
                  )}
                  {listing.city && (
                    <div className="flex items-center gap-0.5 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      <span className="truncate max-w-[80px]">{listing.city}</span>
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile view all */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/listings"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors"
          >
            View all listings <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
