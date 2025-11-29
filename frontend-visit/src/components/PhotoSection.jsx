import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

const PhotoSection = ({ form, setForm, forceTouched, errors, setErrors }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [deviceId, setDeviceId] = useState(null);

  // Auto select real camera
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      const videoDevices = devices.filter((d) => d.kind === "videoinput");
      const preferred =
        videoDevices.find((d) => !d.label.toLowerCase().includes("virtual")) ||
        videoDevices[0];
      setDeviceId(preferred?.deviceId);
    });
  }, []);

  // 🔥 Take photo & auto remove error instantly
  const capture = () => {
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
    setForm((prev) => ({ ...prev, photo: imgSrc }));

    // remove photo error instantly after clicking
    setErrors((prev) => {
      const u = { ...prev };
      delete u.photo;
      return u;
    });
  };

  // 🔁 Retake photo & reset error
  const handleRetake = () => {
    setImage(null);
    setForm((prev) => ({ ...prev, photo: null }));
    setErrors((prev) => {
      const u = { ...prev };
      delete u.photo;
      return u;
    });
  };

  const showError = forceTouched && errors?.photo;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Photo Box */}
      <div
        className={`w-40 h-40 rounded-full overflow-hidden flex items-center justify-center border-2 transition-all duration-300
        ${
          showError
            ? "border-rose-500 shadow-[0_0_12px_rgba(255,80,80,0.45)]"
            : "border-sky-400/60"
        }`}
      >
        {!image ? (
          deviceId && (
            <Webcam
              key={deviceId}
              ref={webcamRef}
              audio={false}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                deviceId: { exact: deviceId },
                facingMode: "user"
              }}
              className="w-full h-full object-cover"
            />
          )
        ) : (
          <img src={image} alt="User" className="w-full h-full object-cover" />
        )}
      </div>

      {/* Buttons */}
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
          onClick={handleRetake}
          className="px-3 py-1 rounded-lg bg-rose-600 text-white text-xs"
        >
          Retake
        </motion.button>
      )}

      {/* ❌ Error message */}
      {showError && (
        <p className="text-xs text-rose-400 animate-pulse">
          📸 Photo is required
        </p>
      )}
    </div>
  );
};

export default PhotoSection;
