import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin, Sparkles } from "lucide-react";
import { useCities } from "@/hooks/useListings";

const CATEGORIES = [
  { value: "Camps", label: "Camps" },
  { value: "Classes", label: "Classes" },
  { value: "Events", label: "Events" },
  { value: "Birthday Spots", label: "Birthdays" },
];

export function SearchBar() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [category, setCategory] = useState("");
  const [keyword, setKeyword] = useState("");
  const { data: citiesData } = useCities();
  const cities = citiesData?.data || [];

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (city) params.set("city", city);
    if (category) params.set("category", category);
    if (keyword) params.set("search", keyword);
    navigate(`/listings?${params.toString()}`);
  };

  return (
    <div className="bg-card/90 backdrop-blur rounded-3xl shadow-soft border border-border/40 p-3">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3">
        {/* City */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-background rounded-2xl border border-border">
          <MapPin className="size-4 text-primary flex-shrink-0" />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none text-foreground"
          >
            <option value="">Choose your city</option>
            {cities.map((c) => (
              <option key={c.city} value={c.city}>{c.city}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-background rounded-2xl border border-border">
          <Sparkles className="size-4 text-primary flex-shrink-0" />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none text-foreground"
          >
            <option value="">Any activity</option>
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Keyword */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-background rounded-2xl border border-border">
          <Search className="size-4 text-muted-foreground flex-shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="soccer, ballet, coding..."
            className="flex-1 bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>

        {/* Search Button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-2xl font-semibold text-sm hover:bg-primary/90 transition-colors"
        >
          <Search className="size-4" />
          Search
        </button>
      </div>
    </div>
  );
}
