/* ─────────────────────────────────────────────────────────────
   FESTIVAL CONFIG
   Shared date, venue, and display strings used across
   TopBar, CountdownTimer, Footer, etc.
   ───────────────────────────────────────────────────────────── */

/** JS Date object for the countdown target (Durga Puja 2026 Saptami) */
export const FESTIVAL_TARGET_DATE = new Date("2026-10-16T00:00:00");

/** Human-readable display strings */
export const FESTIVAL_YEAR = "2026";
export const FESTIVAL_DATE_DISPLAY = "Oct 16, 2026";
export const FESTIVAL_NAME = "Durga Puja";

/** Venue */
export const VENUE = "Brigade Cornerstone Utopia";
export const VENUE_ADDRESS = "Varthur, Bengaluru-560087, Karnataka";

/** Contact */
export const CONTACT_PHONE = "+91 9980331148 / +91 9028027755";
export const CONTACT_EMAIL = "bcu.durgapuja.volunteers@gmail.com";

/** Contact items for Footer */
export const CONTACT_ITEMS = [
  { icon: "📍", label: "Venue", value: VENUE },
  { icon: "📍", label: "Address", value: VENUE_ADDRESS },
  { icon: "📞", label: "Phone", value: CONTACT_PHONE },
  { icon: "✉️", label: "Email", value: CONTACT_EMAIL },
];
