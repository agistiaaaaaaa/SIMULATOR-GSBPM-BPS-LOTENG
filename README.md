# StatPlan — BPS Lombok Tengah

Platform perencanaan kegiatan statistik berbasis **GSBPM 5.2**.

Bukan modul pelatihan. Workspace produktivitas untuk OPD menyusun proyek statistik
dari kebutuhan hingga draf dokumen (KAK, checklist, instrumen, metadata).

Mesin bisnis merujuk **Materi Proses Bisnis Statistik (BPS)**. Rekomendasi jenis
kegiatan (Survei / Sensus / Kompromin) bersifat **rule-based & auditable** — tidak
mengarang prosedur di luar modul resmi.

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS v4
- Zustand (persist / localStorage)
- Framer Motion, Iconsax
- `docx` + `file-saver` (ekspor client-side)

## Menjalankan

```bash
npm install
npm run dev
npm run build
npm run qa
```

## Hosting (Vercel)

```bash
npx vercel login
npm run deploy:prod
```

Domain target: **`simulator.bpsloteng.net`** (CNAME ke Vercel).  
Panduan lengkap: [`HOSTING.md`](./HOSTING.md)

## Modul

- Landing
- Dashboard proyek
- Asisten perencanaan (rekomendasi jenis + cek cepat GSBPM)
- Project workspace: alur GSBPM, checklist, perancangan (+ Yamane), variabel, instrumen, timeline, metadata, ekspor, tautan berbagi
- Presentasi, Bantuan/SOP, Pengaturan

## Arsitektur singkat

```
src/
  domain/       — GSBPM engine, metadata schema, validation, AI planner rules
  store/        — Zustand app state
  content/      — field guides, how-to, contoh topik
  components/   — UI primitives + shell
  features/     — halaman per fitur
  lib/          — utils, sample size, share link, document generator
```

## Catatan

- Progress tersimpan di `localStorage` (kunci `bps-statplan-v2`).
- Dokumen yang dihasilkan adalah **draf** — validasi akhir bersama BPS.
- Metadata mengikuti arah Perka BPS 5/2020 (MS-Keg / MS-Var / MS-Ind) sebagai draf.
- Fitur berbagi: tombol **Salin tautan berbagi** di workspace (hash `#share=` terkompresi gzip).
- Kalkulator sampel Yamane/Z ada di tab Perancangan (Survei).
- Panel Contoh ilustrasi (per aktivitas fase) ada di tab Alur kerja.
- Deploy: Vercel + SPA rewrite (`vercel.json`). Domain kustom diatur di DNS + dashboard Vercel.
