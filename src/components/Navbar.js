import React, { useState, useEffect, useRef } from "react";
import "./Navbar.css";
import { NAV_LINKS } from "../constants/navigation";

export default function Navbar({ onPayClick }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("home");
  const navRef = useRef(null);

  const openPay = () => {
    setMenuOpen(false);
    onPayClick();
  };

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

  /* close menu on outside click/tap */
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    document.addEventListener("touchstart", handler, { passive: true });
    return () => {
      document.removeEventListener("mousedown", handler);
      document.removeEventListener("touchstart", handler);
    };
  }, [menuOpen]);

  /* lock body scroll when mobile menu is open (iOS-safe) */
  useEffect(() => {
    if (menuOpen) {
      const scrollY = window.scrollY;
      document.body.dataset.scrollY = scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = parseInt(document.body.dataset.scrollY || "0", 10);
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
    };
  }, [menuOpen]);

  const handleClick = (href) => {
    setMenuOpen(false);
    setActive(href.slice(1));
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`navbar${scrolled ? " scrolled" : ""}${menuOpen ? " menu-open" : ""}`}
      >
        <div className="nav-inner">
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
    </>
  );
}
