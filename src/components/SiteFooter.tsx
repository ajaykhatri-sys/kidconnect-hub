import { Link } from "react-router-dom";

export const SiteFooter = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground mt-24">
      <div className="container mx-auto py-16 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2">
          <span className="font-display text-2xl font-bold">
            123<span className="text-primary-glow">kids</span>
          </span>
          <p className="mt-3 text-sm text-secondary-foreground/70 max-w-sm">
            The trusted local marketplace for camps, classes, events and birthday spots — discovered by parents, loved by kids.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base mb-3">For parents</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/70">
            <li><Link to="/browse?category=camps" className="hover:text-primary-glow">Find camps</Link></li>
            <li><Link to="/browse?category=classes" className="hover:text-primary-glow">Browse classes</Link></li>
            <li><Link to="/browse?category=events" className="hover:text-primary-glow">Weekend events</Link></li>
            <li><Link to="/browse?category=birthday" className="hover:text-primary-glow">Birthday spots</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base mb-3">For businesses</h4>
          <ul className="space-y-2 text-sm text-secondary-foreground/70">
            <li><Link to="/for-business" className="hover:text-primary-glow">List your business</Link></li>
            <li><Link to="/for-business" className="hover:text-primary-glow">Pricing</Link></li>
            <li><Link to="/for-business" className="hover:text-primary-glow">Success stories</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-secondary-foreground/10">
        <div className="container mx-auto py-6 text-xs text-secondary-foreground/60 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} 123kids. Made with care for families.</span>
          <span>Privacy · Terms · Trust & Safety</span>
        </div>
      </div>
    </footer>
  );
};
