# SongPractice AI

Aplikasi analisis lagu berbasis AI untuk musisi Indonesia. Upload audio → dapatkan chord sheet, not angka, dan tips latihan dalam ~13 detik.

## Stack

| Layer | Teknologi |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | NestJS 11, TypeScript |
| Database | PostgreSQL + Prisma 7 |
| Queue | Redis + BullMQ |
| Storage | S3-compatible (MinIO untuk dev, Cloudflare R2 / AWS S3 untuk prod) |
| Auth | JWT (7 hari), bcrypt |

## Struktur Proyek

```
apps/
  api/        NestJS backend
  web/        Next.js frontend
docker-compose.yml   Redis + MinIO untuk local dev
```

## Prasyarat

- Node.js 20+
- Docker Desktop
- PostgreSQL (lokal atau Docker)

## Setup Local Dev

### 1. Clone dan install dependencies

```bash
git clone <repo-url>
cd song-practice-ai

cd apps/api && npm install
cd ../web && npm install
```

### 2. Konfigurasi environment

```bash
# Backend
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env sesuai konfigurasi lokal
```

Isi minimal `apps/api/.env`:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/songpractice_dev?schema=public"
PORT=3001
CORS_ORIGIN="http://localhost:3000"
JWT_SECRET="ganti-ini-di-production"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# MinIO (local dev)
S3_ENDPOINT="http://localhost:9000"
S3_REGION="us-east-1"
S3_BUCKET="songpractice"
S3_ACCESS_KEY_ID="minioadmin"
S3_SECRET_ACCESS_KEY="minioadmin"
```

### 3. Jalankan infrastruktur (Redis + MinIO)

```bash
docker compose up -d
```

Ini menjalankan:
- **Redis** di port `6379` — queue untuk background worker
- **MinIO** di port `9000` (API) dan `9001` (dashboard) — object storage
- **createbuckets** — sidecar yang membuat bucket `songpractice` otomatis

Cek status:

```bash
docker compose ps
```

MinIO dashboard: http://localhost:9001 (login: `minioadmin` / `minioadmin`)

### 4. Setup database

```bash
cd apps/api

# Jalankan migrations
npx prisma migrate dev

# Seed data (2 user + 5 lagu contoh)
npm run db:seed
```

Akun seed:

| Email | Password | Role |
|---|---|---|
| `raka@example.com` | `password123` | user (45 kredit) |
| `admin@songpractice.ai` | `admin123` | admin (999 kredit) |

Reset database (migrate:fresh + seed):

```bash
npx prisma migrate reset --force
```

### 5. Jalankan API

```bash
cd apps/api
npm run start:dev
```

API berjalan di http://localhost:3001

Worker BullMQ berjalan **di dalam proses yang sama** dengan API. Saat job analisis masuk ke queue, processor otomatis pick up dan proses.

> **Catatan produksi:** Worker sebaiknya dipisah menjadi proses/container sendiri agar API tidak terbebani saat memproses audio berat.

### 6. Jalankan Frontend

```bash
cd apps/web
npm run dev
```

Frontend berjalan di http://localhost:3000

## Cara Kerja Queue

```
User upload audio
  → POST /api/upload/complete
  → DB: Song + Job (status: queued) dibuat
  → BullMQ job di-enqueue ke Redis (queue: "analysis")
  → Response: { jobId }

Frontend polling GET /api/jobs/:id/progress setiap 2 detik
  → status: queued → running → done

Worker (AnalysisProcessor):
  → Pick up job dari Redis
  → Update Job status = running
  → Simulate 5 langkah (~13 detik total)
  → Simpan hasil analisis ke tabel analyses
  → Update Job status = done
  → Jika gagal: status = failed, refund kredit otomatis (percobaan terakhir)

Frontend detect status = done
  → Fetch GET /api/analysis/job/:jobId
  → Tampilkan chord sheet + not angka + tips
```

## Perintah Berguna

```bash
# API
npm run start:dev       # dev mode dengan watch
npm run build           # production build
npm run lint            # ESLint
npx prisma studio       # GUI database browser
npx prisma migrate dev  # jalankan migration baru
npm run db:seed         # seed data

# Docker
docker compose up -d              # jalankan semua service
docker compose up -d redis minio  # hanya Redis + MinIO
docker compose down               # stop semua
docker compose ps                 # cek status
```

## Status Implementasi

| Fitur | Status |
|---|---|
| Auth (JWT, register, login) | Selesai |
| Upload audio ke S3/MinIO | Selesai |
| Queue + worker (BullMQ + Redis) | Selesai |
| Analisis mock (placeholder) | Selesai |
| Halaman hasil (chord, not angka, tips) | Selesai |
| Admin dashboard | Selesai |
| **Real AI analisis chord/BPM** | Belum |
| **Payment (Midtrans/Xendit)** | Belum |
| **PDF generation** | Belum |
| **Email verifikasi / reset password** | Belum |
