import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function FAQItem({ q, a }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-line">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full py-5 sm:py-6 flex justify-between items-center gap-6 text-left font-heading font-semibold text-base sm:text-lg hover:text-gold transition-colors"
        aria-expanded={open}
      >
        <span>{q}</span>
        <span className="relative w-5 h-5 flex-shrink-0">
          <span
            className={`absolute inset-0 m-auto w-full h-px bg-current transition-transform duration-300`}
          />
          <span
            className={`absolute inset-0 m-auto w-px h-full bg-current transition-opacity duration-300 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-5 sm:pb-6 text-sm sm:text-[15px] text-inksoft leading-relaxed max-w-2xl">
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
