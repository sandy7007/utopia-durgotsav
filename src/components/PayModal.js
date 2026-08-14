import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  BLOCKS,
  getTowersForBlock,
  CONTRIBUTION_TYPES,
} from "../constants/forms";
import "./PayModal.css";

export default function PayModal({ isOpen, onClose }) {
  const [don, setDon] = useState({
    fullName: "",
    phone: "",
    email: "",
    transactionDate: "",
    amount: "",
    transactionId: "",
    block: "",
    tower: "",
    apartment: "",
    donationType: "",
  });
  const [donFile, setDonFile] = useState(null);
  const [donErrors, setDonErrors] = useState({});
  const [donLoading, setDonLoading] = useState(false);
  const [donSuccess, setDonSuccess] = useState(false);
  const [donTowers, setDonTowers] = useState([]);
  const donFileRef = useRef(null);

  const handleClose = useCallback(() => {
    setDon({
      fullName: "",
      phone: "",
      email: "",
      transactionDate: "",
      amount: "",
      transactionId: "",
      block: "",
      tower: "",
      apartment: "",
      donationType: "",
    });
    setDonFile(null);
    setDonErrors({});
    setDonSuccess(false);
    setDonTowers([]);
    if (donFileRef.current) donFileRef.current.value = "";
    onClose();
  }, [onClose]);

  /* Close on Escape */
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => e.key === "Escape" && handleClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, handleClose]);

  /* Lock body scroll while open */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function handleDonSubmit(e) {
    e.preventDefault();
    const {
      transactionDate,
      amount,
      transactionId,
      block,
      tower,
      fullName,
      apartment,
      donationType,
      phone,
      email,
    } = don;
    const errs = {};
    const today = new Date().toISOString().slice(0, 10);

    if (!fullName.trim()) errs.fullName = "Required";
    else if (!/^[A-Za-z\s'-]+$/.test(fullName.trim()))
      errs.fullName = "Letters, spaces, hyphens or apostrophes only";

    if (!transactionDate) errs.transactionDate = "Required";
    else if (transactionDate < "2026-04-01")
      errs.transactionDate = "Date cannot be before 01 Apr 2026";
    else if (transactionDate > today)
      errs.transactionDate = "Date cannot be in the future";

    if (!amount) errs.amount = "Required";
    else if (!/^\d+$/.test(amount)) errs.amount = "Numbers only";

    const hasId = transactionId.trim().length > 0;
    const hasFile = !!donFile;

    if (!hasId && !hasFile) {
      errs.transactionId =
        "Provide at least one: Transaction ID or a screenshot";
      errs.attachment = "Provide at least one: Transaction ID or a screenshot";
    } else {
      if (hasFile) {
        const okType = ["image/png", "image/jpeg"].includes(donFile.type);
        const okExt = /\.(png|jpe?g)$/i.test(donFile.name);
        if (!okType && !okExt) errs.attachment = "Only PNG or JPG/JPEG allowed";
        else if (donFile.size > 5 * 1024 * 1024) errs.attachment = "Max 5 MB";
      }
    }

    if (Object.keys(errs).length) {
      setDonErrors(errs);
      return;
    }
    setDonErrors({});
    setDonLoading(true);
    try {
      let attachment = null;
      if (donFile) {
        const dataUrl = await new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(String(reader.result || ""));
          reader.onerror = () => rej(new Error("Could not read file"));
          reader.readAsDataURL(donFile);
        });
        const base64Data = dataUrl.includes(",") ? dataUrl.split(",")[1] : "";
        const safeFileName = donFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
        attachment = {
          fileName: safeFileName,
          contentType: donFile.type || "application/octet-stream",
          base64Data,
          sizeBytes: donFile.size,
          s3Key: `Form submission/Attachments/donation/${Date.now()}_${safeFileName}`,
          s3Bucket: "utopia-durgotsav-website",
        };
      }
      const res = await fetch(
        "https://yrnuwylgwj.execute-api.eu-north-1.amazonaws.com/prod/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formType: "donation",
            fullName: fullName.trim(),
            mobile: phone.trim() ? `+91${phone.trim()}` : "NA",
            email: email.trim() || "NA",
            block: block || "NA",
            tower: tower || "NA",
            apartment: apartment || "NA",
            donationType: donationType || "NA",
            transactionDate,
            amount,
            transactionId: transactionId.trim() || "NA",
            ...(attachment ? { paymentAttachment: attachment } : {}),
            createdAt: new Date().toISOString(),
          }),
        },
      );
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setDonSuccess(true);
      setDon({
        fullName: "",
        phone: "",
        email: "",
        transactionDate: "",
        amount: "",
        transactionId: "",
        block: "",
        tower: "",
        apartment: "",
        donationType: "",
      });
      setDonTowers([]);
      setDonFile(null);
      if (donFileRef.current) donFileRef.current.value = "";
    } catch (err) {
      alert(`Submission failed: ${err.message}`);
    } finally {
      setDonLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div
      className="pay-overlay"
      onClick={(e) => e.target === e.currentTarget && handleClose()}
      role="dialog"
      aria-modal="true"
      aria-label="Payment QR scanner"
    >
      <div className="pay-modal">
        <div className="pay-modal-header">
          <div className="pay-modal-title">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              aria-hidden="true"
            >
              <rect x="5" y="2" width="14" height="20" rx="2" />
              <path d="M9 7h6M9 11h6M9 15h4" />
            </svg>
            <span className="pay-modal-title-text">
              <strong>Pay &amp; Contribute</strong>
              <em>Scan QR · Use UPI</em>
            </span>
          </div>
          <button
            type="button"
            className="pay-modal-close"
            onClick={handleClose}
            aria-label="Close"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="pay-scanner-wrap">
          <img
            src="/images/scanner.jpeg"
            alt="Payment QR Code"
            className="pay-scanner-img"
          />
        </div>

        <div className="pay-upi-row">
          <span className="pay-upi-label">UPI ID</span>
          <span className="pay-upi-id">
            msutopiadurgotsavcommittee.eazypay@icici
          </span>
          <button
            type="button"
            className="pay-upi-copy"
            onClick={() =>
              navigator.clipboard.writeText(
                "msutopiadurgotsavcommittee.eazypay@icici",
              )
            }
            title="Copy UPI ID"
            aria-label="Copy UPI ID"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="9" y="9" width="13" height="13" rx="2" />
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
            </svg>
          </button>
        </div>

        <p className="pay-modal-hint">
          🙏 &nbsp; Scan the QR code with any UPI app to contribute to the
          festivities
        </p>

        {/* ── Donation details form ── */}
        <div className="don-divider">
          <span>Not mandatory to fill up</span>
        </div>

        {donSuccess ? (
          <div className="don-success">
            <svg viewBox="0 0 52 52" aria-hidden="true">
              <circle
                className="fsi-circle"
                cx="26"
                cy="26"
                r="24"
                fill="none"
              />
              <path className="fsi-check" fill="none" d="M14 27l8 8 16-16" />
            </svg>
            <p>Donation details submitted. Thank you! 🙏</p>
          </div>
        ) : (
          <form className="don-form" onSubmit={handleDonSubmit} noValidate>
            {/* <div className="don-row">
              <label>Type of Contribution</label>
              <select
                value={don.donationType}
                disabled={!CONTRIBUTION_TYPES.length}
                onChange={(e) =>
                  setDon((p) => ({ ...p, donationType: e.target.value }))
                }
              >
                <option value="">Please select (optional)</option>
                {CONTRIBUTION_TYPES.map(({ label, price }) => (
                  <option key={label} value={label}>
                    {label}
                    {price ? ` — ₹${price.toLocaleString("en-IN")}` : ""}
                  </option>
                ))}
              </select>
            </div> */}
            <div className="don-row">
              <label>
                Full Name <span className="don-req">*</span>
              </label>
              <input
                type="text"
                placeholder="Your full name"
                value={don.fullName}
                autoComplete="name"
                onChange={(e) => {
                  setDon((p) => ({ ...p, fullName: e.target.value }));
                  setDonErrors((p) => {
                    const n = { ...p };
                    delete n.fullName;
                    return n;
                  });
                }}
              />
              {donErrors.fullName && (
                <span className="don-field-error">{donErrors.fullName}</span>
              )}
            </div>

            <div className="don-row">
              <label>Phone Number</label>
              <div className="don-phone-group">
                <span className="don-isd">+91</span>
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={don.phone}
                  maxLength={10}
                  inputMode="numeric"
                  autoComplete="tel-national"
                  onChange={(e) =>
                    setDon((p) => ({ ...p, phone: e.target.value }))
                  }
                />
              </div>
            </div>

            <div className="don-row">
              <label>Email</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={don.email}
                autoComplete="email"
                onChange={(e) =>
                  setDon((p) => ({ ...p, email: e.target.value }))
                }
              />
            </div>

            <div className="don-row">
              <label>Block</label>
              <select
                value={don.block}
                onChange={(e) => {
                  const b = e.target.value;
                  setDon((p) => ({ ...p, block: b, tower: "" }));
                  setDonTowers(getTowersForBlock(b));
                  setDonErrors((p) => {
                    const n = { ...p };
                    delete n.block;
                    delete n.tower;
                    return n;
                  });
                }}
              >
                <option value="" disabled>
                  Please select
                </option>
                {BLOCKS.map((b) => (
                  <option key={b}>{b}</option>
                ))}
              </select>
              {donErrors.block && (
                <span className="don-field-error">{donErrors.block}</span>
              )}
            </div>

            <div className="don-row">
              <label>Tower</label>
              <select
                value={don.tower}
                disabled={!donTowers.length}
                onChange={(e) => {
                  setDon((p) => ({
                    ...p,
                    tower: e.target.value,
                    apartment: "",
                  }));
                  setDonErrors((p) => {
                    const n = { ...p };
                    delete n.tower;
                    return n;
                  });
                }}
              >
                <option value="">
                  {donTowers.length ? "Please select" : "Select block first"}
                </option>
                {donTowers.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
              {donErrors.tower && (
                <span className="don-field-error">{donErrors.tower}</span>
              )}
            </div>

            <div className="don-row">
              <label>Apartment Number</label>
              <input
                type="text"
                placeholder={don.tower ? "e.g. 1204" : "Select tower first"}
                value={don.apartment}
                maxLength={4}
                inputMode="numeric"
                disabled={!don.tower}
                onChange={(e) =>
                  setDon((p) => ({ ...p, apartment: e.target.value }))
                }
              />
            </div>

            <div className="don-row">
              <label>
                Date of Transaction <span className="don-req">*</span>
              </label>
              <input
                type="date"
                value={don.transactionDate}
                min="2026-04-01"
                max={new Date().toISOString().slice(0, 10)}
                onChange={(e) => {
                  setDon((p) => ({ ...p, transactionDate: e.target.value }));
                  setDonErrors((p) => {
                    const n = { ...p };
                    delete n.transactionDate;
                    return n;
                  });
                }}
              />
              {donErrors.transactionDate && (
                <span className="don-field-error">
                  {donErrors.transactionDate}
                </span>
              )}
            </div>

            <div className="don-row">
              <label>Amount (₹)</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="e.g. 1000"
                value={don.amount}
                onChange={(e) => {
                  setDon((p) => ({ ...p, amount: e.target.value }));
                  setDonErrors((p) => {
                    const n = { ...p };
                    delete n.amount;
                    return n;
                  });
                }}
              />
              {donErrors.amount && (
                <span className="don-field-error">{donErrors.amount}</span>
              )}
            </div>

            <div className="don-row">
              <label>
                Transaction ID{" "}
                <span className="don-either">(or screenshot below)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. TXN123ABC"
                value={don.transactionId}
                onChange={(e) => {
                  setDon((p) => ({ ...p, transactionId: e.target.value }));
                  setDonErrors((p) => {
                    const n = { ...p };
                    delete n.transactionId;
                    return n;
                  });
                }}
              />
              {donErrors.transactionId && (
                <span className="don-field-error">
                  {donErrors.transactionId}
                </span>
              )}
            </div>

            <div className="don-row">
              <label>
                Payment Screenshot{" "}
                <span className="don-either">(or Transaction ID above)</span>
              </label>
              <input
                type="file"
                accept=".png,.jpg,.jpeg,image/png,image/jpeg"
                ref={donFileRef}
                onChange={(e) => {
                  setDonFile(e.target.files?.[0] || null);
                  setDonErrors((p) => {
                    const n = { ...p };
                    delete n.attachment;
                    return n;
                  });
                }}
                className="don-file-input"
              />
              <span className="don-help">PNG or JPG · max 5 MB</span>
              {donErrors.attachment && (
                <span className="don-field-error">{donErrors.attachment}</span>
              )}
            </div>

            <button
              type="submit"
              className="don-submit-btn"
              disabled={donLoading}
            >
              {donLoading ? <span className="don-spinner" /> : null}
              {donLoading ? "Submitting…" : "Submit Donation Details"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
