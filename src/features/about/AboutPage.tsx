import { DocumentText, Hierarchy, ShieldTick, Cpu, Book1 } from 'iconsax-react'
import { Card } from '@/components/ui/Badge'
import { BrandLockup } from '@/components/branding/BrandLockup'
import { HelpTip } from '@/components/ui/HelpTip'

export function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-5 pb-24 md:pb-8">
      <div>
        <p className="mb-1 text-xs font-semibold uppercase tracking-[0.14em] text-ink-600">
          Informasi produk
        </p>
        <h1 className="font-display text-3xl font-semibold tracking-tight">Tentang StatPlan</h1>
        <div className="mt-4">
          <BrandLockup size="md" />
        </div>
      </div>

      <Card>
        <div className="mb-2 flex items-center gap-2">
          <DocumentText size={18} variant="Bold" color="#0b3a5c" />
          <h2 className="font-semibold">Tujuan</h2>
        </div>
        <p className="text-sm leading-relaxed text-ink-700">
          Membantu OPD menyusun perencanaan kegiatan statistik secara sistematis — dari
          identifikasi kebutuhan hingga draf dokumen — dengan panduan GSBPM 5.2 tanpa
          membebani pengguna dengan jargon teknis.
        </p>
      </Card>

      <Card>
        <div className="mb-2 flex items-center gap-2">
          <ShieldTick size={18} variant="Bold" color="#0b3a5c" />
          <h2 className="font-semibold">Visi</h2>
        </div>
        <p className="text-sm leading-relaxed text-ink-700">
          Menjadi workspace perencanaan statistik sektoral yang dapat diaudit, konsisten dengan
          modul BPS, dan siap didemonstrasikan sebagai sistem produksi pemerintahan daerah.
        </p>
      </Card>

      <Card>
        <h2 className="mb-2 font-semibold">Manfaat</h2>
        <ul className="space-y-2 text-sm text-ink-700">
          <li>• Rekomendasi jenis kegiatan (Survei / Sensus / Kompromin) berbasis aturan modul</li>
          <li>• Checklist GSBPM per fase dengan branching sesuai jenis kegiatan</li>
          <li>• Penyusunan variabel, instrumen, metadata MS-Keg/Var/Ind</li>
          <li>• Ekspor draf dokumen perencanaan (.docx) di perangkat pengguna</li>
        </ul>
      </Card>

      <Card>
        <div className="mb-2 flex items-center gap-2">
          <Cpu size={18} variant="Bold" color="#0b3a5c" />
          <h2 className="font-semibold">Teknologi</h2>
        </div>
        <p className="text-sm leading-relaxed text-ink-700">
          React, TypeScript, Vite, Tailwind CSS, Zustand (persist / localStorage), Framer Motion,
          Iconsax, docx + file-saver. Tidak ada backend pada versi demonstrasi ini.
        </p>
      </Card>

      <Card>
        <div className="mb-2 flex items-center gap-2">
          <Hierarchy size={18} variant="Bold" color="#0b3a5c" />
          <h2 className="font-semibold">Rujukan GSBPM</h2>
          <HelpTip topic="gsbpm" />
        </div>
        <p className="text-sm leading-relaxed text-ink-700">
          Konten fase dan subproses merujuk Materi Proses Bisnis Statistik (GSBPM 5.2) BPS.
          Empat tahap navigasi aplikasi digunakan di atas delapan fase GSBPM (bukan tahap resmi
          dalam Materi Proses Bisnis PDF — di PDF, “portal SDI” merujuk portal Satu Data Indonesia
          pada Specify Need 1.5).
        </p>
      </Card>

      <Card className="border-warning/20 bg-warning-soft/40">
        <div className="mb-2 flex items-center gap-2">
          <Book1 size={18} variant="Bold" color="#b45309" />
          <h2 className="font-semibold">Pernyataan</h2>
        </div>
        <p className="text-sm leading-relaxed text-ink-800">
          StatPlan menghasilkan draf bantu perencanaan. Validasi akhir, pengajuan resmi rekomendasi,
          dan publikasi statistik tetap menjadi kewenangan penyelenggara dan BPS sesuai ketentuan
          yang berlaku. Jangan masukkan data pribadi responden ke dalam workspace.
        </p>
      </Card>

      <Card>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-600">Versi</div>
            <div className="mt-1 font-medium">StatPlan 1.0.0 — Demo BPS Loteng</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-ink-600">
              Pengembang / konteks
            </div>
            <div className="mt-1 font-medium">
              Demonstrasi untuk BPS Kabupaten Lombok Tengah
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
