import { getToken, logout } from "./auth";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3001/api";

// ─── Raw API response types ───────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  initials: string;
  role: string;
  plan: string;
  credits: number;
  totalCredits: number;
  resetDay: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiAuthResponse {
  user: ApiUser;
  accessToken: string;
}

export interface ApiSong {
  id: string;
  userId: string;
  title: string;
  artist: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  duration: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiJobStep {
  id: number;
  label: string;
  status: "done" | "running" | "pending";
  durationMs: number | null;
}

export interface ApiJobProgress {
  jobId: string;
  status: "queued" | "running" | "done" | "failed";
  progress: number;
  etaSeconds: number;
  steps: ApiJobStep[];
  error?: string;
}

export interface ApiAnalysisNote {
  n: string;
  highlight: boolean;
  dim: boolean;
}

export interface ApiAnalysisNoteLine {
  label: string;
  notes: ApiAnalysisNote[];
}

export interface ApiAnalysisChordLine {
  chords: { chord: string; pos: number }[];
  lyrics: string;
}

export interface ApiAnalysisSection {
  section: string;
  lines: ApiAnalysisChordLine[];
}

export interface ApiEasyChord {
  chord: string;
  fingering: string;
}

export interface ApiStructureItem {
  label: string;
  bars: number;
}

export interface ApiAnalysis {
  id: string;
  jobId: string;
  songId: string;
  key: string;
  easyKey: string | null;
  bpm: number;
  capo: number | null;
  timeSignature: string;
  structure: ApiStructureItem[];
  chords: ApiAnalysisSection[];
  notAngka: ApiAnalysisNoteLine[];
  practiceTips: string[];
  easyChords: ApiEasyChord[];
  createdAt: string;
}

export interface ApiUploadInit {
  uploadId: string;
  songId: string;
  uploadUrl: string;
  credits: number;
  expiresIn: number;
}

export interface ApiUploadComplete {
  jobId: string;
  uploadId: string;
  status: string;
  message: string;
}

export interface ApiCheckout {
  id: string;
  userId: string;
  product: string;
  productName: string;
  credits: number;
  amount: number;
  currency: string;
  status: string;
  paymentUrl: string;
  expiresAt: string;
}

export interface ApiAdminKpi {
  label: string;
  value: string;
  delta: string;
  accent: "violet" | "pink";
}

export interface ApiAdminQueue {
  running: number;
  queued: number;
  latencyP95: string;
  failed24h: number;
}

export interface ApiAdminStats {
  range: string;
  kpis: ApiAdminKpi[];
  queue: ApiAdminQueue;
}

export interface ApiAdminJob {
  id: string;
  user: string;
  song: string;
  credits: number;
  status: "done" | "running" | "failed";
  latency: string;
}

export interface ApiAdminRefund {
  id: string;
  user: string;
  song: string;
  error: string;
  credits: number;
}

// ─── Fetch helper ─────────────────────────────────────────────────────────────

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options?.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (res.status === 401) {
    logout();
    if (typeof window !== "undefined") {
      window.location.href = "/masuk";
    }
    throw new Error("Sesi berakhir. Silakan masuk kembali.");
  }

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }

  return res.json() as Promise<T>;
}

// ─── Auth endpoints (no token needed) ─────────────────────────────────────────

async function authFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ─── API functions ────────────────────────────────────────────────────────────

export const api = {
  // Auth
  register: (payload: { name: string; email: string; password: string }) =>
    authFetch<ApiAuthResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  login: (payload: { email: string; password: string }) =>
    authFetch<ApiAuthResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  getAuthMe: () => apiFetch<ApiUser>("/auth/me"),

  // Users
  getCurrentUser: () => apiFetch<ApiUser>("/users/me"),

  // Songs
  getSongs: () => apiFetch<ApiSong[]>("/songs"),

  getSong: (id: string) => apiFetch<ApiSong>(`/songs/${id}`),

  // Upload
  initUpload: (payload: { filename: string; mimeType: string; pkg: string }) =>
    apiFetch<ApiUploadInit>("/upload/init", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  completeUpload: (uploadId: string) =>
    apiFetch<ApiUploadComplete>("/upload/complete", {
      method: "POST",
      body: JSON.stringify({ uploadId }),
    }),

  // Jobs
  getJobProgress: (jobId: string) =>
    apiFetch<ApiJobProgress>(`/jobs/${jobId}/progress`),

  // Analysis
  getAnalysisByJobId: (jobId: string) =>
    apiFetch<ApiAnalysis>(`/analysis/job/${jobId}`),

  // Checkout
  createCheckout: (payload: { product: string }) =>
    apiFetch<ApiCheckout>("/checkout", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Admin
  getAdminStats: (range?: string) =>
    apiFetch<ApiAdminStats>(range ? `/admin/stats?range=${range}` : "/admin/stats"),

  getAdminJobs: (limit?: number) =>
    apiFetch<ApiAdminJob[]>(limit ? `/admin/jobs?limit=${limit}` : "/admin/jobs"),

  getAdminRefunds: () => apiFetch<ApiAdminRefund[]>("/admin/refunds"),

  approveRefund: (jobId: string) =>
    apiFetch<{ jobId: string; action: string }>(`/admin/refunds/${jobId}/approve`, {
      method: "POST",
    }),

  retryJob: (jobId: string) =>
    apiFetch<{ jobId: string; action: string; newJobId: string }>(`/admin/jobs/${jobId}/retry`, {
      method: "POST",
    }),
};
