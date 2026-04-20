import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Check, X, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import type { Database } from "@/integrations/supabase/types";

type Listing = Database["public"]["Tables"]["listings"]["Row"];
type Status = Database["public"]["Enums"]["listing_status"];

export default function Admin() {
  const { user, isAdmin, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Status>("pending");
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectTarget, setRejectTarget] = useState<Listing | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user) navigate("/auth?redirect=/admin", { replace: true });
      else if (!isAdmin) navigate("/", { replace: true });
    }
  }, [user, isAdmin, authLoading, navigate]);

  const load = async (status: Status) => {
    setLoading(true);
    const { data, error } = await supabase
      .from("listings")
      .select("*")
      .eq("status", status)
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    setListings(data ?? []);
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) load(tab);
  }, [tab, isAdmin]);

  const approve = async (l: Listing) => {
    setBusy(true);
    const { error } = await supabase
      .from("listings")
      .update({ status: "approved", rejection_reason: null })
      .eq("id", l.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success(`Approved "${l.title}"`);
    setListings((prev) => prev.filter((x) => x.id !== l.id));
  };

  const submitReject = async () => {
    if (!rejectTarget) return;
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason");
      return;
    }
    setBusy(true);
    const { error } = await supabase
      .from("listings")
      .update({ status: "rejected", rejection_reason: rejectReason.trim().slice(0, 500) })
      .eq("id", rejectTarget.id);
    setBusy(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Listing rejected");
    setListings((prev) => prev.filter((x) => x.id !== rejectTarget.id));
    setRejectTarget(null);
    setRejectReason("");
  };

  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-warm">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-warm">
      <SiteHeader />
      <main className="flex-1 container mx-auto py-10 md:py-14 space-y-6">
        <header className="flex items-center gap-3">
          <ShieldCheck className="size-7 text-primary" />
          <div>
            <h1 className="font-display text-3xl md:text-4xl">Moderation</h1>
            <p className="text-sm text-muted-foreground">Review listings submitted by businesses.</p>
          </div>
        </header>

        <Tabs value={tab} onValueChange={(v) => setTab(v as Status)}>
          <TabsList>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>

          <TabsContent value={tab} className="mt-6">
            {loading ? (
              <div className="flex justify-center py-16">
                <Loader2 className="size-6 animate-spin text-primary" />
              </div>
            ) : listings.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nothing here.</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                {listings.map((l) => (
                  <Card key={l.id} className="overflow-hidden">
                    <div className="flex">
                      {l.image_url && (
                        <img src={l.image_url} alt={l.title} className="w-32 h-32 object-cover shrink-0" />
                      )}
                      <CardContent className="p-4 flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-semibold leading-tight">{l.title}</h3>
                          <Badge variant="secondary" className="capitalize">{l.category}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{l.city}</p>
                        {l.description && (
                          <p className="text-xs text-muted-foreground line-clamp-3">{l.description}</p>
                        )}
                        {l.rejection_reason && tab === "rejected" && (
                          <p className="text-xs text-rose-700 bg-rose-50 rounded-md p-2">
                            Reason: {l.rejection_reason}
                          </p>
                        )}
                        {tab === "pending" && (
                          <div className="flex gap-2 pt-1">
                            <Button size="sm" onClick={() => approve(l)} disabled={busy}>
                              <Check className="size-4 mr-1" /> Approve
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setRejectTarget(l)} disabled={busy}>
                              <X className="size-4 mr-1" /> Reject
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
      <SiteFooter />

      <Dialog open={!!rejectTarget} onOpenChange={(o) => !o && setRejectTarget(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject listing</DialogTitle>
            <DialogDescription>
              Tell the business why this listing is being rejected. They'll see the reason in their dashboard.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            rows={4}
            placeholder="e.g. Image is missing or unsuitable, missing pricing details..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            maxLength={500}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectTarget(null)}>Cancel</Button>
            <Button onClick={submitReject} disabled={busy}>
              {busy && <Loader2 className="size-4 animate-spin" />} Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
