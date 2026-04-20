import { useParams, Link } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Globe, Star, Clock, Loader2 } from "lucide-react";
import { useListing } from "@/hooks/useListings";

export default function ListingDetail() {
  const { id, slug } = useParams<{ id: string; slug: string }>();
  const listingId = id || slug || "";
  const { data, isLoading, isError } = useListing(listingId);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  }

  if (isError || !data?.data) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-500">Listing not found.</p>
        <Link to="/listings" className="text-blue-600 hover:underline text-sm">Back to listings</Link>
      </div>
    );
  }

  const listing = data.data;
  const categoryColors: Record<string, string> = {
    Camps: "bg-green-100 text-green-700",
    Classes: "bg-blue-100 text-blue-700",
    Events: "bg-purple-100 text-purple-700",
    "Birthday Spots": "bg-pink-100 text-pink-700",
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Link to="/listings" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to listings
        </Link>
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
          {listing.photos && listing.photos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-1 h-72">
              {listing.photos.slice(0, 5).map((photo, i) => (
                <div key={i} className={`overflow-hidden bg-gray-100 ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                  <img src={photo} alt={`${listing.name} photo ${i + 1}`} className="w-full h-full object-cover"
                    onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image"; }} />
                </div>
              ))}
            </div>
          ) : (
            <div className="h-48 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
              <span className="text-6xl">🎉</span>
            </div>
          )}
          <div className="p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="flex-1">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${categoryColors[listing.category] || "bg-gray-100 text-gray-700"}`}>
                  {listing.category}
                </span>
                <h1 className="text-2xl font-bold text-gray-900 mt-2">{listing.name}</h1>
              </div>
              {listing.rating && (
                <div className="flex flex-col items-center bg-yellow-50 rounded-xl p-3 border border-yellow-100">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-lg font-bold text-gray-900">{listing.rating.toFixed(1)}</span>
                  </div>
                  <span className="text-xs text-gray-500">{listing.review_count?.toLocaleString()} reviews</span>
                </div>
              )}
            </div>
            {listing.description && <p className="text-gray-600 mb-6 leading-relaxed">{listing.description}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {listing.address && (
                <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl">
                  <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Address</p>
                    <p className="text-sm text-gray-700">{listing.address}</p>
                  </div>
                </div>
              )}
              {listing.phone && (
                <a href={`tel:${listing.phone}`} className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                  <Phone className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Phone</p>
                    <p className="text-sm text-blue-600 font-medium">{listing.phone}</p>
                  </div>
                </a>
              )}
              {listing.website && (
                <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors md:col-span-2">
                  <Globe className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">Website</p>
                    <p className="text-sm text-blue-600 font-medium truncate">{listing.website}</p>
                  </div>
                </a>
              )}
            </div>
            {listing.hours && listing.hours.length > 0 && (
              <div className="border-t pt-6">
                <h2 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" /> Hours
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {listing.hours.map((h, i) => (
                    <div key={i} className="flex justify-between text-sm py-1.5 border-b border-gray-50">
                      <span className="font-medium text-gray-700">{h.day_of_week}</span>
                      <span className="text-gray-500">{h.open_time}{h.close_time ? ` – ${h.close_time}` : ""}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-6 flex gap-3">
              {listing.phone && (
                <a href={`tel:${listing.phone}`} className="flex-1 text-center py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors">
                  Call Now
                </a>
              )}
              {listing.website && (
                <a href={listing.website} target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-3 border border-blue-600 text-blue-600 rounded-xl font-medium hover:bg-blue-50 transition-colors">
                  Visit Website
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
