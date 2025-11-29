// IDSection.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { MdCreditCard, MdBadge } from "react-icons/md";

const IDSection = ({ form, handleChange, forceTouched }) => {
  const [touched, setTouched] = useState({ aadhaar: false, pan: false });

  // 🔢 Aadhaar Auto Formatting (1234-5678-9012)
  const handleAadhaar = (e) => {
    let digits = e.target.value.replace(/\D/g, "").slice(0, 12); // only numbers, max 12
    const formatted = digits.replace(/(\d{4})(?=\d)/g, "$1-"); // 4-4-4 format
    handleChange({ target: { name: "aadhaar", value: formatted } });
  };

  // 🔠 PAN Auto Uppercase
  const handlePAN = (e) => {
    let v = e.target.value.toUpperCase().slice(0, 10);
    handleChange({ target: { name: "pan", value: v } });
  };

  const aadhaarDigits = form.aadhaar.replace(/\D/g, "");
  const isActive = (v) => v && v.length > 0;

  // ⭐ Aadhaar error logic
  // 1) Submit kiya (forceTouched)  AND digits !== 12  -> error
  // 2) Field touch ki (touched.aadhaar) + kuch likha + digits !== 12 -> error
  const showAadhaarError =
    (forceTouched && aadhaarDigits.length !== 12) ||
    (touched.aadhaar &&
      form.aadhaar.trim() !== "" &&
      aadhaarDigits.length !== 12);

  return (
    <motion.div
      initial={{ opacity: 0.6, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="grid gap-6 md:grid-cols-2"
    >
      {/* 🔹 Aadhaar Required */}
      <div className="space-y-2">
        <label className="label flex items-center gap-1 text-[15px]">
          <MdCreditCard className="text-sky-300 text-lg" /> Aadhaar Number
        </label>

        <div
          className={`relative backdrop-blur-xl rounded-2xl border transition-all duration-300
            ${
              showAadhaarError
                ? "border-rose-500 shadow-[0_0_12px_rgba(255,85,85,0.45)]"
                : aadhaarDigits.length === 12
                ? "border-sky-400 shadow-[0_0_12px_rgba(0,160,255,0.35)]"
                : "border-white/10 hover:border-sky-400/40"
            }
          `}
        >
          {/* Floating label */}
          <span
            className={`absolute left-5 top-4 text-[15px] text-slate-400 pointer-events-none transition-all duration-300 
              ${
                isActive(form.aadhaar)
                  ? "text-[11px] -translate-y-4 text-sky-200"
                  : ""
              }
            `}
          >
            Enter Aadhaar Number
          </span>

          <input
            name="aadhaar"
            value={form.aadhaar}
            onChange={handleAadhaar}
            onBlur={() => setTouched((p) => ({ ...p, aadhaar: true }))}
            autoComplete="off"
            maxLength={14} // includes 2 hyphens: 12 digits + 2 '-'
            className="w-full bg-transparent px-5 pt-7 pb-3 text-[17px] tracking-widest outline-none text-sky-200 font-semibold"
          />
        </div>

        {showAadhaarError && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xs text-rose-400 ml-1"
          >
            Aadhaar must be 12 digits
          </motion.p>
        )}
      </div>

      {/* 🔹 PAN Optional */}
      <div className="space-y-2">
        <label className="label flex items-center gap-1 text-[15px]">
          <MdBadge className="text-emerald-300 text-lg" /> PAN Number{" "}
          <span className="text-slate-500">(Optional)</span>
        </label>

        <div
          className={`relative backdrop-blur-xl rounded-2xl border transition-all duration-300
            ${
              isActive(form.pan)
                ? "border-emerald-400 shadow-[0_0_12px_rgba(0,255,180,0.35)]"
                : "border-white/10 hover:border-emerald-400/40"
            }
          `}
        >
          {/* Floating label */}
          <span
            className={`absolute left-5 top-4 text-[15px] text-slate-400 pointer-events-none transition-all duration-300
              ${
                isActive(form.pan)
                  ? "text-[11px] -translate-y-4 text-emerald-300"
                  : ""
              }
            `}
          >
            Enter PAN Number (Optional)
          </span>

          <input
            name="pan"
            value={form.pan}
            onChange={handlePAN}
            onBlur={() => setTouched((p) => ({ ...p, pan: true }))}
            autoComplete="off"
            maxLength={10}
            className="w-full bg-transparent px-5 pt-7 pb-3 text-[17px] uppercase outline-none tracking-wider text-emerald-200 font-semibold"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default IDSection;
