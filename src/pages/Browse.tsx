import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

// Browse now redirects to /listings which uses real API data with slug URLs
const Browse = () => {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    // Map old Browse params to new Listings params
    const newParams = new URLSearchParams();
    const category = params.get("category");
    const city = params.get("city");
    const q = params.get("q");
    if (category) newParams.set("category", category);
    if (city) newParams.set("city", city);
    if (q) newParams.set("search", q);
    navigate(`/listings?${newParams.toString()}`, { replace: true });
  }, []);

  return null;
};

export default Browse;
