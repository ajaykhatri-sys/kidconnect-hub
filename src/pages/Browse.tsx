import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { ListingCard } from "@/components/ListingCard";
import { listings, cities, categoryMeta, type Category } from "@/data/listings";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

const Browse = () => {
  const [params, setParams] = useSearchParams();
  const category = params.get("category") || "";
  const city = params.get("city") || "";
  const q = params.get("q") || "";
  const age = params.get("age") || "";

  const update = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value) next.set(key, value); else next.delete(key);
    setParams(next, { replace: true });
  };

  const results = useMemo(() => {
    return listings.filter((l) => {
      if (category && l.category !== category) return false;
      if (city && l.city !== city) return false;
      if (age) {
        const ageNum = parseInt(age, 10);
        if (l.ageMin > ageNum || l.ageMax < ageNum) return false;
      }
      if (q) {
        const needle = q.toLowerCase();
        const hay = `${l.title} ${l.business} ${l.subcategory} ${l.shortDescription}`.toLowerCase();
        if (!hay.includes(needle)) return false;
      }
      return true;
    });
  }, [category, city, age, q]);

  const heading = category ? categoryMeta[category as Category]?.label || "All activities" : "All activities";
  const hasFilters = category || city || age || q;

  return (
    <div className="min-h-screen flex flex-col bg-background font-body">
      <SiteHeader />

      <section className="bg-gradient-warm border-b border-border/40">
        <div className="container mx-auto py-10">
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-balance">
            {heading} {city && <span className="text-primary">in {city.split(",")[0]}</span>}
          </h1>
          <p className="mt-2 text-muted-foreground">{results.length} {results.length === 1 ? "result" : "results"} found</p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-[1fr_1fr_auto_auto] gap-3 bg-card p-3 rounded-3xl shadow-soft border border-border/40">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => update("q", e.target.value)}
                placeholder="Search by name, sport, business…"
                className="pl-10 h-11 rounded-2xl border-border bg-background"
              />
            </div>
            <Select value={city} onValueChange={(v) => update("city", v)}>
              <SelectTrigger className="h-11 rounded-2xl"><SelectValue placeholder="Any city" /></SelectTrigger>
              <SelectContent>{cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={category} onValueChange={(v) => update("category", v)}>
              <SelectTrigger className="h-11 rounded-2xl w-full md:w-44"><SelectValue placeholder="Any category" /></SelectTrigger>
              <SelectContent>
                {(Object.keys(categoryMeta) as Category[]).map((c) => (
                  <SelectItem key={c} value={c}>{categoryMeta[c].label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={age} onValueChange={(v) => update("age", v)}>
              <SelectTrigger className="h-11 rounded-2xl w-full md:w-32"><SelectValue placeholder="Any age" /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 16 }, (_, i) => i + 1).map((a) => (
                  <SelectItem key={a} value={String(a)}>{a} yrs</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {hasFilters && (
            <button
              onClick={() => setParams(new URLSearchParams())}
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground"
            >
              <X className="size-3" /> Clear filters
            </button>
          )}
        </div>
      </section>

      <section className="container mx-auto py-12 flex-1">
        {results.length === 0 ? (
          <div className="text-center py-24">
            <h2 className="font-display text-2xl font-semibold mb-2">No matches yet</h2>
            <p className="text-muted-foreground mb-6">Try widening your filters.</p>
            <Button variant="soft" onClick={() => setParams(new URLSearchParams())}>Clear filters</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {results.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        )}
      </section>

      <SiteFooter />
    </div>
  );
};

export default Browse;
