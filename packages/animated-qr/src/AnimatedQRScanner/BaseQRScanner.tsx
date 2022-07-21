import React, { useEffect, useMemo, useState } from "react";
import { BarcodeFormat, DecodeHintType } from "@zxing/library";
import { BrowserQRCodeReader } from "@zxing/browser";

const VIDEO_ID = "qr-scanner-video";

interface BaseQRScannerProps {
  handleScan: (result: string) => void;
  handleError?: (error: string) => void;
  blur?: boolean;
  videoLoaded?: (canPlay: boolean) => void;
  width?: string | number;
  height?: string | number;
}

export const BaseQRScanner = ({
  handleScan,
  handleError,
  blur = true,
  videoLoaded,
  width,
  height,
}: BaseQRScannerProps): JSX.Element => {
  const [canplay, setCanplay] = useState(false);
  const codeReader = useMemo(() => {
    const hint = new Map();
    hint.set(DecodeHintType.POSSIBLE_FORMATS, [BarcodeFormat.QR_CODE]);
    return new BrowserQRCodeReader(hint, {
      delayBetweenScanAttempts: 100,
      delayBetweenScanSuccess: 100,
    });
  }, []);

  useEffect(() => {
    const videoElement = document.getElementById(VIDEO_ID) as HTMLVideoElement;
    const canplayListener = () => {
      setCanplay(true);
      videoLoaded && videoLoaded(true);
    };
    videoElement.addEventListener("canplay", canplayListener);

    const promise = codeReader.decodeFromVideoDevice(
      undefined,
      videoElement,
      (result) => {
        if (result) {
          handleScan(result.getText());
        }
      }
    );
    return () => {
      videoElement.removeEventListener("canplay", canplayListener);
      promise
        .then((controls) => {
          if (controls) {
            controls.stop();
          }
        })
        .catch((error) => {
          handleError && handleError(error);
        });
    };
  }, []);

  return (
    <video
      id={VIDEO_ID}
      data-testid={VIDEO_ID}
      style={{
        display: canplay ? "block" : "none",
        width: width || "auto",
        height: height || "auto",
        objectFit: "cover",
        transform: "rotateY(180deg)",
        filter: blur ? "blur(4px)" : "none",
      }}
    />
  );
};
