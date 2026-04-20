import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Building2, ExternalLink } from "lucide-react";
import { toast } from "sonner";
import { uniqueSlug } from "@/lib/slug";
import type { Database } from "@/integrations/supabase/types";

type Business = Database["public"]["Tables"]["businesses"]["Row"];
type Listing = Database["public"]["Tables"]["listings"]["Row"];
type Category = Database["public"]["Enums"]["listing_category"];
type Status = Database["public"]["Enums"]["listing_status"];

const businessSchema = z.object({
  name: z.string().trim().min(2).max(120),
  city: z.string().trim().min(2).max(80),
  contact_email: z.string().trim().email().max(255).optional().or(z.literal("")),
  website: z.string().trim().url().max(255).optional().or(z.literal("")),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
});

const listingSchema = z.object({
  title: z.string().trim().min(3).max(140),
  category: z.enum(["camps", "classes", "events", "birthday"]),
  city: z.string().trim().min(2).max(80),
  address: z.string().trim().max(200).optional().or(z.literal("")),
  description: z.string().trim().max(4000).optional().or(z.literal("")),
  age_min: z.coerce.number().int().min(0).max(21).optional(),
  age_max: z.coerce.number().int().min(0).max(21).optional(),
  price_cents: z.coerce.number().int().min(0).max(10_000_000).optional(),
  price_unit: z.string().trim().max(20).optional().or(z.literal("")),
  image_url: z.string().trim().url().max(500).optional().or(z.literal("")),
});

