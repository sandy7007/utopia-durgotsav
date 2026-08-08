import React from "react";
import "./Footer.css";
import { QUICK_LINKS } from "../constants/navigation";
import { CONTACT_ITEMS, VENUE, VENUE_ADDRESS } from "../constants/festival";

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/uma_at_utopia",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0" fill="currentColor" strokeWidth="0" />
        <path d="M17.5 6.5" strokeLinecap="round" strokeWidth="3" />
      </svg>
    ),
  },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer" id="contact">
      <div className="footer-glow" />

      <div className="container">
        {/* ── Top ── */}
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="footer-logo-diya">🪔</span>
              <div>
                <span className="footer-logo-main">Durgotsav</span>
                <span className="footer-logo-sub">
                  Utopia Durgotsav Committee
                </span>
              </div>
            </div>
            <p className="footer-tagline">
              Celebrating the Divine Mother with love, devotion, and community
              spirit since 2024.
            </p>
            {/* Socials */}
            <div className="footer-socials">
              {SOCIALS.map(({ name, href, icon }) => (
                <a
                  key={name}
                  href={href}
                  className="social-btn"
                  aria-label={name}
                  rel="noopener noreferrer"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-col">
            <h4 className="footer-col-title">Quick Links</h4>
            <ul className="footer-links">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <a href={href} className="footer-link">
                    <span className="footer-link-arrow">›</span>
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="footer-col">
            <h4 className="footer-col-title">Contact Us</h4>
            <div className="footer-contact-list">
              {CONTACT_ITEMS.map(({ icon, label, value }) => (
                <div key={label} className="contact-item">
                  <span className="contact-icon">{icon}</span>
                  <div>
                    <span className="contact-label">{label}</span>
                    <span className="contact-value">{value}</span>
                  </div>
                </div>
              ))}

              {/* Locate Us */}
              <a
                className="footer-locate-btn"
                href={`https://maps.google.com/?q=${encodeURIComponent(VENUE + ", " + VENUE_ADDRESS)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                Locate Us on Google Maps
              </a>
            </div>
          </div>
        </div>

        {/* ── Divider ── */}
        <div className="footer-divider" />

        {/* ── Bottom ── */}
        <div className="footer-bottom">
          <p className="footer-copy">
            © {year} Utopia Durgotsav Committee. All rights reserved.
          </p>
          <p className="footer-reg">
            Reg. No. 232/24-25 &nbsp;·&nbsp; File No. 1478/2025-26
          </p>
        </div>
      </div>
    </footer>
  );
}
