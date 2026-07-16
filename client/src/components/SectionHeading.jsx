import Reveal from "./Reveal.jsx";

export default function SectionHeading({ eyebrow, title, description, center = false, dark = false }) {
  return (
    <Reveal
      className={`max-w-2xl mb-12 sm:mb-16 ${center ? "mx-auto text-center" : ""}`}
    >
      <div
        className={`font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center gap-2.5 mb-5 ${
          center ? "justify-center" : ""
        }`}
      >
        <span className="w-6 h-px bg-gold" />
        {eyebrow}
      </div>
      <h2 className={`text-[28px] sm:text-4xl lg:text-[42px] leading-[1.15] ${dark ? "text-bg" : "text-ink"}`}>
        {title}
      </h2>
      {description && (
        <p className={`mt-4 text-base sm:text-lg leading-relaxed ${dark ? "text-[#B8B6AE]" : "text-inksoft"}`}>
          {description}
        </p>
      )}
    </Reveal>
  );
}
