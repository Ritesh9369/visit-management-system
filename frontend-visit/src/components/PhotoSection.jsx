import { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import { motion } from "framer-motion";
import { FaCamera } from "react-icons/fa";

const PhotoSection = ({ form, setForm, forceTouched, errors, setErrors }) => {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);

  const [permission, setPermission] = useState(null); // null = waiting, true = allowed, false = denied
  const [loading, setLoading] = useState(true);

  // Always front camera
  const videoConstraints = {
    facingMode: { exact: "user" }
  };

  // Permission check
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then(() => {
        setPermission(true);
        setLoading(false);
      })
      .catch(() => {
        setPermission(false);
        setLoading(false);
      });
  }, []);

  const capture = () => {
    const imgSrc = webcamRef.current?.getScreenshot();
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
    <div className="flex flex-col items-center gap-4">
      {/* CAMERA RING */}
      <div
        className={`relative w-40 h-40 rounded-full overflow-hidden border-2 flex items-center justify-center ${
          showError
            ? "border-rose-500 shadow-[0_0_12px_rgba(255,80,80,0.45)]"
            : "border-sky-400/60"
        }`}
      >
        {/* LOADING UI */}
        {loading && (
          <div className="text-white text-[11px] animate-pulse">
            ⏳ Loading camera...
          </div>
        )}

        {/* NO PERMISSION UI */}
        {!loading && permission === false && (
          <div className="text-center text-[11px] text-red-300 px-2">
            ⚠ Camera Blocked <br /> Go to Settings → Allow Camera Access
          </div>
        )}

        {/* CAMERA PREVIEW */}
        {!loading && permission && !image && (
          <Webcam
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        )}

        {/* CAPTURED IMAGE */}
        {!loading && permission && image && (
          <img src={image} alt="User" className="w-full h-full object-cover" />
        )}
      </div>

      {/* CAPTURE BUTTON */}
      {!image && permission && !loading && (
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={capture}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-sky-500 to-blue-700 
          shadow-[0_0_12px_rgba(0,200,255,0.7)] flex items-center justify-center text-white
          active:shadow-[0_0_4px_rgba(0,200,255,0.6)] transition-all cursor-pointer"
        >
          <FaCamera size={22} />
        </motion.button>
      )}

      {/* RETAKE BUTTON */}
      {image && (
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={retake}
          className="px-4 py-1.5 rounded-full bg-rose-600 text-white text-xs 
          shadow-[0_0_8px_rgba(255,0,80,0.4)] cursor-pointer hover:bg-rose-700 transition"
        >
          Retake
        </motion.button>
      )}

      {/* ERROR */}
      {showError && (
        <p className="text-xs text-rose-400 animate-pulse">
          📸 Photo is required
        </p>
      )}
    </div>
  );
};

export default PhotoSection;
