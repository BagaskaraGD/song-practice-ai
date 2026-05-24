export const MOCK_USER = {
  id: 'user-mock-1',
  email: 'raka@example.com',
  name: 'Raka Pratama',
  initials: 'R',
  plan: 'pro',
  credits: 12,
  totalCredits: 60,
  resetDay: 1,
  createdAt: new Date('2026-01-01'),
  updatedAt: new Date('2026-05-01'),
};

export const MOCK_SONGS = [
  { id: 'song-1', userId: 'user-mock-1', title: 'Tum Hi Ho', artist: 'Arijit Singh', filename: 'tum_hi_ho.mp3', mimeType: 'audio/mpeg', sizeBytes: 5660000, duration: 262, createdAt: new Date('2026-05-20'), updatedAt: new Date('2026-05-20') },
  { id: 'song-2', userId: 'user-mock-1', title: 'Pelukku Gantikan Kehadiranmu', artist: 'Adjie Soetama', filename: 'pelukku.mp3', mimeType: 'audio/mpeg', sizeBytes: 4200000, duration: 215, createdAt: new Date('2026-05-18'), updatedAt: new Date('2026-05-18') },
  { id: 'song-3', userId: 'user-mock-1', title: 'Adu Rayu', artist: 'Yovie, Tulus, Glenn', filename: 'adu_rayu.mp3', mimeType: 'audio/mpeg', sizeBytes: 6100000, duration: 248, createdAt: new Date('2026-05-15'), updatedAt: new Date('2026-05-15') },
  { id: 'song-4', userId: 'user-mock-1', title: 'Hati-Hati di Jalan', artist: 'Tulus', filename: 'hati_hati.mp3', mimeType: 'audio/mpeg', sizeBytes: 5300000, duration: 231, createdAt: new Date('2026-05-12'), updatedAt: new Date('2026-05-12') },
  { id: 'song-5', userId: 'user-mock-1', title: 'Seberapa Jauh', artist: 'Pamungkas', filename: 'seberapa_jauh.mp3', mimeType: 'audio/mpeg', sizeBytes: 4800000, duration: 220, createdAt: new Date('2026-05-10'), updatedAt: new Date('2026-05-10') },
];

export const MOCK_JOBS = [
  { id: 'job-mock-1', userId: 'user-mock-1', songId: 'song-1', pkg: 'full_tips', status: 'done', credits: 5, latencyMs: 48200, errorMsg: null, createdAt: new Date('2026-05-20'), updatedAt: new Date('2026-05-20') },
  { id: 'job-mock-2', userId: 'user-mock-1', songId: 'song-2', pkg: 'full', status: 'done', credits: 4, latencyMs: 41300, errorMsg: null, createdAt: new Date('2026-05-18'), updatedAt: new Date('2026-05-18') },
  { id: 'job-mock-3', userId: 'user-mock-1', songId: 'song-3', pkg: 'original', status: 'running', credits: 2, latencyMs: null, errorMsg: null, createdAt: new Date('2026-05-15'), updatedAt: new Date('2026-05-15') },
  { id: 'job-mock-4', userId: 'user-mock-1', songId: 'song-4', pkg: 'full', status: 'failed', credits: 4, latencyMs: null, errorMsg: 'Tempo detection timeout', createdAt: new Date('2026-05-12'), updatedAt: new Date('2026-05-12') },
];

