import Orb from "./Orb";

interface BackgroundProps {
  orbs?: Array<{
    size?: number;
    color?: string;
    x?: string;
    y?: string;
    opacity?: number;
    blur?: number;
  }>;
}

const defaultOrbs = [
  { size: 900, color: "#a78bfa", x: "22%", y: "40%", opacity: 0.55, blur: 120 },
  { size: 760, color: "#f472b6", x: "80%", y: "22%", opacity: 0.5, blur: 110 },
  { size: 500, color: "#6366f1", x: "50%", y: "90%", opacity: 0.35, blur: 100 },
];

export default function Background({ orbs = defaultOrbs }: BackgroundProps) {
  return (
    <>
      <div className="sp-bg" />
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden" }}>
        {orbs.map((orb, i) => (
          <Orb key={i} {...orb} />
        ))}
      </div>
      <div className="sp-grain" />
    </>
  );
}
