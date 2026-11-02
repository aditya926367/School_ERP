// src/components/common/CameraCapture.tsx
// A popup that takes a photo with the laptop webcam or the phone's front camera (like a selfie).
// It gives the photo back as a small square JPEG data URL, ready to be saved with the form.
// A phone needs https (or localhost) for the live camera. If the live camera cannot start,
// the popup offers the phone's own camera app instead.
import { useEffect, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Camera, RefreshCw, X } from "lucide-react";

type CameraCaptureProps = {
  onCapture: (photo: string) => void;
  onClose: () => void;
};

const SIZE = 480; // the saved photo is 480 x 480 pixels
const MAX_BYTES = 250 * 1024; // keep the saved photo small

// Turn any picture or video frame into a centered square JPEG that stays under MAX_BYTES
function toSquareJpeg(source: CanvasImageSource, width: number, height: number) {
  const side = Math.min(width, height);
  const canvas = document.createElement("canvas");
  canvas.width = SIZE;
  canvas.height = SIZE;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("This browser cannot process photos.");
  context.drawImage(source, (width - side) / 2, (height - side) / 2, side, side, 0, 0, SIZE, SIZE);

  let quality = 0.85;
  let data = canvas.toDataURL("image/jpeg", quality);
  // A data URL is about 4/3 the size of the file, so compare with that
  while (data.length * 0.75 > MAX_BYTES && quality > 0.3) {
    quality -= 0.1;
    data = canvas.toDataURL("image/jpeg", quality);
  }
  return data;
}

function explain(error: unknown) {
  const name = typeof error === "object" && error !== null && "name" in error ? String((error as { name: unknown }).name) : "";
  if (name === "NotAllowedError" || name === "SecurityError") {
    return "The camera is blocked. Click the camera icon in the address bar, allow it, then try again.";
  }
  if (name === "NotFoundError" || name === "OverconstrainedError") return "No camera was found on this device.";
  if (name === "NotReadableError") return "The camera is being used by another app. Close it and try again.";
  return "The camera could not be started.";
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [status, setStatus] = useState<"starting" | "live" | "error">("starting");
  const [message, setMessage] = useState("");
  const [shot, setShot] = useState(""); // the photo just taken, waiting for "Use photo"
  const [attempt, setAttempt] = useState(0); // changing this starts the camera again

  // Start the camera, and always switch it off again when the popup closes
  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;

    async function start() {
      setStatus("starting");
      if (!navigator.mediaDevices?.getUserMedia) {
        setStatus("error");
        setMessage("The live camera needs a secure page (https). Use your phone's camera app below.");
        return;
      }
      try {
        const opened = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 960 }, height: { ideal: 960 } },
          audio: false,
        });
        if (cancelled) {
          opened.getTracks().forEach((track) => track.stop());
          return;
        }
        stream = opened;
        if (videoRef.current) {
          videoRef.current.srcObject = opened;
          await videoRef.current.play().catch(() => undefined);
        }
        setStatus("live");
      } catch (error) {
        if (cancelled) return;
        setStatus("error");
        setMessage(explain(error));
      }
    }

    start();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [attempt]);

  function takePhoto() {
    const video = videoRef.current;
    if (!video || !video.videoWidth) return;
    try {
      setShot(toSquareJpeg(video, video.videoWidth, video.videoHeight));
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "The photo could not be taken.");
    }
  }

  // Fallback: the phone's own camera app (opens the front camera on most phones)
  function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const image = new Image();
      image.onload = () => {
        try {
          setShot(toSquareJpeg(image, image.naturalWidth, image.naturalHeight));
          setStatus("live");
        } catch (error) {
          setMessage(error instanceof Error ? error.message : "The photo could not be read.");
        }
      };
      image.onerror = () => setMessage("That file is not a picture.");
      image.src = String(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-900">Take photo</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>

        {/* The picture area is always square, like the saved photo */}
        <div className="relative mx-auto aspect-square w-full overflow-hidden rounded-xl bg-gray-900">
          {shot ? (
            <img src={shot} alt="Captured" className="h-full w-full object-cover" />
          ) : (
            <video
              ref={videoRef}
              playsInline
              muted
              className={`h-full w-full object-cover ${status === "live" ? "" : "invisible"}`}
              style={{ transform: "scaleX(-1)" }} // mirrored, like a selfie preview
            />
          )}

          {!shot && status === "starting" && (
            <p className="absolute inset-0 flex items-center justify-center text-sm text-white">Starting camera...</p>
          )}
          {!shot && status === "error" && (
            <p className="absolute inset-0 flex items-center justify-center p-6 text-center text-sm text-white">{message}</p>
          )}
        </div>

        {shot ? (
          <div className="mt-4 flex gap-3">
            <button
              type="button"
              onClick={() => setShot("")}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50"
            >
              <RefreshCw size={16} />
              Retake
            </button>
            <button
              type="button"
              onClick={() => onCapture(shot)}
              className="h-11 flex-1 rounded-xl bg-[#27348b] text-sm font-semibold text-white"
            >
              Use photo
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {status === "live" && (
              <button
                type="button"
                onClick={takePhoto}
                className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#27348b] text-sm font-semibold text-white"
              >
                <Camera size={18} />
                Capture
              </button>
            )}
            {status === "error" && (
              <>
                <button
                  type="button"
                  onClick={() => setAttempt(attempt + 1)}
                  className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#27348b] text-sm font-semibold text-white"
                >
                  <RefreshCw size={16} />
                  Try camera again
                </button>
                <label className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-700 hover:bg-gray-50">
                  <Camera size={16} />
                  Use phone camera app
                  <input type="file" accept="image/*" capture="user" onChange={handleFile} className="hidden" />
                </label>
              </>
            )}
            <p className="text-center text-xs text-gray-400">Look at the camera and keep your face in the middle.</p>
          </div>
        )}
      </div>
    </div>
  );
}