"use client";
import { useRef, useState } from "react";
import Image from "next/image";

export default function KYCCaptureStep({
  onNext,
  onBack,
}: Readonly<{
  onNext: (data: any) => void;
  onBack: () => void;
}>) {
  const [files, setFiles] = useState({
    fingerprintScan: null as File | null,
    fingerprintImage: null as File | null,
    signature: null as File | null,
    selfie: null as File | null,
    retina: null as File | null,
  });
  const [error, setError] = useState("");
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);
  const [fingerprintPreview, setFingerprintPreview] = useState<string | null>(
    null,
  );
  const [retinaPreview, setRetinaPreview] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCapturing, setIsCapturing] = useState<
    null | "selfie" | "fingerprint" | "retina"
  >(null);

  // Camera logic
  const startCamera =
    (mode: "selfie" | "fingerprint" | "retina") => async () => {
      setIsCapturing(mode);
      if (navigator.mediaDevices && videoRef.current) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    };

  const captureImage = (mode: "selfie" | "fingerprint" | "retina") => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(videoRef.current, 0, 0, 320, 240);
        canvasRef.current.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], `${mode}.png`, { type: "image/png" });
            setFiles((prev) => ({ ...prev, [mode]: file }));
            const dataUrl = canvasRef.current?.toDataURL("image/png") ?? null;
            if (mode === "selfie") setSelfiePreview(dataUrl);
            if (mode === "fingerprint") setFingerprintPreview(dataUrl);
            if (mode === "retina") setRetinaPreview(dataUrl);
          }
        }, "image/png");
      }
    }
    stopCamera();
  };

  const stopCamera = () => {
    setIsCapturing(null);
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream?.getTracks?.().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files: fileList } = e.target;
    if (fileList && fileList[0]) {
      setFiles((prev) => ({ ...prev, [name]: fileList[0] }));
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (name === "selfie") setSelfiePreview(ev.target?.result as string);
        if (name === "fingerprintImage")
          setFingerprintPreview(ev.target?.result as string);
        if (name === "retina") setRetinaPreview(ev.target?.result as string);
      };
      reader.readAsDataURL(fileList[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // if (
    //   !files.fingerprintScan ||
    //   !files.fingerprintImage ||
    //   !files.signature ||
    //   !files.selfie ||
    //   !files.retina
    // ) {
    //   setError("Please provide all required KYC captures.");
    //   return;
    // }
    setError("");
    onNext(files);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="mb-4 text-xl font-bold">Step 3: KYC Capture</h2>
      <div>
        <label htmlFor="fingerprintScan" className="mb-1 block font-medium">
          Fingerprint Scan (PDF/image, required)
        </label>
        <input
          id="fingerprintScan"
          type="file"
          name="fingerprintScan"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block"
        />
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="fingerprintImage">
          Fingerprint Image (live capture required)
        </label>
        {fingerprintPreview && (
          <Image
            src={fingerprintPreview}
            alt="Fingerprint Preview"
            className="mb-2 h-32 w-32 rounded border object-cover"
            width={128}
            height={128}
            unoptimized
          />
        )}
        {isCapturing === "fingerprint" ? (
          <div className="flex flex-col gap-2">
            <video
              ref={videoRef}
              width={320}
              height={240}
              className="border"
              aria-label="Fingerprint camera preview"
            >
              <track kind="captions" />
            </video>
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              style={{ display: "none" }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => captureImage("fingerprint")}
                className="rounded bg-green-600 px-3 py-1 text-white"
              >
                Capture
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="rounded bg-gray-400 px-3 py-1 text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={startCamera("fingerprint")}
            className="rounded bg-blue-500 px-3 py-1 text-white"
          >
            Capture Fingerprint with Camera
          </button>
        )}
      </div>
      <div>
        <label htmlFor="signature" className="mb-1 block font-medium">
          Signature (upload, required)
        </label>
        <input
          id="signature"
          type="file"
          name="signature"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
          className="block"
        />
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="selfie">
          Selfie (live capture required)
        </label>
        {selfiePreview && (
          <Image
            src={selfiePreview}
            alt="Selfie Preview"
            className="mb-2 h-32 w-32 rounded-full border object-cover"
            width={128}
            height={128}
            unoptimized
          />
        )}
        {isCapturing === "selfie" ? (
          <div className="flex flex-col gap-2">
            <video
              ref={videoRef}
              width={320}
              height={240}
              className="border"
              aria-label="Selfie camera preview"
            >
              <track kind="captions" />
            </video>
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              style={{ display: "none" }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => captureImage("selfie")}
                className="rounded bg-green-600 px-3 py-1 text-white"
              >
                Capture
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="rounded bg-gray-400 px-3 py-1 text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={startCamera("selfie")}
            className="rounded bg-blue-500 px-3 py-1 text-white"
          >
            Capture Selfie with Camera
          </button>
        )}
      </div>
      <div>
        <label className="mb-1 block font-medium" htmlFor="retina">
          Retina Scan (required)
        </label>
        {retinaPreview && (
          <Image
            src={retinaPreview}
            alt="Retina Preview"
            className="mb-2 h-32 w-32 rounded border object-cover"
            width={128}
            height={128}
            unoptimized
          />
        )}
        {isCapturing === "retina" ? (
          <div className="flex flex-col gap-2">
            <video
              ref={videoRef}
              width={320}
              height={240}
              className="border"
              aria-label="Retina camera preview"
            >
              <track kind="captions" />
            </video>
            <canvas
              ref={canvasRef}
              width={320}
              height={240}
              style={{ display: "none" }}
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => captureImage("retina")}
                className="rounded bg-green-600 px-3 py-1 text-white"
              >
                Capture
              </button>
              <button
                type="button"
                onClick={stopCamera}
                className="rounded bg-gray-400 px-3 py-1 text-white"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={startCamera("retina")}
              className="rounded bg-blue-500 px-3 py-1 text-white"
            >
              Capture Retina with Camera
            </button>
            <input
              id="retina"
              type="file"
              name="retina"
              accept="image/*"
              onChange={handleFileChange}
              className="block"
            />
          </div>
        )}
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <div className="mt-4 flex space-x-2">
        <button
          type="button"
          className="rounded bg-gray-300 px-4 py-2"
          onClick={onBack}
        >
          Back
        </button>
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          Next
        </button>
      </div>
    </form>
  );
}
