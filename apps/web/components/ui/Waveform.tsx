interface WaveformProps {
  width?: number;
  height?: number;
  bars?: number;
  seed?: number;
  color?: string;
  gap?: number;
  minH?: number;
  maxH?: number;
  rounded?: boolean;
  id?: string;
}

export default function Waveform({
  width = 800,
  height = 80,
  bars = 64,
  seed = 1,
  color,
  gap = 4,
  minH = 0.1,
  maxH = 1,
  rounded = true,
  id = "wv-grad",
}: WaveformProps) {
  const heights: number[] = [];
  let x = seed * 9.137;
  for (let i = 0; i < bars; i++) {
    x = Math.sin(x * 12.9898 + i * 78.233) * 43758.5453;
    const v = x - Math.floor(x);
    const env = 0.55 + 0.45 * Math.sin((i / bars) * Math.PI * 2 + seed);
    heights.push(Math.max(minH, Math.min(maxH, v * env * maxH + minH)));
  }
  const totalGap = gap * (bars - 1);
  const bw = (width - totalGap) / bars;
  const fillColor = color ?? `url(#${id})`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" style={{ display: "block" }}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop offset="0" stopColor="#f472b6" />
          <stop offset=".5" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      {heights.map((h, i) => {
        const barH = h * height;
        const y = (height - barH) / 2;
        return (
          <rect
            key={i}
            x={i * (bw + gap)}
            y={y}
            width={bw}
            height={barH}
            rx={rounded ? bw / 2 : 0}
            fill={fillColor}
          />
        );
      })}
    </svg>
  );
}
