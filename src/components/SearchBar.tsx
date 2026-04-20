import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cities, categoryMeta, type Category } from "@/data/listings";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export const SearchBar = () => {
  const navigate = useNavigate();
  const [city, setCity] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [query, setQuery] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    if (query.trim()) params.set("q", query.trim());
    navigate(`/browse?${params.toString()}`);
  };

  return (
    <form
      onSubmit={submit}
      className="bg-card/95 backdrop-blur-md rounded-3xl shadow-card-hover border border-border/40 p-2 md:p-2 grid grid-cols-1 md:grid-cols-[1.2fr_1fr_1fr_auto] gap-2 md:gap-0 md:divide-x divide-border"
    >
      <label className="flex items-center gap-3 px-4 py-3 md:py-2 rounded-2xl hover:bg-muted/40 transition-smooth cursor-text">
        <MapPin className="size-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">City</div>
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="border-0 p-0 h-auto shadow-none bg-transparent text-sm font-medium focus:ring-0">
              <SelectValue placeholder="Choose your city" />
            </SelectTrigger>
            <SelectContent className="max-h-72">
              {cities.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </label>

      <label className="flex items-center gap-3 px-4 py-3 md:py-2 rounded-2xl hover:bg-muted/40 transition-smooth cursor-text">
        <Sparkles className="size-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">What for</div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="border-0 p-0 h-auto shadow-none bg-transparent text-sm font-medium focus:ring-0">
              <SelectValue placeholder="Any activity" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(categoryMeta) as Category[]).map((c) => (
                <SelectItem key={c} value={c}>{categoryMeta[c].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </label>

      <label className="flex items-center gap-3 px-4 py-3 md:py-2 rounded-2xl hover:bg-muted/40 transition-smooth cursor-text">
        <Search className="size-5 text-primary shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Keyword</div>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="soccer, ballet, coding…"
            className="w-full bg-transparent text-sm font-medium placeholder:text-muted-foreground/70 outline-none"
          />
        </div>
      </label>

      <div className="flex items-center justify-end p-1">
        <Button type="submit" variant="hero" size="lg" className="w-full md:w-auto">
          <Search className="size-4" />
          Search
        </Button>
      </div>
    </form>
  );
};
