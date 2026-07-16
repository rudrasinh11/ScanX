import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import Button from "../components/Button.jsx";
import api from "../lib/api.js";

export default function CaseStudyDetail() {
  const { slug } = useParams();
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ok | notfound | offline

  useEffect(() => {
    setStatus("loading");
    api
      .get(`/case-studies/${slug}`)
      .then((res) => {
        setData(res.data);
        setStatus("ok");
      })
      .catch((err) => {
        setStatus(err?.response?.status === 404 ? "notfound" : "offline");
      });
  }, [slug]);

  if (status === "loading") {
    return <div className="pt-40 pb-32 text-center text-inksoft">Loading report…</div>;
  }

  if (status === "notfound") {
    return (
      <div className="pt-40 pb-32 text-center px-5">
        <h1 className="text-2xl font-bold mb-3">Report not found</h1>
        <p className="text-inksoft mb-8">This case study may have been removed at the business owner's request.</p>
        <Button to="/case-studies" variant="secondary">
          <ArrowLeft size={15} /> Back to case studies
        </Button>
      </div>
    );
  }

  if (status === "offline") {
    return (
      <div className="pt-40 pb-32 text-center px-5">
        <h1 className="text-2xl font-bold mb-3">Report unavailable</h1>
        <p className="text-inksoft mb-8">
          The ScanX API isn't reachable right now, so this report couldn't be loaded from
          MongoDB. Start the backend and try again.
        </p>
        <Button to="/case-studies" variant="secondary">
          <ArrowLeft size={15} /> Back to case studies
        </Button>
      </div>
    );
  }

  const sections = [
    { label: "Summary", value: data.summary },
    { label: "Customer Journey", value: data.customerJourney },
    { label: "Website Audit", value: data.websiteAudit },
    { label: "Competitor Analysis", value: data.competitorAnalysis },
  ].filter((s) => s.value);

  return (
    <div className="pt-28 sm:pt-32 pb-20 sm:pb-28">
      <div className="max-w-[900px] mx-auto px-5 sm:px-8">
        <Reveal>
          <Link to="/case-studies" className="inline-flex items-center gap-1.5 text-sm text-inksoft hover:text-gold transition-colors mb-8">
            <ArrowLeft size={15} /> Back to case studies
          </Link>
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold mb-4">{data.industry}</div>
          <h1 className="text-[30px] sm:text-4xl lg:text-5xl leading-tight mb-4">{data.businessName}</h1>
          <p className="text-base sm:text-lg text-inksoft leading-relaxed mb-8">{data.objective}</p>
          <div className="flex flex-wrap gap-2 mb-12">
            {(data.tags || []).map((t) => (
              <span key={t} className="text-xs bg-raised px-3 py-1.5 rounded-full text-inksoft">{t}</span>
            ))}
          </div>
        </Reveal>

        {sections.map((s) => (
          <Reveal key={s.label} className="mb-10">
            <h2 className="text-xl font-heading font-bold mb-3">{s.label}</h2>
            <p className="text-inksoft leading-relaxed">{s.value}</p>
          </Reveal>
        ))}

        {data.swot && (
          <Reveal className="mb-10">
            <h2 className="text-xl font-heading font-bold mb-4">SWOT Analysis</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["strengths", "weaknesses", "opportunities", "threats"].map((key) => (
                <div key={key} className="border border-line rounded-md p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-gold mb-3 capitalize">{key}</h3>
                  <ul className="space-y-2 text-sm text-inksoft">
                    {(data.swot[key] || []).map((item, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-gold">•</span> {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {data.growthOpportunities?.length > 0 && (
          <Reveal className="mb-10">
            <h2 className="text-xl font-heading font-bold mb-4">Growth Opportunities</h2>
            <ul className="space-y-3">
              {data.growthOpportunities.map((g, i) => (
                <li key={i} className="flex gap-3 text-inksoft">
                  <span className="font-num text-gold text-sm mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  {g}
                </li>
              ))}
            </ul>
          </Reveal>
        )}

        {data.roadmap?.length > 0 && (
          <Reveal className="mb-14">
            <h2 className="text-xl font-heading font-bold mb-4">Roadmap</h2>
            <div className="space-y-4">
              {data.roadmap.map((r, i) => (
                <div key={i} className="border-l-2 border-gold pl-5 py-1">
                  <div className="text-sm font-semibold text-gold mb-1">{r.phase}</div>
                  <div className="text-inksoft text-sm">{r.detail}</div>
                </div>
              ))}
            </div>
          </Reveal>
        )}

        <Reveal className="px-6 py-5 border-l-2 border-gold bg-raised text-[13px] text-inksoft leading-relaxed rounded-r">
          This report was independently prepared using publicly available information for
          educational and portfolio purposes. It does not represent a commissioned consulting
          engagement, and is not affiliated with or endorsed by {data.businessName}. It will be
          removed upon request from the business owner.
        </Reveal>
      </div>
    </div>
  );
}
