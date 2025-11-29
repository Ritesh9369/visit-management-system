import { useState, useRef } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

const PhotoSection = ({ form, setForm, forceTouched, errors, setErrors }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  // Start with front camera
  const [facingMode, setFacingMode] = useState("user");
  const [camKey, setCamKey] = useState(0); // force reload webcam

  const switchCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
    setCamKey((prev) => prev + 1); // refresh webcam component
  };

  const videoConstraints = {
    audio: false,
    video: { facingMode }
  };

  const capture = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
    setForm((prev) => ({ ...prev, photo: imgSrc }));
    setErrors((prev) => {
      const u = { ...prev };
      delete u.photo;
      return u;
    });
  };

  const retake = () => {
    setImage(null);
    setForm((prev) => ({ ...prev, photo: null }));
  };

  const showError = forceTouched && errors?.photo;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Circle preview */}
      <div
        className={`w-40 h-40 rounded-full overflow-hidden flex items-center justify-center border-2 transition-all duration-300 ${
          showError
            ? "border-rose-500 shadow-[0_0_12px_rgba(255,80,80,0.45)]"
            : "border-sky-400/60"
        }`}
      >
        {!image ? (
          <Webcam
            key={camKey} // 👈 force reload when switching
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <img src={image} alt="User" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Switch Camera */}
      {!image && (
        <button
          onClick={switchCamera}
          className="px-3 py-1 rounded-lg bg-gray-700 text-white text-[11px]"
        >
          🔄 Switch Camera
        </button>
      )}

      {/* Capture / Retake */}
      {!image ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={capture}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm flex items-center gap-1"
        >
          <FaCamera /> Click Photo
        </motion.button>
      ) : (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={retake}
          className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs"
        >
          Retake
        </motion.button>
      )}

      {showError && (
        <p className="text-xs text-rose-400 animate-pulse">
          📸 Photo is required
        </p>
      )}
    </div>
  );
};

export default PhotoSection;
