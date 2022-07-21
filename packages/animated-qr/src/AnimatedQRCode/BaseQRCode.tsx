import React from "react";
import QRCode from "qrcode.react";

interface Props {
  value: string;
  size?: number;
}

const DEFAULT_QR_SIZE = 180;

export const BaseQRCode = ({
  value,
  size = DEFAULT_QR_SIZE,
}: Props): JSX.Element => (
  <div
    style={{
      width: size,
      height: size,
      backgroundColor: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
  >
    <QRCode value={value} size={size - 10} />
  </div>
);
