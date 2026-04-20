import { useQuery } from "@tanstack/react-query";

const API_BASE = "https://123kids-api.ajay-khatri.workers.dev";

export interface Listing {
  id: string;
  name: string;
  category: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  website: string;
  rating: number;
  review_count: number;
  description: string;
  lat: number;
  lng: number;
  photo: string;
  created_at: string;
}

export interface ListingDetail extends Listing {
  photos: string[];
  hours: { day_of_week: string; open_time: string; close_time: string }[];
}

export interface Pagination {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

interface ListingsParams {
  category?: string;
  city?: string;
  search?: string;
  page?: number;
  limit?: number;
}

async function fetchListings(params: ListingsParams = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set("category", params.category);
  if (params.city) query.set("city", params.city);
  if (params.search) query.set("search", params.search);
  if (params.page) query.set("page", String(params.page));
  if (params.limit) query.set("limit", String(params.limit));

  const res = await fetch(`${API_BASE}/api/listings?${query}`);
  const data = await res.json();
  return data as { success: boolean; data: Listing[]; pagination: Pagination };
}

async function fetchListing(id: string) {
  const res = await fetch(`${API_BASE}/api/listings/${id}`);
  const data = await res.json();
  return data as { success: boolean; data: ListingDetail };
}

async function fetchFeatured() {
  const res = await fetch(`${API_BASE}/api/featured`);
  const data = await res.json();
  return data as { success: boolean; data: Listing[] };
}

async function fetchCategories() {
  const res = await fetch(`${API_BASE}/api/categories`);
  const data = await res.json();
  return data as { success: boolean; data: { category: string; count: number }[] };
}

async function fetchCities() {
  const res = await fetch(`${API_BASE}/api/cities`);
  const data = await res.json();
  return data as { success: boolean; data: { city: string; count: number }[] };
}

async function searchListings(q: string) {
  const res = await fetch(`${API_BASE}/api/search?q=${encodeURIComponent(q)}`);
  const data = await res.json();
  return data as { success: boolean; data: Listing[] };
}

export function useListings(params: ListingsParams = {}) {
  return useQuery({
    queryKey: ["listings", params],
    queryFn: () => fetchListings(params),
  });
}

export function useListing(id: string) {
  return useQuery({
    queryKey: ["listing", id],
    queryFn: () => fetchListing(id),
    enabled: !!id,
  });
}

export function useFeaturedListings() {
  return useQuery({
    queryKey: ["featured"],
    queryFn: fetchFeatured,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
}

export function useCities() {
  return useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
  });
}

export function useSearch(q: string) {
  return useQuery({
    queryKey: ["search", q],
    queryFn: () => searchListings(q),
    enabled: q.length > 2,
  });
}
