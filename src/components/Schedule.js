import React from "react";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./Schedule.css";
import { SCHEDULE } from "../constants/events";

function TimelineCard({ day, date, events, color, index }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.15 });

  return (
    <motion.div
      ref={ref}
      className="tl-card"
      initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.7, delay: index * 0.08 }}
      style={{ "--card-accent": color }}
    >
      <div className="tl-dot" />
      <div className="tl-content">
        <div className="tl-header">
          <h4 className="tl-day">{day}</h4>
          <span className="tl-date">{date}</span>
        </div>
        <ul className="tl-events">
          {events.map((ev) => (
            <li key={ev}>
              <span className="tl-bullet">✦</span>
              {ev}
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}

function PujaTimeline({ puja, bengali, color, days }) {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  return (
    <div className="puja-timeline" style={{ "--timeline-color": color }}>
      <motion.div
        ref={ref}
        className="puja-timeline-header"
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7 }}
      >
        {/* <span className="puja-bengali-sm" style={{ color }}>
          {bengali}
        </span> */}
        <h3 className="puja-timeline-title" style={{ color }}>
          {puja}
        </h3>
      </motion.div>

      <div className="tl-track">
        {days.map((d, i) => (
          <TimelineCard key={d.day} {...d} color={color} index={i} />
        ))}
      </div>
    </div>
  );
}

export default function Schedule() {
  const [headRef, headInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  return (
    <section id="schedule" className="schedule-section">
      <div className="schedule-bg" />
      <div className="container">
        <motion.div
          ref={headRef}
          className="schedule-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="schedule-eyebrow">✦ Plan Your Visit ✦</p>
          <h2 className="section-title">Event Schedule</h2>
          <div className="ornament">
            <span className="ornament-symbol">📅</span>
          </div>
          <p className="section-subtitle">
            A complete timeline of all rituals, cultural programmes, and
            celebrations across our annual festivals.
          </p>
        </motion.div>

        <div className="schedules-list">
          {SCHEDULE.map((s) => (
            <PujaTimeline key={s.puja} {...s} />
          ))}
        </div>
      </div>
    </section>
  );
}
