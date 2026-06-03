import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "#030014",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          border: "1px solid rgba(124, 58, 237, 0.4)",
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="#7c3aed"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect width="14" height="14" x="5" y="5" rx="2" />
          <rect width="6" height="6" x="9" y="9" rx="1" />
          <path d="M9 1v4" />
          <path d="M15 1v4" />
          <path d="M9 19v4" />
          <path d="M15 19v4" />
          <path d="M19 9h4" />
          <path d="M19 15h4" />
          <path d="M1 9h4" />
          <path d="M1 15h4" />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  );
}
