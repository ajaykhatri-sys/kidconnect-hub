import { Link } from "react-router-dom";

const CATEGORIES = [
  { name: "Camps", emoji: "🏕️", color: "bg-green-50 hover:bg-green-100 border-green-200", text: "text-green-700", desc: "Summer & day camps" },
  { name: "Classes", emoji: "📚", color: "bg-blue-50 hover:bg-blue-100 border-blue-200", text: "text-blue-700", desc: "Dance, art, martial arts & more" },
  { name: "Events", emoji: "🎉", color: "bg-purple-50 hover:bg-purple-100 border-purple-200", text: "text-purple-700", desc: "Family fun events" },
  { name: "Birthday Spots", emoji: "🎂", color: "bg-pink-50 hover:bg-pink-100 border-pink-200", text: "text-pink-700", desc: "Party venues & ideas" },
];

export function CategorySection() {
  return (
    <section className="py-12 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Browse by Category
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Find the perfect activity for your child in Palm Beach County
        </p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              to={`/listings?category=${encodeURIComponent(cat.name)}`}
              className={`flex flex-col items-center p-6 rounded-2xl border-2 transition-all duration-200 ${cat.color}`}
            >
              <span className="text-4xl mb-3">{cat.emoji}</span>
              <h3 className={`font-bold text-lg ${cat.text}`}>{cat.name}</h3>
              <p className="text-gray-500 text-xs text-center mt-1">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
