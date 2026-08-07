import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./CountdownTimer.css";
import {
  FESTIVAL_TARGET_DATE,
  FESTIVAL_NAME,
  FESTIVAL_YEAR,
  FESTIVAL_DATE_DISPLAY,
  VENUE,
} from "../constants/festival";

function pad(n) {
  return String(n).padStart(2, "0");
}

function getTimeLeft() {
  const diff = FESTIVAL_TARGET_DATE - Date.now();
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

function Flip({ value, label }) {
  const [prev, setPrev] = useState(value);
  const [flip, setFlip] = useState(false);

  useEffect(() => {
    if (value !== prev) {
      setFlip(true);
      const t = setTimeout(() => {
        setPrev(value);
        setFlip(false);
      }, 300);
      return () => clearTimeout(t);
    }
  }, [value, prev]);

  return (
    <div className="flip-unit">
      <div className={`flip-card${flip ? " flipping" : ""}`}>
        <span className="flip-top">{pad(flip ? prev : value)}</span>
        <span className="flip-bottom">{pad(value)}</span>
      </div>
      <span className="flip-label">{label}</span>
    </div>
  );
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeLeft());
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.2 });

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="countdown-section">
      <div className="countdown-bg" />
      <div className="container">
        <motion.div
          ref={ref}
          className="countdown-inner"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.9 }}
        >
          <p className="countdown-eyebrow">✦ Get Ready ✦</p>
          <h2 className="countdown-title">{FESTIVAL_NAME} {FESTIVAL_YEAR}</h2>
          <p className="countdown-sub">
            Mahasaptami &nbsp;·&nbsp; {FESTIVAL_DATE_DISPLAY}
          </p>

          <div className="countdown-venue">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
            <span>{VENUE}</span>
          </div>

          <div className="countdown-grid">
            <Flip value={time.days} label="Days" />
            <span className="countdown-sep">:</span>
            <Flip value={time.hours} label="Hours" />
            <span className="countdown-sep">:</span>
            <Flip value={time.minutes} label="Minutes" />
            <span className="countdown-sep">:</span>
            <Flip value={time.seconds} label="Seconds" />
          </div>

          <p className="countdown-msg">
            🌸 &nbsp; Mark your calendar and celebrate with us! &nbsp; 🌸
          </p>
        </motion.div>
      </div>
    </section>
  );
}
