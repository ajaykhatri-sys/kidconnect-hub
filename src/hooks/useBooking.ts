import { useQuery, useMutation } from "@tanstack/react-query";

const API_BASE = "https://123kids-api.ajay-khatri.workers.dev";

export interface Schedule {
  id: string;
  listing_id: string;
  title: string;
  description: string;
  price: number;
  price_label: string;
  duration_minutes: number;
  max_spots: number;
  age_min: number;
  age_max: number;
}

export interface Availability {
  id: string;
  schedule_id: string;
  date: string;
  start_time: string;
  end_time: string;
  spots_total: number;
  spots_booked: number;
  spots_remaining: number;
}

export interface BookingRequest {
  listing_id: string;
  schedule_id: string;
  availability_id: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  child_name: string;
  child_age: number;
  num_spots: number;
  notes: string;
}

export function useSchedules(listingId: string) {
  return useQuery({
    queryKey: ["schedules", listingId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/listings/${listingId}/schedules`);
      const data = await res.json();
      return data as { success: boolean; data: Schedule[] };
    },
    enabled: !!listingId,
  });
}

export function useAvailability(scheduleId: string) {
  return useQuery({
    queryKey: ["availability", scheduleId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/api/schedules/${scheduleId}/availability`);
      const data = await res.json();
      return data as { success: boolean; data: Availability[] };
    },
    enabled: !!scheduleId,
  });
}

export function useCreateBooking() {
  return useMutation({
    mutationFn: async (booking: BookingRequest) => {
      const res = await fetch(`${API_BASE}/api/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(booking),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Booking failed");
      return data;
    },
  });
}
