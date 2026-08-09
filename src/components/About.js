import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./About.css";
import { STATS, BELIEFS, COMMITTEE_INFO } from "../constants/committee";

function StatCard({ value, label, delay }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });
  return (
    <motion.div
      ref={ref}
      className="stat-card"
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay }}
    >
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </motion.div>
  );
}

export default function About({ aboutImage }) {
  const [headRef, headInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });
  const [leftRef, leftInView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });
  const [rightRef, rightInView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  return (
    <section id="about" className="about-section">
      <div className="about-bg-pattern" aria-hidden="true" />

      <div className="container">
        {/* ── Heading ── */}
        <motion.div
          ref={headRef}
          className="about-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="about-eyebrow">Our Story</p>
          <h2 className="section-title">About The Committee</h2>
          <div className="ornament">
            <span className="ornament-symbol">✦</span>
          </div>
          <p className="section-subtitle">
            True devotion, culture and community, woven together in celebration
            of the Divine Mother.
          </p>
        </motion.div>

        {/* ── Two-column layout ── */}
        <div className="about-grid">
          {/* Left – text */}
          <motion.div
            ref={leftRef}
            className="about-text-col"
            initial={{ opacity: 0, x: -50 }}
            animate={leftInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9 }}
          >
            <h3 className="about-subheading">A Legacy Born From Love</h3>
            <p>
              Founded in <strong>{COMMITTEE_INFO.foundedYear}</strong>, the{" "}
              {COMMITTEE_INFO.name}&nbsp;began as a small neighbourhood
              gathering of devotees in the spirit of celebrating Ma Durga. Over
              the last couple of years, our puja has grown into one of the most
              beloved community festivals of the area — touching thousands of
              hearts every year.
            </p>
            <p>
              We believe that a festival is not just a ritual — it is a living
              tapestry of art, music, tradition, and togetherness. Every year
              our dedicated team of volunteers works tirelessly to create
              breathtaking pandal decorations, organise cultural programmes, and
              ensure that every visitor feels the warmth and divinity of the
              goddess.
            </p>
            <p>
              From <strong>Durga Puja</strong> in autumn to{" "}
              <strong>Kali Puja</strong> and
              <strong> Saraswati Puja</strong>, we celebrate the full spectrum
              of Shakti — the divine feminine energy that sustains the universe.
            </p>
            <a href="#durga-puja" className="about-btn">
              Explore Our Pujas
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
          </motion.div>

          {/* Right – decorative card */}
          <motion.div
            ref={rightRef}
            className="about-visual-col"
            initial={{ opacity: 0, x: 50 }}
            animate={rightInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, delay: 0.1 }}
          >
            <div className="about-card">
              <div className="about-card-inner">
                <div className="about-icon-ring">
                  <img src="/logo.png" alt="Durgotsav" className="about-logo" />
                </div>
                <h4 className="about-card-title">Our Beliefs</h4>
                {BELIEFS.map(({ icon, text }) => (
                  <div key={text} className="belief-item">
                    <span className="belief-icon">{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* ── Stats bar ── */}
        <div className="stats-row">
          {STATS.map((s, i) => (
            <StatCard
              key={s.label}
              value={s.value}
              label={s.label}
              delay={i * 0.12}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
