import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Footer from "./components/Footer.jsx";
import ScrollProgress from "./components/ScrollProgress.jsx";
import BackToTop from "./components/BackToTop.jsx";
import Home from "./pages/Home.jsx";
import CaseStudies from "./pages/CaseStudies.jsx";
import CaseStudyDetail from "./pages/CaseStudyDetail.jsx";
import Services from "./pages/Services.jsx";
import Methodology from "./pages/Methodology.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import NotFound from "./pages/NotFound.jsx";
import AdminLayout from "./pages/admin/AdminLayout.jsx";
import Dashboard from "./pages/admin/Dashboard.jsx";
import CaseStudiesAdmin from "./pages/admin/CaseStudies.jsx";
import Submissions from "./pages/admin/Submissions.jsx";
import AdminLogin from "./pages/admin/AdminLogin.jsx";
import Privacy from "./pages/Privacy.jsx";
import Disclaimer from "./pages/Disclaimer.jsx";
import ToastViewport from "./components/ToastViewport.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" in window ? "instant" : "auto" });
  }, [pathname]);
  return null;
}

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollProgress />
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
          <Route path="/services" element={<Services />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          
          {/* Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />
          
          {/* Authentic Nested Admin Layout Routes */}
          <Route path="/admin/*" element={<AdminLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="case-studies" element={<CaseStudiesAdmin />} />
            <Route path="submissions" element={<Submissions />} />
          </Route>

          {/* Catch-all 404 handler (Must be placed at the very bottom) */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BackToTop />
      <ToastViewport />
    </div>
  );
}