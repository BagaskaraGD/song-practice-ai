export const mockUser = {
  name: "Raka",
  initials: "R",
  credits: 12,
  totalCredits: 60,
  plan: "Pro · Bulanan",
  resetDays: 18,
};

export const mockSongs = [
  { id: "1", title: "Tum Hi Ho", artist: "Arijit Singh", key: "F# Major", bpm: 82, pkg: "Lembar Lengkap", date: "24 Mei", status: "done" as const },
  { id: "2", title: "Perfect", artist: "Ed Sheeran", key: "Ab Major", bpm: 95, pkg: "Original + Mudah", date: "23 Mei", status: "done" as const },
  { id: "3", title: "Pelan-Pelan Saja", artist: "Kotak", key: "C Major", bpm: 118, pkg: "Lembar Lengkap", date: "22 Mei", status: "processing" as const },
  { id: "4", title: "How Great Is Our God", artist: "Chris Tomlin", key: "G Major", bpm: 78, pkg: "Lembar Lengkap", date: "21 Mei", status: "done" as const },
  { id: "5", title: "Akad", artist: "Payung Teduh", key: "Em", bpm: 106, pkg: "Akor Mudah", date: "19 Mei", status: "done" as const },
  { id: "6", title: "Bukan Cinta Biasa", artist: "Afgan", key: "D Major", bpm: 84, pkg: "Original + Mudah", date: "18 Mei", status: "failed" as const },
  { id: "7", title: "Yang Terdalam", artist: "Peterpan", key: "A Major", bpm: 88, pkg: "Lembar Lengkap", date: "15 Mei", status: "done" as const },
];

export const mockResult = {
  title: "Tum Hi Ho",
  artist: "Arijit Singh",
  duration: "4:22",
  uploadDate: "24 Mei 2026",
  keyDetected: "F#",
  keyScale: "Major",
  keyConfidence: "confidence 94%",
  tempo: "82",
  tempoSub: "BPM · 4/4",
  tempoNote: "rentang stabil",
  easyKey: "G",
  easyKeySub: "Major · pakai Capo 1",
  easyKeyNote: "ramah pemula",
  scale: "F# Ionian",
  scaleSub: "6 # · enharm. Gb",
  scaleNote: "mayor diatonis",
  analysisTime: "48 detik",
  creditsUsed: 4,
  easyChords: [
    { chord: "G", degree: "I" },
    { chord: "D", degree: "V" },
    { chord: "Em", degree: "vi" },
    { chord: "C", degree: "IV" },
  ],
  structure: [
    { section: "Intro", time: "0:00 – 0:14", color: "rgba(167,139,250,.5)", prog: "G – D – Em – C" },
    { section: "Verse 1", time: "0:14 – 1:02", color: "rgba(244,114,182,.45)", prog: "G – D – Em – C" },
    { section: "Chorus", time: "1:02 – 1:40", color: "rgba(99,102,241,.65)", prog: "C – G – D – Em" },
    { section: "Verse 2", time: "1:40 – 2:18", color: "rgba(244,114,182,.45)", prog: "G – D – Em – C" },
    { section: "Chorus", time: "2:18 – 2:34", color: "rgba(99,102,241,.65)", prog: "C – G – D – Em" },
    { section: "Bridge", time: "2:34 – 3:24", color: "rgba(167,139,250,.6)", prog: "Em – C – G – D" },
    { section: "Outro", time: "3:24 – 4:22", color: "rgba(167,139,250,.35)", prog: "G – D" },
  ],
  practiceTips: [
    "Mulai dengan akor mudah di G, baru pindah ke F# saat transisi Em → C terasa lancar.",
    "Strumming pattern: D D U U D U — perhatikan pukulan up pada hitungan 2.5 dan 4.5.",
    "Bagian Chorus pakai dinamika lebih kencang; di Bridge turunkan volume untuk kontras.",
    "Untuk vokalis, range melodi C4–G5 — kalau terlalu tinggi, transpose −2 (E Major).",
  ],
  notAngka: [
    { label: "Intro", notes: ["3","5","6","5","3","2","1"], highlight: [] as number[], dim: false },
    { label: "Verse", notes: ["5","6","1̇","1̇","7","6","5","—","5","6","1̇","7","6","5"], highlight: [2,3,10], dim: false },
    { label: "Chorus", notes: ["1̇","7","6","5","3","5","6","—","1̇","7","6","5","6","5"], highlight: [0,8], dim: false },
    { label: "Bridge", notes: ["3̣","5̣","1","3","2","1","7̣","—"], highlight: [] as number[], dim: true },
  ],
};

export const mockProcessing = {
  title: "Tum Hi Ho — Arijit Singh",
  duration: "4:22",
  pkg: "Lembar Latihan Lengkap",
  credits: 4,
  steps: [
    { title: "Unggahan diterima", desc: "File terverifikasi · 5.4 MB", status: "done" as const, time: "0:08" },
    { title: "Mendeteksi kunci & BPM", desc: "F# Major · 82 BPM terdeteksi", status: "done" as const, time: "0:15" },
    { title: "Memperkirakan akor", desc: "Memproses chord progression frame-by-frame", status: "active" as const, time: "0:23" },
    { title: "Membuat versi mudah", desc: "Transposisi + saran capo", status: "pending" as const, time: "— —" },
    { title: "Menyusun lembar latihan", desc: "Not Angka, struktur lagu, tips", status: "pending" as const, time: "— —" },
  ],
  progress: 45,
  eta: 32,
};

export const mockAdmin = {
  kpis: [
    { label: "Total Pengguna", value: "4.847", delta: "+22%", accent: "violet" as const },
    { label: "Lagu Dianalisis", value: "12.4rb", delta: "+18%", accent: "pink" as const },
    { label: "Pendapatan (7 hari)", value: "Rp 14.2jt", delta: "+31%", accent: "violet" as const },
    { label: "Tingkat Sukses", value: "97.3%", delta: "+0.4%", accent: "pink" as const },
    { label: "Job Gagal", value: "38", delta: "-12%", accent: "violet" as const },
  ],
  queue: {
    running: 7,
    queued: 12,
    latencyP95: "48 dtk",
    failed24h: 3,
  },
  recentJobs: [
    { id: "j-8821", user: "raka@email.com", song: "Tum Hi Ho", credits: 4, status: "done" as const, latency: "42 dtk" },
    { id: "j-8820", user: "sinta@gmail.com", song: "Perfect", credits: 2, status: "done" as const, latency: "38 dtk" },
    { id: "j-8819", user: "budi.k@yahoo.com", song: "How Great Is Our God", credits: 5, status: "running" as const, latency: "31 dtk" },
    { id: "j-8818", user: "dewi@music.id", song: "Akad", credits: 4, status: "done" as const, latency: "55 dtk" },
    { id: "j-8817", user: "andre.w@gmail.com", song: "Bukan Cinta Biasa", credits: 4, status: "failed" as const, latency: "—" },
  ],
  refundQueue: [
    { id: "j-8812", user: "alan@studio.id", song: "Semua Tentang Kita", credits: 4, error: "ERR_DETECT" },
    { id: "j-8809", user: "lani@worship.id", song: "Amazing Grace (Live)", credits: 5, error: "ERR_TIMEOUT" },
    { id: "j-8801", user: "tommy.s@email.com", song: "Numb.wma", credits: 2, error: "ERR_FORMAT" },
  ],
};
