// ⭐ FINAL VISITOR FORM with FULL VALIDATION + LIVE BACKEND CONNECTED

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import Header from "./Header";
import PhotoSection from "./PhotoSection";
import BasicInfo from "./BasicInfo";
import MeetingSection from "./MeetingSection";
import IDSection from "./IDSection";
import PassPreview from "./PassPreview";

const shake = {
  x: [0, -8, 8, -8, 8, 0],
  transition: { duration: 0.45 }
};

const VisitorForm = () => {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    whomToMeet: "",
    aadhaar: "",
    pan: "",
    photo: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [passData, setPassData] = useState(null);
  const [successMsg, setSuccessMsg] = useState("");
  const [forceTouched, setForceTouched] = useState(false);
  const [shakeTrigger, setShakeTrigger] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));

    setErrors((prev) => {
      const u = { ...prev };
      if (name === "name" && value.trim() !== "") delete u.name;
      if (name === "phone" && /^[0-9]{10}$/.test(value)) delete u.phone;
      if (name === "whomToMeet" && value.trim() !== "") delete u.whomToMeet;

      const ap = name === "aadhaar" ? value.replace(/\D/g, "") : "";
      if (name === "aadhaar" && /^[0-9]{12}$/.test(ap)) delete u.aadhaar;

      return u;
    });
  };

  const validate = () => {
    const e = {};

    if (!form.photo) e.photo = "Photo required";
    if (!form.name.trim()) e.name = "Name required";
    if (!/^[0-9]{10}$/.test(form.phone)) e.phone = "10 digit number required";
    if (!form.whomToMeet.trim()) e.whomToMeet = "Select employee";

    const aadhaarPure = form.aadhaar.replace(/\D/g, "");
    if (!/^[0-9]{12}$/.test(aadhaarPure))
      e.aadhaar = "Aadhaar must be 12 digits";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      setForceTouched(true);
      setShakeTrigger(true);
      setTimeout(() => setShakeTrigger(false), 450);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setForceTouched(false);
    setIsSubmitting(true);

    try {
      const passId = "PASS-" + Math.floor(100000 + Math.random() * 900000);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/visitors/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...form, passId })
        }
      );

      // ⭐ FIX — backend warm-up JSON error
      if (!response.ok) {
        const text = await response.text();
        throw new Error(`Server responded: ${text}`);
      }

      const result = await response.json();

      if (result.success) {
        const now = new Date();
        setPassData({
          ...form,
          passId,
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString()
        });

        setSuccessMsg(`Pass Generated Successfully — ID: ${passId}`);
        setTimeout(() => setSuccessMsg(""), 4000);

        setForm({
          name: "",
          phone: "",
          whomToMeet: "",
          aadhaar: "",
          pan: "",
          photo: null
        });

        setErrors({});
      } else {
        alert(result.message);
      }
    } catch (err) {
      alert("Backend not connected — " + err.message);
    }

    setIsSubmitting(false);
  };

  return (
    <div className="page relative">
      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
            transition={{ duration: 0.45 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white px-6 py-3 rounded-xl shadow-lg text-sm font-semibold tracking-wide z-[999]"
          >
            {successMsg}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-[2fr,1.4fr] gap-6 w-full max-w-6xl mx-auto select-none">
        <div className="space-y-6">
          {forceTouched && Object.keys(errors).length > 0 && (
            <motion.div animate={shakeTrigger ? shake : {}}>
              <div className="bg-red-500/15 border border-red-400 text-red-300 text-[14px] px-5 py-3 rounded-xl shadow font-medium">
                ⚠ Required fields are missing — please fill all details to
                continue
              </div>
            </motion.div>
          )}

          <Header />
          <motion.div className="card">
            <div className="flex flex-col md:flex-row gap-6">
              <PhotoSection
                {...{ form, setForm, forceTouched, errors, setErrors }}
              />
              <BasicInfo {...{ form, errors, handleChange, forceTouched }} />
            </div>
          </motion.div>

          <motion.div className="card relative overflow-visible z-20 pb-14">
            <MeetingSection {...{ form, errors, handleChange, forceTouched }} />
          </motion.div>

          <motion.form className="card space-y-4 pt-8" onSubmit={handleSubmit}>
            <IDSection {...{ form, errors, handleChange, forceTouched }} />

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              disabled={isSubmitting}
              className="w-full py-4 rounded-2xl font-semibold tracking-wide text-[17px]
              bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-[0_0_15px_rgba(0,160,255,0.28)]
              hover:shadow-[0_0_28px_rgba(0,200,255,0.55)] hover:brightness-110 transition-all duration-200
              cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? "Saving & Generating Pass..."
                : "Generate Visitor Pass"}
            </motion.button>
          </motion.form>
        </div>

        <AnimatePresence mode="wait">
          {passData && <PassPreview passData={passData} />}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default VisitorForm;
