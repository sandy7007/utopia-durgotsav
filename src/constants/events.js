/* ─────────────────────────────────────────────────────────────
   EVENTS
   Configuration for EventSection components and the full
   Schedule timeline.  Image arrays come from images.js so
   there is a single source of truth for all paths.
   ───────────────────────────────────────────────────────────── */
import {
  DURGA_PUJA_IMAGES,
  KALI_PUJA_IMAGES,
  SARASWATI_PUJA_IMAGES,
} from "./images";

/* ── Event sections (rendered by <EventSection> in App.js) ── */
export const EVENT_SECTIONS = [
  {
    id: "durga-puja",
    title: "Durga Puja",
    bengaliTitle: "দুর্গাপূজা",
    description:
      "The grandest festival of Bengal now in Bengaluru — a five-day celebration of Goddess Durga\u2019s victory over Mahishasura. Our committee brings the community together with elaborate pandal decorations, cultural programmes, and heartfelt devotion each year.",
    images: DURGA_PUJA_IMAGES,
    accentColor: "#FF6B35",
    bgGradient:
      "linear-gradient(160deg, #0A0100 0%, #2A0A00 50%, #0A0100 100%)",
    svgDecoration: "/images/linearGradient/durgapuja.svg",
    reverse: false,
  },
  {
    id: "kali-puja",
    title: "Kali Puja",
    bengaliTitle: "কালীপূজা",
    description:
      "On the moonless night of Amavasya, the fierce Mother Kali is worshipped with earthen lamps, incense, and intense devotion. The committee creates an awe-inspiring atmosphere that honours the power and grace of the Dark Mother.",
    images: KALI_PUJA_IMAGES,
    accentColor: "#9B59B6",
    bgGradient:
      "linear-gradient(160deg, #080012 0%, #1A0030 50%, #080012 100%)",
    svgDecoration: "/images/linearGradient/kalipuja.svg",
    reverse: true,
  },
  {
    id: "saraswati-puja",
    title: "Saraswati Puja",
    bengaliTitle: "সরস্বতী পূজা",
    description:
      "Vasant Panchami heralds the arrival of spring and the worship of Goddess Saraswati \u2014 the divine patron of knowledge, music, and arts. Students, teachers, and artists gather to seek her blessings and celebrate learning.",
    images: SARASWATI_PUJA_IMAGES,
    accentColor: "#E91E8C",
    bgGradient:
      "linear-gradient(160deg, #0A000D 0%, #25002A 50%, #0A000D 100%)",
    svgDecoration: "/images/linearGradient/saraswati.svg",
    reverse: false,
  },
];

/* ── Schedule timeline (rendered by <Schedule>) ── */
export const SCHEDULE = [
  {
    puja: "Durga Puja",
    bengali: "দুর্গাপূজা",
    color: "#FF6B35",
    days: [
      {
        day: "Sashti",
        date: "Oct 16, 2026 (Friday)",
        events: [
          "Bodhon & inauguration of Cultural Programme (Tridhara)",
          "Morning aarti",
          "Cultural programme \u2013 classical inaugural evening - 6:30 PM to 9:30 PM",
        ],
      },
      {
        day: "Saptami - Day1",
        date: "Oct 17, 2026 (Saturday)",
        events: [
          "Morning Games & competitions for children/seniors",
          "Morning Puja",
          "Cultural programme \u2013 Celebrating Generations & Folk Traditions - 6:30 PM to 9:30 PM",
        ],
      },
      {
        day: "Saptami - Day2",
        date: "Oct 18, 2026 (Sunday)",
        events: [
          "Morning Games & competitions for children/seniors",
          "Morning Puja",
          "Cultural programme \u2013 A Celebration of Cinema - 6:30 PM to 9:30 PM",
        ],
      },
      {
        day: "Ashtami",
        date: "Oct 19, 2026 (Monday)",
        events: [
          "Grand pushpanjali (flower offering) in the morning",
          "Sandhi Puja at dusk (the most sacred hour)",
          "Dhunachi nritya (incense-pot dance)",
          "Community Lunch \u2013 12:30 PM to 3:30 PM",
          "Cultural programme \u2013 A Musical/ Dance/Recitation/Skit Evening - 6:30 PM to 9:30 PM",
        ],
      },
      {
        day: "Navami",
        date: "Oct 20, 2026 (Tuesday)",
        events: [
          "Special aarti and bhog offering",
          "Most awaited Dandiya Dance & Bollywood Night",
        ],
      },
      {
        day: "Dashami",
        date: "Oct 21, 2026 (Wednesday)",
        events: [
          "Sindoor Khela (vermilion ceremony)",
          "Bisarjan procession with dhak beats",
          "Community feast & farewell",
        ],
      },
    ],
  },
  {
    puja: "Kali Puja",
    bengali: "কালীপূজা",
    color: "#9B59B6",
    days: [
      {
        day: "Amavasya Eve",
        date: "Nov 19, 2026",
        events: [
          "Decoration & lamp-lighting of pandal",
          "Evening bhajan & kirtan",
        ],
      },
      {
        day: "Kali Puja Night",
        date: "Nov 20, 2026",
        events: [
          "Main puja begins at midnight",
          "Earthen lamp rows lit across the premises",
          "Devotional singing until dawn",
        ],
      },
    ],
  },
  {
    puja: "Saraswati Puja",
    bengali: "সরস্বতী পূজা",
    color: "#E91E8C",
    days: [
      {
        day: "Vasant Panchami",
        date: "Jan 22, 2027",
        events: [
          "Students offer books for blessing",
          "Pushpanjali in the morning",
          "Cultural programme \u2013 music & art showcase",
        ],
      },
    ],
  },
];
