import Reveal from "../components/Reveal.jsx";

export default function Disclaimer() {
  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28">
      <article className="max-w-3xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center gap-2.5 mb-5">
            <span className="w-6 h-px bg-gold" /> Legal
          </div>
          <h1 className="text-[32px] sm:text-5xl leading-[1.1] mb-8">Research Disclaimer</h1>
          <div className="space-y-7 text-inksoft leading-relaxed">
            <p>ScanX reports are research and strategic-analysis materials. They are designed to inform business decisions, not to guarantee commercial outcomes or provide legal, financial, tax, or investment advice.</p>
            <section><h2 className="text-xl font-heading font-bold text-ink mb-2">Research basis</h2><p>Unless an engagement states otherwise, findings are based on information available during the research window. Markets, competitors, platforms, and customer behaviour can change after delivery.</p></section>
            <section><h2 className="text-xl font-heading font-bold text-ink mb-2">Portfolio case studies</h2><p>Portfolio case studies may be independently prepared from public sources for education and demonstration. They do not imply endorsement, affiliation, or a client relationship with the businesses mentioned.</p></section>
            <section><h2 className="text-xl font-heading font-bold text-ink mb-2">Use of reports</h2><p>Clients remain responsible for validating recommendations in their own context and for decisions made using any ScanX material.</p></section>
          </div>
        </Reveal>
      </article>
    </div>
  );
}
