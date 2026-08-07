import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./Gallery.css";

/* Gradient categories to colour placeholder tiles */
const TILE_GRADIENTS = [
  "linear-gradient(135deg,#3D0808,#8B0000)",
  "linear-gradient(135deg,#0A001A,#4B0082)",
  "linear-gradient(135deg,#1A0A00,#8B4513)",
  "linear-gradient(135deg,#000A1A,#003366)",
  "linear-gradient(135deg,#0A1A00,#2E7D32)",
  "linear-gradient(135deg,#1A000D,#880E4F)",
  "linear-gradient(135deg,#1A1400,#827717)",
  "linear-gradient(135deg,#100A1A,#6A1B9A)",
];

function GalleryTile({ src, index, onClick }) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [tileRef, inView] = useInView({ triggerOnce: true, threshold: 0.05 });

  const gradient = TILE_GRADIENTS[index % TILE_GRADIENTS.length];
  const label = `Photo ${index + 1}`;

  return (
    <motion.div
      ref={tileRef}
      className="gallery-tile"
      initial={{ opacity: 0, scale: 0.88 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: (index % 6) * 0.06 }}
      onClick={() => onClick(index)}
      role="button"
      tabIndex={0}
      aria-label={`View ${label}`}
      onKeyDown={(e) => e.key === "Enter" && onClick(index)}
    >
      {/* Always render the placeholder, overlay with img once loaded */}
      <div className="gallery-placeholder" style={{ background: gradient }}>
        <span className="gallery-placeholder-icon">🪷</span>
        <span className="gallery-placeholder-text">{label}</span>
      </div>

      {!failed && src && (
        <img
          src={src}
          alt={label}
          className={`gallery-img${loaded ? " loaded" : ""}`}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
          loading="lazy"
        />
      )}

      <div className="gallery-tile-overlay">
        <svg
          className="gallery-zoom-icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35M11 8v6M8 11h6" />
        </svg>
      </div>
    </motion.div>
  );
}

/* ── Lightbox ── */
function Lightbox({ images, currentIndex, onClose, onPrev, onNext }) {
  /* keyboard navigation */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  /* lock scroll */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const [imgFailed, setImgFailed] = useState(false);
  const src = images[currentIndex];
  const gradient = TILE_GRADIENTS[currentIndex % TILE_GRADIENTS.length];

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="lightbox-frame"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Image / placeholder */}
          {!imgFailed && src ? (
            <img
              key={currentIndex}
              src={src}
              alt={`Photo ${currentIndex + 1}`}
              className="lightbox-img"
              onError={() => setImgFailed(true)}
            />
          ) : (
            <div
              className="lightbox-placeholder"
              style={{ background: gradient }}
            >
              <span>🪷</span>
              <span>Photo {currentIndex + 1}</span>
            </div>
          )}

          {/* Close */}
          <button
            className="lightbox-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Prev / Next */}
          <button
            className="lightbox-nav lightbox-nav--prev"
            onClick={onPrev}
            aria-label="Previous"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            className="lightbox-nav lightbox-nav--next"
            onClick={onNext}
            aria-label="Next"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>

          {/* Counter */}
          <div className="lightbox-counter">
            {currentIndex + 1} / {images.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ── Category derived from the image's folder path ── */
function getCategory(src) {
  if (!src) return "Celebrations";
  if (src.includes("/Durga_puja/")) return "Durga Puja";
  if (src.includes("/Kali_puja/")) return "Kali Puja";
  if (src.includes("/Saraswati_puja/")) return "Saraswati Puja";
  return "Celebrations";
}

/* ── Main Gallery ── */
const CATEGORIES = ["All", "Durga Puja", "Kali Puja", "Saraswati Puja"];

export default function Gallery({ images = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxIdx, setLightboxIdx] = useState(null);
  const [headRef, headInView] = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const allImages = images.length ? images : Array(18).fill(null);

  /* Filter by active category; lightbox always operates on the filtered set */
  const displayImages =
    activeCategory === "All"
      ? allImages
      : allImages.filter((src) => getCategory(src) === activeCategory);

  const openLightbox = (i) => setLightboxIdx(i);
  const closeLightbox = () => setLightboxIdx(null);
  const prevImg = useCallback(
    () =>
      setLightboxIdx(
        (i) => (i - 1 + displayImages.length) % displayImages.length,
      ),
    [displayImages.length],
  );
  const nextImg = useCallback(
    () => setLightboxIdx((i) => (i + 1) % displayImages.length),
    [displayImages.length],
  );

  return (
    <section id="gallery" className="gallery-section">
      <div className="gallery-bg-glow" />

      <div className="container">
        {/* Heading */}
        <motion.div
          ref={headRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="gallery-heading"
        >
          <p className="gallery-eyebrow">✦ Memories ✦</p>
          <h2 className="section-title">Photo Gallery</h2>
          <div className="ornament">
            <span className="ornament-symbol">🪷</span>
          </div>
          <p className="section-subtitle">
            Glimpses of divine celebrations, heartfelt devotion, and joyous
            community moments captured through the years.
          </p>
        </motion.div>

        {/* Category filter */}
        <div className="gallery-filter">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`filter-btn${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="gallery-scroll-wrap">
          <div className="gallery-grid">
            {displayImages.map((src, i) => (
              <GalleryTile key={i} src={src} index={i} onClick={openLightbox} />
            ))}
          </div>
          <div className="gallery-scroll-fade" aria-hidden="true" />
        </div>
        <p className="gallery-count">
          {displayImages.length} photo{displayImages.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Lightbox */}
      {lightboxIdx !== null && (
        <Lightbox
          images={displayImages}
          currentIndex={lightboxIdx}
          onClose={closeLightbox}
          onPrev={prevImg}
          onNext={nextImg}
        />
      )}
    </section>
  );
}
