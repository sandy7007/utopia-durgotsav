import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";
import "./Forms.css";
import {
  FORM_API_ENDPOINT,
  TABS,
  BLOCKS,
  getTowersForBlock,
  NAME_RE,
  MOBILE_RE,
  EMAIL_RE,
  APT_RE,
} from "../constants/forms";

function validateImageFile(file) {
  if (!file) return null;
  const okType = ["image/png", "image/jpeg"].includes(file.type);
  const okExt = /\.(png|jpe?g)$/i.test(file.name);
  if (!okType && !okExt) return "Only PNG or JPG/JPEG files allowed";
  if (file.size > 5 * 1024 * 1024) return "File must be 5 MB or smaller";
  return null;
}

async function buildAttachment(file, formType) {
  if (!file) return null;
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || "");
      const base64Data = dataUrl.includes(",") ? dataUrl.split(",")[1] : "";
      const safeFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      resolve({
        fileName: safeFileName,
        contentType: file.type || "application/octet-stream",
        base64Data,
        sizeBytes: file.size,
        s3Key: `Form submission/Attachments/${formType}/${Date.now()}_${safeFileName}`,
        s3Bucket: "utopia-durgotsav-website",
      });
    };
    reader.onerror = () => reject(new Error("Could not read file"));
    reader.readAsDataURL(file);
  });
}

