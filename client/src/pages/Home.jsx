import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Circle } from "lucide-react";
import Button from "../components/Button.jsx";
import SectionHeading from "../components/SectionHeading.jsx";
import Reveal from "../components/Reveal.jsx";
import { StaggerGrid, StaggerItem } from "../components/StaggerGrid.jsx";
import FAQItem from "../components/FAQItem.jsx";
import AnimatedCounter from "../components/AnimatedCounter.jsx";
import api from "../lib/api.js";
import {
  problems,
  analyzeAreas,
  deliverables,
  processSteps,
  methodFlow,
  sources,
  stats,
  faqs,
} from "../data/content.js";

const barHeights = [35, 52, 40, 68, 58, 80, 71, 92];

const fallbackCases = [
  { slug: "coastal-cafe-group", industry: "Hospitality", businessName: "Coastal Café Group", objective: "Improve repeat visit rate and local search visibility.", tags: ["Reviews", "Local SEO", "Customer Journey"] },
  { slug: "wellview-dental-clinic", industry: "Healthcare", businessName: "Wellview Dental Clinic", objective: "Strengthen digital trust signals ahead of a second location.", tags: ["Brand", "Reviews", "Web Audit"] },
  { slug: "northline-home-goods", industry: "Retail", businessName: "Northline Home Goods", objective: "Identify why in-store traffic isn't converting to online sales.", tags: ["Competitor", "Journey", "Growth"] },
];

