import soccer from "@/assets/listing-soccer.jpg";
import coding from "@/assets/listing-coding.jpg";
import swim from "@/assets/listing-swim.jpg";
import pottery from "@/assets/listing-pottery.jpg";
import nature from "@/assets/listing-nature.jpg";
import dance from "@/assets/listing-dance.jpg";

export type Category = "camps" | "classes" | "events" | "birthday";

export interface Listing {
  id: string;
  slug: string;
  title: string;
  business: string;
  category: Category;
  subcategory: string;
  city: string;
  neighborhood: string;
  ageMin: number;
  ageMax: number;
  priceFrom: number;
  priceUnit: "session" | "week" | "month" | "event";
  rating: number;
  reviewCount: number;
  image: string;
  featured?: boolean;
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  schedule: string;
}

export const cities = [
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "San Diego, CA",
  "Austin, TX",
  "Boston, MA",
  "Seattle, WA",
  "Denver, CO",
  "Miami, FL",
];

export const categoryMeta: Record<Category, { label: string; description: string }> = {
  camps: { label: "Camps", description: "Day & overnight adventures" },
  classes: { label: "Classes", description: "Weekly enrichment programs" },
  events: { label: "Events", description: "One-time fun this weekend" },
  birthday: { label: "Birthday Spots", description: "Unforgettable party venues" },
};

