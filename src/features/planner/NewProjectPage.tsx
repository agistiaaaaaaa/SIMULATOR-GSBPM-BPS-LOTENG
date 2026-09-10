import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MagicStar, ArrowRight2, InfoCircle } from 'iconsax-react'
import { recommendJenisKegiatan } from '@/domain/aiPlanner'
import { useAppStore } from '@/store/appStore'
import { toast } from '@/store/toastStore'
import type { Klasifikasi } from '@/domain/types'
import { Button } from '@/components/ui/Button'
import { Card, Badge } from '@/components/ui/Badge'
import { Field, Input, Label, Select, Textarea } from '@/components/ui/Field'
import { jenisLabel } from '@/lib/utils'

export function NewProjectPage() {
  const navigate = useNavigate()
  const createProject = useAppStore((s) => s.createProject)

  const [name, setName] = useState('')
  const [topik, setTopik] = useState('')
  const [description, setDescription] = useState('')
  const [klasifikasi, setKlasifikasi] = useState<Klasifikasi>('sektoral')
  const [estimasiAnggaran, setEstimasiAnggaran] = useState('')
  const [dataAvailable, setDataAvailable] = useState<'unknown' | 'yes' | 'no'>('unknown')
  const [needCoverage, setNeedCoverage] = useState<'sample' | 'full' | 'admin'>('sample')
  const [step, setStep] = useState<1 | 2>(1)

  const preview = useMemo(
    () =>
      recommendJenisKegiatan({
        description: `${name} ${description} ${topik}`,
        dataAvailable: dataAvailable === 'unknown' ? undefined : dataAvailable === 'yes',
        needCoverage,
      }),
    [name, description, topik, dataAvailable, needCoverage],
  )

  const canContinue = name.trim().length > 2 && topik.trim().length > 1 && description.trim().length > 10

  function handleCreate() {
    const project = createProject({
      name,
      topik,
      description,
      klasifikasi,
      estimasiAnggaran,
      dataAvailable: dataAvailable === 'unknown' ? undefined : dataAvailable === 'yes',
      needCoverage,
    })
    toast('Proyek berhasil dibuat')
    navigate(`/app/projects/${project.id}`)
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-ink-100 px-3 py-1 text-sm font-medium text-ink-800 ring-1 ring-ink-900/5">
          <MagicStar size={16} variant="Bold" color="currentColor" />
          Asisten perencanaan
        </div>
        <h1 className="font-display text-3xl font-semibold tracking-tight">
          Proyek statistik baru
        </h1>
        <p className="mt-2 text-ink-700">
          Ceritakan kebutuhan Anda dengan bahasa sehari-hari. Sistem akan menyarankan
          jenis kegiatan berdasarkan modul BPS.
        </p>
      </div>

      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs font-medium text-ink-600">
          <span>{step === 1 ? 'Langkah 1 · Identitas kebutuhan' : 'Langkah 2 · Rekomendasi'}</span>
          <span>
            {step}/2
          </span>
        </div>
        <div className="flex gap-2">
          {[1, 2].map((n) => (
            <div
              key={n}
              className={`h-1.5 flex-1 rounded-full ${step >= n ? 'bg-ink-900' : 'bg-ink-100'}`}
              aria-hidden
            />
          ))}
        </div>
      </div>

      {step === 1 ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="space-y-5">
            <Field>
              <Label htmlFor="name">Nama kegiatan</Label>
              <Input
                id="name"
                placeholder="Contoh: Survei Kepuasan Pelayanan Dinas X 2026"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="topik">Topik / domain</Label>
              <Input
                id="topik"
                placeholder="Contoh: UMKM, kependudukan, pendidikan, kesehatan"
                value={topik}
                onChange={(e) => setTopik(e.target.value)}
              />
            </Field>
            <Field>
              <Label htmlFor="desc" hint="Minimal 10 karakter">
                Kebutuhan & konteks
              </Label>
              <Textarea
                id="desc"
                placeholder="Apa yang ingin diukur? Untuk siapa? Apakah data administratif sudah tersedia di dinas/portal SDI?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field>
                <Label htmlFor="klasifikasi">Klasifikasi</Label>
                <Select
                  id="klasifikasi"
                  value={klasifikasi}
                  onChange={(e) => setKlasifikasi(e.target.value as Klasifikasi)}
                >
                  <option value="dasar">Statistik dasar</option>
                  <option value="sektoral">Statistik sektoral</option>
                  <option value="khusus">Statistik khusus</option>
                </Select>
              </Field>
              <Field>
                <Label htmlFor="coverage">Cakupan yang dibutuhkan</Label>
                <Select
                  id="coverage"
                  value={needCoverage}
                  onChange={(e) =>
                    setNeedCoverage(e.target.value as 'sample' | 'full' | 'admin')
                  }
                >
                  <option value="sample">Sampel / sebagian unit</option>
                  <option value="full">Pendataan lengkap seluruh unit</option>
                  <option value="admin">Data administratif yang sudah ada</option>
                </Select>
              </Field>
            </div>
            <Field>
              <Label htmlFor="available">Apakah data sudah tersedia di portal/dinas?</Label>
              <Select
                id="available"
                value={dataAvailable}
                onChange={(e) =>
                  setDataAvailable(e.target.value as 'unknown' | 'yes' | 'no')
                }
              >
                <option value="unknown">Belum dicek / belum tahu</option>
                <option value="yes">Ya, data sudah ada dan relevan</option>
                <option value="no">Tidak, perlu pengumpulan baru</option>
              </Select>
            </Field>
            <Field>
              <Label htmlFor="budget" hint="Opsional">
                Estimasi anggaran
              </Label>
              <Input
                id="budget"
                placeholder="Contoh: Rp 75.000.000 (perencanaan)"
                value={estimasiAnggaran}
                onChange={(e) => setEstimasiAnggaran(e.target.value)}
              />
            </Field>
            <div className="flex flex-col items-end gap-1.5 pt-2">
              {!canContinue ? (
                <p className="text-xs text-ink-600">
                  Lengkapi nama (≥3), topik (≥2), dan deskripsi (≥10 karakter) untuk melanjutkan.
                </p>
              ) : null}
              <Button
                disabled={!canContinue}
                tooltip={
                  !canContinue
                    ? 'Isi nama, topik, dan deskripsi minimal 10 karakter'
                    : 'Lanjut ke rekomendasi jenis kegiatan'
                }
                rightIcon={<ArrowRight2 size={16} variant="Bold" color="currentColor" />}
                onClick={() => setStep(2)}
              >
                Lihat rekomendasi
              </Button>
            </div>
          </Card>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <Card>
            <div className="mb-4 flex flex-wrap items-center gap-2">
              <Badge tone="brand">Rekomendasi</Badge>
              <Badge tone="gold">
                Keyakinan {Math.round(preview.confidence * 100)}%
              </Badge>
            </div>
            <h2 className="text-2xl font-semibold text-ink-950">
              {jenisLabel(preview.jenis)}
            </h2>
            <p className="mt-2 text-sm text-ink-700">
              Rekomendasi ini disusun secara deterministik dari aturan modul BPS
              (Specify Need 1.5 & Design 2.3) — bukan improvisasi model bahasa bebas.
            </p>
            <ul className="mt-5 space-y-3">
              {preview.rationale.map((r) => (
                <li key={r} className="flex gap-3 text-sm text-ink-800">
                  <InfoCircle size={16} variant="Bold" color="#2a74a8" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 rounded-xl bg-ink-50 p-4 text-xs text-ink-700">
              <div className="mb-1 font-medium text-ink-900">Rujukan modul</div>
              {preview.groundedRefs.map((ref) => (
                <div key={ref}>• {ref}</div>
              ))}
            </div>
          </Card>

          <div className="flex flex-wrap justify-between gap-3">
            <Button variant="secondary" onClick={() => setStep(1)}>
              Ubah input
            </Button>
            <Button
              variant="gold"
              rightIcon={<ArrowRight2 size={16} variant="Bold" color="currentColor" />}
              onClick={handleCreate}
            >
              Buat ruang kerja proyek
            </Button>
          </div>
        </motion.div>
      )}
    </div>
  )
}
