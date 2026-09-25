/* ─── Forms API ───────────────────────────────────────────────── */
export const FORM_API_ENDPOINT =
  "https://yrnuwylgwj.execute-api.eu-north-1.amazonaws.com/prod/submit";

/* ─── Tabs ────────────────────────────────────────────────────── */
// change the disabled to false or remove the disabled property to enable a form tab
export const TABS = [
  {
    key: "registration",
    label: "Committee Member Registration",
    disabled: false,
  },
  { key: "cultural", label: "Cultural event(2026)", disabled: true },
  //   { key: "bhogCoupons", label: "Bhog Coupons", disabled: false },
  //   { key: "events", label: "Events", disabled: true },
];

/* ─── Blocks & Towers ─────────────────────────────────────────── */
export const BLOCKS = ["Eden", "Serene", "Halcyon", "Paradise", "Tranquil"];

export function getTowersForBlock(block) {
  const T = Array.from({ length: 17 }, (_, i) => String.fromCharCode(65 + i));
  const map = {
    Eden: T.slice(0, 5),
    Serene: T.slice(0, 8),
    Halcyon: T.slice(8, 10),
    Tranquil: T.slice(10),
    Paradise: T.slice(5, 12),
  };
  return map[block] || [];
}

/* ─── Contribution types (Pay / Donate modal) ─────────────────── */
export const CONTRIBUTION_TYPES = [
  { label: "General Contribution" },
  { label: "Dasha Karma / Puja Samagri items (one day)", price: 3001 },
  { label: "Puja sweets (one day)", price: 5001 },
  { label: "Puja Flower (one day)", price: 4001 },
  { label: "Saree Nivedan", price: 5001 },
  { label: "Maa-er Puja Bhog", price: 5001 },
  { label: "Sandhi Puja", price: 10001 },
  { label: "Community Bhog Sponsorship", price: 10001 },
  { label: "Visarjan Sweets", price: 5001 },
];

/* ─── Validation regexes ──────────────────────────────────────── */
export const NAME_RE = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
export const MOBILE_RE = /^[6-9]\d{9}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const APT_RE = /^\d{1,4}$/;
