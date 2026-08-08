import React, { useState, useEffect, useCallback, useRef } from "react";
import "./PayModal.css";

export default function PayModal({ isOpen, onClose }) {
  const [don, setDon] = useState({
    transactionDate: "",
    amount: "",
    transactionId: "",
  });
  const [donFile, setDonFile] = useState(null);
  const [donErrors, setDonErrors] = useState({});
  const [donLoading, setDonLoading] = useState(false);
  const [donSuccess, setDonSuccess] = useState(false);
  const donFileRef = useRef(null);

  const handleClose = useCallback(() => {
    setDon({ transactionDate: "", amount: "", transactionId: "" });
    setDonFile(null);
    setDonErrors({});
    setDonSuccess(false);
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
    const { transactionDate, amount, transactionId } = don;
    const errs = {};
    const today = new Date().toISOString().slice(0, 10);

    if (!transactionDate) errs.transactionDate = "Required";
    else if (transactionDate < "2026-04-01")
      errs.transactionDate = "Date cannot be before 01 Apr 2026";
    else if (transactionDate > today)
      errs.transactionDate = "Date cannot be in the future";

    if (!amount) errs.amount = "Required";
    else if (!/^\d+$/.test(amount)) errs.amount = "Numbers only";

    if (!transactionId) errs.transactionId = "Required";
    else if (!/^[A-Za-z0-9]+$/.test(transactionId))
      errs.transactionId = "Letters and numbers only";

    if (!donFile) {
      errs.attachment = "Required";
    } else {
      const okType = ["image/png", "image/jpeg"].includes(donFile.type);
      const okExt = /\.(png|jpe?g)$/i.test(donFile.name);
      if (!okType && !okExt) errs.attachment = "Only PNG or JPG/JPEG allowed";
      else if (donFile.size > 5 * 1024 * 1024) errs.attachment = "Max 5 MB";
    }

    if (Object.keys(errs).length) {
      setDonErrors(errs);
      return;
    }
    setDonErrors({});
    setDonLoading(true);
    try {
      const dataUrl = await new Promise((res, rej) => {
        const reader = new FileReader();
        reader.onload = () => res(String(reader.result || ""));
        reader.onerror = () => rej(new Error("Could not read file"));
        reader.readAsDataURL(donFile);
      });
      const base64Data = dataUrl.includes(",") ? dataUrl.split(",")[1] : "";
      const safeFileName = donFile.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const attachment = {
        fileName: safeFileName,
        contentType: donFile.type || "application/octet-stream",
        base64Data,
        sizeBytes: donFile.size,
        s3Key: `Form submission/Attachments/donation/${Date.now()}_${safeFileName}`,
        s3Bucket: "utopia-durgotsav-website",
      };
      const res = await fetch(
        "https://unrenh5oj3.execute-api.eu-north-1.amazonaws.com/prod/submit",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            formType: "donation",
            transactionDate,
            amount,
            transactionId,
            attachment,
            createdAt: new Date().toISOString(),
          }),
        },
      );
      if (!res.ok) throw new Error(`Server responded ${res.status}`);
      setDonSuccess(true);
      setDon({ transactionDate: "", amount: "", transactionId: "" });
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
              strokeWidth="2"
              aria-hidden="true"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
            </svg>
            <span>Scan to Pay / Donate</span>
          </div>
          <button
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

        <p className="pay-modal-hint">
          🙏 &nbsp; Scan the QR code with any UPI app to contribute to the
          festivities
        </p>

        {/* ── Donation details form ── */}
        <div className="don-divider">
          <span>Donation Details (Not mandatory to submit)</span>
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
            <div className="don-row">
              <label>Date of Transaction</label>
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
              <label>Transaction ID</label>
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
              <label>Payment Screenshot</label>
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
