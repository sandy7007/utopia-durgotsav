import React from "react";
import "./Footer.css";
import { QUICK_LINKS } from "../constants/navigation";
import { CONTACT_ITEMS } from "../constants/festival";

const SOCIALS = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/uma_at_utopiayou",
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
    <footer className="footer">
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
        </div>
      </div>
    </footer>
  );
}
