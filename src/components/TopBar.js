import React, { useState, useEffect } from "react";
import "./TopBar.css";
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
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  };
}

export default function TopBar() {
  const [time, setTime] = useState(getTimeLeft());
  const [dismissed, setDismissed] = useState(false);
  //   const [visitors, setVisitors] = useState(121);

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("https://api.counterapi.dev/v1/utopia-durgotsav/site-visits/hit")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => d && setVisitors(d.count ?? d.value ?? null))
      .catch(() => {});
  }, []);

  if (dismissed || !time) return null;

  return (
    <div className="topbar" role="banner">
      {/* Left decorative strip */}
      <div className="topbar-glow" aria-hidden="true" />

      <div className="topbar-content">
        {/* Event label */}
        <span className="topbar-label">
          <span className="topbar-diya" aria-hidden="true">
            🪔
          </span>
          <span>
            {FESTIVAL_NAME} {FESTIVAL_YEAR}
          </span>
          <span className="topbar-dot" aria-hidden="true">
            ·
          </span>
          <span className="topbar-date">{FESTIVAL_DATE_DISPLAY}</span>
        </span>

        {/* Divider */}
        <span className="topbar-vr" aria-hidden="true" />

        {/* Venue */}
        <span className="topbar-venue">
          <svg
            className="topbar-pin"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
          </svg>
          <span>{VENUE}</span>
        </span>

        {/* Divider */}
        <span className="topbar-vr" aria-hidden="true" />
        <span
          className="topbar-countdown"
          aria-label={`${time.days} days ${time.hours} hours ${time.minutes} minutes ${time.seconds} seconds remaining`}
        >
          <span className="topbar-unit">
            <strong>{pad(time.days)}</strong>
            <em>d</em>
          </span>
          <span className="topbar-colon">:</span>
          <span className="topbar-unit">
            <strong>{pad(time.hours)}</strong>
            <em>h</em>
          </span>
          <span className="topbar-colon">:</span>
          <span className="topbar-unit">
            <strong>{pad(time.minutes)}</strong>
            <em>m</em>
          </span>
          <span className="topbar-colon">:</span>
          <span className="topbar-unit topbar-unit--sec">
            <strong>{pad(time.seconds)}</strong>
            <em>s</em>
          </span>
        </span>

        <span className="topbar-tag">to go!</span>

        {/* {visitors !== null && (
          <>
            <span className="topbar-vr" aria-hidden="true" />
            <span
              className="topbar-visitors"
              aria-label={`${visitors.toLocaleString()} site visitors`}
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                aria-hidden="true"
              >
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {visitors.toLocaleString()} site visits so far
            </span>
          </>
        )} */}
      </div>

      {/* Dismiss */}
      <button
        className="topbar-close"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss banner"
      >
        ✕
      </button>
    </div>
  );
}
