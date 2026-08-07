import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Carousel from './Carousel';
import './EventSection.css';

export default function EventSection({
  id,
  title,
  bengaliTitle,
  description,
  images,
  accentColor = '#FF6B35',
  bgGradient,
  svgDecoration,
  reverse = false,
}) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const textVariant = {
    hidden:  { opacity: 0, x: reverse ? 50 : -50 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.9, ease: [0.22,1,0.36,1] } },
  };

  const carouselVariant = {
    hidden:  { opacity: 0, x: reverse ? -50 : 50, scale: 0.95 },
    visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.9, delay: 0.15, ease: [0.22,1,0.36,1] } },
  };

  return (
    <section
      id={id}
      className={`event-section ${reverse ? 'event-section--reverse' : ''}`}
      style={{ background: bgGradient }}
      ref={ref}
    >
      {/* Decorative corner glow */}
      <div className="event-glow" style={{ '--accent': accentColor }} />

      {/* SVG watermark decoration */}
      {svgDecoration && (
        <img src={svgDecoration} alt="" className="event-svg-decoration" aria-hidden="true" />
      )}

      <div className="container">
        <div className="event-grid">
          {/* ── Text side ── */}
          <motion.div
            className="event-text"
            variants={textVariant}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <p className="event-eyebrow" style={{ color: accentColor }}>
              ✦ Annual Celebration ✦
            </p>

            <h2 className="event-bengali" style={{ '--accent': accentColor }}>
              {bengaliTitle}
            </h2>

            <h3 className="event-title">{title}</h3>

            <div className="event-divider" style={{ '--accent': accentColor }}>
              <span className="ed-line" /><span className="ed-dot" /><span className="ed-line" />
            </div>

            <p className="event-description">{description}</p>

            <div className="event-tags">
              {['Devotion', 'Culture', 'Community', 'Heritage'].map((tag) => (
                <span
                  key={tag}
                  className="event-tag"
                  style={{ borderColor: `${accentColor}40`, color: accentColor }}
                >
                  {tag}
                </span>
              ))}
            </div>

            <a href="#gallery" className="event-cta" style={{ '--accent': accentColor }}>
              View Full Gallery
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
              </svg>
            </a>
          </motion.div>

          {/* ── Carousel side ── */}
          <motion.div
            className="event-carousel-wrap"
            variants={carouselVariant}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <div
              className="carousel-frame"
              style={{ '--accent': accentColor }}
            >
              <Carousel images={images} accentColor={accentColor} autoplayMs={4500} />
            </div>
            {/* Decorative frame corners */}
            <span className="frame-corner frame-corner--tl" style={{ color: accentColor }}>✦</span>
            <span className="frame-corner frame-corner--tr" style={{ color: accentColor }}>✦</span>
            <span className="frame-corner frame-corner--bl" style={{ color: accentColor }}>✦</span>
            <span className="frame-corner frame-corner--br" style={{ color: accentColor }}>✦</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
