import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';
import { DEFAULT_ANALYSIS_DATA } from '../src/common/constants';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  console.log('🌱 Seeding database...');

  const userHash = await bcrypt.hash('password123', 10);
  const adminHash = await bcrypt.hash('admin123', 10);

  const user = await prisma.user.upsert({
    where: { id: 'dev-user-1' },
    update: { passwordHash: userHash, role: 'user' },
    create: {
      id: 'dev-user-1',
      email: 'raka@example.com',
      name: 'Raka Pratama',
      initials: 'RP',
      passwordHash: userHash,
      role: 'user',
      plan: 'pro',
      credits: 45,
      totalCredits: 60,
      resetDay: 1,
    },
  });
  console.log(`  ✓ User: ${user.name} (${user.id})`);

  const admin = await prisma.user.upsert({
    where: { id: 'dev-admin-1' },
    update: { passwordHash: adminHash, role: 'admin' },
    create: {
      id: 'dev-admin-1',
      email: 'admin@songpractice.ai',
      name: 'Admin SongPractice',
      initials: 'AS',
      passwordHash: adminHash,
      role: 'admin',
      plan: 'admin',
      credits: 999,
      totalCredits: 999,
      resetDay: 1,
    },
  });
  console.log(`  ✓ Admin: ${admin.name} (${admin.id})`);

  const songs = [
    { id: 'song-mock-1', title: 'Tum Hi Ho', artist: 'Arijit Singh', filename: 'tum_hi_ho.mp3', mimeType: 'audio/mpeg', sizeBytes: 5660000, duration: 262 },
    { id: 'song-mock-2', title: 'Pelukku Gantikan Kehadiranmu', artist: 'Adjie Soetama', filename: 'pelukku.mp3', mimeType: 'audio/mpeg', sizeBytes: 4200000, duration: 215 },
    { id: 'song-mock-3', title: 'Adu Rayu', artist: 'Yovie, Tulus, Glenn', filename: 'adu_rayu.mp3', mimeType: 'audio/mpeg', sizeBytes: 6100000, duration: 248 },
    { id: 'song-mock-4', title: 'Hati-Hati di Jalan', artist: 'Tulus', filename: 'hati_hati.mp3', mimeType: 'audio/mpeg', sizeBytes: 5300000, duration: 231 },
    { id: 'song-mock-5', title: 'Perfect', artist: 'Ed Sheeran', filename: 'perfect.mp3', mimeType: 'audio/mpeg', sizeBytes: 4800000, duration: 263 },
  ];

  for (const s of songs) {
    await prisma.song.upsert({
      where: { id: s.id },
      update: {},
      create: { ...s, userId: 'dev-user-1' },
    });
    console.log(`  ✓ Song: ${s.title}`);
  }

  const now = new Date();
  const jobs = [
    { id: 'job-mock-1', songId: 'song-mock-1', pkg: 'full_tips', status: 'done' as const, credits: 5, latencyMs: 48200, errorMsg: null, createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000) },
    { id: 'job-mock-2', songId: 'song-mock-2', pkg: 'full', status: 'done' as const, credits: 4, latencyMs: 41300, errorMsg: null, createdAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000) },
    { id: 'job-mock-3', songId: 'song-mock-3', pkg: 'original', status: 'running' as const, credits: 2, latencyMs: null, errorMsg: null, createdAt: new Date(now.getTime() - 5000) },
    { id: 'job-mock-4', songId: 'song-mock-4', pkg: 'full', status: 'failed' as const, credits: 4, latencyMs: null, errorMsg: 'Tempo detection timeout', createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000) },
    { id: 'job-mock-5', songId: 'song-mock-5', pkg: 'easy', status: 'done' as const, credits: 1, latencyMs: 22100, errorMsg: null, createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000) },
  ];

  for (const j of jobs) {
    await prisma.job.upsert({
      where: { id: j.id },
      update: { status: j.status },
      create: { ...j, userId: 'dev-user-1' },
    });
    console.log(`  ✓ Job: ${j.id} [${j.status}]`);
  }

  const analyses = [
    { id: 'analysis-mock-1', jobId: 'job-mock-1', songId: 'song-mock-1', ...DEFAULT_ANALYSIS_DATA },
    {
      id: 'analysis-mock-2',
      jobId: 'job-mock-2',
      songId: 'song-mock-2',
      key: 'C',
      easyKey: 'C',
      bpm: 76,
      capo: null,
      timeSignature: '4/4',
      structure: [
        { label: 'Intro', bars: 4 },
        { label: 'Verse 1', bars: 8 },
        { label: 'Chorus', bars: 8 },
        { label: 'Verse 2', bars: 8 },
        { label: 'Chorus', bars: 8 },
        { label: 'Outro', bars: 4 },
      ],
      chords: [{ section: 'Verse 1', lines: [{ chords: [{ chord: 'C', pos: 0 }, { chord: 'Am', pos: 8 }], lyrics: 'Pelukku gantikan kehadiranmu' }] }],
      notAngka: [{ label: 'Melodi', notes: [{ n: '1', highlight: false, dim: false }, { n: '3', highlight: true, dim: false }, { n: '5', highlight: false, dim: false }] }],
      practiceTips: ['Kunci C sangat cocok untuk pemula tanpa capo.', 'BPM 76 — tempo lambat, fokus pada ekspresi dinamika.'],
      easyChords: [{ chord: 'C', fingering: 'x32010' }, { chord: 'Am', fingering: 'x02210' }, { chord: 'F', fingering: 'xx3211' }, { chord: 'G', fingering: '320003' }],
    },
    {
      id: 'analysis-mock-5',
      jobId: 'job-mock-5',
      songId: 'song-mock-5',
      key: 'Ab',
      easyKey: 'G',
      bpm: 95,
      capo: 1,
      timeSignature: '4/4',
      structure: [
        { label: 'Intro', bars: 4 },
        { label: 'Verse 1', bars: 8 },
        { label: 'Chorus', bars: 8 },
        { label: 'Bridge', bars: 4 },
        { label: 'Outro', bars: 4 },
      ],
      chords: [{ section: 'Chorus', lines: [{ chords: [{ chord: 'G', pos: 0 }, { chord: 'D', pos: 8 }, { chord: 'Em', pos: 16 }, { chord: 'C', pos: 24 }], lyrics: "You're perfect" }] }],
      notAngka: [{ label: 'Chorus', notes: [{ n: '1', highlight: true, dim: false }, { n: '5', highlight: false, dim: false }, { n: '3', highlight: false, dim: false }] }],
      practiceTips: ['Gunakan capo 1 untuk kunci asli Ab.', 'Chorus punya power chord feel — strumming penuh.'],
      easyChords: [{ chord: 'G', fingering: '320003' }, { chord: 'D', fingering: 'xx0232' }, { chord: 'Em', fingering: '022000' }, { chord: 'C', fingering: 'x32010' }],
    },
  ];

  for (const a of analyses) {
    await prisma.analysis.upsert({
      where: { id: a.id },
      update: {},
      create: a,
    });
    console.log(`  ✓ Analysis: ${a.id}`);
  }

  const txns = [
    { id: 'txn-1', userId: 'dev-user-1', amount: 60, type: 'purchase' as const, description: 'Paket Pro Bulanan', refId: null },
    { id: 'txn-2', userId: 'dev-user-1', amount: -5, type: 'deduct' as const, description: 'Analisis: Tum Hi Ho (full_tips)', refId: 'job-mock-1' },
    { id: 'txn-3', userId: 'dev-user-1', amount: -4, type: 'deduct' as const, description: 'Analisis: Pelukku Gantikan... (full)', refId: 'job-mock-2' },
    { id: 'txn-4', userId: 'dev-user-1', amount: -4, type: 'deduct' as const, description: 'Analisis: Hati-Hati di Jalan (full) — gagal', refId: 'job-mock-4' },
    { id: 'txn-5', userId: 'dev-user-1', amount: 4, type: 'refund' as const, description: 'Refund: Hati-Hati di Jalan — timeout', refId: 'job-mock-4' },
    { id: 'txn-6', userId: 'dev-user-1', amount: -1, type: 'deduct' as const, description: 'Analisis: Perfect (easy)', refId: 'job-mock-5' },
  ];

  for (const t of txns) {
    await prisma.creditTransaction.upsert({
      where: { id: t.id },
      update: {},
      create: t,
    });
  }
  console.log(`  ✓ CreditTransactions: ${txns.length} records`);

  console.log('\n✅ Seed complete.');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
