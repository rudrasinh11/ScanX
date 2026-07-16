import Reveal from "../components/Reveal.jsx";
import { StaggerGrid, StaggerItem } from "../components/StaggerGrid.jsx";
import { methodFlow, sources } from "../data/content.js";

const confidenceLevels = [
  { level: "Verified", desc: "Confirmed across two or more independent public sources." },
  { level: "Observed", desc: "Directly observed on the business's own channels or site." },
  { level: "Inferred", desc: "Reasonably concluded from patterns, but not directly confirmed." },
];

const limitations = [
  "Research relies on publicly available information at the time of the report — private data, internal metrics, and POS numbers are out of scope.",
  "Recommendations reflect patterns observed during the research window and may shift as a business or its market changes.",
  "ScanX reports are strategic guidance, not guarantees of outcome.",
];

const ethics = [
  "No private, gated, or paywalled data is accessed during research.",
  "Featured businesses are not clients — reports are independently prepared for portfolio purposes.",
  "Any business may request removal of its report at any time.",
];

export default function Methodology() {
  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <Reveal className="max-w-2xl mb-14 sm:mb-16">
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center gap-2.5 mb-5">
            <span className="w-6 h-px bg-gold" /> How ScanX Works
          </div>
          <h1 className="text-[32px] sm:text-5xl leading-[1.1] mb-4">Research Methodology</h1>
          <p className="text-base sm:text-lg text-inksoft leading-relaxed">
            Every report starts with a decision question, then moves from documented evidence to
            a practical recommendation. This page explains the standard behind that work.
          </p>
        </Reveal>

        {/* Framework */}
        <Reveal className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-heading font-bold mb-6">Scoring Framework</h2>
          <div className="flex flex-wrap gap-3">
            {methodFlow.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="border border-line px-4 sm:px-5 py-3 rounded-full text-sm font-medium flex items-center gap-2.5 hover:border-gold hover:bg-goldsoft transition-all">
                  <span className="font-num text-gold text-[13px]">{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </span>
                {i < methodFlow.length - 1 && <span className="text-inkfaint hidden sm:inline">→</span>}
              </span>
            ))}
          </div>
        </Reveal>

        {/* Sources */}
        <Reveal className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-heading font-bold mb-6">Research Sources</h2>
          <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {sources.map((s) => (
              <StaggerItem
                key={s}
                className="bg-bg p-5 text-sm font-medium flex items-center gap-3 hover:bg-raised hover:pl-6 transition-all"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {s}
              </StaggerItem>
            ))}
          </StaggerGrid>
        </Reveal>

        {/* Confidence Levels */}
        <Reveal className="mb-16 sm:mb-20">
          <h2 className="text-2xl font-heading font-bold mb-6">Confidence Levels</h2>
          <p className="text-inksoft leading-relaxed mb-6 max-w-2xl">
            Every finding in a ScanX report is labeled by how strongly the evidence supports it.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {confidenceLevels.map((c) => (
              <div key={c.level} className="border border-line rounded-md p-6 hover:border-gold transition-colors">
                <div className="text-gold font-num text-sm font-semibold mb-2.5 uppercase tracking-wide">{c.level}</div>
                <p className="text-sm text-inksoft leading-relaxed">{c.desc}</p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Evidence Standards & Limitations */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 mb-16 sm:mb-20">
          <Reveal>
            <h2 className="text-2xl font-heading font-bold mb-6">Evidence Standards</h2>
            <p className="text-inksoft leading-relaxed">
              A recommendation is only included in a ScanX report if it can be traced to a
              specific, publicly available observation — a review pattern, a site audit result,
              a competitor's published offer. Opinion without a documented source doesn't make
              it into the deliverable.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <h2 className="text-2xl font-heading font-bold mb-6">Limitations</h2>
            <ul className="space-y-3">
              {limitations.map((l, i) => (
                <li key={i} className="flex gap-3 text-sm text-inksoft leading-relaxed">
                  <span className="text-gold flex-shrink-0">—</span>
                  {l}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        {/* Ethics & Transparency */}
        <Reveal className="border border-line rounded-md p-7 sm:p-10 bg-raised">
          <h2 className="text-2xl font-heading font-bold mb-6">Ethics &amp; Transparency</h2>
          <ul className="space-y-3">
            {ethics.map((e, i) => (
              <li key={i} className="flex gap-3 text-sm text-inksoft leading-relaxed">
                <span className="text-gold flex-shrink-0">—</span>
                {e}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </div>
  );
}
