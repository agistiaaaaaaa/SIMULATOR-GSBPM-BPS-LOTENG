/**
 * Laporan akademik: penjelasan flowchart + ERD StatPlan (format PKL)
 * Run: node scripts/generate-flowchart-erd-doc.mjs
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  AlignmentType,
  BorderStyle,
  Document,
  HeadingLevel,
  ImageRun,
  LevelFormat,
  Packer,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  convertInchesToTwip,
} from 'docx'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const figuresDir = join(root, 'docs', 'figures')
const outPath = join(root, 'docs', 'Penjelasan-Flowchart-dan-ERD-StatPlan.docx')

const FIG = {
  flowchart: join(figuresDir, 'Gambar-2.1-Flowchart-Alur-Utama-StatPlan.png'),
  erd: join(figuresDir, 'Gambar-2.2-ERD-Model-Data-StatPlan.png'),
  gsbpm: join(figuresDir, 'Gambar-2.3-Pemetaan-GSBPM-StatPlan.png'),
}

const PAGE_CONTENT_WIDTH = 468 // px usable ~6.5" at 72dpi for image width hint

function run(text, opts = {}) {
  return new TextRun({
    text,
    font: 'Times New Roman',
    size: 24, // 12 pt
    ...opts,
  })
}

function p(text, opts = {}) {
  return new Paragraph({
    alignment: opts.align ?? AlignmentType.JUSTIFIED,
    spacing: { after: opts.after ?? 200, line: 360, lineRule: 'auto' },
    indent: opts.indent,
    ...opts.para,
    children: [run(text, opts.run)],
  })
}

function emptyLine() {
  return new Paragraph({ spacing: { after: 120 }, children: [] })
}

function h(text, level = HeadingLevel.HEADING_1) {
  const size = level === HeadingLevel.HEADING_1 ? 28 : level === HeadingLevel.HEADING_2 ? 26 : 24
  return new Paragraph({
    heading: level,
    spacing: { before: 360, after: 200, line: 360, lineRule: 'auto' },
    children: [run(text, { bold: true, size })],
  })
}

function bullet(text) {
  return new Paragraph({
    numbering: { reference: 'bullets', level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 360, lineRule: 'auto' },
    children: [run(text)],
  })
}

function numbered(text, ref = 'numbers') {
  return new Paragraph({
    numbering: { reference: ref, level: 0 },
    alignment: AlignmentType.JUSTIFIED,
    spacing: { after: 120, line: 360, lineRule: 'auto' },
    children: [run(text)],
  })
}

function caption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 120, after: 80, line: 276, lineRule: 'auto' },
    children: [run(text, { bold: true, size: 22 })],
  })
}

function sumber(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 280, line: 276, lineRule: 'auto' },
    children: [run(text, { italics: true, size: 20 })],
  })
}

function figureImage(filePath, alt, widthPx, heightPx) {
  const data = readFileSync(filePath)
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 80 },
    children: [
      new ImageRun({
        type: 'png',
        data,
        transformation: { width: widthPx, height: heightPx },
        altText: {
          title: alt,
          description: alt,
          name: alt,
        },
      }),
    ],
  })
}

function cell(text, opts = {}) {
  return new TableCell({
    width: { size: opts.width ?? 3000, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      bottom: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      left: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
      right: { style: BorderStyle.SINGLE, size: 8, color: '000000' },
    },
    shading: opts.header ? { fill: 'D9E2F3' } : undefined,
    children: [
      new Paragraph({
        alignment: opts.center ? AlignmentType.CENTER : AlignmentType.LEFT,
        spacing: { before: 60, after: 60 },
        children: [
          run(text, {
            bold: Boolean(opts.header || opts.bold),
            size: 20,
          }),
        ],
      }),
    ],
  })
}

function simpleTable(headers, rows) {
  const colW = Math.floor(9360 / headers.length)
  return new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: headers.map(() => colW),
    rows: [
      new TableRow({
        children: headers.map((header) => cell(header, { header: true, width: colW, center: true })),
      }),
      ...rows.map(
        (row) =>
          new TableRow({
            children: row.map((c) => cell(String(c), { width: colW })),
          }),
      ),
    ],
  })
}

function tableCaption(text) {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { before: 200, after: 120 },
    children: [run(text, { bold: true, size: 22 })],
  })
}

const doc = new Document({
  styles: {
    default: {
      document: {
        styles: [
          {
            id: 'Normal',
            run: { font: 'Times New Roman', size: 24 },
            paragraph: { spacing: { line: 360, lineRule: 'auto' } },
          },
        ],
      },
    },
  },
  numbering: {
    config: [
      {
        reference: 'bullets',
        levels: [
          {
            level: 0,
            format: LevelFormat.BULLET,
            text: '•',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.2) },
              },
            },
          },
        ],
      },
      {
        reference: 'numbers',
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.2) },
              },
            },
          },
        ],
      },
      {
        reference: 'numbers2',
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.2) },
              },
            },
          },
        ],
      },
      {
        reference: 'numbers3',
        levels: [
          {
            level: 0,
            format: LevelFormat.DECIMAL,
            text: '%1.',
            alignment: AlignmentType.LEFT,
            style: {
              paragraph: {
                indent: { left: convertInchesToTwip(0.35), hanging: convertInchesToTwip(0.2) },
              },
            },
          },
        ],
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          margin: {
            top: convertInchesToTwip(1.18), // ~3 cm
            bottom: convertInchesToTwip(1.18),
            left: convertInchesToTwip(1.18),
            right: convertInchesToTwip(1.0),
          },
        },
      },
      children: [
        // ===== HALAMAN JUDUL =====
        emptyLine(),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [run('DOKUMEN PENJELASAN SISTEM', { bold: true, size: 28 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 200 },
          children: [
            run('FLOWCHART DAN ENTITY RELATIONSHIP DIAGRAM (ERD)', {
              bold: true,
              size: 28,
            }),
          ],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 320 },
          children: [run('APLIKASI STATPLAN', { bold: true, size: 32 })],
        }),
        p(
          'Platform Perencanaan Kegiatan Statistik Berbasis GSBPM 5.2 untuk OPD Kabupaten Lombok Tengah',
          { align: AlignmentType.CENTER, run: { size: 24 } },
        ),
        emptyLine(),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [run('Disusun untuk Keperluan Pembelajaran dan Laporan Praktik Kerja Lapangan (PKL)', { size: 22 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 120 },
          children: [run('Badan Pusat Statistik Kabupaten Lombok Tengah', { bold: true, size: 22 })],
        }),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 },
          children: [run('Tahun 2026', { size: 22 })],
        }),

        // page break via empty + section content continues; use explicit break
        new Paragraph({
          children: [],
          pageBreakBefore: true,
        }),

        // ===== DAFTAR ISI RINGKAS =====
        h('DAFTAR ISI'),
        p('BAB I   PENDAHULUAN ......................................................................... 1', {
          align: AlignmentType.LEFT,
          run: { size: 22 },
        }),
        p('BAB II  GAMBARAN UMUM SISTEM ..................................................... 2', {
          align: AlignmentType.LEFT,
          run: { size: 22 },
        }),
        p('BAB III FLOWCHART ALUR SISTEM ....................................................... 3', {
          align: AlignmentType.LEFT,
          run: { size: 22 },
        }),
        p('BAB IV  ENTITY RELATIONSHIP DIAGRAM (ERD) ................................. 5', {
          align: AlignmentType.LEFT,
          run: { size: 22 },
        }),
        p('BAB V   PENUTUP ............................................................................... 7', {
          align: AlignmentType.LEFT,
          run: { size: 22 },
        }),
        emptyLine(),
        h('DAFTAR GAMBAR', HeadingLevel.HEADING_2),
        p('Gambar 2.1  Flowchart Alur Utama Sistem StatPlan', { align: AlignmentType.LEFT, run: { size: 22 } }),
        p('Gambar 2.2  Entity Relationship Diagram Model Data StatPlan', {
          align: AlignmentType.LEFT,
          run: { size: 22 },
        }),
        p('Gambar 2.3  Pemetaan 8 Fase GSBPM ke 4 Tahap Navigasi StatPlan', {
          align: AlignmentType.LEFT,
          run: { size: 22 },
        }),
        emptyLine(),
        h('DAFTAR TABEL', HeadingLevel.HEADING_2),
        p('Tabel 3.1  Transisi Alur Utama Sistem', { align: AlignmentType.LEFT, run: { size: 22 } }),
        p('Tabel 3.2  Perbandingan Jenis Kegiatan Statistik', { align: AlignmentType.LEFT, run: { size: 22 } }),
        p('Tabel 4.1  Kardinalitas Relasi Model Data StatPlan', { align: AlignmentType.LEFT, run: { size: 22 } }),
        p('Tabel 4.2  Atribut Utama Entitas Project', { align: AlignmentType.LEFT, run: { size: 22 } }),

        new Paragraph({ children: [], pageBreakBefore: true }),

        // ===== BAB I =====
        h('BAB I PENDAHULUAN'),
        h('1.1 Latar Belakang', HeadingLevel.HEADING_2),
        p(
          'Perencanaan kegiatan statistik pada Organisasi Perangkat Daerah (OPD) memerlukan ketertiban proses agar hasilnya dapat ditelusuri, ditinjau, dan dikembangkan. Kerangka Generic Statistical Business Process Model (GSBPM) 5.2 menyediakan standar proses bisnis statistik. Namun, penerapan GSBPM di tingkat OPD sering terhambat oleh kompleksitas istilah dan kurangnya alat bantu yang menuntun penyusunan rencana secara sistematis.',
        ),
        p(
          'StatPlan dikembangkan sebagai aplikasi web client-side untuk membantu OPD Kabupaten Lombok Tengah merencanakan kegiatan statistik dari identifikasi kebutuhan hingga penyusunan draf dokumen. Dokumen ini menjelaskan flowchart dan Entity Relationship Diagram (ERD) agar alur sistem serta struktur data dapat dipelajari secara akademik, khususnya dalam konteks laporan Praktik Kerja Lapangan (PKL).',
        ),

        h('1.2 Tujuan Penulisan', HeadingLevel.HEADING_2),
        numbered('Menjelaskan tujuan dan ruang lingkup sistem StatPlan.'),
        numbered('Menguraikan flowchart alur utama pengguna secara runtut.'),
        numbered('Menjelaskan pemetaan fase GSBPM dalam navigasi aplikasi.'),
        numbered('Menguraikan ERD/model data beserta kardinalitas relasinya.'),
        numbered('Menyediakan bahan pembelajaran dan lampiran laporan PKL yang mudah dipahami.'),

        h('1.3 Manfaat', HeadingLevel.HEADING_2),
        bullet('Bagi peserta PKL: memahami alur dan struktur data sistem secara utuh.'),
        bullet('Bagi pembimbing: memperoleh ringkasan teknis yang rapi dan berkaidah akademik.'),
        bullet('Bagi OPD: memahami cara kerja alat bantu perencanaan tanpa harus membaca kode sumber.'),

        h('1.4 Ruang Lingkup', HeadingLevel.HEADING_2),
        p(
          'Pembahasan terbatas pada alur fungsional aplikasi StatPlan dan model data yang tersimpan di penyimpanan lokal browser (localStorage). Dokumen ini tidak membahas infrastruktur server produksi, autentikasi multi-pengguna, maupun proses approval resmi BPS, karena komponen tersebut berada di luar arsitektur aplikasi saat ini.',
        ),

        new Paragraph({ children: [], pageBreakBefore: true }),

        // ===== BAB II =====
        h('BAB II GAMBARAN UMUM SISTEM'),
        h('2.1 Identitas Sistem', HeadingLevel.HEADING_2),
        p(
          'StatPlan adalah platform perencanaan kegiatan statistik berbasis GSBPM 5.2 yang berjalan sepenuhnya di sisi klien (browser). Data proyek disimpan lokal, validasi bisnis dijalankan di aplikasi, dan dokumen Word dapat dihasilkan tanpa mengunggah data ke server aplikasi.',
        ),

        h('2.2 Tujuan Sistem', HeadingLevel.HEADING_2),
        p(
          'Secara singkat, StatPlan bertujuan membantu OPD merencanakan kegiatan statistik sesuai kerangka GSBPM 5.2 — mulai dari kebutuhan data hingga draf dokumen — tanpa mewajibkan pengguna menghafal seluruh istilah teknis GSBPM.',
        ),

        h('2.3 Sasaran Pengguna', HeadingLevel.HEADING_2),
        bullet('OPD Kabupaten Lombok Tengah yang menyusun rencana kegiatan statistik sektoral.'),
        bullet('Petugas BPS yang mendampingi atau mereviu perencanaan OPD.'),
        bullet('Peserta pelatihan/PKL yang mempelajari penerapan GSBPM secara praktis.'),

        h('2.4 Batasan Sistem', HeadingLevel.HEADING_2),
        bullet('Bukan sistem operasional resmi pengumpulan data lapangan BPS.'),
        bullet('Bukan sistem persetujuan (approval) daring.'),
        bullet('Bukan layanan AI berbasis cloud yang mengirim data proyek ke server eksternal.'),
        bullet('Bukan basis data pusat multi-pengguna; data utama berada pada perangkat pengguna.'),

        h('2.5 Keluaran Sistem', HeadingLevel.HEADING_2),
        bullet('Proyek perencanaan statistik terstruktur di browser.'),
        bullet('Checklist dan metadata (MS-Keg, MS-Var, MS-Ind) sebagai bukti kelengkapan.'),
        bullet('Dokumen Word (.docx) berstatus draf siap ditinjau.'),
        bullet('Tautan berbagi yang menghasilkan salinan proyek pada perangkat penerima.'),

        new Paragraph({ children: [], pageBreakBefore: true }),

        // ===== BAB III =====
        h('BAB III FLOWCHART ALUR SISTEM'),
        h('3.1 Pengertian Flowchart', HeadingLevel.HEADING_2),
        p(
          'Flowchart merupakan diagram alir yang menggambarkan urutan proses, keputusan, dan keluaran suatu sistem. Dalam laporan ini, flowchart digunakan untuk menjelaskan bagaimana pengguna berinteraksi dengan StatPlan dari pembukaan aplikasi hingga menghasilkan dokumen atau tautan berbagi.',
        ),

        h('3.2 Flowchart Alur Utama', HeadingLevel.HEADING_2),
        p(
          'Alur utama StatPlan dapat diringkas dalam enam tahap: (1) masuk aplikasi, (2) memilih aktivitas kerja, (3) mengisi kebutuhan data, (4) memperoleh rekomendasi jenis kegiatan, (5) mengerjakan workspace berbasis GSBPM, serta (6) melakukan validasi dan menghasilkan keluaran. Gambar 2.1 menyajikan flowchart alur utama tersebut.',
        ),

        figureImage(
          FIG.flowchart,
          'Gambar 2.1 Flowchart Alur Utama Sistem StatPlan',
          PAGE_CONTENT_WIDTH,
          Math.round(PAGE_CONTENT_WIDTH * 0.78),
        ),
        caption('Gambar 2.1 Flowchart Alur Utama Sistem StatPlan'),
        sumber('Sumber: Diolah dari alur aplikasi StatPlan (2026)'),

        p(
          'Berdasarkan Gambar 2.1, sistem dimulai dari halaman pendaratan (landing page). Apabila onboarding belum selesai, panduan awal ditampilkan. Selanjutnya pengguna memilih aktivitas: membuat proyek baru, membuka proyek tersimpan, mencari proyek, atau mengimpor data. Pada pembuatan proyek baru, sistem memvalidasi kelengkapan input minimum sebelum menjalankan mesin rekomendasi jenis kegiatan (Survei, Sensus, atau Kompromin). Setelah ruang kerja terbentuk, setiap perubahan disimpan otomatis. Ekspor dokumen dan berbagi tautan hanya diizinkan apabila validasi bisnis tidak menghasilkan error tingkat penghambat (blocking).',
        ),

        h('3.3 Transisi Antarproses', HeadingLevel.HEADING_2),
        tableCaption('Tabel 3.1 Transisi Alur Utama Sistem'),
        simpleTable(
          ['Dari', 'Ke', 'Syarat / Keterangan'],
          [
            ['Landing', 'Dashboard', 'Onboarding selesai atau dilewati'],
            ['Dashboard', 'Wizard proyek', 'Pengguna memilih buat proyek baru'],
            ['Wizard', 'Rekomendasi jenis', 'Nama, topik, dan deskripsi memenuhi batas minimum'],
            ['Rekomendasi', 'Workspace', 'Jenis kegiatan Survei/Sensus/Kompromin ditetapkan'],
            ['Workspace', 'Validasi ekspor', 'Portal, checklist, dan metadata diperiksa'],
            ['Validasi lolos', 'DOCX / tautan', 'Tidak terdapat error blocking'],
            ['Validasi gagal', 'Perbaikan tab terkait', 'Pengguna melengkapi kekurangan data'],
          ],
        ),
        emptyLine(),

        h('3.4 Jenis Kegiatan Statistik', HeadingLevel.HEADING_2),
        p(
          'Jenis kegiatan memengaruhi checklist, kebutuhan instrumen, dan desain sampling. Perbandingan ringkas disajikan pada Tabel 3.2.',
        ),
        tableCaption('Tabel 3.2 Perbandingan Jenis Kegiatan Statistik'),
        simpleTable(
          ['Jenis', 'Inti', 'Implikasi pada Sistem'],
          [
            ['Survei', 'Pendataan sebagian unit', 'Memerlukan desain sampling dan instrumen'],
            ['Sensus', 'Pendataan seluruh unit', 'Instrumen digunakan; tanpa desain sampel'],
            ['Kompromin', 'Pemanfaatan data administrasi', 'Fokus ekstraksi data; kuesioner dikosongkan'],
          ],
        ),
        emptyLine(),

        h('3.5 Pemetaan GSBPM pada Navigasi Aplikasi', HeadingLevel.HEADING_2),
        p(
          'GSBPM 5.2 terdiri atas delapan fase resmi. Demi kemudahan pengguna OPD, StatPlan mengelompokkan delapan fase tersebut menjadi empat tahap navigasi. Pengelompokan ini merupakan penyederhanaan antarmuka (UX), bukan penggantian standar GSBPM. Pemetaan tersebut ditunjukkan pada Gambar 2.3.',
        ),
        figureImage(
          FIG.gsbpm,
          'Gambar 2.3 Pemetaan 8 Fase GSBPM ke 4 Tahap Navigasi StatPlan',
          PAGE_CONTENT_WIDTH,
          Math.round(PAGE_CONTENT_WIDTH * 0.56),
        ),
        caption('Gambar 2.3 Pemetaan 8 Fase GSBPM ke 4 Tahap Navigasi StatPlan'),
        sumber('Sumber: Diolah dari GSBPM 5.2 dan navigasi StatPlan (2026)'),

        p(
          'Pada setiap fase, pola kerja pengguna relatif seragam: membaca tujuan fase, melaksanakan aktivitas relevan, mengisi checklist sebagai bukti, memeriksa keluaran, kemudian melanjutkan ke fase berikutnya. Hasil evaluasi (fase 8) diharapkan menjadi umpan balik bagi siklus perencanaan berikutnya.',
        ),

        new Paragraph({ children: [], pageBreakBefore: true }),

        // ===== BAB IV =====
        h('BAB IV ENTITY RELATIONSHIP DIAGRAM (ERD)'),
        h('4.1 Pengertian dan Pendekatan Model', HeadingLevel.HEADING_2),
        p(
          'Entity Relationship Diagram (ERD) menggambarkan entitas data beserta hubungannya. Pada StatPlan, penyimpanan aktual bersifat document-oriented: seluruh data proyek tersimpan sebagai objek JSON pada localStorage dengan kunci bps-statplan-v2. Oleh karena itu, ERD pada laporan ini merepresentasikan model logis struktur objek tersebut, lengkap dengan kardinalitas, meskipun secara fisik belum diimplementasikan sebagai tabel SQL.',
        ),

        h('4.2 ERD Model Data StatPlan', HeadingLevel.HEADING_2),
        p(
          'Gambar 2.2 menampilkan entitas pusat Project sebagai aggregate root, beserta entitas/komponen anak dan referensi ke master GSBPM.',
        ),
        figureImage(
          FIG.erd,
          'Gambar 2.2 Entity Relationship Diagram Model Data StatPlan',
          PAGE_CONTENT_WIDTH,
          Math.round(PAGE_CONTENT_WIDTH * 0.78),
        ),
        caption('Gambar 2.2 Entity Relationship Diagram Model Data StatPlan'),
        sumber('Sumber: Diolah dari src/domain/types.ts dan store aplikasi (2026)'),

        p(
          'AppState merupakan akar store yang memuat himpunan Project. Setiap Project mengandung komponen perencanaan seperti variabel, indikator, butir kuesioner, timeline, status checklist, pengaturan desain, pemeriksaan portal SDI, metadata, serta rekomendasi jenis kegiatan. Master fase GSBPM bersifat statis di dalam kode sumber dan direferensikan melalui currentPhaseId maupun phaseId pada timeline.',
        ),

        h('4.3 Kardinalitas Relasi', HeadingLevel.HEADING_2),
        tableCaption('Tabel 4.1 Kardinalitas Relasi Model Data StatPlan'),
        simpleTable(
          ['Induk', 'Kardinalitas', 'Anak / Komponen', 'Keterangan'],
          [
            ['AppState', '1 : 0..*', 'Project', 'Satu store memuat banyak proyek'],
            ['Project', '1 : 0..*', 'VariableDef', 'Nested di dalam JSON Project'],
            ['Project', '1 : 0..*', 'IndicatorDef', 'relatedVariables masih berbasis nama'],
            ['Project', '1 : 0..*', 'QuestionnaireItem', 'Dikosongkan pada Kompromin'],
            ['Project', '1 : 0..*', 'TimelineItem', 'Mengacu GsbpmPhase.id'],
            ['Project', '1 : 1', 'DesignSettings', 'Metode, moda, sampling, ukuran sampel'],
            ['Project', '1 : 1', 'PortalSdiCheck', 'Pemeriksaan sirusa dan romantik'],
            ['Project', '1 : 1', 'MetadataDraft', 'MS-Keg, MS-Var, MS-Ind'],
            ['Project', '0..1', 'AiRecommendation', 'Hasil rekomendasi jenis kegiatan'],
            ['Project', '1 : N', 'ChecklistState', 'Key mengacu id checklist master'],
          ],
        ),
        emptyLine(),

        h('4.4 Atribut Utama Entitas Project', HeadingLevel.HEADING_2),
        tableCaption('Tabel 4.2 Atribut Utama Entitas Project'),
        simpleTable(
          ['Atribut', 'Uraian'],
          [
            ['id', 'Kunci unik proyek'],
            ['name, topik, description', 'Identitas dan uraian kebutuhan'],
            ['klasifikasi', 'dasar / sektoral / khusus'],
            ['jenisKegiatan', 'survei / sensus / kompromin'],
            ['currentPhaseId', 'Fase GSBPM yang sedang dikerjakan'],
            ['status', 'draft / in_progress / ready_for_review / archived'],
            ['createdAt, updatedAt', 'Stempel waktu pembuatan dan pembaruan'],
          ],
        ),
        emptyLine(),

        h('4.5 Alur Persistensi Data', HeadingLevel.HEADING_2),
        numbered('Antarmuka React menerima input pengguna.', 'numbers2'),
        numbered('Action Zustand memperbarui state Project secara immutable.', 'numbers2'),
        numbered('Koleksi Project[] tersimpan di memori aplikasi.', 'numbers2'),
        numbered('Middleware persist menuliskan state ke localStorage (bps-statplan-v2).', 'numbers2'),

        h('4.6 Jalur Keluaran Data', HeadingLevel.HEADING_2),
        bullet('Dokumen Word: Project → validasi bisnis → berkas .docx.'),
        bullet('Tautan berbagi: Project → kompresi gzip/Base64URL → URL #share → impor sebagai salinan ber-ID baru.'),
        bullet('Cadangan JSON: seluruh Project[] diekspor dan dapat diimpor kembali.'),

        h('4.7 Catatan Integritas Data', HeadingLevel.HEADING_2),
        p(
          'Karena tidak menggunakan basis data relasional, constraint foreign key tidak ditegakkan oleh mesin basis data. Integritas dijaga melalui validasi pada lapisan aplikasi. Salah satu perhatian penting adalah IndicatorDef.relatedVariables yang menyimpan nama variabel, bukan VariableDef.id, sehingga perubahan nama variabel dapat memutus keterkaitan secara logis. Apabila sistem dikembangkan ke backend SQL, relasi tersebut sebaiknya dinormalisasi menggunakan tabel penghubung berbasis ID.',
        ),

        new Paragraph({ children: [], pageBreakBefore: true }),

        // ===== BAB V =====
        h('BAB V PENUTUP'),
        h('5.1 Kesimpulan', HeadingLevel.HEADING_2),
        p(
          'StatPlan merupakan alat bantu perencanaan statistik berbasis GSBPM 5.2 yang berorientasi pada kemudahan OPD. Flowchart alur utama menunjukkan proses dari masuk aplikasi hingga validasi dan keluaran dokumen/tautan. ERD memperlihatkan bahwa Project menjadi pusat model data document-oriented pada penyimpanan lokal browser. Dengan pemahaman terhadap kedua diagram tersebut, peserta PKL maupun pengguna dapat menjelaskan cara kerja sistem secara runtut dan akademis.',
        ),

        h('5.2 Saran Pengembangan', HeadingLevel.HEADING_2),
        numbered('Menambahkan manajemen pengguna dan hak akses apabila sistem dipindahkan ke backend.', 'numbers3'),
        numbered('Mengubah relasi indikator–variabel menjadi berbasis ID.', 'numbers3'),
        numbered('Memisahkan metadata variabel/indikator per entitas secara lebih granular.', 'numbers3'),
        numbered('Menyimpan log aktivitas secara persisten untuk keperluan audit.', 'numbers3'),

        emptyLine(),
        emptyLine(),
        h('DAFTAR PUSTAKA / RUJUKAN IMPLEMENTASI'),
        p(
          'Badan Pusat Statistik. (2026). Materi Proses Bisnis Statistik (GSBPM 5.2). Modul pelatihan.',
          { align: AlignmentType.LEFT },
        ),
        p(
          'StatPlan Source Code. (2026). Berkas implementasi: src/App.tsx, src/domain/types.ts, src/domain/gsbpm.ts, src/store/appStore.ts, src/domain/validation.ts, serta modul ekspor dokumen dan tautan berbagi.',
          { align: AlignmentType.LEFT },
        ),

        emptyLine(),
        emptyLine(),
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 400 },
          children: [run('— Akhir Dokumen —', { italics: true, size: 22 })],
        }),
      ],
    },
  ],
})

mkdirSync(dirname(outPath), { recursive: true })
const buffer = await Packer.toBuffer(doc)
writeFileSync(outPath, buffer)
console.log('Wrote', outPath)
console.log('Figures:')
for (const [k, v] of Object.entries(FIG)) console.log('-', k, v)
