import React, { useState, useEffect, useCallback, useRef } from 'react';
import './Carousel.css';

/* Gradient patterns shown when images haven't loaded yet */
const FALLBACK_GRADIENTS = [
  'linear-gradient(135deg,#3D0808,#8B0000,#C0392B)',
  'linear-gradient(135deg,#1A0020,#4B0082,#8B008B)',
  'linear-gradient(135deg,#0A1A0A,#1B5E20,#2E7D32)',
  'linear-gradient(135deg,#1A1A00,#827717,#F57F17)',
  'linear-gradient(135deg,#0A0A2A,#1A237E,#283593)',
  'linear-gradient(135deg,#1A000D,#880E4F,#C2185B)',
];

function SlideImage({ src, index, accentColor }) {
  const [failed, setFailed] = useState(false);
  const fallback = FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length];

  if (failed || !src) {
    return (
      <div
        className="carousel-placeholder"
        style={{ background: fallback }}
      >
        <span className="placeholder-om">🪷</span>
        <span className="placeholder-label">Photo {index + 1}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`Slide ${index + 1}`}
      className="carousel-img"
      onError={() => setFailed(true)}
      loading="lazy"
    />
  );
}

export default function Carousel({ images = [], accentColor = '#FF6B35', autoplayMs = 4000 }) {
  const [current,   setCurrent]   = useState(0);
  const [paused,    setPaused]    = useState(false);
  const [direction, setDirection] = useState(1);   // 1 = forward, -1 = backward
  const timerRef = useRef(null);
  const trackRef = useRef(null);

  const total = images.length || 6;  // show 6 placeholders if no images

  const goTo = useCallback((idx, dir = 1) => {
    setDirection(dir);
    setCurrent((idx + total) % total);
  }, [total]);

  const next = useCallback(() => goTo(current + 1,  1),  [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  /* Autoplay */
  useEffect(() => {
    if (paused) return;
    timerRef.current = setInterval(next, autoplayMs);
    return () => clearInterval(timerRef.current);
  }, [paused, next, autoplayMs]);

  /* Touch / drag support */
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const delta = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(delta) > 40) delta > 0 ? next() : prev();
    touchStartX.current = null;
  };

  const displayImages = images.length ? images : Array(6).fill(null);

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      style={{ '--accent': accentColor }}
    >
      {/* ── Slides ── */}
      <div className="carousel-track" ref={trackRef}>
        {displayImages.map((src, i) => (
          <div
            key={i}
            className={`carousel-slide ${i === current ? 'active' : ''}`}
          >
            <SlideImage src={src} index={i} accentColor={accentColor} />
          </div>
        ))}
      </div>

      {/* ── Gradient overlays ── */}
      <div className="carousel-overlay-bottom" />
      <div className="carousel-overlay-left"   />
      <div className="carousel-overlay-right"  />

      {/* ── Nav arrows ── */}
      <button
        className="carousel-btn carousel-btn--prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M15 18l-6-6 6-6"/>
        </svg>
      </button>
      <button
        className="carousel-btn carousel-btn--next"
        onClick={next}
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path d="M9 18l6-6-6-6"/>
        </svg>
      </button>

      {/* ── Dots ── */}
      <div className="carousel-dots" role="tablist">
        {displayImages.map((_, i) => (
          <button
            key={i}
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            className={`carousel-dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i, i > current ? 1 : -1)}
          />
        ))}
      </div>

      {/* ── Progress bar ── */}
      <div className="carousel-progress">
        <div
          className="carousel-progress-fill"
          key={`${current}-${paused}`}
          style={{
            animationDuration: `${autoplayMs}ms`,
            animationPlayState: paused ? 'paused' : 'running',
          }}
        />
      </div>

      {/* ── Slide counter ── */}
      <div className="carousel-counter">
        {String(current + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </div>
  );
}
