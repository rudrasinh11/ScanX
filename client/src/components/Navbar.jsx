import { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const links = [
  { to: "/services", label: "Services" },
  { to: "/case-studies", label: "Case Studies" },
  { to: "/methodology", label: "Methodology" },
  { to: "/about", label: "About" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const location = useLocation();

  const hideSnapshot = location.pathname.startsWith("/admin");

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[100] bg-bg/85 backdrop-blur-md border-b border-linesoft transition-[padding,box-shadow] duration-300 ${
        scrolled ? "shadow-[0_10px_30px_-22px_rgba(31,31,31,0.35)]" : ""
      }`}
    >
      <nav
        className={`max-w-[1240px] mx-auto flex items-center justify-between px-5 sm:px-8 lg:px-10 transition-[padding] duration-300 ${
          scrolled ? "py-3.5" : "py-5"
        }`}
      >
        <Link to="/" className="font-heading font-extrabold text-xl tracking-tight" onClick={() => setOpen(false)}>
          Scan<span className="text-gold">X</span>
        </Link>

        <div className="hidden lg:flex items-center gap-10 text-sm font-medium text-inksoft">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `relative pb-1 transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1.5 after:h-px after:w-full after:bg-gold after:origin-right after:scale-x-0 hover:after:origin-left hover:after:scale-x-100 after:transition-transform after:duration-300 ${
                  isActive ? "text-ink after:scale-x-100 after:origin-left" : "hover:text-ink"
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        {!hideSnapshot && (
          <Link
            to="/contact"
            className="hidden sm:inline-flex text-[13px] font-semibold px-5 py-[11px] border border-ink rounded-sm transition-all duration-300 hover:bg-ink hover:text-bg hover:-translate-y-0.5"
          >
            Request Snapshot
          </Link>
        )}

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="lg:hidden p-2 -mr-2"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden overflow-hidden border-t border-linesoft bg-bg"
          >
            <div className="flex flex-col px-5 py-6 gap-1">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `py-3 text-base font-medium border-b border-linesoft ${
                      isActive ? "text-gold" : "text-ink"
                    }`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              {!hideSnapshot && (
                <Link
                  to="/contact"
                  onClick={() => setOpen(false)}
                  className="mt-5 text-center text-sm font-semibold px-5 py-3.5 bg-ink text-bg rounded-sm"
                >
                  Request Snapshot
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
