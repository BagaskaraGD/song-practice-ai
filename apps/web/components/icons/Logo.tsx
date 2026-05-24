export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="logo-grad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#f472b6" />
          <stop offset=".55" stopColor="#a78bfa" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path d="M5 22V8.5l14-3v13" stroke="url(#logo-grad)" strokeWidth="2.2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx="6.5" cy="22.5" r="3.2" fill="url(#logo-grad)" />
      <circle cx="20.5" cy="19.5" r="3.2" fill="url(#logo-grad)" />
      <path d="M23 11l4-2v8" stroke="url(#logo-grad)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".7" />
    </svg>
  );
}
