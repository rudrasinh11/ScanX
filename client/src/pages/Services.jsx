import { ArrowRight } from "lucide-react";
import Reveal from "../components/Reveal.jsx";
import { StaggerGrid, StaggerItem } from "../components/StaggerGrid.jsx";
import Button from "../components/Button.jsx";
import { services } from "../data/content.js";

export default function Services() {
  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <Reveal className="max-w-2xl mb-14 sm:mb-16">
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center gap-2.5 mb-5">
            <span className="w-6 h-px bg-gold" /> What We Do
          </div>
          <h1 className="text-[32px] sm:text-5xl leading-[1.1] mb-4">Services</h1>
          <p className="text-base sm:text-lg text-inksoft leading-relaxed">
            Each report starts with the business decision it needs to support. We scope the
            evidence, markets, and deliverable around that decision—not a generic package.
          </p>
        </Reveal>

        <StaggerGrid className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {services.map((s) => (
            <StaggerItem
              key={s.name}
              className="border border-line rounded-md p-7 sm:p-8 bg-bg hover:border-gold hover:shadow-gold hover:-translate-y-1 transition-all duration-300"
            >
              <h2 className="text-xl sm:text-2xl font-heading font-bold mb-5">{s.name}</h2>

              <dl className="space-y-4 text-sm">
                <div>
                  <dt className="text-inkfaint uppercase tracking-wide text-[11px] mb-1.5">Problem</dt>
                  <dd className="text-inksoft leading-relaxed">{s.problem}</dd>
                </div>
                <div>
                  <dt className="text-inkfaint uppercase tracking-wide text-[11px] mb-1.5">Solution</dt>
                  <dd className="text-inksoft leading-relaxed">{s.solution}</dd>
                </div>
                <div>
                  <dt className="text-inkfaint uppercase tracking-wide text-[11px] mb-1.5">Deliverables</dt>
                  <dd className="flex flex-wrap gap-2 mt-1.5">
                    {s.deliverables.map((d) => (
                      <span key={d} className="text-[11px] bg-raised px-2.5 py-1.5 rounded-full text-inksoft">
                        {d}
                      </span>
                    ))}
                  </dd>
                </div>
                <div>
                  <dt className="text-inkfaint uppercase tracking-wide text-[11px] mb-1.5">Business Value</dt>
                  <dd className="text-inksoft leading-relaxed">{s.value}</dd>
                </div>
                <div className="flex justify-between pt-4 border-t border-linesoft">
                  <div>
                    <dt className="text-inkfaint uppercase tracking-wide text-[11px] mb-1">Ideal For</dt>
                    <dd className="text-sm">{s.idealFor}</dd>
                  </div>
                  <div className="text-right">
                    <dt className="text-inkfaint uppercase tracking-wide text-[11px] mb-1">Timeline</dt>
                    <dd className="text-sm font-num text-gold">{s.timeline}</dd>
                  </div>
                </div>
              </dl>
            </StaggerItem>
          ))}
        </StaggerGrid>

        <Reveal className="mt-16 text-center border border-line rounded-md py-14 px-6 bg-raised">
          <h2 className="text-2xl sm:text-3xl font-heading font-bold mb-4">Not sure which service fits?</h2>
          <p className="text-inksoft max-w-lg mx-auto mb-8">
            Tell us about your business and biggest challenge — ScanX will recommend the right
            scope and send a custom proposal.
          </p>
          <div className="flex justify-center">
            <Button to="/contact" variant="primary">
              Discuss Your Research Brief <ArrowRight size={15} />
            </Button>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
