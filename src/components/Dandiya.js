import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import Carousel from "./Carousel";
import { DANDIYA_IMAGES } from "../constants/images";
import "./Dandiya.css";

const HIGHLIGHTS = [
  {
    icon: "🥁",
    title: "Live Dhol & Music",
    desc: "High-energy Gujarati garba beats mixed with Bollywood hits to keep you dancing all night.",
  },
  {
    icon: "🪄",
    title: "Dandiya Sticks",
    desc: "Complimentary decorated dandiya sticks provided at the venue for all participants.",
  },
  {
    icon: "👗",
    title: "Best Costume Prize",
    desc: "Show off your most vibrant chaniya choli or kurta — exciting prizes for the best dressed.",
  },
  {
    icon: "🍽️",
    title: "Festive Snacks",
    desc: "Enjoy traditional farsan, chai, and sweet treats through the evening.",
  },
  {
    icon: "🏆",
    title: "Dandiya Competition",
    desc: "Couples and solo dance competitions with special prizes from the committee.",
  },
  {
    icon: "📸",
    title: "Photo Booth",
    desc: "Capture your festive memories at our specially designed Navratri photo corner.",
  },
];

const STATS = [
  { num: "Navami Night", label: "Event Night" },
  { num: "7:30 PM", label: "Starts at" },
  { num: "Open to All", label: "Residents Welcome" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Dandiya() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.08 });

  return (
    <section id="dandiya" className="dandiya-section" ref={ref}>
      <div className="dandiya-bg-glow" aria-hidden="true" />
      <div className="dandiya-sticks" aria-hidden="true">
        🏮
      </div>

      <div className="dandiya-inner">
        {/* ── Header ── */}
        <motion.div
          className="dandiya-header"
          variants={fadeUp}
          custom={0}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="dandiya-eyebrow">✦ Special Evening ✦</p>
          <h2 className="dandiya-title-en">Dandiya Night</h2>
          <p className="dandiya-tagline">
            Twirl into the festival season with colourful sticks, soulful garba
            rhythms, and the warmth of the entire Utopia community. An evening
            to remember — every year, on Navami night.
          </p>
        </motion.div>

        {/* ── Divider ── */}
        <div className="dandiya-divider">
          <span className="dandiya-divider-icon">🪗</span>
        </div>

        {/* ── Info pills ── */}
        <motion.div
          className="dandiya-info-bar"
          variants={fadeUp}
          custom={1}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {[
            { icon: "📅", label: "Navami Night", detail: "During Durga Puja" },
            {
              icon: "🕢",
              label: "7:00 PM Onwards",
              detail: "Late into the night",
            },
            {
              icon: "📍",
              label: "Utopia Commercial Amphitheatre",
            },
            { icon: "🎟️", label: "Free Entry", detail: "For all residents" },
          ].map(({ icon, label, detail }) => (
            <div className="dandiya-info-pill" key={label}>
              <span className="dandiya-info-pill-icon">{icon}</span>
              <span>
                <strong>{label}</strong> · {detail}
              </span>
            </div>
          ))}
        </motion.div>

        {/* ── Photo Gallery ── */}
        <motion.div
          className="dandiya-gallery"
          variants={fadeUp}
          custom={2}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          <p className="dandiya-gallery-label">📷 Moments from Dandiya Night</p>
          <Carousel
            images={DANDIYA_IMAGES}
            accentColor="#e040a0"
            autoplayMs={3500}
          />
        </motion.div>
      </div>
    </section>
  );
}
