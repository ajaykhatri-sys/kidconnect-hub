import { Link } from "react-router-dom";
import camps from "@/assets/cat-camps.jpg";
import classes from "@/assets/cat-classes.jpg";
import events from "@/assets/cat-events.jpg";
import birthday from "@/assets/cat-birthday.jpg";
import { categoryMeta, type Category } from "@/data/listings";

const tiles: { key: Category; image: string }[] = [
  { key: "camps", image: camps },
  { key: "classes", image: classes },
  { key: "events", image: events },
  { key: "birthday", image: birthday },
];

export const CategoryTiles = () => {
  return (
    <section className="container mx-auto py-20">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Browse by category</p>
          <h2 className="font-display text-3xl md:text-5xl font-semibold text-balance max-w-xl">
            Whatever they're into, it's here.
          </h2>
        </div>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {tiles.map(({ key, image }) => (
          <Link
            key={key}
            to={`/browse?category=${key}`}
            className="group relative aspect-[4/5] rounded-3xl overflow-hidden shadow-card hover:shadow-card-hover transition-spring hover:-translate-y-1"
          >
            <img
              src={image}
              alt={categoryMeta[key].label}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-spring group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-primary-foreground">
              <h3 className="font-display text-2xl font-semibold">{categoryMeta[key].label}</h3>
              <p className="text-sm text-primary-foreground/80 mt-1">{categoryMeta[key].description}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
