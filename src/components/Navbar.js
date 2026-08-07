import React, { useState, useEffect, useCallback } from "react";
import "./Navbar.css";
import { NAV_LINKS } from "../constants/navigation";
import PayModal from "./PayModal";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [payOpen, setPayOpen] = useState(false);

  const openPay = () => {
    setMenuOpen(false);
    setPayOpen(true);
  };
  const closePay = useCallback(() => setPayOpen(false), []);

  /* scroll-shadow */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* scroll-spy — update active link as sections enter the viewport */
  useEffect(() => {
    const sectionIds = NAV_LINKS.map((l) => l.href.slice(1));

    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry with the largest intersection ratio that is currently intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      {
        // Fire when 20 % of the section is inside the viewport
        threshold: 0.2,
        // Shrink the top of the root by the combined topbar + navbar height
        rootMargin: "-90px 0px -30% 0px",
      },
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  /* lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleClick = (href) => {
    setMenuOpen(false);
    setActive(href.slice(1));
  };

  return (
    <>
      <nav
        className={`navbar${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}
      >
        <div className="nav-inner">
          {/* Logo */}
          <a
            className="nav-logo"
            href="#home"
            onClick={() => handleClick("#home")}
          >
            <span className="nav-logo-text">
              <span className="nav-logo-main">Utopia Durgotsav</span>
              <span className="nav-logo-sub">
                Presented by Utopia Durgotsav Committee
              </span>
            </span>
          </a>

          {/* Desktop links */}
          <ul
            className={`nav-links${menuOpen ? " open" : ""}`}
            role="navigation"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className={
                    active === href.slice(1) ? "nav-link active" : "nav-link"
                  }
                  onClick={() => handleClick(href)}
                >
                  {label}
                </a>
              </li>
            ))}
            <li>
              <button
                className="nav-pay-btn"
                onClick={openPay}
                aria-label="Open payment scanner"
              >
                <svg
                  className="nav-pay-icon"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  aria-hidden="true"
                >
                  <rect x="2" y="5" width="20" height="14" rx="2" />
                  <path d="M2 10h20" />
                </svg>
                Pay / Donate
              </button>
            </li>
          </ul>

          {/* Hamburger */}
          <button
            className={`hamburger${menuOpen ? " open" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>

      {/* ── Payment Scanner Modal ── */}
      <PayModal isOpen={payOpen} onClose={closePay} />
    </>
  );
}
