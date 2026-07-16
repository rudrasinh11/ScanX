import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-line pt-14 sm:pt-16 pb-8">
      <div className="max-w-[1240px] mx-auto px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col lg:flex-row justify-between gap-10 lg:gap-12 mb-12">
          <div className="max-w-xs">
            <Link to="/" className="font-heading font-extrabold text-xl">
              Scan<span className="text-gold">X</span>
            </Link>
            <p className="text-sm text-inksoft mt-3.5 leading-relaxed">
              Decision-ready market research reports for growth, launch, and market-entry decisions.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 sm:gap-16">
            <div>
              <h5 className="text-xs uppercase tracking-wider text-inkfaint mb-4">Company</h5>
              <nav className="flex flex-col gap-3 text-sm text-inksoft">
                <Link to="/services" className="hover:text-gold transition-colors">Services</Link>
                <Link to="/case-studies" className="hover:text-gold transition-colors">Case Studies</Link>
                <Link to="/methodology" className="hover:text-gold transition-colors">Methodology</Link>
                <Link to="/about" className="hover:text-gold transition-colors">About</Link>
              </nav>
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wider text-inkfaint mb-4">Contact</h5>
              <nav className="flex flex-col gap-3 text-sm text-inksoft">
                <a href="mailto:rudrasinh3115@gmail.com" className="hover:text-gold transition-colors">
                  rudrasinh3115@gmail.com
                </a>
                <a href="tel:+918905050705" className="hover:text-gold transition-colors">
                  +91 8905050705
                </a>
              </nav>
            </div>
            <div>
              <h5 className="text-xs uppercase tracking-wider text-inkfaint mb-4">Legal</h5>
              <nav className="flex flex-col gap-3 text-sm text-inksoft">
                <Link to="/privacy" className="hover:text-gold transition-colors">Privacy</Link>
                <Link to="/disclaimer" className="hover:text-gold transition-colors">Disclaimer</Link>
              </nav>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-3 pt-6 border-t border-linesoft text-xs text-inkfaint">
          <span>&copy; {new Date().getFullYear()} ScanX. Independent business research.</span>
          <span>Research. Evidence. Strategy.</span>
        </div>
      </div>
    </footer>
  );
}
