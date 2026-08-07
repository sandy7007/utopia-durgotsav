import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./Sponsors.css";
import { SPONSORS } from "../constants/sponsors";

function SponsorLogo({ src, name }) {
  return (
    <div className="sponsor-logo-wrap">
      <img src={src} alt={name} className="sponsor-logo" loading="lazy" />
    </div>
  );
}

export default function Sponsors() {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  /* Duplicate the array so the marquee loops seamlessly */
  const doubled = [...SPONSORS, ...SPONSORS];

  return (
    <section id="sponsors" className="sponsors-section">
      <div className="sponsors-bg-glow" />
      <div className="container">
        <motion.div
          ref={ref}
          className="sponsors-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="sponsors-eyebrow">✦ Our Supporters ✦</p>
          <h2 className="section-title">Proud Sponsors</h2>
          <div className="ornament">
            <span className="ornament-symbol">🙏</span>
          </div>
          <p className="section-subtitle">
            We are grateful to our generous sponsors whose support makes this
            grand celebration possible every year.
          </p>
        </motion.div>
      </div>

      {/* Marquee — outside .container so it bleeds full width */}
      <div className="sponsors-marquee-wrapper">
        <div className="sponsors-track">
          {doubled.map((s, i) => (
            <SponsorLogo key={i} src={s.src} name={s.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
