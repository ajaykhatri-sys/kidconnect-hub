import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md" | "lg";
  className?: string;
  readOnly?: boolean;
}

const sizeMap = { sm: "size-4", md: "size-5", lg: "size-7" };

export const StarRating = ({ value, onChange, size = "md", className, readOnly }: StarRatingProps) => {
  const interactive = !!onChange && !readOnly;
  return (
    <div className={cn("inline-flex items-center gap-0.5", className)} role={interactive ? "radiogroup" : undefined} aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= Math.round(value);
        const StarEl = (
          <Star
            className={cn(
              sizeMap[size],
              "transition-smooth",
              filled ? "fill-accent text-accent" : "text-muted-foreground/40",
            )}
          />
        );
        if (!interactive) return <span key={n}>{StarEl}</span>;
        return (
          <button
            key={n}
            type="button"
            role="radio"
            aria-checked={n === Math.round(value)}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onClick={() => onChange!(n)}
            className="p-0.5 hover:scale-110 transition-spring"
          >
            {StarEl}
          </button>
        );
      })}
    </div>
  );
};
