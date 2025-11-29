import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

const PhotoSection = ({ form, setForm, forceTouched, errors, setErrors }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  // Device camera list
  const [devices, setDevices] = useState([]);
  const [deviceId, setDeviceId] = useState(null); // front camera first
  const [camKey, setCamKey] = useState(0);
  const [permissionError, setPermissionError] = useState(false);

  // 🔥 Ask permission + fetch devices
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => setPermissionError(false))
      .catch(() => setPermissionError(true));

    navigator.mediaDevices.enumerateDevices().then((mediaDevices) => {
      const cams = mediaDevices.filter((d) => d.kind === "videoinput");
      setDevices(cams);

      if (cams.length > 0) {
        // ALWAYS start with **front camera**
        setDeviceId(cams[0].deviceId);
      }
    });
  }, []);

  // 🔁 Switch camera (front → back → front)
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

  // 🔄 Retake
  const retake = () => {
    setImage(null);
    setForm((prev) => ({ ...prev, photo: null }));
  };

  const showError = forceTouched && errors?.photo;

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`w-40 h-40 rounded-full overflow-hidden flex items-center justify-center border-2 transition-all duration-300 ${
          showError
            ? "border-rose-500 shadow-[0_0_12px_rgba(255,80,80,0.45)]"
            : "border-sky-400/60"
        }`}
      >
        {permissionError ? (
          <p className="text-[11px] text-rose-400 text-center px-2">
            🚫 Camera blocked — Allow camera & refresh page
          </p>
        ) : !image && deviceId ? (
          <Webcam
            key={camKey}
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={{ deviceId }}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          image && (
            <img
              src={image}
              alt="User"
              className="w-full h-full object-cover"
            />
          )
        )}
      </div>

      {/* Switch button (only when more than 1 camera) */}
      {!image && !permissionError && devices.length > 1 && (
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
