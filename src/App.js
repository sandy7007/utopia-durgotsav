import React, { useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import TopBar from "./components/TopBar";
import Hero from "./components/Hero";
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
      <Navbar />
      <Hero heroBgImage={HERO_BG_IMAGE} />
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
    </div>
  );
}
