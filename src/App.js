import React, { useEffect, useState, useCallback } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
import PayModal from "./components/PayModal";
import About from "./components/About";
import CountdownTimer from "./components/CountdownTimer";
import EventSection from "./components/EventSection";
import Sponsors from "./components/Sponsors";
import Gallery from "./components/Gallery";
import Schedule from "./components/Schedule";
import Forms from "./components/Forms";
import Footer from "./components/Footer";
import { HERO_BG_IMAGE, ABOUT_IMAGE, GALLERY_IMAGES } from "./constants/images";
import { EVENT_SECTIONS } from "./constants/events";

export default function App() {
  const [payOpen, setPayOpen] = useState(false);
  const openPay = useCallback(() => setPayOpen(true), []);
  const closePay = useCallback(() => setPayOpen(false), []);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* Scroll-reveal: add .visible to .reveal elements when they enter view */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) => e.isIntersecting && e.target.classList.add("visible"),
        ),
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="App">
      <TopBar />
      <Navbar onPayClick={openPay} />
      <Hero heroBgImage={HERO_BG_IMAGE} onPayClick={openPay} />
      <About aboutImage={ABOUT_IMAGE} />
      <CountdownTimer />

      {EVENT_SECTIONS.map((event) => (
        <EventSection key={event.id} {...event} />
      ))}

      <Gallery images={GALLERY_IMAGES} />
      <Sponsors />
      <Schedule />
      <Forms />
      <Footer />
      <PayModal isOpen={payOpen} onClose={closePay} />
      {showTop && (
        <button
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            aria-hidden="true"
          >
            <path d="M18 15l-6-6-6 6" />
          </svg>
        </button>
      )}
    </div>
  );
}