export const listings: Listing[] = [
  {
    id: "1", slug: "kickstart-soccer-academy", title: "Kickstart Soccer Academy",
    business: "Kickstart Sports", category: "classes", subcategory: "Sports",
    city: "Austin, TX", neighborhood: "South Lamar",
    ageMin: 5, ageMax: 12, priceFrom: 28, priceUnit: "session",
    rating: 4.9, reviewCount: 184, image: soccer, featured: true,
    shortDescription: "Pro coaches teach skills, teamwork, and confidence on the field.",
    longDescription: "Our award-winning soccer program has been Austin's favorite for over a decade. Small group sizes (8:1 ratio), professional licensed coaches, and a curriculum focused on fundamentals, fun, and friendship. Every child plays — every session.",
    highlights: ["Licensed coaches", "8:1 student ratio", "All skill levels", "Free trial class"],
    schedule: "Tue & Thu • 4:00–5:30 PM • Saturdays 9:00 AM",
  },
  {
    id: "2", slug: "code-explorers-junior", title: "Code Explorers Junior",
    business: "Bright Bytes Lab", category: "classes", subcategory: "STEM",
    city: "Seattle, WA", neighborhood: "Capitol Hill",
    ageMin: 7, ageMax: 13, priceFrom: 220, priceUnit: "month",
    rating: 4.8, reviewCount: 96, image: coding, featured: true,
    shortDescription: "Hands-on coding with Scratch, Python, and game design.",
    longDescription: "Where curiosity becomes capability. Kids build real games and apps while learning the fundamentals of programming. Project-based curriculum reviewed by Google engineers. Take-home laptop kits available.",
    highlights: ["Project-based learning", "Industry mentors", "Showcase events", "1:6 instructor ratio"],
    schedule: "Wednesdays 4:30–6:00 PM • 8-week sessions",
  },
  {
    id: "3", slug: "splash-swim-school", title: "Splash Swim School",
    business: "Splash Aquatics", category: "classes", subcategory: "Swim",
    city: "Miami, FL", neighborhood: "Coral Gables",
    ageMin: 1, ageMax: 10, priceFrom: 35, priceUnit: "session",
    rating: 4.9, reviewCount: 312, image: swim, featured: true,
    shortDescription: "Heated indoor pool, certified instructors, year-round lessons.",
    longDescription: "Water safety is our mission. Our heated 92°F pool, Red Cross certified instructors, and gentle progression-based curriculum have introduced over 5,000 Miami kids to swimming. Parent-and-me through stroke development.",
    highlights: ["Heated 92°F pool", "Red Cross certified", "Make-up classes", "Sibling discounts"],
    schedule: "7 days a week • 30-min lessons • Online booking",
  },
  {
    id: "4", slug: "clayhouse-pottery-studio", title: "Clayhouse Pottery Studio",
    business: "Clayhouse Studio", category: "classes", subcategory: "Art",
    city: "Boston, MA", neighborhood: "Jamaica Plain",
    ageMin: 6, ageMax: 14, priceFrom: 45, priceUnit: "session",
    rating: 4.8, reviewCount: 71, image: pottery,
    shortDescription: "Wheel throwing, hand-building, and glazing in a sunlit studio.",
    longDescription: "A creative refuge for young hands. Learn wheel throwing, hand-building techniques, and glazing in our beautifully restored Jamaica Plain studio. All materials and firing included. Take home finished pieces every session.",
    highlights: ["All materials included", "Take home pieces", "Small classes (max 8)", "Weekend workshops"],
    schedule: "Sat & Sun • 10:00 AM–12:00 PM",
  },
  {
    id: "5", slug: "wildwood-nature-camp", title: "Wildwood Adventure Camp",
    business: "Wildwood Outdoors", category: "camps", subcategory: "Outdoor",
    city: "Denver, CO", neighborhood: "Boulder Foothills",
    ageMin: 6, ageMax: 12, priceFrom: 485, priceUnit: "week",
    rating: 4.9, reviewCount: 248, image: nature, featured: true,
    shortDescription: "A week of hiking, wildlife, and unplugged outdoor magic.",
    longDescription: "Disconnect to reconnect. Five days of hiking the Boulder foothills, wildlife identification, fire safety, shelter building, and stargazing. Wilderness-First-Aid certified guides. Lunch and snacks included. Tech-free environment.",
    highlights: ["WFA certified guides", "Lunch included", "Tech-free", "Daily photo updates"],
    schedule: "Mon–Fri • 8:30 AM–4:30 PM • June–August",
  },
  {
    id: "6", slug: "petite-pliés-ballet", title: "Petite Pliés Ballet",
    business: "Petite Pliés Academy", category: "classes", subcategory: "Dance",
    city: "New York, NY", neighborhood: "Upper West Side",
    ageMin: 3, ageMax: 8, priceFrom: 32, priceUnit: "session",
    rating: 4.9, reviewCount: 156, image: dance,
    shortDescription: "Gentle introduction to classical ballet for little dancers.",
    longDescription: "A nurturing first ballet experience inspired by the Royal Academy of Dance syllabus. Our patient instructors weave technique into storytelling and play. Annual recital at Symphony Space included with enrollment.",
    highlights: ["RAD-trained instructors", "Annual recital", "Trial class free", "Sibling discount"],
    schedule: "Mon, Wed, Sat • Multiple time slots",
  },
  {
    id: "7", slug: "summer-stem-camp", title: "Summer STEM Discovery Camp",
    business: "Bright Bytes Lab", category: "camps", subcategory: "STEM",
    city: "Seattle, WA", neighborhood: "Bellevue",
    ageMin: 8, ageMax: 13, priceFrom: 525, priceUnit: "week",
    rating: 4.8, reviewCount: 89, image: coding,
    shortDescription: "Robotics, coding, and 3D printing in a week-long deep dive.",
    longDescription: "Build robots, code games, and bring ideas to life with 3D printers. Friday showcase for parents. All equipment provided.",
    highlights: ["All equipment provided", "Friday showcase", "Take-home project", "Lunch included"],
    schedule: "Mon–Fri • 9:00 AM–4:00 PM",
  },
  {
    id: "8", slug: "weekend-art-walk", title: "Family Art Walk Festival",
    business: "City Arts Council", category: "events", subcategory: "Festival",
    city: "Los Angeles, CA", neighborhood: "Arts District",
    ageMin: 3, ageMax: 14, priceFrom: 0, priceUnit: "event",
    rating: 4.7, reviewCount: 412, image: pottery,
    shortDescription: "Free outdoor art festival with workshops, music, and food.",
    longDescription: "A sun-soaked Saturday of family art. Drop-in pottery, mural painting, live music, and food trucks. Free admission, materials provided.",
    highlights: ["Free admission", "Materials provided", "Live music", "Food trucks"],
    schedule: "Saturday June 15 • 10:00 AM–4:00 PM",
  },
  {
    id: "9", slug: "splash-zone-birthday", title: "Splash Zone Birthday Parties",
    business: "Splash Aquatics", category: "birthday", subcategory: "Pool Party",
    city: "Miami, FL", neighborhood: "Coral Gables",
    ageMin: 4, ageMax: 12, priceFrom: 425, priceUnit: "event",
    rating: 4.9, reviewCount: 134, image: swim,
    shortDescription: "Private pool party with lifeguards, host, pizza, and cake.",
    longDescription: "The easiest birthday you'll ever throw. Private heated pool for 90 minutes, dedicated lifeguards, party host, decorated party room, pizza, cake, and goody bags. Up to 15 swimmers.",
    highlights: ["Up to 15 kids", "Lifeguards & host", "Pizza & cake included", "Decorated room"],
    schedule: "Sat & Sun • 11 AM, 1 PM, 3 PM slots",
  },
  {
    id: "10", slug: "pottery-party-pack", title: "Pottery Birthday Party",
    business: "Clayhouse Studio", category: "birthday", subcategory: "Creative",
    city: "Boston, MA", neighborhood: "Jamaica Plain",
    ageMin: 5, ageMax: 13, priceFrom: 380, priceUnit: "event",
    rating: 4.9, reviewCount: 58, image: pottery,
    shortDescription: "Each guest paints a take-home piece. Stress-free hosting.",
    longDescription: "Up to 12 kids, 2 hours, all materials. Each child paints a piece (mug, bowl, or figurine), we fire and deliver them within a week. Bring your own cake.",
    highlights: ["Up to 12 kids", "Take-home keepsakes", "Stress-free hosting", "All materials"],
    schedule: "Saturdays • 1:00 PM–3:00 PM",
  },
  {
    id: "11", slug: "junior-coders-meetup", title: "Junior Coders Weekend Meetup",
    business: "Bright Bytes Lab", category: "events", subcategory: "Meetup",
    city: "Seattle, WA", neighborhood: "South Lake Union",
    ageMin: 9, ageMax: 14, priceFrom: 25, priceUnit: "event",
    rating: 4.8, reviewCount: 67, image: coding,
    shortDescription: "Saturday hack jams for kids who love to build.",
    longDescription: "Bring your laptop or use ours. Theme reveals, mentor support, and a friendly demo at the end. Snacks provided.",
    highlights: ["Mentor support", "Snacks provided", "Show & tell", "Loaner laptops"],
    schedule: "First Saturday monthly • 10 AM–1 PM",
  },
  {
    id: "12", slug: "sunset-soccer-camp", title: "Sunset Soccer Summer Camp",
    business: "Kickstart Sports", category: "camps", subcategory: "Sports",
    city: "Austin, TX", neighborhood: "Zilker Park",
    ageMin: 5, ageMax: 12, priceFrom: 395, priceUnit: "week",
    rating: 4.9, reviewCount: 203, image: soccer,
    shortDescription: "Mornings of soccer drills, scrimmages, and ice pops.",
    longDescription: "Beat the heat. Camp runs 8–11 AM with shaded fields, water breaks every 20 min, and an ice pop send-off daily. All skill levels grouped by age and experience.",
    highlights: ["Shaded fields", "Frequent water breaks", "Skill-grouped", "Free t-shirt"],
    schedule: "Mon–Fri • 8:00–11:00 AM • June–August",
  },
];

export const getListingBySlug = (slug: string) => listings.find((l) => l.slug === slug);
export const getFeatured = () => listings.filter((l) => l.featured);
