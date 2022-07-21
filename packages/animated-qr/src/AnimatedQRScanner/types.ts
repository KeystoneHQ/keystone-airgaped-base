export enum QRCodeError {
  UNEXPECTED_QRCODE = "UNEXPECTED_QRCODE",
  INVALID_QR_CODE = "INVALID_QR_CODE",
}

export enum CameraStatus {
  ACCESSING_CAMERA = "ACCESSING_CAMERA",
  NO_WEBCAM = "NO_WEBCAM_FOUND",
  PERMISSION_NEEDED = "NO_WEBCAM_ACCESS",
  READY = "READY",
  UNKNOWN_ERROR = "UNKNOWN_CAMERA_ERROR",
}

export interface ScannerProps {
  purpose: Purpose
  handleScan: (ur: { type: string; cbor: string }) => void
  handleError: (error: string) => void
  options?: {
    width?: number | string
    height?: number | string
    blur?: boolean
  }
  videoLoaded?: (canPlay: boolean) => void
}

export enum Purpose {
  SYNC = "sync",
  SIGN = "sign",
  SOL_SYNC = "sol-sync",
  SOL_SIGN = "sol-sign",
  NEAR_SYNC = "near-sync",
  NEAR_SIGN = "near-sign",
}