function HeroDashboard() {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function onMove(e) {
    const rect = ref.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x, y });
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setTilt({ x: 0, y: 0 })}
      animate={{ rotateY: tilt.x * 6, rotateX: -tilt.y * 6 }}
      transition={{ type: "spring", stiffness: 200, damping: 20 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      className="bg-white border border-line rounded-md shadow-soft p-5 sm:p-6 relative w-full"
    >
      <div className="flex justify-between items-center mb-5">
        <span className="text-[11px] sm:text-xs uppercase tracking-wider text-inkfaint font-semibold flex items-center gap-1.5">
          <Circle className="text-gold animate-pulse" size={7} fill="currentColor" />
          Business Snapshot — Live
        </span>
        <span className="text-[11px] sm:text-xs uppercase tracking-wider text-inkfaint font-semibold">Q3</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-3.5 mb-5">
        {[
          { label: "Review Score", value: "4.1", delta: "+0.6" },
          { label: "Site Speed", value: "62", delta: "+18" },
          { label: "Market Position", value: "#4", delta: "↑2" },
          { label: "Opportunity Index", value: "78", delta: "High" },
        ].map((k) => (
          <div key={k.label} className="bg-raised rounded-[5px] p-3.5 sm:p-4 transition-all hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_14px_26px_-18px_rgba(31,31,31,0.3)]">
            <div className="text-[10px] sm:text-[11px] uppercase tracking-wide text-inkfaint mb-1.5">{k.label}</div>
            <div className="text-xl sm:text-2xl font-bold font-num flex items-baseline gap-2">
              {k.value} <span className="text-[11px] sm:text-xs text-gold font-semibold">{k.delta}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-end gap-1.5 h-16 sm:h-20 pt-3.5 border-t border-linesoft">
        {barHeights.map((h, i) => (
          <motion.div
            key={i}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: [0.16, 1, 0.3, 1] }}
            style={{ height: `${h}%`, transformOrigin: "bottom" }}
            className={`flex-1 rounded-t-[3px] origin-bottom ${
              i % 2 === 0 ? "bg-gradient-to-b from-gold to-[#D9B876] opacity-85" : "bg-ink opacity-10"
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}

function Particles() {
  const particles = useRef(
    Array.from({ length: 12 }, () => ({
      left: 5 + Math.random() * 90,
      size: 2 + Math.random() * 3,
      duration: 8 + Math.random() * 10,
      delay: Math.random() * 8,
    }))
  ).current;

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden sm:block">
      {particles.map((p, i) => (
        <motion.span
          key={i}
          className="absolute bottom-0 rounded-full bg-gold"
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          animate={{ y: ["0vh", "-70vh"], opacity: [0, 0.5, 0.25, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

export default function Home() {
  const [caseStudies, setCaseStudies] = useState(fallbackCases);

  useEffect(() => {
    api
      .get("/case-studies")
      .then((res) => {
        if (Array.isArray(res.data) && res.data.length) {
          setCaseStudies(res.data.slice(0, 3));
        }
      })
      .catch(() => {
        // API not running yet — fall back to static preview data
      });
  }, []);

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden min-h-[92vh] sm:min-h-screen flex items-center pt-28 sm:pt-32 pb-14 sm:pb-16">
        <div className="absolute w-[380px] h-[380px] sm:w-[560px] sm:h-[560px] rounded-full -top-24 -right-24 sm:-top-36 sm:-right-40 pointer-events-none bg-[radial-gradient(circle,rgba(182,140,58,0.18)_0%,rgba(182,140,58,0)_70%)]" />
        <Particles />
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 relative z-10 grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] gap-10 sm:gap-14 lg:gap-[70px] items-center w-full">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
              className="font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center gap-2.5 mb-5"
            >
              <span className="w-6 h-px bg-gold" />
              Business Market Research Analyst
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="text-[34px] leading-[1.1] xs:text-[38px] sm:text-5xl lg:text-[60px] lg:leading-[1.06] tracking-tight mb-6"
            >
              Make your next market decision with{" "}
              <em className="not-italic text-gold bg-gradient-to-r from-gold via-[#8f6c26] to-gold bg-[length:200%_auto] bg-clip-text text-transparent animate-[shine_6s_linear_infinite]">
                evidence you can defend.
              </em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="text-base sm:text-lg leading-relaxed text-inksoft max-w-[480px] mb-9"
            >
              ScanX delivers decision-ready market research reports—covering market opportunity,
              competitors, customers, and go-to-market risks—so leaders can act with confidence.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-wrap gap-4"
            >
              <Button to="/case-studies" variant="primary">
                Explore Research Reports <ArrowRight size={15} />
              </Button>
              <Button to="/contact" variant="secondary">
                Discuss Your Research Brief
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <HeroDashboard />
          </motion.div>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="h-px bg-line" />
      </div>

      {/* PROBLEMS */}
      <section id="problems" className="bg-raised py-20 sm:py-28 lg:py-[120px]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Business Diagnostics"
            title="Are these problems slowing your business growth?"
            description="Most businesses lose customers quietly — not from one big failure, but from small, compounding gaps in experience, positioning, and visibility."
          />
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-line border border-line">
            {problems.map((p) => (
              <StaggerItem key={p.t} className="bg-raised hover:bg-white transition-colors duration-300 p-7 sm:p-8">
                <h3 className="text-[17px] font-heading font-bold mb-3.5 leading-snug">{p.t}</h3>
                <div className="flex justify-between text-[11px] sm:text-xs text-inkfaint pt-3.5 mt-3.5 border-t border-linesoft uppercase tracking-wide">
                  <span>Impact</span>
                  <b className="text-gold font-num font-semibold text-right">{p.impact}</b>
                </div>
                <div className="flex justify-between text-[11px] sm:text-xs text-inkfaint pt-3.5 mt-3.5 border-t border-linesoft uppercase tracking-wide">
                  <span>Opportunity</span>
                  <b className="text-gold font-num font-semibold">{p.opp}</b>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* PROCESS TIMELINE */}
      <section className="py-20 sm:py-28 lg:py-[120px]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Process"
            title="How ScanX helps"
            description="A structured path from raw evidence to a prioritized growth roadmap."
          />
          <Reveal>
            <div className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-3">
              <div className="hidden lg:block absolute top-[35px] left-[8%] right-[8%] h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent" />
              {processSteps.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.42, delay: i * 0.07 }}
                  className="relative z-10 group flex items-center sm:flex-col sm:items-start lg:items-center gap-4 lg:gap-3 rounded-md border border-line bg-white p-4 sm:p-5 lg:p-4 text-left lg:text-center transition-all duration-300 hover:-translate-y-1 hover:border-gold hover:shadow-gold"
                >
                  <div className="w-11 h-11 rounded-full border border-ink flex items-center justify-center font-num font-semibold text-sm bg-bg group-hover:border-gold group-hover:bg-goldsoft group-hover:text-gold transition-colors flex-shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.14em] text-inkfaint mb-1">Step {i + 1}</div>
                    <div className="text-sm font-semibold tracking-wide">{step}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="h-px bg-line" />
      </div>

      {/* WHAT WE ANALYZE */}
      <section className="py-20 sm:py-28 lg:py-[120px]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Scope of Research"
            title="What we analyze"
            description="Nine research areas, each contributing evidence to your business's full growth picture."
          />
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 bg-transparent">
            {analyzeAreas.map((a) => (
              <StaggerItem
                key={a.t}
                className="h-full border border-line rounded-md bg-white hover:border-gold hover:-translate-y-1 hover:shadow-card transition-all duration-300 p-7 sm:p-8"
              >
                <div className="w-10 h-10 border border-line rounded-lg flex items-center justify-center mb-5 text-gold hover:rotate-[-8deg] hover:scale-110 transition-transform">
                  <Circle size={16} strokeWidth={1.6} />
                </div>
                <h3 className="text-[17px] font-heading font-bold mb-2.5">{a.t}</h3>
                <p className="text-sm text-inksoft leading-relaxed mb-3.5">{a.d}</p>
                <div className="text-[11px] sm:text-xs text-gold font-semibold uppercase tracking-wide">{a.v}</div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="h-px bg-line" />
      </div>

      {/* DELIVERABLES */}
      <section className="py-20 sm:py-28 lg:py-[120px]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="The Deliverable"
            title="What you'll receive"
            description="One consolidated report, built to be read by an owner and acted on by a team."
          />
          <StaggerGrid className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
            {deliverables.map((d, i) => (
              <StaggerItem
                key={d}
                className="border border-line rounded-md p-5 sm:p-6 bg-bg hover:border-gold hover:shadow-gold hover:-translate-y-1 transition-all duration-300"
              >
                <div className="font-num text-xs text-inkfaint mb-3.5">{String(i + 1).padStart(2, "0")}</div>
                <h4 className="text-[15px] font-semibold leading-snug">{d}</h4>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* CASE STUDIES PREVIEW */}
      <section id="cases" className="py-20 sm:py-28 lg:py-[120px]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Featured Work"
            title="Independent Portfolio Case Studies"
            description="Real businesses, researched independently, to demonstrate how ScanX's methodology surfaces practical opportunities."
          />
          <StaggerGrid className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {caseStudies.map((c) => (
              <StaggerItem key={c.slug}>
                <motion.a
                  href={`/case-studies/${c.slug}`}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="block border border-line rounded-md overflow-hidden bg-white hover:shadow-[0_44px_64px_-35px_rgba(31,31,31,0.28)] transition-shadow h-full"
                >
                  <div className="h-40 sm:h-48 bg-raised border-b border-line relative flex items-center justify-center overflow-hidden">
                    <div
                      className="absolute inset-0 opacity-40"
                      style={{
                        backgroundImage:
                          "linear-gradient(rgba(31,31,31,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(31,31,31,0.05) 1px,transparent 1px)",
                        backgroundSize: "24px 24px",
                      }}
                    />
                    <span className="font-num text-3xl sm:text-4xl font-semibold text-ink opacity-15 relative">
                      {c.businessName.split(" ").map((w) => w[0]).slice(0, 2).join("")}
                    </span>
                  </div>
                  <div className="p-6 sm:p-7">
                    <div className="text-[11px] uppercase tracking-wider text-gold font-semibold mb-2.5">
                      {c.industry}
                    </div>
                    <h3 className="text-lg sm:text-xl font-heading font-bold mb-2.5">{c.businessName}</h3>
                    <p className="text-sm text-inksoft leading-relaxed mb-4.5">{c.objective}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {(c.tags || []).map((tag) => (
                        <span key={tag} className="text-[11px] bg-raised px-2.5 py-1.5 rounded-full text-inksoft">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-sm font-semibold border-t border-linesoft pt-4.5 text-gold">
                      View report <ArrowRight size={14} />
                    </div>
                  </div>
                </motion.a>
              </StaggerItem>
            ))}
          </StaggerGrid>
          <Reveal className="mt-9 flex justify-center">
            <Button to="/case-studies" variant="secondary">
              View All Case Studies <ArrowRight size={15} />
            </Button>
          </Reveal>
          <Reveal className="mt-11 px-6 sm:px-7 py-5 border-l-2 border-gold bg-raised text-[13px] text-inksoft leading-relaxed rounded-r">
            Reports were independently prepared using publicly available information for
            educational and portfolio purposes. They do not represent commissioned consulting
            engagements, and are not affiliated with or endorsed by the featured business.
            Reports will be removed upon request from the respective business owner.
          </Reveal>
        </div>
      </section>

      {/* METHODOLOGY TEASER */}
      <section id="methodology" className="bg-ink text-bg py-20 sm:py-28 lg:py-[120px]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Research Methodology"
            title="Evidence before opinion"
            description="Every recommendation in a ScanX report traces back to a documented, publicly available source."
            dark
          />
          <Reveal className="flex flex-wrap gap-3 sm:gap-3.5 mb-14 sm:mb-16">
            {methodFlow.map((step, i) => (
              <span key={step} className="flex items-center gap-3">
                <span className="border border-white/15 px-4 sm:px-5 py-3 sm:py-3.5 rounded-full text-sm font-medium flex items-center gap-2.5 hover:border-gold hover:bg-gold/10 hover:-translate-y-0.5 transition-all">
                  <span className="font-num text-gold text-[13px]">{String(i + 1).padStart(2, "0")}</span>
                  {step}
                </span>
                {i < methodFlow.length - 1 && <span className="text-[#726F65] hidden sm:inline">→</span>}
              </span>
            ))}
          </Reveal>
          <StaggerGrid className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-white/10 border border-white/10">
            {sources.map((s) => (
              <StaggerItem
                key={s}
                className="bg-ink p-5 sm:p-5.5 text-sm font-medium flex items-center gap-3 hover:bg-[#2a2a26] hover:pl-7 transition-all duration-300"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {s}
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* STATS DASHBOARD */}
      <section className="py-20 sm:py-28 lg:py-[120px]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
          <SectionHeading
            eyebrow="Business Dashboard"
            title="Research at a glance"
            description="A running tally of the work behind ScanX's growing portfolio."
          />
          <StaggerGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-line border border-line">
            {stats.map((s) => (
              <StaggerItem key={s.label} className="bg-bg hover:bg-raised transition-colors p-8 sm:p-10 lg:p-11">
                <div className="text-4xl sm:text-[44px] font-bold tracking-tight mb-2">
                  <AnimatedCounter target={s.value} />
                </div>
                <div className="text-[13px] text-inksoft uppercase tracking-wide">{s.label}</div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 sm:py-28 lg:py-[120px]">
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
          <SectionHeading eyebrow="Questions" title="Frequently asked questions" />
          <Reveal className="max-w-3xl">
            {faqs.map((f) => (
              <FAQItem key={f.q} q={f.q} a={f.a} />
            ))}
          </Reveal>
        </div>
      </section>

      {/* FINAL CTA */}
      <section id="contact-cta" className="relative overflow-hidden text-center py-24 sm:py-32 lg:py-[140px]">
        <div className="absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none bg-[radial-gradient(circle,rgba(182,140,58,0.08)_0%,rgba(182,140,58,0)_70%)] animate-[pulseGlow_6s_ease-in-out_infinite]" />
        <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10 relative">
          <Reveal className="font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center justify-center gap-2.5 mb-5">
            <span className="w-6 h-px bg-gold" /> Get Started
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="text-[32px] sm:text-5xl lg:text-[52px] leading-tight mb-5">
              Ready to discover hidden growth opportunities?
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-base sm:text-lg text-inksoft max-w-xl mx-auto mb-10 leading-relaxed">
              Let's analyze your business and uncover practical opportunities to improve your
              market position, customer experience, and digital presence.
            </p>
          </Reveal>
          <Reveal delay={0.15} className="flex justify-center">
            <Button to="/contact" variant="primary">
              Request Free Business Snapshot
            </Button>
          </Reveal>
        </div>
      </section>
    </>
  );
}
