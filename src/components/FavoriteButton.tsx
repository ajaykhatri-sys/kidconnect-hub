import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface FavoriteButtonProps {
  listingId: string;
  className?: string;
  variant?: "icon" | "labeled";
}

export const FavoriteButton = ({ listingId, className, variant = "icon" }: FavoriteButtonProps) => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      if (!user) {
        setIsFav(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase
        .from("favorites")
        .select("id")
        .eq("listing_id", listingId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (!cancelled) {
        setIsFav(!!data);
        setLoading(false);
      }
    };
    if (!authLoading) check();
    return () => { cancelled = true; };
  }, [user, authLoading, listingId]);

  const toggle = async () => {
    if (!user) {
      navigate(`/auth?redirect=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setBusy(true);
    if (isFav) {
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("listing_id", listingId)
        .eq("user_id", user.id);
      if (error) toast.error(error.message);
      else setIsFav(false);
    } else {
      const { error } = await supabase
        .from("favorites")
        .insert({ listing_id: listingId, user_id: user.id });
      if (error) toast.error(error.message);
      else {
        setIsFav(true);
        toast.success("Saved to favorites");
      }
    }
    setBusy(false);
  };

  if (variant === "labeled") {
    return (
      <Button
        type="button"
        variant={isFav ? "default" : "outline"}
        size="lg"
        onClick={toggle}
        disabled={busy || loading}
        className={className}
      >
        <Heart className={cn("size-4", isFav && "fill-current")} />
        {isFav ? "Saved" : "Save"}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="soft"
      size="icon"
      onClick={toggle}
      disabled={busy || loading}
      aria-label={isFav ? "Remove from favorites" : "Save to favorites"}
      className={cn("bg-card/90 backdrop-blur", className)}
    >
      <Heart className={cn("size-4", isFav && "fill-rose-500 text-rose-500")} />
    </Button>
  );
};