/* ─── Success Modal ──────────────────────────────────────────── */
function SuccessModal({ onClose }) {
  /* Close on Escape */
  useEffect(() => {
    const h = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [onClose]);

  return (
    <div
      className="forms-success-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Submission successful"
    >
      <motion.div
        className="forms-success-card"
        initial={{ scale: 0.82, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.82, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <div className="forms-success-icon" aria-hidden="true">
          <svg viewBox="0 0 52 52">
            <circle className="fsi-circle" cx="26" cy="26" r="24" fill="none" />
            <path className="fsi-check" fill="none" d="M14 27l8 8 16-16" />
          </svg>
        </div>
        <h3>Submitted Successfully!</h3>
        <p>Your form has been received. Thank you for participating!</p>
        <button className="forms-success-btn" onClick={onClose} autoFocus>
          OK
        </button>
      </motion.div>
    </div>
  );
}

/* ─── Inline field error ─────────────────────────────────────── */
function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <span className="form-field-error" role="alert">
      {msg}
    </span>
  );
}

/* ─── Main component ─────────────────────────────────────────── */
export default function Forms() {
  const [activeTab, setActiveTab] = useState("cultural");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  /* dynamic-field state */
  const [block, setBlock] = useState("");
  const [towers, setTowers] = useState([]);
  const [selectedPuja, setSelectedPuja] = useState("");

  const formRef = useRef(null);
  const [headRef, headInView] = useInView({
    triggerOnce: true,
    threshold: 0.15,
  });

  /* Update tower list whenever block changes */
  useEffect(() => {
    setTowers(getTowersForBlock(block));
  }, [block]);

  /* Reset form state on tab switch */
  useEffect(() => {
    setErrors({});
    setBlock("");
    setSelectedPuja("");
    formRef.current?.reset();
  }, [activeTab]);

  /* Clear one field's error on change */
  const clearErr = (...keys) =>
    setErrors((prev) => {
      const next = { ...prev };
      keys.forEach((k) => delete next[k]);
      return next;
    });

  /* ── Submit ────────────────────────────────────────────────── */
  async function handleSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;

    const fd = new FormData(form);
    const get = (k) => String(fd.get(k) || "").trim();
    const errs = {};

    /* Common validation */
    if (!get("salutation")) errs.salutation = "Please select";
    const fullName = get("fullName");
    if (!fullName) errs.fullName = "Required";
    else if (!NAME_RE.test(fullName))
      errs.fullName = "Letters, spaces, hyphens or apostrophes only";
    const mobile = get("mobile");
    if (!mobile) errs.mobile = "Required";
    else if (!MOBILE_RE.test(mobile))
      errs.mobile = "10 digits starting with 6–9";
    const email = get("email");
    if (!email) errs.email = "Required";
    else if (!EMAIL_RE.test(email)) errs.email = "Invalid email address";

    /* Tab-specific validation */
    if (activeTab === "registration") {
      if (!get("block")) errs.block = "Required";
      if (!get("tower")) errs.tower = "Required";
      const apt = get("apartment");
      const first2 = Number(apt.length >= 2 ? apt.slice(0, 2) : apt);
      if (!apt) errs.apartment = "Required";
      else if (!APT_RE.test(apt) || Number(apt) < 1 || first2 > 26)
        errs.apartment = "Invalid (4 digits, first 2 ≤ 26)";
      const imgFile = form.elements.imageProof?.files?.[0];
      if (!imgFile) errs.imageProof = "Please upload a proof image";
      else {
        const e = validateImageFile(imgFile);
        if (e) errs.imageProof = e;
      }
    }

    if (activeTab === "cultural") {
      if (!get("block")) errs.block = "Required";
      if (!get("tower")) errs.tower = "Required";
      const aptC = get("apartment");
      const first2C = Number(aptC.length >= 2 ? aptC.slice(0, 2) : aptC);
      if (!aptC) errs.apartment = "Required";
      else if (!APT_RE.test(aptC) || Number(aptC) < 1 || first2C > 26)
        errs.apartment = "Invalid (4 digits, first 2 ≤ 26)";
      if (!get("performanceCategory")) errs.performanceCategory = "Required";
      if (!get("participantCount") || Number(get("participantCount")) < 1)
        errs.participantCount = "Must be at least 1";
    }

    if (activeTab === "pujaRituals") {
      if (!get("block")) errs.block = "Required";
      if (!get("tower")) errs.tower = "Required";
      const aptP = get("apartment");
      const first2P = Number(aptP.length >= 2 ? aptP.slice(0, 2) : aptP);
      if (!aptP) errs.apartment = "Required";
      else if (!APT_RE.test(aptP) || Number(aptP) < 1 || first2P > 26)
        errs.apartment = "Invalid (4 digits, first 2 ≤ 26)";
      if (!get("ritualType")) errs.ritualType = "Required";
      if (!get("preferredDay")) errs.preferredDay = "Required";
      if (!get("timeOfDay")) errs.timeOfDay = "Required";
    }

    if (activeTab === "bhogCoupons") {
      if (!get("block")) errs.block = "Required";
      if (!get("tower")) errs.tower = "Required";
      const aptB = get("apartment");
      const first2B = Number(aptB.length >= 2 ? aptB.slice(0, 2) : aptB);
      if (!aptB) errs.apartment = "Required";
      else if (!APT_RE.test(aptB) || Number(aptB) < 1 || first2B > 26)
        errs.apartment = "Invalid (4 digits, first 2 ≤ 26)";
      if (!get("couponCount") || Number(get("couponCount")) < 1)
        errs.couponCount = "Must be at least 1";
      if (!get("puja")) errs.puja = "Required";
      if (get("puja") === "Durga Puja" && !get("pickupDay"))
        errs.pickupDay = "Required";
    }

    if (activeTab === "events") {
      if (!get("block")) errs.block = "Required";
      if (!get("tower")) errs.tower = "Required";
      const aptE = get("apartment");
      const first2E = Number(aptE.length >= 2 ? aptE.slice(0, 2) : aptE);
      if (!aptE) errs.apartment = "Required";
      else if (!APT_RE.test(aptE) || Number(aptE) < 1 || first2E > 26)
        errs.apartment = "Invalid (4 digits, first 2 ≤ 26)";
      if (!get("eventType")) errs.eventType = "Required";
      if (!get("seatCount") || Number(get("seatCount")) < 1)
        errs.seatCount = "Must be at least 1";
    }

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setLoading(true);
    try {
      const imgFile =
        activeTab === "registration"
          ? form.elements.imageProof?.files?.[0]
          : null;
      const attachment = await buildAttachment(imgFile, activeTab);

      const payload = {
        formType: activeTab,
        salutation: get("salutation"),
        fullName,
        mobile: `+91${mobile}`,
        email,
        ...getTabPayload(fd),
        ...(attachment ? { attachment } : {}),
        createdAt: new Date().toISOString(),
      };

      const res = await fetch(FORM_API_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Server responded ${res.status}`);

      setSuccess(true);
      form.reset();
      setBlock("");
      setSelectedPuja("");
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  function getTabPayload(fd) {
    const get = (k) => String(fd.get(k) || "").trim();
    switch (activeTab) {
      case "registration":
        return {
          block: get("block"),
          tower: get("tower"),
          apartment: get("apartment"),
        };
      case "cultural":
        return {
          block: get("block"),
          tower: get("tower"),
          apartment: get("apartment"),
          performanceCategory: get("performanceCategory"),
          participantCount: get("participantCount"),
        };
      case "pujaRituals":
        return {
          block: get("block"),
          tower: get("tower"),
          apartment: get("apartment"),
          ritualType: get("ritualType"),
          preferredDay: get("preferredDay"),
          timeOfDay: get("timeOfDay"),
        };
      case "bhogCoupons":
        return {
          block: get("block"),
          tower: get("tower"),
          apartment: get("apartment"),
          couponCount: get("couponCount"),
          puja: get("puja"),
          pickupDay: get("pickupDay"),
        };
      case "events":
        return {
          block: get("block"),
          tower: get("tower"),
          apartment: get("apartment"),
          eventType: get("eventType"),
          seatCount: get("seatCount"),
        };
      default:
        return {};
    }
  }

  /* ── Render ────────────────────────────────────────────────── */
  const tabLabel = TABS.find((t) => t.key === activeTab)?.label ?? "";

  return (
    <section id="forms" className="forms-section">
      <div className="forms-bg" />
      <div className="container">
        {/* Heading */}
        <motion.div
          ref={headRef}
          className="forms-heading"
          initial={{ opacity: 0, y: 30 }}
          animate={headInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <p className="forms-eyebrow">✦ Participate ✦</p>
          <h2 className="section-title">Registration &amp; Forms</h2>
          <div className="ornament">
            <span className="ornament-symbol">📋</span>
          </div>
        </motion.div>

        {/* Tab switcher */}
        <div className="forms-tabs" role="tablist" aria-label="Form types">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              role="tab"
              aria-selected={activeTab === tab.key}
              aria-disabled={tab.disabled}
              disabled={tab.disabled}
              className={`forms-tab-btn${activeTab === tab.key ? " active" : ""}${tab.disabled ? " disabled" : ""}`}
              onClick={() => !tab.disabled && setActiveTab(tab.key)}
            >
              {tab.label}
              {tab.disabled && (
                <span className="tab-coming-soon">Coming Soon</span>
              )}
            </button>
          ))}
        </div>

        {/* Form card */}
        <AnimatePresence mode="wait">
          {!activeTab ? (
            <motion.p
              key="hint"
              className="forms-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              Select a form type above to get started.
            </motion.p>
          ) : (
            <motion.div
              key={activeTab}
              className={`forms-card${activeTab === "cultural" ? " forms-card--wide" : ""}`}
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              {activeTab === "cultural" && (
                <div className="cultural-embed">
                  <div className="cultural-open-card">
                    <div className="cultural-open-icon" aria-hidden="true">
                      🎭
                    </div>
                    <h4>Cultural Event Registration</h4>
                    <p>
                      Sign up for Solo Dance, Group Dance, Song, Recitation,
                      Instrumental, or Group Skit performances.
                    </p>
                    <a
                      href="https://forms.gle/11ac1yAJiybid5UU8"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="cultural-open-btn"
                    >
                      Open Registration Form ↗
                    </a>
                  </div>
                </div>
              )}

              {activeTab !== "cultural" && (
                <form ref={formRef} onSubmit={handleSubmit} noValidate>
                  {/* ── Common fields ── */}
                  <div className="form-row">
                    <label>
                      Name <span className="req">*</span>
                    </label>
                    <div className="name-group">
                      <select
                        name="salutation"
                        onChange={() => clearErr("salutation")}
                        defaultValue=""
                      >
                        <option value="" disabled>
                          Salutation
                        </option>
                        <option>Mr.</option>
                        <option>Mrs.</option>
                        <option>Ms.</option>
                        <option>Dr.</option>
                      </select>
                      <input
                        type="text"
                        name="fullName"
                        placeholder="Full name"
                        autoComplete="name"
                        onChange={() => clearErr("fullName")}
                      />
                    </div>
                    <FieldError msg={errors.salutation || errors.fullName} />
                  </div>

                  <div className="form-row">
                    <label>
                      Mobile <span className="req">*</span>
                    </label>
                    <div className="mobile-group">
                      <span className="isd">+91</span>
                      <input
                        type="tel"
                        name="mobile"
                        placeholder="9876543210"
                        maxLength={10}
                        inputMode="numeric"
                        autoComplete="tel-national"
                        onChange={() => clearErr("mobile")}
                      />
                    </div>
                    <FieldError msg={errors.mobile} />
                  </div>

                  <div className="form-row">
                    <label>
                      Email <span className="req">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      autoComplete="email"
                      onChange={() => clearErr("email")}
                    />
                    <FieldError msg={errors.email} />
                  </div>

                  {/* ── Registration ── */}
                  {activeTab === "registration" && (
                    <>
                      <div className="form-row">
                        <label>
                          Block <span className="req">*</span>
                        </label>
                        <select
                          name="block"
                          value={block}
                          onChange={(e) => {
                            setBlock(e.target.value);
                            clearErr("block");
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Please select
                          </option>
                          {BLOCKS.map((b) => (
                            <option key={b}>{b}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.block} />
                      </div>

                      <div className="form-row">
                        <label>
                          Tower <span className="req">*</span>
                        </label>
                        <select
                          name="tower"
                          disabled={!towers.length}
                          onChange={() => clearErr("tower")}
                          defaultValue=""
                        >
                          <option value="">
                            {towers.length
                              ? "Please select"
                              : "Select block first"}
                          </option>
                          {towers.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.tower} />
                      </div>

                      <div className="form-row">
                        <label>
                          Apartment Number <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          placeholder="e.g. 1204"
                          maxLength={4}
                          inputMode="numeric"
                          onChange={() => clearErr("apartment")}
                        />
                        <FieldError msg={errors.apartment} />
                      </div>

                      <div className="form-row">
                        <label>
                          Resident Proof Image <span className="req">*</span>
                        </label>
                        <input
                          type="file"
                          name="imageProof"
                          accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                          onChange={() => clearErr("imageProof")}
                          className="file-input"
                        />
                        <span className="form-help">
                          PNG or JPG/JPEG · max 5 MB
                        </span>
                        <FieldError msg={errors.imageProof} />
                      </div>
                    </>
                  )}

                  {/* ── Puja Rituals ── */}
                  {activeTab === "pujaRituals" && (
                    <>
                      <div className="form-row">
                        <label>
                          Block <span className="req">*</span>
                        </label>
                        <select
                          name="block"
                          value={block}
                          onChange={(e) => {
                            setBlock(e.target.value);
                            clearErr("block");
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Please select
                          </option>
                          {BLOCKS.map((b) => (
                            <option key={b}>{b}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.block} />
                      </div>

                      <div className="form-row">
                        <label>
                          Tower <span className="req">*</span>
                        </label>
                        <select
                          name="tower"
                          disabled={!towers.length}
                          onChange={() => clearErr("tower")}
                          defaultValue=""
                        >
                          <option value="">
                            {towers.length
                              ? "Please select"
                              : "Select block first"}
                          </option>
                          {towers.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.tower} />
                      </div>

                      <div className="form-row">
                        <label>
                          Apartment Number <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          placeholder="e.g. 1204"
                          maxLength={4}
                          inputMode="numeric"
                          onChange={() => clearErr("apartment")}
                        />
                        <FieldError msg={errors.apartment} />
                      </div>

                      <div className="form-row">
                        <label>
                          Ritual Type <span className="req">*</span>
                        </label>
                        <select
                          name="ritualType"
                          onChange={() => clearErr("ritualType")}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Please select
                          </option>
                          {[
                            "Pushpanjali",
                            "Arati",
                            "Sindoor Khela",
                            "Dhunuchi Naach",
                          ].map((r) => (
                            <option key={r}>{r}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.ritualType} />
                      </div>

                      <div className="form-row">
                        <label>
                          Preferred Day <span className="req">*</span>
                        </label>
                        <select
                          name="preferredDay"
                          onChange={() => clearErr("preferredDay")}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Please select
                          </option>
                          {["Saptami", "Ashtami", "Navami", "Dashami"].map(
                            (d) => (
                              <option key={d}>{d}</option>
                            ),
                          )}
                        </select>
                        <FieldError msg={errors.preferredDay} />
                      </div>

                      <div className="form-row">
                        <label>
                          Time of Day <span className="req">*</span>
                        </label>
                        <select
                          name="timeOfDay"
                          onChange={() => clearErr("timeOfDay")}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Please select
                          </option>
                          {["Morning", "Afternoon", "Evening"].map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.timeOfDay} />
                      </div>
                    </>
                  )}

                  {/* ── Bhog Coupons ── */}
                  {activeTab === "bhogCoupons" && (
                    <>
                      <div className="form-row">
                        <label>
                          Block <span className="req">*</span>
                        </label>
                        <select
                          name="block"
                          value={block}
                          onChange={(e) => {
                            setBlock(e.target.value);
                            clearErr("block");
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Please select
                          </option>
                          {BLOCKS.map((b) => (
                            <option key={b}>{b}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.block} />
                      </div>

                      <div className="form-row">
                        <label>
                          Tower <span className="req">*</span>
                        </label>
                        <select
                          name="tower"
                          disabled={!towers.length}
                          onChange={() => clearErr("tower")}
                          defaultValue=""
                        >
                          <option value="">
                            {towers.length
                              ? "Please select"
                              : "Select block first"}
                          </option>
                          {towers.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.tower} />
                      </div>

                      <div className="form-row">
                        <label>
                          Apartment Number <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          placeholder="e.g. 1204"
                          maxLength={4}
                          inputMode="numeric"
                          onChange={() => clearErr("apartment")}
                        />
                        <FieldError msg={errors.apartment} />
                      </div>

                      <div className="form-row">
                        <label>
                          Coupon Quantity <span className="req">*</span>
                        </label>
                        <input
                          type="number"
                          name="couponCount"
                          min={1}
                          placeholder="Number of coupons"
                          onChange={() => clearErr("couponCount")}
                        />
                        <FieldError msg={errors.couponCount} />
                      </div>

                      <div className="form-row">
                        <label>
                          Puja <span className="req">*</span>
                        </label>
                        <select
                          name="puja"
                          value={selectedPuja}
                          onChange={(e) => {
                            setSelectedPuja(e.target.value);
                            clearErr("puja");
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Please select
                          </option>
                          {["Durga Puja", "Kali Puja", "Saraswati Puja"].map(
                            (p) => (
                              <option key={p}>{p}</option>
                            ),
                          )}
                        </select>
                        <FieldError msg={errors.puja} />
                      </div>

                      {selectedPuja === "Durga Puja" && (
                        <div className="form-row">
                          <label>
                            Pickup Day <span className="req">*</span>
                          </label>
                          <select
                            name="pickupDay"
                            onChange={() => clearErr("pickupDay")}
                            defaultValue=""
                          >
                            <option value="" disabled>
                              Please select
                            </option>
                            {["Ashtami", "Navami"].map((d) => (
                              <option key={d}>{d}</option>
                            ))}
                          </select>
                          <FieldError msg={errors.pickupDay} />
                        </div>
                      )}
                    </>
                  )}

                  {/* ── Events ── */}
                  {activeTab === "events" && (
                    <>
                      <div className="form-row">
                        <label>
                          Block <span className="req">*</span>
                        </label>
                        <select
                          name="block"
                          value={block}
                          onChange={(e) => {
                            setBlock(e.target.value);
                            clearErr("block");
                          }}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Please select
                          </option>
                          {BLOCKS.map((b) => (
                            <option key={b}>{b}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.block} />
                      </div>

                      <div className="form-row">
                        <label>
                          Tower <span className="req">*</span>
                        </label>
                        <select
                          name="tower"
                          disabled={!towers.length}
                          onChange={() => clearErr("tower")}
                          defaultValue=""
                        >
                          <option value="">
                            {towers.length
                              ? "Please select"
                              : "Select block first"}
                          </option>
                          {towers.map((t) => (
                            <option key={t}>{t}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.tower} />
                      </div>

                      <div className="form-row">
                        <label>
                          Apartment Number <span className="req">*</span>
                        </label>
                        <input
                          type="text"
                          name="apartment"
                          placeholder="e.g. 1204"
                          maxLength={4}
                          inputMode="numeric"
                          onChange={() => clearErr("apartment")}
                        />
                        <FieldError msg={errors.apartment} />
                      </div>

                      <div className="form-row">
                        <label>
                          Event Type <span className="req">*</span>
                        </label>
                        <select
                          name="eventType"
                          onChange={() => clearErr("eventType")}
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Please select
                          </option>
                          {[
                            "Dandiya Night",
                            "Quiz",
                            "Children Activities",
                            "Food Fest",
                          ].map((ev) => (
                            <option key={ev}>{ev}</option>
                          ))}
                        </select>
                        <FieldError msg={errors.eventType} />
                      </div>

                      <div className="form-row">
                        <label>
                          Seat Count <span className="req">*</span>
                        </label>
                        <input
                          type="number"
                          name="seatCount"
                          min={1}
                          placeholder="Number of seats"
                          onChange={() => clearErr("seatCount")}
                        />
                        <FieldError msg={errors.seatCount} />
                      </div>
                    </>
                  )}

                  <button
                    type="submit"
                    className="forms-submit-btn"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="forms-spinner" aria-hidden="true" />
                    ) : null}
                    {loading ? "Submitting…" : "Submit Form"}
                  </button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Success modal */}
      <AnimatePresence>
        {success && <SuccessModal onClose={() => setSuccess(false)} />}
      </AnimatePresence>
    </section>
  );
}
