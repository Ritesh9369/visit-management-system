import { useState, useRef, useEffect } from "react";
import { FaUserTie } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const employees = [
  "Gunnesh",
  "Ritesh",
  "Sandeep",
  "Rahul",
  "Priya",
  "Reception",
  "Shivam",
  "Manoj",
  "Sneha",
  "Harshal",
  "Vikas",
  "Komal",
  "Dinesh"
];

const MeetingSection = ({ form, errors, handleChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicked outside
  useEffect(() => {
    const listener = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", listener);
    return () => document.removeEventListener("mousedown", listener);
  }, []);

  const selectEmp = (emp) => {
    handleChange({ target: { name: "whomToMeet", value: emp } });
    setOpen(false);
  };

  return (
    <div className="space-y-3 relative" ref={dropdownRef}>
      <label className="label">
        <FaUserTie className="text-amber-300" /> Whom to meet
      </label>

      {/* Selected Box */}
      <motion.div
        onClick={() => setOpen(!open)}
        whileTap={{ scale: 0.97 }}
        whileHover={{ scale: 1.01 }}
        className={`inputBox flex justify-between items-center cursor-pointer transition-all border-[1.5px]
          ${open ? "border-sky-400/60 shadow-sky-500/20" : "border-white/10"}
        `}
      >
        <span
          className={`transition ${
            form.whomToMeet ? "text-sky-300 font-medium" : "text-slate-500"
          }`}
        >
          {form.whomToMeet || "Select employee"}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.25 }}
        >
          ▼
        </motion.span>
      </motion.div>

      {/* Animated underline when selected */}
      {form.whomToMeet && (
        <motion.div
          layoutId="underlineMeeting"
          className="h-[2.5px] rounded-full bg-gradient-to-r from-sky-300 to-sky-500 mt-1"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.35 }}
        />
      )}

      {/* Dropdown list */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.96 }}
            transition={{ duration: 0.23 }}
            className="absolute left-0 right-0 z-[999] mt-2 
              bg-slate-900/90 backdrop-blur-xl border border-white/10 
              rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="max-h-48 overflow-y-auto custom-scroll">
              {employees.map((emp) => (
                <motion.div
                  key={emp}
                  onClick={() => selectEmp(emp)}
                  whileHover={{ backgroundColor: "rgba(56, 189, 248, 0.25)" }}
                  whileTap={{ scale: 0.97 }}
                  className={`px-4 py-3 text-[15px] cursor-pointer transition-all ${
                    form.whomToMeet === emp
                      ? "bg-sky-500/25 text-sky-300 font-semibold"
                      : "text-slate-200"
                  }`}
                >
                  {emp}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error message */}
      {errors.whomToMeet && (
        <p className="text-xs text-rose-400 mt-1">{errors.whomToMeet}</p>
      )}
    </div>
  );
};

export default MeetingSection;
