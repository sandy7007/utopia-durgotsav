/* ─── Forms API ───────────────────────────────────────────────── */
export const FORM_API_ENDPOINT =
  "https://yrnuwylgwj.execute-api.eu-north-1.amazonaws.com/prod/submit";

/* ─── Tabs ────────────────────────────────────────────────────── */
// change the disabled to false or remove the disabled property to enable a form tab
export const TABS = [
  { key: "registration", label: "Member Registration", disabled: false },
  { key: "cultural", label: "Cultural" },
  { key: "pujaRituals", label: "Puja Rituals", disabled: false },
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
  { label: "Saree", price: 1500 },
  { label: "Ashtami Sondhi Puja", price: 2100 },
  { label: "Sindoor Khela", price: 501 },
  { label: "Dhunuchi Naach", price: 501 },
  { label: "Pushpanjali", price: 251 },
  { label: "Bhog Sponsorship", price: 5100 },
  { label: "Pandal Decoration", price: 2100 },
  { label: "Cultural Programme Sponsor", price: 3100 },
  { label: "General Donation", price: null },
];

/* ─── Validation regexes ──────────────────────────────────────── */
export const NAME_RE = /^[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
export const MOBILE_RE = /^[6-9]\d{9}$/;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const APT_RE = /^\d{1,4}$/;
