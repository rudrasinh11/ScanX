import Reveal from "../components/Reveal.jsx";
import Button from "../components/Button.jsx";

export default function NotFound() {
  return (
    <div className="pt-40 pb-32 text-center px-5">
      <Reveal>
        <div className="font-num text-gold text-sm tracking-widest mb-4">404</div>
        <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-4">Page not found</h1>
        <p className="text-inksoft max-w-md mx-auto mb-9">
          The page you're looking for doesn't exist or may have moved.
        </p>
        <div className="flex justify-center">
          <Button to="/" variant="primary">
            Back to Home
          </Button>
        </div>
      </Reveal>
    </div>
  );
}
