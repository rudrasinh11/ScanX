import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

let rippleId = 0;

export default function Button({
  to,
  href,
  onClick,
  type = "button",
  variant = "primary",
  children,
  className = "",
}) {
  const ref = useRef(null);
  const [ripples, setRipples] = useState([]);
  const [pos, setPos] = useState({ x: 0, y: 0 });

  const base =
    "relative inline-flex items-center justify-center gap-2.5 overflow-hidden isolate rounded-sm px-6 sm:px-7 py-4 text-sm font-semibold transition-colors duration-300";
  const variants = {
    primary:
      "bg-ink text-bg hover:bg-gold hover:shadow-[0_18px_34px_-16px_rgba(182,140,58,0.55)]",
    secondary:
      "border border-ink text-ink hover:border-gold hover:text-gold hover:shadow-[0_18px_34px_-20px_rgba(31,31,31,0.25)]",
  };

  function handleMouseMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setPos({ x: x * 0.18, y: y * 0.3 });
  }

  function handleClick(e) {
    const rect = ref.current.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const id = rippleId++;
    setRipples((r) => [
      ...r,
      { id, size, x: e.clientX - rect.left - size / 2, y: e.clientY - rect.top - size / 2 },
    ]);
    setTimeout(() => setRipples((r) => r.filter((rp) => rp.id !== id)), 650);
    onClick && onClick(e);
  }

  const content = (
    <>
      <span
        className={`absolute inset-0 -z-10 ${
          variant === "primary"
            ? "bg-gradient-to-r from-transparent via-white/35 to-transparent"
            : "bg-gradient-to-r from-transparent via-gold/20 to-transparent"
        } -translate-x-[130%] group-hover:translate-x-[130%] transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)]`}
      />
      {ripples.map((r) => (
        <span
          key={r.id}
          className={`absolute rounded-full pointer-events-none animate-[rippleAnim_.65s_ease-out_forwards] ${
            variant === "primary" ? "bg-white/50" : "bg-gold/40"
          }`}
          style={{ width: r.size, height: r.size, left: r.x, top: r.y }}
        />
      ))}
      <span className="relative z-10 flex items-center gap-2.5">{children}</span>
    </>
  );

  const motionProps = {
    ref,
    className: `group ${base} ${variants[variant]} ${className}`,
    onMouseMove: handleMouseMove,
    onMouseLeave: () => setPos({ x: 0, y: 0 }),
    onClick: handleClick,
    animate: { x: pos.x, y: pos.y },
    transition: { type: "spring", stiffness: 300, damping: 20, mass: 0.4 },
  };

  if (to) {
    return (
      <motion.div {...motionProps} style={{ display: "inline-block" }}>
        <Link to={to} className="contents">
          {content}
        </Link>
      </motion.div>
    );
  }

  if (href) {
    return (
      <motion.a {...motionProps} href={href}>
        {content}
      </motion.a>
    );
  }

  return (
    <motion.button {...motionProps} type={type}>
      {content}
    </motion.button>
  );
}
