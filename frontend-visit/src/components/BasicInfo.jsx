import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaIdBadge } from "react-icons/fa";
import { MdPhoneIphone } from "react-icons/md";

const BasicInfo = ({ form, errors, handleChange, forceTouched }) => {
  const [touched, setTouched] = useState({ name: false, phone: false });

  useEffect(() => {
    if (forceTouched) {
      setTouched({ name: true, phone: true });
    }
  }, [forceTouched]);

  const isActive = (v) => v && v.length > 0;
  const showNameError = errors.name && touched.name;
  const showPhoneError = errors.phone && touched.phone;

  return (
    <motion.div
      initial={{ opacity: 0.6, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="flex-1 space-y-6"
    >
      {/* NAME */}
      <div className="space-y-2">
        <label className="label flex items-center gap-1 text-[15px]">
          <FaIdBadge className="text-sky-300 text-lg" /> Visitor Name
        </label>

        <div
          className={`relative backdrop-blur-xl rounded-2xl border transition-all duration-300
            ${
              showNameError
                ? "border-rose-500 shadow-[0_0_12px_rgba(255,80,80,0.40)]"
                : isActive(form.name)
                ? "border-sky-400 shadow-[0_0_12px_rgba(0,160,255,0.35)]"
                : "border-white/10 hover:border-sky-400/40"
            }
          `}
        >
          <span
            className={`absolute left-5 top-4 text-[15px] text-slate-400 pointer-events-none transition-all duration-300 
              ${
                isActive(form.name)
                  ? "text-[11px] -translate-y-4 text-sky-200"
                  : ""
              }
            `}
          >
            Enter full name
          </span>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={(e) =>
              handleChange({
                target: {
                  name: "name",
                  value: e.target.value.replace(/[^A-Za-z ]/g, "") // 🚫 no numbers
                }
              })
            }
            onBlur={() => setTouched((p) => ({ ...p, name: true }))}
            className="w-full bg-transparent px-5 pt-7 pb-3 text-[17px] outline-none text-sky-100 font-semibold"
          />
        </div>

        {showNameError && (
          <p className="text-xs text-rose-400 ml-1 animate-pulse">
            {errors.name}
          </p>
        )}
      </div>

      {/* PHONE */}
      <div className="space-y-2">
        <label className="label flex items-center gap-1 text-[15px]">
          <MdPhoneIphone className="text-green-300 text-lg" /> Phone Number
        </label>

        <div
          className={`relative backdrop-blur-xl rounded-2xl border transition-all duration-300
            ${
              showPhoneError
                ? "border-rose-500 shadow-[0_0_12px_rgba(255,80,80,0.40)]"
                : isActive(form.phone)
                ? "border-green-400 shadow-[0_0_12px_rgba(0,255,180,0.35)]"
                : "border-white/10 hover:border-green-400/40"
            }
          `}
        >
          <span
            className={`absolute left-5 top-4 text-[15px] text-slate-400 pointer-events-none transition-all duration-300 
              ${
                isActive(form.phone)
                  ? "text-[11px] -translate-y-4 text-green-300"
                  : ""
              }
            `}
          >
            10-digit phone number
          </span>

          <input
            type="text"
            name="phone"
            value={form.phone}
            maxLength="10"
            onChange={handleChange}
            onBlur={() => setTouched((p) => ({ ...p, phone: true }))}
            className="w-full bg-transparent px-5 pt-7 pb-3 text-[17px] outline-none text-green-200 font-semibold tracking-wide"
          />
        </div>

        {showPhoneError && (
          <p className="text-xs text-rose-400 ml-1 animate-pulse">
            {errors.phone}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default BasicInfo;
