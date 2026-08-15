# Deploy & Hosting — StatPlan (BPS Lombok Tengah)

Target domain (README BPS): **`simulator.bpsloteng.net`**

Stack: Vite SPA → **Vercel** (zero backend).

## 1. Deploy cepat (CLI)

Di folder proyek:

```bash
npm install
npm run build
npx vercel login
npx vercel --yes
```

Production:

```bash
npm run deploy:prod
```

atau:

```bash
npx vercel --prod --yes
```

Setelah sukses, Vercel memberi URL `https://….vercel.app`.

## 2. Domain kustom `simulator.bpsloteng.net`

1. Di dashboard Vercel → Project → **Settings → Domains** → tambah `simulator.bpsloteng.net`.
2. Di DNS domain `bpsloteng.net` (penyedia DNS Anda), buat:

| Type  | Name        | Value                         |
|-------|-------------|-------------------------------|
| CNAME | `simulator` | `cname.vercel-dns.com`        |

   (Ikuti nilai yang ditampilkan Vercel bila berbeda.)

3. Tunggu propagasi DNS (bisa beberapa menit–jam), lalu verifikasi di Vercel.

## 3. GitHub Actions (opsional)

Workflow: `.github/workflows/deploy-vercel.yml`

Secrets yang diperlukan di repo GitHub:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

Dapatkan dari `vercel link` / dashboard Vercel.

## 4. Checklist go-live

- [ ] `npm run build` lulus
- [ ] `npm run qa` lulus
- [ ] Deploy preview OK
- [ ] Deploy production OK
- [ ] Domain CNAME aktif (HTTPS otomatis di Vercel)
- [ ] Uji: Landing → Beranda → Proyek demo → Ekspor draf
- [ ] Uji: Tautan berbagi `#share=`
- [ ] Uji refresh di `/app/projects/...` (SPA rewrite)

## 5. Catatan

- Tidak ada backend/API key di client.
- Data pengguna tetap di `localStorage` browser masing-masing.
- Dokumen ekspor = **draf**; validasi akhir bersama BPS.
