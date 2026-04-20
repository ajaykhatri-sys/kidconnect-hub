import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo-123kids.png";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const navItems = [
    { to: "/browse?category=camps", label: "Camps" },
    { to: "/browse?category=classes", label: "Classes" },
    { to: "/browse?category=events", label: "Events" },
    { to: "/browse?category=birthday", label: "Birthdays" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/60">
      <div className="container mx-auto flex h-16 items-center justify-between gap-6">
        <Link to="/" className="flex items-center gap-2 group" aria-label="123kids home">
          <img src={logo} alt="123kids logo" className="h-12 md:h-14 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth rounded-full hover:bg-muted"
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/for-business">List your business</Link>
          </Button>
          <Button variant="default" size="sm" asChild>
            <Link to="/signin">Sign in</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-full hover:bg-muted transition-smooth"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background animate-fade-in">
          <div className="container mx-auto py-4 flex flex-col gap-1">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="h-px bg-border my-2" />
            <Link to="/for-business" className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium" onClick={() => setOpen(false)}>
              List your business
            </Link>
            <Button asChild className="mt-2 mx-2">
              <Link to="/signin" onClick={() => setOpen(false)}>Sign in</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
