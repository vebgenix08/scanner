import { useEffect, useRef } from "react";
import { Html5QrcodeScanner, Html5QrcodeScannerState } from "html5-qrcode";

type QRScannerProps = {
  onScan: (decodedText: string) => void;
  paused?: boolean;
};

export default function QRScanner({ onScan, paused }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);
  const onScanRef = useRef(onScan);

  useEffect(() => {
    onScanRef.current = onScan;
  }, [onScan]);

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "reader",
      {
        fps: 10,
        qrbox: 250,
        rememberLastUsedCamera: true,
        showTorchButtonIfSupported: true,
      },
      false,
    );

    scannerRef.current = scanner;

    scanner.render(
      (decodedText) => {
        onScanRef.current(decodedText);
      },
      () => {
        // Ignore scan misses
      },
    );

    return () => {
      scanner.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (paused && state === Html5QrcodeScannerState.SCANNING) {
          scannerRef.current.pause(true);
        } else if (!paused && state === Html5QrcodeScannerState.PAUSED) {
          scannerRef.current.resume();
        }
      } catch (error) {
        // Ignore pause/resume state errors
      }
    }
  }, [paused]);

  return <div id="reader" />;
}
