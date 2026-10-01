import { ImageResponse } from "next/og";

// Default share card for every page (WhatsApp, LinkedIn, X, Slack previews).
export const alt = "Virtual Captains — Sales Training, SalesX & Sales Floor Management";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "radial-gradient(120% 90% at 50% 0%, #1d4ed8 0%, #0b1c4d 45%, #020B25 80%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#e7ff3d",
            }}
          />
          <div style={{ fontSize: 30, letterSpacing: 6, textTransform: "uppercase", color: "#38bdf8" }}>
            Virtual Captains
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2 }}>
            Turn Sales Potential
          </div>
          <div style={{ fontSize: 76, fontWeight: 600, lineHeight: 1.05, letterSpacing: -2, color: "#7dd3fc" }}>
            Into Proven Performance.
          </div>
          <div style={{ marginTop: 28, fontSize: 30, color: "rgba(255,255,255,0.75)" }}>
            SalesX simulation training · Sales consulting · Sales floor management
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24 }}>
          <div style={{ color: "rgba(255,255,255,0.6)" }}>Middle East · India · Southeast Asia</div>
          <div
            style={{
              padding: "12px 28px",
              borderRadius: 999,
              background: "#e7ff3d",
              color: "#020B25",
              fontWeight: 600,
            }}
          >
            Let&apos;s Connect
          </div>
        </div>
      </div>
    ),
    size,
  );
}
