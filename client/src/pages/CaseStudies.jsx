import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download, Search } from "lucide-react";
import { motion } from "framer-motion";
import Reveal from "../components/Reveal.jsx";
import { StaggerGrid, StaggerItem } from "../components/StaggerGrid.jsx";
import api from "../lib/api.js";

const fallback = [
  { slug: "coastal-cafe-group", industry: "Hospitality", businessName: "Coastal Café Group", objective: "Improve repeat visit rate and local search visibility.", tags: ["Reviews", "Local SEO", "Customer Journey"] },
  { slug: "wellview-dental-clinic", industry: "Healthcare", businessName: "Wellview Dental Clinic", objective: "Strengthen digital trust signals ahead of a second location.", tags: ["Brand", "Reviews", "Web Audit"] },
  { slug: "northline-home-goods", industry: "Retail", businessName: "Northline Home Goods", objective: "Identify why in-store traffic isn't converting to online sales.", tags: ["Competitor", "Journey", "Growth"] },
];

export default function CaseStudies() {
  const [caseStudies, setCaseStudies] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [industry, setIndustry] = useState("All");
  const [query, setQuery] = useState("");
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    setLoading(true);
    api
      .get("/case-studies")
      .then((res) => {
        setCaseStudies(res.data.length ? res.data : fallback);
        setOffline(false);
      })
      .catch(() => setOffline(true))
      .finally(() => setLoading(false));
  }, []);

  const industries = useMemo(
    () => ["All", ...new Set(caseStudies.map((c) => c.industry))],
    [caseStudies]
  );

  const filtered = caseStudies.filter((c) => {
    const matchesIndustry = industry === "All" || c.industry === industry;
    const matchesQuery =
      !query ||
      c.businessName.toLowerCase().includes(query.toLowerCase()) ||
      c.objective.toLowerCase().includes(query.toLowerCase());
    return matchesIndustry && matchesQuery;
  });

  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <Reveal className="max-w-2xl mb-4">
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center gap-2.5 mb-5">
            <span className="w-6 h-px bg-gold" /> Featured Work
          </div>
          <h1 className="text-[32px] sm:text-5xl leading-[1.1] mb-4">
            Independent Portfolio Case Studies
          </h1>
          <p className="text-base sm:text-lg text-inksoft leading-relaxed">
            Real businesses, researched independently, to demonstrate how ScanX's methodology
            surfaces practical opportunities.
          </p>
        </Reveal>

        {offline && (
          <Reveal className="mt-8 px-5 py-4 border border-line rounded-md bg-raised text-sm text-inksoft">
            Showing sample data — the ScanX API isn't reachable right now, so live case
            studies from MongoDB couldn't be loaded.
          </Reveal>
        )}

        <Reveal className="mt-10 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => (
              <button
                key={ind}
                onClick={() => setIndustry(ind)}
                className={`text-xs sm:text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                  industry === ind
                    ? "bg-ink text-bg border-ink"
                    : "border-line text-inksoft hover:border-gold hover:text-gold"
                }`}
              >
                {ind}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-inkfaint" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search reports…"
              className="w-full pl-10 pr-4 py-2.5 text-sm border border-line rounded-full bg-bg focus:border-gold outline-none transition-colors"
            />
          </div>
        </Reveal>

        {!loading && filtered.length === 0 && (
          <Reveal className="mt-16 text-center text-inksoft">
            No reports match that search yet.
          </Reveal>
        )}

        <StaggerGrid className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((c) => (
            <StaggerItem key={c.slug}>
              <motion.div
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="border border-line rounded-md overflow-hidden bg-white hover:shadow-[0_44px_64px_-35px_rgba(31,31,31,0.28)] transition-shadow h-full flex flex-col"
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
                <div className="p-6 sm:p-7 flex flex-col flex-1">
                  <div className="text-[11px] uppercase tracking-wider text-gold font-semibold mb-2.5">
                    {c.industry}
                  </div>
                  <h3 className="text-lg sm:text-xl font-heading font-bold mb-2.5">{c.businessName}</h3>
                  <p className="text-sm text-inksoft leading-relaxed mb-4.5 flex-1">{c.objective}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {(c.tags || []).map((tag) => (
                      <span key={tag} className="text-[11px] bg-raised px-2.5 py-1.5 rounded-full text-inksoft">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-4 text-sm font-semibold border-t border-linesoft pt-4.5">
                    <Link to={`/case-studies/${c.slug}`} className="flex items-center gap-1.5 hover:text-gold transition-colors">
                      Preview <ArrowRight size={14} />
                    </Link>
                    {c.pdfUrl && (
                      <a href={c.pdfUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 hover:text-gold transition-colors">
                        Download PDF <Download size={14} />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal className="mt-14 px-6 sm:px-7 py-5 border-l-2 border-gold bg-raised text-[13px] text-inksoft leading-relaxed rounded-r">
          Reports were independently prepared using publicly available information for
          educational and portfolio purposes. They do not represent commissioned consulting
          engagements, and are not affiliated with or endorsed by the featured business.
          Reports will be removed upon request from the respective business owner.
        </Reveal>
      </div>
    </div>
  );
}
