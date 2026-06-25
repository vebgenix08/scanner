import { useEffect, useRef } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

type QRScannerProps = {
  onScan: (decodedText: string) => void;
};

export default function QRScanner({ onScan }: QRScannerProps) {
  const scannerRef = useRef<Html5QrcodeScanner | null>(null);

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
        onScan(decodedText);
      },
      () => {
        // Ignore scan misses and keep the camera live.
      },
    );

    return () => {
      scanner.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, [onScan]);

  return <div id="reader" />;
}
