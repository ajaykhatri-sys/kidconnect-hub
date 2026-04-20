import { useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useListings, useCities } from "@/hooks/useListings";
import { ListingCard } from "@/components/ListingCard";

const CATEGORIES = ["All", "Camps", "Classes", "Events", "Birthday Spots"];

export default function Listings() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useListings({
    category: selectedCategory || undefined,
    city: selectedCity || undefined,
    search: search || undefined,
    page,
    limit: 20,
  });

  const { data: citiesData } = useCities();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategory = (cat: string) => {
    setSelectedCategory(cat === "All" ? "" : cat);
    setPage(1);
  };

  const listings = data?.data || [];
  const pagination = data?.pagination;
  const cities = citiesData?.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <form onSubmit={handleSearch} className="flex gap-2 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search camps, classes, events..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button type="submit" className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
              Search
            </button>
          </form>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategory(cat)}
                className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  (cat === "All" && !selectedCategory) || selectedCategory === cat
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex gap-6">
          <div className="hidden lg:block w-56 flex-shrink-0">
            <div className="bg-white rounded-2xl p-4 border border-gray-100 sticky top-28">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Filter className="w-4 h-4" /> Filter by City
              </h3>
              <div className="space-y-1 max-h-80 overflow-y-auto">
                <button
                  onClick={() => { setSelectedCity(""); setPage(1); }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${!selectedCity ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                >
                  All Cities
                </button>
                {cities.map((c) => (
                  <button
                    key={c.city}
                    onClick={() => { setSelectedCity(c.city); setPage(1); }}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${selectedCity === c.city ? "bg-blue-50 text-blue-600 font-medium" : "text-gray-600 hover:bg-gray-50"}`}
                  >
                    {c.city} <span className="text-gray-400">({c.count})</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-gray-500">
                {isLoading ? "Loading..." : (
                  <><span className="font-semibold text-gray-900">{pagination?.total || 0}</span> listings found{selectedCategory && ` in ${selectedCategory}`}{selectedCity && ` · ${selectedCity}`}{search && ` · "${search}"`}</>
                )}
              </p>
            </div>
            {isLoading && <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>}
            {isError && <div className="text-center py-20"><p className="text-gray-500">Failed to load listings. Please try again.</p></div>}
            {!isLoading && !isError && listings.length === 0 && <div className="text-center py-20"><p className="text-2xl mb-2">🔍</p><p className="text-gray-500">No listings found.</p></div>}
            {!isLoading && listings.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
              </div>
            )}
            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-sm text-gray-600">Page {page} of {pagination.pages}</span>
                <button onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="p-2 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
