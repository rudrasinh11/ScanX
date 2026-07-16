import Reveal from "../components/Reveal.jsx";
import { StaggerGrid, StaggerItem } from "../components/StaggerGrid.jsx";

const philosophy = [
  { t: "Business First", d: "Every finding is filtered through one question: does this move a real business decision forward?" },
  { t: "Evidence Driven", d: "Recommendations trace back to a documented, publicly available source — not intuition." },
  { t: "Independent Analysis", d: "Reports are prepared without a commercial relationship to the business being studied." },
  { t: "Transparent Recommendations", d: "Confidence levels and limitations are stated plainly, not smoothed over." },
];

export default function About() {
  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <Reveal className="max-w-2xl mb-14 sm:mb-16">
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center gap-2.5 mb-5">
            <span className="w-6 h-px bg-gold" /> About ScanX
          </div>
          <h1 className="text-[32px] sm:text-5xl leading-[1.1] mb-4">
            Research built to be used, not filed away.
          </h1>
          <p className="text-base sm:text-lg text-inksoft leading-relaxed">
            ScanX exists to give business owners a clear, evidence-based picture of where they
            stand — without the guesswork that usually comes with growth decisions.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 sm:mb-20">
          <Reveal>
            <h2 className="text-2xl font-heading font-bold mb-5">Why ScanX</h2>
            <p className="text-inksoft leading-relaxed mb-4">
              ScanX started from a simple observation: most small and mid-sized businesses make
              growth decisions with less evidence than the businesses competing against them.
              Market research and competitive intelligence were treated as tools for large
              companies with dedicated strategy teams — not for the café, clinic, or retailer
              trying to figure out why growth has plateaued.
            </p>
            <p className="text-inksoft leading-relaxed">
              ScanX was built to close that gap — bringing the same evidence-based research
              approach used by larger consulting practices to businesses that have never had
              access to it before.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl font-heading font-bold mb-5">Mission &amp; Vision</h2>
            <p className="text-inksoft leading-relaxed mb-4">
              <span className="font-semibold text-ink">Mission —</span> Give business owners a
              clear, evidence-based picture of their market position, and a prioritized path
              toward growth.
            </p>
            <p className="text-inksoft leading-relaxed">
              <span className="font-semibold text-ink">Vision —</span> A standard where every
              growth decision, regardless of company size, is backed by real research rather
              than assumption.
            </p>
          </Reveal>
        </div>

        <Reveal className="mb-14">
          <h2 className="text-2xl font-heading font-bold mb-8">Research Philosophy</h2>
        </Reveal>
        <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-16 sm:mb-20">
          {philosophy.map((p) => (
            <StaggerItem key={p.t} className="border border-line rounded-md p-6 sm:p-7 hover:border-gold transition-colors">
              <h3 className="text-lg font-heading font-bold mb-2.5">{p.t}</h3>
              <p className="text-sm text-inksoft leading-relaxed">{p.d}</p>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal className="border-l-2 border-gold bg-raised rounded-r px-6 sm:px-8 py-6 sm:py-7 text-inksoft leading-relaxed max-w-2xl">
          ScanX makes no exaggerated promises. Every report states its confidence level and
          limitations plainly — because a recommendation is only useful if it can be trusted.
        </Reveal>
      </div>
    </div>
  );
}
