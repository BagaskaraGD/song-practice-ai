export default function Capo({ size = 20, stroke = "currentColor" }: { size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="9" width="14" height="6" rx="3" />
      <path d="M9 6v3M12 6v3M15 6v3M9 15v3M12 15v3M15 15v3" />
    </svg>
  );
}
