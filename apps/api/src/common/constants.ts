export const DEV_USER_ID = 'dev-user-1';

export const PKG_CREDITS: Record<string, number> = {
  easy: 1,
  original: 2,
  full: 4,
  full_tips: 5,
};

export const JOB_STEPS = [
  { label: 'Unggahan diterima', thresholdSec: 5 },
  { label: 'Mendeteksi kunci & BPM', thresholdSec: 10 },
  { label: 'Memperkirakan akor', thresholdSec: 15 },
  { label: 'Membuat versi mudah', thresholdSec: 20 },
  { label: 'Menyusun lembar latihan', thresholdSec: 25 },
];

export const JOB_COMPLETE_SEC = 25;

export const DEFAULT_ANALYSIS_DATA = {
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
      lines: [
        {
          chords: [
            { chord: 'G', pos: 0 },
            { chord: 'Em', pos: 8 },
            { chord: 'C', pos: 16 },
            { chord: 'D', pos: 24 },
          ],
          lyrics: '',
        },
      ],
    },
    {
      section: 'Verse 1',
      lines: [
        {
          chords: [
            { chord: 'G', pos: 0 },
            { chord: 'Em', pos: 12 },
          ],
          lyrics: 'Hum tere bin ab reh nahin sakte',
        },
        {
          chords: [
            { chord: 'C', pos: 0 },
            { chord: 'D', pos: 12 },
          ],
          lyrics: 'Tere bina kya wajood mera',
        },
      ],
    },
    {
      section: 'Chorus',
      lines: [
        {
          chords: [
            { chord: 'G', pos: 0 },
            { chord: 'D', pos: 8 },
          ],
          lyrics: 'Tum hi ho, tum hi ho',
        },
        {
          chords: [
            { chord: 'Em', pos: 0 },
            { chord: 'C', pos: 8 },
          ],
          lyrics: 'Ab tum hi ho, tum hi ho',
        },
      ],
    },
  ],
  notAngka: [
    {
      label: 'Melodi Utama',
      notes: [
        { n: '3', highlight: false, dim: false },
        { n: '3', highlight: false, dim: false },
        { n: '5', highlight: true, dim: false },
        { n: '6', highlight: false, dim: false },
        { n: '5', highlight: false, dim: false },
        { n: '3', highlight: false, dim: false },
        { n: '1', highlight: false, dim: true },
      ],
    },
    {
      label: 'Chorus Hook',
      notes: [
        { n: '5', highlight: false, dim: false },
        { n: '6', highlight: true, dim: false },
        { n: '5', highlight: false, dim: false },
        { n: '3', highlight: false, dim: false },
        { n: '2', highlight: false, dim: false },
        { n: '1', highlight: false, dim: true },
        { n: '—', highlight: false, dim: true },
      ],
    },
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
};
