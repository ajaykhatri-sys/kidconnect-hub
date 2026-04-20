import { Link, NavLink, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, LogOut, User as UserIcon, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useState } from "react";
import logo from "@/assets/logo-123kids.png";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const SiteHeader = () => {
  const [open, setOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const navItems = [
    { to: "/browse?category=camps", label: "Camps" },
    { to: "/browse?category=classes", label: "Classes" },
    { to: "/browse?category=events", label: "Events" },
    { to: "/browse?category=birthday", label: "Birthdays" },
  ];

  const initial =
    (user?.user_metadata?.display_name as string | undefined)?.[0]?.toUpperCase() ??
    user?.email?.[0]?.toUpperCase() ??
    "U";

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

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
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-full hover:bg-muted px-1.5 py-1 transition-smooth">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">{user.email}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account"><UserIcon className="size-4 mr-2" /> Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/dashboard"><LayoutDashboard className="size-4 mr-2" /> My listings</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><ShieldCheck className="size-4 mr-2" /> Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="size-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="default" size="sm" asChild>
              <Link to="/auth">Sign in</Link>
            </Button>
          )}
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
            {user ? (
              <>
                <Link to="/dashboard" className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium" onClick={() => setOpen(false)}>
                  My listings
                </Link>
                {isAdmin && (
                  <Link to="/admin" className="px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium" onClick={() => setOpen(false)}>
                    Admin
                  </Link>
                )}
                <Button variant="outline" className="mt-2 mx-2" onClick={() => { setOpen(false); handleSignOut(); }}>
                  Sign out
                </Button>
              </>
            ) : (
              <Button asChild className="mt-2 mx-2">
                <Link to="/auth" onClick={() => setOpen(false)}>Sign in</Link>
              </Button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