export const MOCK_ANALYSIS = {
  id: 'analysis-mock-1',
  jobId: 'job-mock-1',
  songId: 'song-1',
  key: 'F#',
  easyKey: 'G',
  bpm: 82,
  capo: 1,
  timeSignature: '4/4',
  structure: [
    { label: 'Intro', bars: 4 },
    { label: 'Verse 1', bars: 8 },
    { label: 'Pre-Chorus', bars: 4 },
    { label: 'Chorus', bars: 8 },
    { label: 'Verse 2', bars: 8 },
    { label: 'Chorus', bars: 8 },
    { label: 'Outro', bars: 4 },
  ],
  chords: [
    {
      section: 'Intro',
      lines: [{ chords: [{ chord: 'G', pos: 0 }, { chord: 'Em', pos: 8 }, { chord: 'C', pos: 16 }, { chord: 'D', pos: 24 }], lyrics: '' }],
    },
    {
      section: 'Verse 1',
      lines: [
        { chords: [{ chord: 'G', pos: 0 }, { chord: 'Em', pos: 12 }], lyrics: 'Hum tere bin ab reh nahin sakte' },
        { chords: [{ chord: 'C', pos: 0 }, { chord: 'D', pos: 12 }], lyrics: 'Tere bina kya wajood mera' },
      ],
    },
    {
      section: 'Chorus',
      lines: [
        { chords: [{ chord: 'G', pos: 0 }, { chord: 'D', pos: 8 }], lyrics: 'Tum hi ho, tum hi ho' },
        { chords: [{ chord: 'Em', pos: 0 }, { chord: 'C', pos: 8 }], lyrics: 'Ab tum hi ho, tum hi ho' },
      ],
    },
  ],
  notAngka: [
    { label: 'Melodi Utama', notes: [{ n: '3', highlight: false, dim: false }, { n: '3', highlight: false, dim: false }, { n: '5', highlight: true, dim: false }, { n: '6', highlight: false, dim: false }, { n: '5', highlight: false, dim: false }, { n: '3', highlight: false, dim: false }, { n: '1', highlight: false, dim: true }] },
    { label: 'Chorus Hook', notes: [{ n: '5', highlight: false, dim: false }, { n: '6', highlight: true, dim: false }, { n: '5', highlight: false, dim: false }, { n: '3', highlight: false, dim: false }, { n: '2', highlight: false, dim: false }, { n: '1', highlight: false, dim: true }, { n: '-', highlight: false, dim: true }] },
  ],
  practiceTips: [
    'Fokus pada transisi G → Em di verse — gunakan posisi capo 1 untuk menghindari barre chord F# asli.',
    'BPM 82 — coba latihan di 65 BPM dulu hingga perubahan akor terasa alami.',
    'Chorus pakai pola strumming D-DU-UDU untuk feel ballad yang lebih kuat.',
    'Pre-chorus Am → D punya feel "naik" — tekan aksen di ketukan 3 untuk dramatik.',
  ],
  easyChords: [
    { chord: 'G', fingering: '320003' },
    { chord: 'Em', fingering: '022000' },
    { chord: 'C', fingering: 'x32010' },
    { chord: 'D', fingering: 'xx0232' },
  ],
  createdAt: new Date('2026-05-20'),
};

export const MOCK_PROCESSING = {
  jobId: 'job-mock-processing',
  status: 'running',
  progress: 45,
  etaSeconds: 32,
  steps: [
    { id: 1, label: 'Unggah & validasi audio', status: 'done', durationMs: 1200 },
    { id: 2, label: 'Deteksi kunci & BPM', status: 'done', durationMs: 8400 },
    { id: 3, label: 'Transkripsi akor', status: 'running', durationMs: null },
    { id: 4, label: 'Notasi & struktur lagu', status: 'pending', durationMs: null },
    { id: 5, label: 'Generate lembar latihan', status: 'pending', durationMs: null },
  ],
};

export const MOCK_ADMIN = {
  kpis: [
    { label: 'Total Pengguna', value: '2.841', delta: '+12% vs bulan lalu', accent: 'violet' },
    { label: 'Analisis Hari Ini', value: '143', delta: '+8% vs kemarin', accent: 'pink' },
    { label: 'Pendapatan Bulan Ini', value: 'Rp 4,2 jt', delta: '+23% vs bulan lalu', accent: 'violet' },
    { label: 'Kredit Terjual', value: '8.920', delta: '+17% vs bulan lalu', accent: 'pink' },
    { label: 'Refund Pending', value: '3', delta: '-2 vs kemarin', accent: 'violet' },
  ],
  queue: {
    running: 7,
    queued: 12,
    latencyP95: '58.2 dtk',
    failed24h: 2,
  },
  recentJobs: [
    { id: 'JOB-7821', user: 'raka@example.com', song: 'Tum Hi Ho', credits: 5, status: 'done', latency: '48.2 dtk' },
    { id: 'JOB-7820', user: 'budi@mail.com', song: 'Pelukku Gantikan...', credits: 4, status: 'done', latency: '41.3 dtk' },
    { id: 'JOB-7819', user: 'sari@example.com', song: 'Adu Rayu', credits: 2, status: 'running', latency: '—' },
    { id: 'JOB-7818', user: 'dani@mail.com', song: 'Hati-Hati di Jalan', credits: 4, status: 'failed', latency: '—' },
    { id: 'JOB-7817', user: 'maya@example.com', song: 'Seberapa Jauh', credits: 1, status: 'done', latency: '22.1 dtk' },
  ],
  refundQueue: [
    { id: 'JOB-7818', user: 'dani@mail.com', song: 'Hati-Hati di Jalan — Tulus', error: 'Timeout', credits: 4 },
    { id: 'JOB-7801', user: 'ferry@mail.com', song: 'Kau Adalah — Isyana', error: 'Low quality', credits: 2 },
    { id: 'JOB-7794', user: 'lina@mail.com', song: 'Cinta Luar Biasa — Andmesh', error: 'Timeout', credits: 5 },
  ],
};
