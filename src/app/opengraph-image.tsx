import { ImageResponse } from "next/og";

export const alt = "MotionQL: the MongoDB IDE you won't outgrow";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 80,
        background: "radial-gradient(80% 90% at 20% 0%, #0b6e6a 0%, #0b1018 60%)",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 40, fontWeight: 600 }}>
        <div style={{ width: 72, height: 72, borderRadius: 18, background: "linear-gradient(135deg,#0FA37F,#10254A)", display: "flex" }} />
        MotionQL
      </div>
      <div style={{ marginTop: 48, fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3 }}>The MongoDB IDE</div>
      <div style={{ fontSize: 84, fontWeight: 700, lineHeight: 1.02, letterSpacing: -3, color: "#5EE0A8" }}>you won&apos;t outgrow.</div>
      <div style={{ marginTop: 36, fontSize: 30, color: "#a9b8c8" }}>Free Pro license for 12 months · macOS, Windows, Linux</div>
    </div>,
    size,
  );
}
