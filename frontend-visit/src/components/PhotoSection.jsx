import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

const PhotoSection = ({ form, setForm, forceTouched, errors, setErrors }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null);
  const [camKey, setCamKey] = useState(0);
  const [permissionError, setPermissionError] = useState(false);

  // 📌 Auto ask camera permission + get camera list
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setPermissionError(false))
      .catch(() => setPermissionError(true));

    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      const cams = mediaDevices.filter((d) => d.kind === "videoinput");
      setDevices(cams);

      if (cams.length > 0) {
        setDeviceId(cams[0].deviceId); // default → first camera
      }
    });
  }, []);

  // 🔄 Switch camera
  const switchCamera = () => {
    if (devices.length > 1) {
      const currentIndex = devices.findIndex((d) => d.deviceId === deviceId);
      const nextIndex = (currentIndex + 1) % devices.length;
      setDeviceId(devices[nextIndex].deviceId);
      setCamKey((prev) => prev + 1);
    }
  };

  // 📸 Capture
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

  // 🔁 Retake
  const retake = () => {
    setImage(null);
    setForm((prev) => ({ ...prev, photo: null }));
  };

  const showError = forceTouched && errors?.photo;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Camera Preview Box */}
      <div
        className={`w-40 h-40 rounded-full overflow-hidden flex items-center justify-center border-2 transition-all duration-300 ${
          showError
            ? "border-rose-500 shadow-[0_0_12px_rgba(255,80,80,0.45)]"
            : "border-sky-400/60"
        }`}
      >
        {/* Permission Denied Message */}
        {permissionError && (
          <p className="text-center text-[11px] text-rose-400 px-2">
            🚫 Camera permission blocked. Go to browser settings → Allow camera
            → Reload page.
          </p>
        )}

        {/* Live camera feed */}
        {!permissionError && !image && deviceId && (
          <Webcam
            key={camKey}
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ deviceId }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        {/* Captured image preview */}
        {image && (
          <img src={image} alt="User" className="w-full h-full object-cover" />
        )}
      </div>

      {/* 🔄 Switch Camera */}
      {!image && devices.length > 1 && !permissionError && (
        <button
          onClick={switchCamera}
          className="px-3 py-1 rounded-lg bg-gray-700 text-white text-[11px]"
        >
          🔄 Switch Camera
        </button>
      )}

      {/* 📸 Capture / Retake */}
      {!image ? (
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.05 }}
          onClick={capture}
          disabled={permissionError}
          className="px-4 py-2 rounded-lg bg-sky-600 text-white text-sm flex items-center gap-1 disabled:bg-gray-500"
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

      {/* ❌ Error */}
      {showError && (
        <p className="text-xs text-rose-400 animate-pulse">
          📸 Photo is required
        </p>
      )}
    </div>
  );
};

export default PhotoSection;