const statusVariants: Record<Status, { label: string; className: string }> = {
  pending: { label: "Pending review", className: "bg-amber-100 text-amber-900 hover:bg-amber-100" },
  approved: { label: "Approved", className: "bg-emerald-100 text-emerald-900 hover:bg-emerald-100" },
  rejected: { label: "Rejected", className: "bg-rose-100 text-rose-900 hover:bg-rose-100" },
};

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [listings, setListings] = useState<Listing[]>([]);
  const [activeBusinessId, setActiveBusinessId] = useState<string>("");

  // Forms
  const [bName, setBName] = useState("");
  const [bCity, setBCity] = useState("");
  const [bEmail, setBEmail] = useState("");
  const [bWebsite, setBWebsite] = useState("");
  const [bDesc, setBDesc] = useState("");

  const [lTitle, setLTitle] = useState("");
  const [lCategory, setLCategory] = useState<Category>("classes");
  const [lCity, setLCity] = useState("");
  const [lAddress, setLAddress] = useState("");
  const [lDesc, setLDesc] = useState("");
  const [lAgeMin, setLAgeMin] = useState("");
  const [lAgeMax, setLAgeMax] = useState("");
  const [lPrice, setLPrice] = useState("");
  const [lPriceUnit, setLPriceUnit] = useState("session");
  const [lImage, setLImage] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth?redirect=/dashboard", { replace: true });
  }, [user, authLoading, navigate]);

  const fetchAll = async () => {
    if (!user) return;
    setLoading(true);
    const [bRes, lRes] = await Promise.all([
      supabase.from("businesses").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
      supabase.from("listings").select("*").eq("owner_id", user.id).order("created_at", { ascending: false }),
    ]);
    setBusinesses(bRes.data ?? []);
    setListings(lRes.data ?? []);
    if ((bRes.data ?? []).length && !activeBusinessId) {
      setActiveBusinessId(bRes.data![0].id);
      setLCity((bRes.data![0].city ?? "").toString());
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const ensureBusinessOwnerRole = async () => {
    if (!user) return;
    // Idempotent — unique constraint on (user_id, role) prevents duplicates.
    await supabase.from("user_roles").insert({ user_id: user.id, role: "business_owner" });
  };

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = businessSchema.safeParse({
      name: bName,
      city: bCity,
      contact_email: bEmail,
      website: bWebsite,
      description: bDesc,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { data, error } = await supabase
      .from("businesses")
      .insert({
        owner_id: user.id,
        name: parsed.data.name,
        slug: uniqueSlug(parsed.data.name),
        city: parsed.data.city,
        contact_email: parsed.data.contact_email || null,
        website: parsed.data.website || null,
        description: parsed.data.description || null,
      })
      .select()
      .single();
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    await ensureBusinessOwnerRole();
    toast.success("Business created");
    setBName(""); setBCity(""); setBEmail(""); setBWebsite(""); setBDesc("");
    setBusinesses((prev) => [data!, ...prev]);
    setActiveBusinessId(data!.id);
    setLCity(data!.city ?? "");
  };

  const handleCreateListing = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeBusinessId) {
      toast.error("Create a business first");
      return;
    }
    const parsed = listingSchema.safeParse({
      title: lTitle,
      category: lCategory,
      city: lCity,
      address: lAddress,
      description: lDesc,
      age_min: lAgeMin || undefined,
      age_max: lAgeMax || undefined,
      price_cents: lPrice ? Math.round(Number(lPrice) * 100) : undefined,
      price_unit: lPriceUnit,
      image_url: lImage,
    });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setBusy(true);
    const { data, error } = await supabase
      .from("listings")
      .insert({
        owner_id: user.id,
        business_id: activeBusinessId,
        title: parsed.data.title,
        slug: uniqueSlug(parsed.data.title),
        category: parsed.data.category,
        city: parsed.data.city,
        address: parsed.data.address || null,
        description: parsed.data.description || null,
        age_min: parsed.data.age_min ?? null,
        age_max: parsed.data.age_max ?? null,
        price_cents: parsed.data.price_cents ?? null,
        price_unit: parsed.data.price_unit || null,
        image_url: parsed.data.image_url || null,
      })
      .select()
      .single();
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Listing submitted for review");
    setLTitle(""); setLAddress(""); setLDesc(""); setLAgeMin(""); setLAgeMax(""); setLPrice(""); setLImage("");
    setListings((prev) => [data!, ...prev]);
  };

  const handleDeleteListing = async (id: string) => {
    const { error } = await supabase.from("listings").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    setListings((prev) => prev.filter((l) => l.id !== id));
    toast.success("Listing deleted");
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const hasBusiness = businesses.length > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-warm">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-10 md:py-14 space-y-10">
        <header className="space-y-1">
          <h1 className="font-display text-4xl">Your dashboard</h1>
          <p className="text-muted-foreground">Manage your business profile and listings.</p>
        </header>

        {/* Businesses */}
        <section className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="size-5" /> {hasBusiness ? "Add another business" : "Create your business"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreateBusiness} className="space-y-3">
                <div className="space-y-1.5">
                  <Label htmlFor="b-name">Business name</Label>
                  <Input id="b-name" value={bName} onChange={(e) => setBName(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-city">City</Label>
                  <Input id="b-city" value={bCity} onChange={(e) => setBCity(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-email">Contact email</Label>
                  <Input id="b-email" type="email" value={bEmail} onChange={(e) => setBEmail(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-web">Website</Label>
                  <Input id="b-web" type="url" placeholder="https://" value={bWebsite} onChange={(e) => setBWebsite(e.target.value)} />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="b-desc">Short description</Label>
                  <Textarea id="b-desc" rows={3} value={bDesc} onChange={(e) => setBDesc(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy && <Loader2 className="size-4 animate-spin" />} Save business
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your businesses</CardTitle>
            </CardHeader>
            <CardContent>
              {!hasBusiness ? (
                <p className="text-sm text-muted-foreground">No businesses yet — create one to start adding listings.</p>
              ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                  {businesses.map((b) => (
                    <button
                      key={b.id}
                      onClick={() => { setActiveBusinessId(b.id); setLCity(b.city ?? ""); }}
                      className={`text-left rounded-2xl border p-4 transition-smooth hover:bg-muted/50 ${
                        activeBusinessId === b.id ? "border-primary ring-2 ring-primary/20" : "border-border"
                      }`}
                    >
                      <div className="font-semibold">{b.name}</div>
                      <div className="text-xs text-muted-foreground">{b.city ?? "—"}</div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </section>

        {/* New listing */}
        {hasBusiness && (
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="size-5" /> New listing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleCreateListing} className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="l-title">Title</Label>
                    <Input id="l-title" value={lTitle} onChange={(e) => setLTitle(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5">
                    <Label>Category</Label>
                    <Select value={lCategory} onValueChange={(v) => setLCategory(v as Category)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="camps">Camps</SelectItem>
                        <SelectItem value="classes">Classes</SelectItem>
                        <SelectItem value="events">Events</SelectItem>
                        <SelectItem value="birthday">Birthdays</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="l-city">City</Label>
                    <Input id="l-city" value={lCity} onChange={(e) => setLCity(e.target.value)} required />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="l-address">Address (optional)</Label>
                    <Input id="l-address" value={lAddress} onChange={(e) => setLAddress(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="l-amin">Min age</Label>
                    <Input id="l-amin" type="number" min={0} max={21} value={lAgeMin} onChange={(e) => setLAgeMin(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="l-amax">Max age</Label>
                    <Input id="l-amax" type="number" min={0} max={21} value={lAgeMax} onChange={(e) => setLAgeMax(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="l-price">Price (USD)</Label>
                    <Input id="l-price" type="number" step="0.01" min={0} value={lPrice} onChange={(e) => setLPrice(e.target.value)} />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="l-unit">Per</Label>
                    <Input id="l-unit" placeholder="session, week, child" value={lPriceUnit} onChange={(e) => setLPriceUnit(e.target.value)} />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="l-image">Image URL</Label>
                    <Input id="l-image" type="url" placeholder="https://..." value={lImage} onChange={(e) => setLImage(e.target.value)} />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <Label htmlFor="l-desc">Description</Label>
                    <Textarea id="l-desc" rows={4} value={lDesc} onChange={(e) => setLDesc(e.target.value)} />
                  </div>
                  <div className="md:col-span-2">
                    <Button type="submit" disabled={busy}>
                      {busy && <Loader2 className="size-4 animate-spin" />} Submit for review
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </section>
        )}

        {/* Listings */}
        <section>
          <h2 className="font-display text-2xl mb-4">Your listings</h2>
          {listings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No listings yet.</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {listings.map((l) => {
                const v = statusVariants[l.status];
                return (
                  <Card key={l.id} className="overflow-hidden">
                    {l.image_url && (
                      <img src={l.image_url} alt={l.title} className="h-36 w-full object-cover" />
                    )}
                    <CardContent className="p-4 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold leading-tight">{l.title}</h3>
                        <Badge className={v.className}>{v.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground capitalize">{l.category} · {l.city}</p>
                      {l.status === "rejected" && l.rejection_reason && (
                        <p className="text-xs text-rose-700 bg-rose-50 rounded-md p-2">
                          Reason: {l.rejection_reason}
                        </p>
                      )}
                      <div className="flex items-center gap-2 pt-1">
                        {l.status === "approved" && (
                          <Button asChild size="sm" variant="outline">
                            <Link to={`/listing/${l.slug}`}>View <ExternalLink className="size-3.5 ml-1" /></Link>
                          </Button>
                        )}
                        <Button size="sm" variant="ghost" className="text-rose-600 hover:text-rose-700" onClick={() => handleDeleteListing(l.id)}>
                          Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
