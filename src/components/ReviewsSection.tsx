import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { StarRating } from "./StarRating";
import { Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface ReviewWithProfile {
  id: string;
  rating: number;
  comment: string | null;
  created_at: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

interface ReviewsSectionProps {
  listingId: string;
  onSummaryChange?: (summary: { count: number; average: number }) => void;
}

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().trim().max(2000).optional(),
});

export const ReviewsSection = ({ listingId, onSummaryChange }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<ReviewWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    const { data: rawReviews, error } = await supabase
      .from("reviews")
      .select("id, rating, comment, created_at, user_id")
      .eq("listing_id", listingId)
      .order("created_at", { ascending: false });

    if (error) {
      toast.error(error.message);
      setLoading(false);
      return;
    }

    const userIds = Array.from(new Set((rawReviews ?? []).map((r) => r.user_id)));
    let profileMap = new Map<string, { display_name: string | null; avatar_url: string | null }>();
    if (userIds.length) {
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, display_name, avatar_url")
        .in("user_id", userIds);
      (profiles ?? []).forEach((p) =>
        profileMap.set(p.user_id, { display_name: p.display_name, avatar_url: p.avatar_url }),
      );
    }

    const merged: ReviewWithProfile[] = (rawReviews ?? []).map((r) => ({
      ...r,
      display_name: profileMap.get(r.user_id)?.display_name ?? null,
      avatar_url: profileMap.get(r.user_id)?.avatar_url ?? null,
    }));

    setReviews(merged);
    const count = merged.length;
    const average = count ? merged.reduce((s, r) => s + r.rating, 0) / count : 0;
    onSummaryChange?.({ count, average });
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  const myReview = user ? reviews.find((r) => r.user_id === user.id) : undefined;

  useEffect(() => {
    if (editingId && myReview) {
      setRating(myReview.rating);
      setComment(myReview.comment ?? "");
    }
  }, [editingId, myReview]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const parsed = reviewSchema.safeParse({ rating, comment });
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message ?? "Please select a rating");
      return;
    }
    setBusy(true);
    if (myReview) {
      const { error } = await supabase
        .from("reviews")
        .update({ rating: parsed.data.rating, comment: parsed.data.comment || null })
        .eq("id", myReview.id);
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Review updated");
    } else {
      const { error } = await supabase
        .from("reviews")
        .insert({
          listing_id: listingId,
          user_id: user.id,
          rating: parsed.data.rating,
          comment: parsed.data.comment || null,
        });
      setBusy(false);
      if (error) return toast.error(error.message);
      toast.success("Thanks for your review!");
    }
    setEditingId(null);
    setRating(0);
    setComment("");
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete your review?")) return;
    const { error } = await supabase.from("reviews").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Review deleted");
    load();
  };

  return (
    <section className="mt-12">
      <h2 className="font-display text-2xl font-semibold mb-5">Reviews</h2>

      {/* Composer */}
      {user ? (
        (!myReview || editingId) ? (
          <form onSubmit={submit} className="rounded-3xl border border-border/60 bg-card p-5 mb-6 space-y-3 shadow-soft">
            <div>
              <p className="text-sm font-semibold mb-1.5">Your rating</p>
              <StarRating value={rating} onChange={setRating} size="lg" />
            </div>
            <div>
              <label htmlFor="review-comment" className="text-sm font-semibold">
                Tell other parents about your experience (optional)
              </label>
              <Textarea
                id="review-comment"
                rows={4}
                maxLength={2000}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="mt-1.5"
                placeholder="What did your kid love? Anything to know before booking?"
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" disabled={busy || rating === 0}>
                {busy && <Loader2 className="size-4 animate-spin" />}
                {myReview ? "Update review" : "Post review"}
              </Button>
              {editingId && (
                <Button type="button" variant="ghost" onClick={() => { setEditingId(null); setRating(0); setComment(""); }}>
                  Cancel
                </Button>
              )}
            </div>
          </form>
        ) : (
          <div className="rounded-3xl border border-border/60 bg-muted/30 p-5 mb-6 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">You've reviewed this listing.</p>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditingId(myReview.id)}>Edit</Button>
              <Button size="sm" variant="ghost" className="text-rose-600 hover:text-rose-700" onClick={() => remove(myReview.id)}>
                <Trash2 className="size-4" /> Delete
              </Button>
            </div>
          </div>
        )
      ) : (
        <div className="rounded-3xl border border-dashed border-border bg-card/50 p-5 mb-6 text-sm text-muted-foreground">
          <Link to={`/auth?redirect=${encodeURIComponent(window.location.pathname)}`} className="text-primary font-semibold hover:underline">
            Sign in
          </Link>{" "}
          to leave a review.
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="size-5 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet — be the first!</p>
      ) : (
        <ul className="space-y-5">
          {reviews.map((r) => {
            const initial = (r.display_name?.[0] ?? "U").toUpperCase();
            return (
              <li key={r.id} className="flex gap-4">
                <Avatar className="size-10 shrink-0">
                  {r.avatar_url && <img src={r.avatar_url} alt="" className="size-full object-cover" />}
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                    {initial}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-sm">{r.display_name ?? "Anonymous"}</span>
                    <span className="text-xs text-muted-foreground">
                      · {formatDistanceToNow(new Date(r.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  <StarRating value={r.rating} size="sm" readOnly className="mt-0.5" />
                  {r.comment && <p className="mt-2 text-sm text-foreground/90 whitespace-pre-wrap">{r.comment}</p>}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};
