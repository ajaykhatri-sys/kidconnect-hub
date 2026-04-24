import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, X, Star, MapPin, Phone, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListings, useCities } from "@/hooks/useListings";

const CATEGORIES = ["Camps", "Classes", "Events", "Birthday Spots"];

const categoryMeta: Record<string, { emoji: string; color: string }> = {
  Camps: { emoji: "🏕️", color: "bg-green-100 text-green-700" },
  Classes: { emoji: "📚", color: "bg-blue-100 text-blue-700" },
  Events: { emoji: "🎉", color: "bg-purple-100 text-purple-700" },
  "Birthday Spots": { emoji: "🎂", color: "bg-pink-100 text-pink-700" },
};

export default function Listings() {
  const [category, setCategory] = useState("");
  const [city, setCity] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useListings({
    category: category || undefined,
    city: city || undefined,
    search: search || undefined,
    page,
    limit: 20,
  });

  const { data: citiesData } = useCities();
  const listings = data?.data || [];
  const pagination = data?.pagination;
  const cities = citiesData?.data || [];
  const hasFilters = category || city || search;

  const clearFilters = () => {
    setCategory(""); setCity(""); setSearch(""); setSearchInput(""); setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const heading = category ? `${categoryMeta[category]?.emoji || ""} ${category}` : "All Activities";

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <SiteHeader />

      <section className="bg-gradient-warm border-b border-border/40">
        <div className="container mx-auto py-10">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-balance">
            {heading}{city && <span className="text-primary"> in {city}</span>}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {isLoading ? "Loading..." : `${pagination?.total || 0} ${pagination?.total === 1 ? "result" : "results"} found`}
          </p>

          <form onSubmit={handleSearch}
            className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_auto_auto_auto] gap-3 bg-card p-3 rounded-3xl shadow-soft border border-border/40">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input value={searchInput} onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search camps, classes, events..."
                className="pl-10 h-11 rounded-2xl border-border bg-background" />
            </div>
            <Select value={city} onValueChange={(v) => { setCity(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="h-11 rounded-2xl w-full md:w-48"><SelectValue placeholder="Any city" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any city</SelectItem>
                {cities.map((c) => <SelectItem key={c.city} value={c.city}>{c.city}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={category} onValueChange={(v) => { setCategory(v === "all" ? "" : v); setPage(1); }}>
              <SelectTrigger className="h-11 rounded-2xl w-full md:w-44"><SelectValue placeholder="Any category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any category</SelectItem>
                {CATEGORIES.map((c) => <SelectItem key={c} value={c}>{categoryMeta[c]?.emoji} {c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button type="submit" className="h-11 rounded-2xl px-6">Search</Button>
          </form>

          {hasFilters && (
            <button onClick={clearFilters}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
              <X className="size-3" /> Clear filters
            </button>
          )}
        </div>
      </section>

      <section className="border-b border-border/40 bg-background">
        <div className="container mx-auto py-4 flex gap-2 overflow-x-auto">
          <button onClick={() => { setCategory(""); setPage(1); }}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
              !category ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40"}`}>
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                category === cat ? "bg-primary text-primary-foreground border-primary" : "bg-background text-muted-foreground border-border hover:border-primary/40"}`}>
              {categoryMeta[cat]?.emoji} {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="container mx-auto py-12 flex-1">
        {isLoading && <div className="flex items-center justify-center py-24"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>}
        {isError && <div className="text-center py-24"><p className="text-muted-foreground">Could not load listings.</p></div>}
        {!isLoading && !isError && listings.length === 0 && (
          <div className="text-center py-24">
            <h2 className="font-display text-2xl font-semibold mb-2">No matches yet</h2>
            <p className="text-muted-foreground mb-6">Try widening your filters.</p>
            <Button variant="outline" onClick={clearFilters}>Clear filters</Button>
          </div>
        )}

        {!isLoading && listings.length > 0 && (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => {
                const meta = categoryMeta[listing.category];
                // Always use slug if available, fall back to id
                const listingUrl = listing.slug ? `/listing/${listing.slug}` : `/listing/${listing.id}`;
                return (
                  <Link key={listing.id} to={listingUrl}
                    className="group bg-card rounded-3xl shadow-soft border border-border/40 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                    <div className="relative h-48 bg-muted overflow-hidden">
                      {listing.photo ? (
                        <img src={listing.photo} alt={listing.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => { (e.target as HTMLImageElement).src = "https://placehold.co/400x300?text=No+Image"; }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-warm">
                          <span className="text-4xl">{meta?.emoji || "🎉"}</span>
                        </div>
                      )}
                      <span className={`absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full ${meta?.color || "bg-muted text-muted-foreground"}`}>
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
                    </div>
                  </Link>
                );
              })}
            </div>

            {pagination && pagination.pages > 1 && (
              <div className="flex items-center justify-center gap-3 mt-12">
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="rounded-xl">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground font-medium">Page {page} of {pagination.pages}</span>
                <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(pagination.pages, p + 1))} disabled={page === pagination.pages} className="rounded-xl">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </section>

      <SiteFooter />
    </div>
  );
}
