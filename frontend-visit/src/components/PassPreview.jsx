import { motion } from "framer-motion";
import { useRef } from "react";

const PassPreview = ({ passData }) => {
  if (!passData) return null;

  const passRef = useRef(null);
  const date = passData.time ? new Date(passData.time) : null;

  const maskAadhaar = (a) =>
    a ? "XXXX-XXXX-" + a.replace(/\D/g, "").slice(-4) : "";

  const maskPAN = (p) =>
    p ? "XXXXX" + p.replace(/\D/g, "").slice(-4) : "NOT PROVIDED";

  return (
    <motion.div
      key={passData.passId}
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="flex items-center justify-center mt-4"
    >
      <div
        ref={passRef}
        className="relative w-full max-w-sm bg-[#0e1525] rounded-3xl border border-white/10 px-6 py-7 text-slate-100 shadow-2xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <p className="text-[10px] tracking-[0.25em] uppercase text-sky-400">
              VISITOR PASS
            </p>
            <h2 className="text-lg font-semibold">{passData.passId}</h2>
          </div>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 text-emerald-300 px-3 py-1 text-[10px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Checked-in
          </span>
        </div>

        {/* Photo + Name */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-800 shadow">
            {passData.photo ? (
              <img
                src={passData.photo}
                alt="Visitor"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-xl font-bold bg-gradient-to-br from-indigo-400 to-sky-400">
                {passData.name?.[0]?.toUpperCase() || "V"}
              </div>
            )}
          </div>

          <div className="text-xs">
            <p className="text-slate-400">Visitor Name</p>
            <p className="font-semibold text-sm capitalize">{passData.name}</p>
            <p className="mt-1 text-slate-400">Phone</p>
            <p className="text-sm">{passData.phone}</p>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 text-[11px] mb-2">
          <div className="bg-slate-900/60 border border-white/5 rounded-2xl px-3 py-2">
            <p className="text-slate-400">Whom to Meet</p>
            <p className="font-medium mt-0.5 capitalize">
              {passData.whomToMeet}
            </p>
          </div>

          {date && !isNaN(date.getTime()) && (
            <div className="bg-slate-900/60 border border-white/5 rounded-2xl px-3 py-2">
              <p className="text-slate-400">Date & Time</p>
              <p className="font-medium mt-0.5">
                {date.toLocaleDateString()} • {date.toLocaleTimeString()}
              </p>
            </div>
          )}

          <div className="bg-slate-900/60 border border-white/5 rounded-2xl px-3 py-2">
            <p className="text-slate-400">Aadhaar</p>
            <p className="font-medium mt-0.5 tracking-widest">
              {maskAadhaar(passData.aadhaar)}
            </p>
          </div>

          <div className="bg-slate-900/60 border border-white/5 rounded-2xl px-3 py-2">
            <p className="text-slate-400">PAN</p>
            <p className="font-medium mt-0.5 uppercase tracking-wide">
              {maskPAN(passData.pan)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PassPreview;
