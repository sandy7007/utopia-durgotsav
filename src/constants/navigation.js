/* ─────────────────────────────────────────────────────────────
   NAVIGATION
   Shared link arrays used by Navbar and Footer.
   ───────────────────────────────────────────────────────────── */

/** Primary navigation links (Navbar) */
export const NAV_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#durga-puja", label: "Durga Puja" },
  { href: "#kali-puja", label: "Kali Puja" },
  { href: "#saraswati-puja", label: "Saraswati Puja" },
  { href: "#gallery", label: "Gallery" },
  { href: "#sponsors", label: "Sponsors" },
  { href: "#schedule", label: "Schedule" },
  { href: "#forms", label: "Forms" },
  { href: "#contact", label: "Contact" },
];

/** Quick links column in the Footer */
export const QUICK_LINKS = [
  { href: "#home", label: "Home" },
  { href: "#about", label: "About Us" },
  { href: "#durga-puja", label: "Durga Puja" },
  { href: "#kali-puja", label: "Kali Puja" },
  { href: "#saraswati-puja", label: "Saraswati Puja" },
  { href: "#gallery", label: "Gallery" },
  { href: "#schedule", label: "Schedule" },
  { href: "#forms", label: "Forms" },
  { href: "#contact", label: "Contact" },
];

/** Social media links (icons rendered by Footer) */
export const SOCIAL_LINKS = [
  { name: "Facebook", href: "#" },
  { name: "Instagram", href: "https://www.instagram.com/uma_at_utopia" },
  { name: "YouTube", href: "#" },
  { name: "WhatsApp", href: "#" },
];

/* ─────────────────────────────────────────────────────────────
   ANNOUNCEMENT BUTTON
   Set enabled: true to show a highlighted CTA button in the
   Hero section. Point href at any navigation anchor.
   ───────────────────────────────────────────────────────────── */
export const ANNOUNCEMENT_BUTTON = {
  enabled: false, // ← flip to true to show
  label: "Bhog coupon available",
  href: "#forms", // ← target section anchor
};
