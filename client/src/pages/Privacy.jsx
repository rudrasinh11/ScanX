import Reveal from "../components/Reveal.jsx";

export default function Privacy() {
  return (
    <div className="pt-32 sm:pt-36 pb-20 sm:pb-28">
      <article className="max-w-3xl mx-auto px-5 sm:px-8">
        <Reveal>
          <div className="font-num text-xs tracking-[0.14em] uppercase text-gold flex items-center gap-2.5 mb-5">
            <span className="w-6 h-px bg-gold" /> Legal
          </div>
          <h1 className="text-[32px] sm:text-5xl leading-[1.1] mb-8">Privacy Policy</h1>
          <div className="space-y-7 text-inksoft leading-relaxed">
            <p>ScanX collects the details you submit through the research-brief form, including contact information and business context. We use this information only to assess your request, respond to you, and improve our service.</p>
            <section><h2 className="text-xl font-heading font-bold text-ink mb-2">How information is used</h2><p>Your details are stored in our secure business systems and are available only to the ScanX team and service providers needed to operate the site. We do not sell personal information.</p></section>
            <section><h2 className="text-xl font-heading font-bold text-ink mb-2">Retention</h2><p>We keep enquiry records only for as long as reasonably necessary for business communication, record keeping, or legal obligations. You may request access, correction, or deletion of your enquiry by contacting us.</p></section>
            <section><h2 className="text-xl font-heading font-bold text-ink mb-2">Contact</h2><p>For privacy questions, email <a className="text-gold hover:underline" href="mailto:rudrasinh3115@gmail.com">rudrasinh3115@gmail.com</a>.</p></section>
          </div>
        </Reveal>
      </article>
    </div>
  );
}
