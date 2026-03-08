import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Shield, Menu, X } from "lucide-react";

const navItems = [
  { label: "Bohaterowie", href: "#heroes" },
  { label: "Mapy", href: "#maps" },
  { label: "Wrogowie", href: "#enemies" },
  { label: "Marketplace", href: "#marketplace" },
];

const GameNav = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-2">
          <Shield className="w-7 h-7 text-primary" />
          <span className="font-display text-lg font-bold text-foreground">
            Defense <span className="text-primary">Heroes</span>
          </span>
        </a>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:block">
          <button onClick={() => navigate('/game')} className="px-5 py-2 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg hover:opacity-90 transition-opacity">
            Graj Teraz
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button className="md:hidden text-foreground" onClick={() => setOpen(!open)}>
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-card border-b border-border p-4 space-y-3"
        >
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="block font-body text-sm font-medium text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <button className="w-full px-5 py-2 bg-primary text-primary-foreground font-body font-bold text-sm rounded-lg">
            Graj Teraz
          </button>
        </motion.div>
      )}
    </nav>
  );
};

export default GameNav;
