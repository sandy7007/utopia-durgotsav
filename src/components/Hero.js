import React, { useEffect, useRef, useMemo } from "react";
import { motion } from "framer-motion";
import "./Hero.css";

/* ── Floating spark particle ── */
function Spark({ style }) {
  return <div className="spark" style={style} />;
}

export default function Hero({ heroBgImage }) {
  const containerRef = useRef(null);

  /* stable random sparks – generated once */
  const sparks = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => ({
        key: i,
        style: {
          left: `${5 + Math.random() * 90}%`,
          bottom: `${5 + Math.random() * 85}%`,
          width: `${3 + Math.random() * 6}px`,
          height: `${3 + Math.random() * 6}px`,
          animationDelay: `${(Math.random() * 6).toFixed(2)}s`,
          animationDuration: `${(5 + Math.random() * 7).toFixed(2)}s`,
        },
      })),
    [],
  );

  /* parallax on mouse move */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleMove = (e) => {
      const rx = (e.clientX / window.innerWidth - 0.5) * 18;
      const ry = (e.clientY / window.innerHeight - 0.5) * 12;
      el.style.setProperty("--rx", `${rx}deg`);
      el.style.setProperty("--ry", `${ry}deg`);
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const titleVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.18, duration: 0.9, ease: [0.22, 1, 0.36, 1] },
    }),
  };

  return (
    <section id="home" className="hero" ref={containerRef}>
      {/* ── Background layers ── */}
      <div className="hero-bg">
        {heroBgImage && (
          <img
            src={heroBgImage}
            alt=""
            className="hero-bg-photo"
            aria-hidden="true"
          />
        )}
        <div className="hero-bg-radial" />
        <div className="hero-bg-grid" />
        <div className="hero-bg-vignette" />
      </div>

      {/* ── Sparks ── */}
      <div className="sparks-layer" aria-hidden="true">
        {sparks.map((s) => (
          <Spark key={s.key} style={s.style} />
        ))}
      </div>

      {/* ── Main content ── */}
      <div className="hero-content">
        <motion.p
          className="hero-eyebrow"
          custom={0}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          ✦ Welcome to ✦
        </motion.p>

        <motion.h1
          className="hero-bengali"
          custom={1}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          দুর্গোৎসব
        </motion.h1>

        <motion.h2
          className="hero-english"
          custom={2}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          D U R G O T S A V
        </motion.h2>

        <motion.div
          className="hero-divider"
          custom={3}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <span className="hd-line" />
          <span className="hd-om">ॐ</span>
          <span className="hd-line" />
        </motion.div>

        <motion.p
          className="hero-committee"
          custom={4}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Utopia Durgotsav Committee &nbsp;·&nbsp; Celebrating the Divine Mother
        </motion.p>

        <motion.p
          className="hero-since"
          custom={5}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          Since 2024
        </motion.p>

        <motion.div
          className="hero-actions"
          custom={6}
          variants={titleVariants}
          initial="hidden"
          animate="visible"
        >
          <a href="#durga-puja" className="hero-btn hero-btn--primary">
            Explore Festivities
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
            >
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </a>
          <a href="#gallery" className="hero-btn hero-btn--ghost">
            View Gallery
          </a>
        </motion.div>
      </div>

      {/* ── Scroll nudge ── */}
      <div className="scroll-nudge" aria-hidden="true">
        <div className="scroll-line" />
        <span>scroll</span>
      </div>

      {/* ── Bottom lotus strip ── */}
      <div className="lotus-strip" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <span
            key={i}
            className="lotus"
            style={{ animationDelay: `${i * 0.12}s` }}
          >
            🪷
          </span>
        ))}
      </div>
    </section>
  );
}
