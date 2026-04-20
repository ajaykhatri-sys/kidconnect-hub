import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Building2, LayoutDashboard, Calendar, BookOpen,
  DollarSign, LogOut, Search, Plus, Check, X,
  Loader2, Star, MapPin, Clock, Users, ChevronRight,
  AlertCircle, TrendingUp, CreditCard, Bell
} from "lucide-react";
import { useBusinessAuth, useBusinessApi } from "@/hooks/useBusinessAuth";

type Tab = "overview" | "listings" | "availability" | "bookings" | "payouts";

export default function BusinessDashboard() {
  const { business, logout, loading } = useBusinessAuth();
  const api = useBusinessApi();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("overview");
  const [claimedListings, setClaimedListings] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [stats, setStats] = useState({ total_bookings: 0, total_revenue: 0, pending_bookings: 0 });
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!loading && !business) navigate("/business/auth");
  }, [business, loading]);

  useEffect(() => {
    if (business) loadData();
  }, [business]);

  const loadData = async () => {
    setDataLoading(true);
    try {
      const [listingsRes, bookingsRes, statsRes] = await Promise.all([
        api("/api/business/listings"),
        api("/api/business/bookings"),
        api("/api/business/stats"),
      ]);
      setClaimedListings(listingsRes.data || []);
      setBookings(bookingsRes.data || []);
      setStats(statsRes.data || { total_bookings: 0, total_revenue: 0, pending_bookings: 0 });
    } catch (e) { console.error(e); }
    setDataLoading(false);
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="w-8 h-8 animate-spin text-blue-500" /></div>;
  if (!business) return null;

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "listings", label: "My Listings", icon: Building2 },
    { id: "availability", label: "Availability", icon: Calendar },
    { id: "bookings", label: "Bookings", icon: BookOpen },
    { id: "payouts", label: "Payouts", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col fixed h-full z-10 hidden md:flex">
        <div className="p-6 border-b">
          <Link to="/" className="flex items-center gap-2 mb-4">
            <span className="text-blue-600 font-bold text-lg">123kids</span>
            <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium">Business</span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold">{business.owner_name[0]}</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm truncate max-w-[130px]">{business.business_name || business.owner_name}</p>
              <p className="text-xs text-gray-500 truncate max-w-[130px]">{business.email}</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as Tab)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.id ? "bg-blue-50 text-blue-600" : "text-gray-600 hover:bg-gray-50"
              }`}>
              <t.icon className="w-4 h-4" />
              {t.label}
              {t.id === "bookings" && stats.pending_bookings > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {stats.pending_bookings}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <button onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-red-50 hover:text-red-600 transition-all">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 md:ml-64">
        {/* Mobile header */}
        <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between">
          <span className="font-bold text-blue-600">123kids Business</span>
          <button onClick={() => { logout(); navigate("/"); }} className="text-gray-500">
            <LogOut className="w-5 h-5" />
          </button>
        </div>

        {/* Mobile tabs */}
        <div className="md:hidden flex overflow-x-auto bg-white border-b px-4 gap-4">
          {tabs.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id as Tab)}
              className={`flex-shrink-0 py-3 text-xs font-medium border-b-2 transition-all ${
                tab === t.id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500"
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {/* OVERVIEW TAB */}
          {tab === "overview" && (
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Welcome back, {business.owner_name.split(" ")[0]}! 👋
              </h1>

              {/* Stripe banner */}
              {!business.stripe_onboarding_complete && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-6 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-amber-800">Set up payouts to get paid</p>
                    <p className="text-sm text-amber-700 mt-0.5">Connect your Stripe account to receive payments from bookings.</p>
                  </div>
                  <button onClick={() => setTab("payouts")}
                    className="flex-shrink-0 px-4 py-2 bg-amber-500 text-white rounded-xl text-sm font-medium hover:bg-amber-600 transition-colors">
                    Set up →
                  </button>
                </div>
              )}

              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {[
                  { label: "Total Bookings", value: stats.total_bookings, icon: BookOpen, color: "blue" },
                  { label: "Total Revenue", value: `$${stats.total_revenue?.toFixed(2) || "0.00"}`, icon: TrendingUp, color: "green" },
                  { label: "Pending", value: stats.pending_bookings, icon: Bell, color: "orange" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100">
                    <div className={`w-10 h-10 rounded-xl bg-${stat.color}-50 flex items-center justify-center mb-3`}>
                      <stat.icon className={`w-5 h-5 text-${stat.color}-500`} />
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button onClick={() => setTab("listings")}
                  className="bg-white rounded-2xl p-5 border border-gray-100 text-left hover:border-blue-200 hover:shadow-sm transition-all group">
                  <Building2 className="w-8 h-8 text-blue-500 mb-3" />
                  <p className="font-semibold text-gray-900">Manage Listings</p>
                  <p className="text-sm text-gray-500 mt-1">Claim your business or add new listings</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-3 group-hover:text-blue-500 transition-colors" />
                </button>
                <button onClick={() => setTab("availability")}
                  className="bg-white rounded-2xl p-5 border border-gray-100 text-left hover:border-blue-200 hover:shadow-sm transition-all group">
                  <Calendar className="w-8 h-8 text-green-500 mb-3" />
                  <p className="font-semibold text-gray-900">Manage Availability</p>
                  <p className="text-sm text-gray-500 mt-1">Set dates, times and pricing for your activities</p>
                  <ChevronRight className="w-4 h-4 text-gray-400 mt-3 group-hover:text-green-500 transition-colors" />
                </button>
              </div>
            </div>
          )}

          {/* LISTINGS TAB */}
          {tab === "listings" && (
            <ListingsTab listings={claimedListings} api={api} onRefresh={loadData} />
          )}

          {/* AVAILABILITY TAB */}
          {tab === "availability" && (
            <AvailabilityTab listings={claimedListings} api={api} onRefresh={loadData} />
          )}

          {/* BOOKINGS TAB */}
          {tab === "bookings" && (
            <BookingsTab bookings={bookings} api={api} onRefresh={loadData} />
          )}

          {/* PAYOUTS TAB */}
          {tab === "payouts" && (
            <PayoutsTab business={business} api={api} />
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// LISTINGS TAB
// ============================================================
function ListingsTab({ listings, api, onRefresh }: any) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);
  const [claiming, setClaiming] = useState<string | null>(null);

  const searchListings = async () => {
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://123kids-api.ajay-khatri.workers.dev/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      setSearchResults(data.data || []);
    } catch (e) { console.error(e); }
    setSearching(false);
  };

  const claimListing = async (listingId: string) => {
    setClaiming(listingId);
    try {
      const res = await api("/api/business/claim", {
        method: "POST",
        body: JSON.stringify({ listing_id: listingId }),
      });
      if (res.success) {
        alert("✅ Listing claimed! It will appear in your dashboard after verification.");
        onRefresh();
        setSearchResults([]);
        setSearchQuery("");
      } else {
        alert("Error: " + res.error);
      }
    } catch (e) { alert("Failed to claim listing"); }
    setClaiming(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">My Listings</h2>
      </div>

      {/* My claimed listings */}
      {listings.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {listings.map((l: any) => (
            <div key={l.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              {l.photo && <img src={l.photo} alt={l.name} className="w-full h-32 object-cover" />}
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 text-sm">{l.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{l.city} · {l.category}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${l.claim_status === "approved" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                    {l.claim_status === "approved" ? "✓ Verified" : "Pending"}
                  </span>
                </div>
                {l.rating && (
                  <div className="flex items-center gap-1 mt-2">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-600">{l.rating} ({l.review_count} reviews)</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-blue-50 rounded-2xl p-6 mb-8 text-center">
          <Building2 className="w-12 h-12 text-blue-400 mx-auto mb-3" />
          <p className="font-semibold text-gray-900">No listings yet</p>
          <p className="text-sm text-gray-500 mt-1">Search for your business below to claim it</p>
        </div>
      )}

      {/* Claim a listing */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-semibold text-gray-900 mb-4">🔍 Find & Claim Your Listing</h3>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            placeholder="Search by business name..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && searchListings()}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button onClick={searchListings} disabled={searching}
            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            Search
          </button>
        </div>

        {searchResults.length > 0 && (
          <div className="space-y-2">
            {searchResults.map((l: any) => (
              <div key={l.id} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50">
                <div>
                  <p className="font-medium text-sm text-gray-900">{l.name}</p>
                  <p className="text-xs text-gray-500">{l.address}</p>
                </div>
                <button
                  onClick={() => claimListing(l.id)}
                  disabled={claiming === l.id}
                  className="flex-shrink-0 ml-4 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-1"
                >
                  {claiming === l.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Plus className="w-3 h-3" />}
                  Claim
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ============================================================
// AVAILABILITY TAB
// ============================================================
function AvailabilityTab({ listings, api, onRefresh }: any) {
  const [selectedListing, setSelectedListing] = useState<any>(null);
  const [schedules, setSchedules] = useState<any[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);
  const [showAddSchedule, setShowAddSchedule] = useState(false);
  const [showAddSlot, setShowAddSlot] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const [scheduleForm, setScheduleForm] = useState({
    title: "", description: "", price: "", price_label: "per person",
    duration_minutes: "60", max_spots: "10", age_min: "3", age_max: "18",
  });
  const [slotForm, setSlotForm] = useState({
    date: "", start_time: "", end_time: "", spots_total: "10",
  });

  const loadSchedules = async (listingId: string) => {
    const res = await fetch(`https://123kids-api.ajay-khatri.workers.dev/api/listings/${listingId}/schedules`);
    const data = await res.json();
    setSchedules(data.data || []);
  };

  const loadAvailability = async (scheduleId: string) => {
    const res = await fetch(`https://123kids-api.ajay-khatri.workers.dev/api/schedules/${scheduleId}/availability`);
    const data = await res.json();
    setAvailability(data.data || []);
  };

  const addSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api("/api/business/schedules", {
        method: "POST",
        body: JSON.stringify({ ...scheduleForm, listing_id: selectedListing.id }),
      });
      if (res.success) {
        setShowAddSchedule(false);
        loadSchedules(selectedListing.id);
        setScheduleForm({ title: "", description: "", price: "", price_label: "per person", duration_minutes: "60", max_spots: "10", age_min: "3", age_max: "18" });
      }
    } catch (e) { alert("Failed to add schedule"); }
    setSaving(false);
  };

  const addSlot = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await api("/api/business/availability", {
        method: "POST",
        body: JSON.stringify({ ...slotForm, schedule_id: selectedSchedule.id }),
      });
      if (res.success) {
        setShowAddSlot(false);
        loadAvailability(selectedSchedule.id);
        setSlotForm({ date: "", start_time: "", end_time: "", spots_total: "10" });
      }
    } catch (e) { alert("Failed to add slot"); }
    setSaving(false);
  };

  const deleteSlot = async (slotId: string) => {
    if (!confirm("Delete this time slot?")) return;
    await api(`/api/business/availability/${slotId}`, { method: "DELETE" });
    if (selectedSchedule) loadAvailability(selectedSchedule.id);
  };

  if (listings.length === 0) {
    return (
      <div className="text-center py-16">
        <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <p className="font-semibold text-gray-900">No listings yet</p>
        <p className="text-sm text-gray-500 mt-1">Claim a listing first to manage availability</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Manage Availability</h2>

      {/* Step 1: Select listing */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <p className="text-sm font-semibold text-gray-700 mb-3">1. Select a listing</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {listings.map((l: any) => (
            <button key={l.id}
              onClick={() => { setSelectedListing(l); setSelectedSchedule(null); loadSchedules(l.id); }}
              className={`text-left p-3 rounded-xl border-2 transition-all ${selectedListing?.id === l.id ? "border-blue-400 bg-blue-50" : "border-gray-100 hover:border-gray-200"}`}>
              <p className="font-medium text-sm text-gray-900">{l.name}</p>
              <p className="text-xs text-gray-500">{l.city}</p>
            </button>
          ))}
        </div>
      </div>

      {selectedListing && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">2. Activity / Pricing Options</p>
            <button onClick={() => setShowAddSchedule(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors">
              <Plus className="w-3 h-3" /> Add Option
            </button>
          </div>

          {showAddSchedule && (
            <form onSubmit={addSchedule} className="bg-blue-50 rounded-xl p-4 mb-4 space-y-3">
              <input required placeholder="Title (e.g. Beginner Karate Class)" value={scheduleForm.title}
                onChange={e => setScheduleForm({...scheduleForm, title: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input placeholder="Description" value={scheduleForm.description}
                onChange={e => setScheduleForm({...scheduleForm, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="grid grid-cols-2 gap-3">
                <input required type="number" placeholder="Price ($)" value={scheduleForm.price}
                  onChange={e => setScheduleForm({...scheduleForm, price: e.target.value})}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <select value={scheduleForm.price_label} onChange={e => setScheduleForm({...scheduleForm, price_label: e.target.value})}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>per person</option><option>per child</option><option>per session</option><option>per party</option><option>per month</option>
                </select>
                <input type="number" placeholder="Duration (min)" value={scheduleForm.duration_minutes}
                  onChange={e => setScheduleForm({...scheduleForm, duration_minutes: e.target.value})}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Max spots" value={scheduleForm.max_spots}
                  onChange={e => setScheduleForm({...scheduleForm, max_spots: e.target.value})}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Min age" value={scheduleForm.age_min}
                  onChange={e => setScheduleForm({...scheduleForm, age_min: e.target.value})}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                <input type="number" placeholder="Max age" value={scheduleForm.age_max}
                  onChange={e => setScheduleForm({...scheduleForm, age_max: e.target.value})}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save
                </button>
                <button type="button" onClick={() => setShowAddSchedule(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {schedules.map((s: any) => (
              <button key={s.id}
                onClick={() => { setSelectedSchedule(s); loadAvailability(s.id); }}
                className={`w-full text-left p-3 rounded-xl border-2 transition-all ${selectedSchedule?.id === s.id ? "border-green-400 bg-green-50" : "border-gray-100 hover:border-gray-200"}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{s.title}</p>
                    <p className="text-xs text-gray-500">${s.price} {s.price_label} · {s.duration_minutes} min · Max {s.max_spots}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedSchedule && (
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-gray-700">3. Time Slots for "{selectedSchedule.title}"</p>
            <button onClick={() => setShowAddSlot(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-medium hover:bg-green-700 transition-colors">
              <Plus className="w-3 h-3" /> Add Time Slot
            </button>
          </div>

          {showAddSlot && (
            <form onSubmit={addSlot} className="bg-green-50 rounded-xl p-4 mb-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs text-gray-500 mb-1 block">Date</label>
                  <input required type="date" value={slotForm.date}
                    onChange={e => setSlotForm({...slotForm, date: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Start time</label>
                  <input required placeholder="e.g. 10:00 AM" value={slotForm.start_time}
                    onChange={e => setSlotForm({...slotForm, start_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">End time</label>
                  <input placeholder="e.g. 11:00 AM" value={slotForm.end_time}
                    onChange={e => setSlotForm({...slotForm, end_time: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
                <div>
                  <label className="text-xs text-gray-500 mb-1 block">Total spots</label>
                  <input required type="number" value={slotForm.spots_total}
                    onChange={e => setSlotForm({...slotForm, spots_total: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500" />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={saving}
                  className="flex items-center gap-1 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Add Slot
                </button>
                <button type="button" onClick={() => setShowAddSlot(false)}
                  className="px-4 py-2 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </form>
          )}

          <div className="space-y-2">
            {availability.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No time slots yet. Add your first one above!</p>
            ) : availability.map((slot: any) => (
              <div key={slot.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {new Date(slot.date + "T00:00:00").toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                    {" · "}{slot.start_time}{slot.end_time ? ` – ${slot.end_time}` : ""}
                  </p>
                  <p className="text-xs text-gray-500">
                    {slot.spots_booked}/{slot.spots_total} booked
                    {slot.spots_total - slot.spots_booked === 0 && <span className="text-red-500 ml-1">· Full</span>}
                  </p>
                </div>
                <button onClick={() => deleteSlot(slot.id)}
                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// BOOKINGS TAB
// ============================================================
function BookingsTab({ bookings, api, onRefresh }: any) {
  const [updating, setUpdating] = useState<string | null>(null);

  const updateStatus = async (bookingId: string, status: string) => {
    setUpdating(bookingId);
    await api(`/api/business/bookings/${bookingId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    onRefresh();
    setUpdating(null);
  };

  const statusColors: Record<string, string> = {
    confirmed: "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    cancelled: "bg-red-100 text-red-700",
    completed: "bg-blue-100 text-blue-700",
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Bookings</h2>
      {bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="font-semibold text-gray-900">No bookings yet</p>
          <p className="text-sm text-gray-500 mt-1">Bookings will appear here once customers book your activities</p>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b: any) => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{b.parent_name}</p>
                  <p className="text-sm text-gray-500">{b.parent_email} {b.parent_phone ? `· ${b.parent_phone}` : ""}</p>
                </div>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[b.status] || "bg-gray-100 text-gray-700"}`}>
                  {b.status}
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-4">
                <div><p className="text-xs text-gray-400">Child</p><p className="font-medium">{b.child_name || "—"} {b.child_age ? `(age ${b.child_age})` : ""}</p></div>
                <div><p className="text-xs text-gray-400">Spots</p><p className="font-medium">{b.num_spots}</p></div>
                <div><p className="text-xs text-gray-400">Total</p><p className="font-medium text-green-600">${b.total_price}</p></div>
                <div><p className="text-xs text-gray-400">Booked</p><p className="font-medium">{new Date(b.created_at).toLocaleDateString()}</p></div>
              </div>
              {b.notes && <p className="text-sm text-gray-500 bg-gray-50 rounded-lg px-3 py-2 mb-3">📝 {b.notes}</p>}
              {b.status === "confirmed" && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(b.id, "completed")} disabled={updating === b.id}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                    <Check className="w-3 h-3" /> Mark Complete
                  </button>
                  <button onClick={() => updateStatus(b.id, "cancelled")} disabled={updating === b.id}
                    className="flex items-center gap-1 px-3 py-1.5 border border-red-200 text-red-600 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors disabled:opacity-50">
                    <X className="w-3 h-3" /> Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================
// PAYOUTS TAB
// ============================================================
function PayoutsTab({ business, api }: any) {
  const [loading, setLoading] = useState(false);

  const startStripeOnboarding = async () => {
    setLoading(true);
    try {
      const res = await api("/api/business/stripe/onboard", { method: "POST" });
      if (res.url) {
        window.location.href = res.url;
      } else {
        alert("Error: " + (res.error || "Could not start Stripe onboarding"));
      }
    } catch (e) { alert("Failed to connect Stripe"); }
    setLoading(false);
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-900 mb-6">Payouts</h2>
      {business.stripe_onboarding_complete ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Stripe Connected ✓</p>
              <p className="text-sm text-gray-500">You're all set to receive payments</p>
            </div>
          </div>
          <p className="text-sm text-gray-500">
            123kids.com collects payments from customers and transfers your earnings to your Stripe account automatically after each completed booking, minus a 15% platform fee.
          </p>
          <div className="mt-4 bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 font-medium uppercase tracking-wide mb-2">Fee structure</p>
            <div className="flex justify-between text-sm"><span className="text-gray-600">Your earnings</span><span className="font-semibold text-green-600">85%</span></div>
            <div className="flex justify-between text-sm mt-1"><span className="text-gray-600">Platform fee</span><span className="font-semibold text-gray-900">15%</span></div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">Connect Stripe to get paid</p>
              <p className="text-sm text-gray-500">Set up your Stripe account to receive payouts</p>
            </div>
          </div>

          <div className="space-y-3 mb-6">
            {["Receive payments directly to your bank account", "Automatic payouts after each booking", "85% of each booking goes to you", "Secure & trusted by millions of businesses"].map((item) => (
              <div key={item} className="flex items-center gap-2 text-sm text-gray-600">
                <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>

          <button onClick={startStripeOnboarding} disabled={loading}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Connecting...</> : "Connect with Stripe →"}
          </button>
          <p className="text-xs text-center text-gray-400 mt-3">You'll be redirected to Stripe to complete setup</p>
        </div>
      )}
    </div>
  );
}
