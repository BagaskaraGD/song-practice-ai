interface OrbProps {
  size?: number;
  color?: string;
  x?: string;
  y?: string;
  opacity?: number;
  blur?: number;
}

export default function Orb({ size = 600, color = "#a78bfa", x = "50%", y = "50%", opacity = 0.5, blur = 80 }: OrbProps) {
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: size,
        height: size,
        transform: "translate(-50%,-50%)",
        background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
        filter: `blur(${blur}px)`,
        opacity: `calc(${opacity} * var(--glow))`,
        pointerEvents: "none",
      }}
    />
  );
}
