import type { IndicatorDef, VariableDef } from '@/domain/types'



function defaultsForType(type: VariableDef['type']): Pick<

  VariableDef,

  'scale' | 'exampleValue' | 'missingValueRule'

> {

  switch (type) {

    case 'kategorik':

      return {

        scale: 'nominal',

        exampleValue: 'Kode kategori terpilih',

        missingValueRule: 'Kosong / 99 = Tidak tahu / Tidak menjawab',

      }

    case 'numerik':

      return {

        scale: 'rasio',

        exampleValue: 'Nilai terukur valid',

        missingValueRule: 'Kosong / −99 = Tidak diketahui; tidak diisi dengan 0 kecuali benar-benar nol',

      }

    case 'teks':

      return {

        scale: 'nominal',

        exampleValue: 'Teks bebas sesuai kondef',

        missingValueRule: 'Kosong diizinkan jika tidak tersedia; jangan isi “-” tanpa catatan',

      }

    case 'tanggal':

      return {

        scale: 'interval',

        exampleValue: 'YYYY-MM-DD',

        missingValueRule: 'Kosong / 9999-99-99 = Tidak diketahui',

      }

  }

}



function v(

  id: string,

  name: string,

  definition: string,

  type: VariableDef['type'],

  unit?: string,

  source?: string,

  extras?: Partial<

    Pick<VariableDef, 'scale' | 'exampleValue' | 'missingValueRule' | 'category'>

  >,

): VariableDef {

  return {

    id,

    name,

    definition,

    type,

    unit,

    source: source ?? 'Instrumen kegiatan / OPD penyelenggara',

    ...defaultsForType(type),

    ...extras,

  }

}



function ind(

  id: string,

  name: string,

  formula: string,

  relatedVariables: string[],

): IndicatorDef {

  return { id, name, formula, relatedVariables }

}



/** Survei Kepuasan Masyarakat — DPMPTSP (Demo Example) */

export const varsSkm: VariableDef[] = [

  v(

    'skm-v0',

    'Nama responden',

    'Nama lengkap atau inisial responden yang diwawancarai (untuk keperluan administrasi lapangan)',

    'teks',

    undefined,

    'Wawancara responden',

    {

      category: 'Identitas',

      exampleValue: 'Inisial / nama sesuai formulir (hindari identitas berlebih di publikasi)',

      missingValueRule: 'Wajib diisi pada saat wawancara; kosong tidak diizinkan',

    },

  ),

  v(

    'skm-v1',

    'Jenis kelamin',

    'Jenis kelamin responden (Laki-laki / Perempuan)',

    'kategorik',

    undefined,

    'Wawancara responden',

    {

      category: 'Identitas',

      exampleValue: '1 = Laki-laki; 2 = Perempuan',

    },

  ),

  v('skm-v2', 'Usia', 'Usia responden pada saat wawancara', 'numerik', 'tahun', 'Wawancara responden', {

    category: 'Identitas',

    scale: 'rasio',

    exampleValue: '34',

  }),

  v('skm-v3', 'Kecamatan', 'Wilayah kecamatan tempat responden tinggal', 'kategorik', undefined, 'Master wilayah BPS', {

    category: 'Wilayah',

    exampleValue: 'Praya',

  }),

  v(

    'skm-v4',

    'Desa/Kelurahan',

    'Wilayah desa/kelurahan tempat responden tinggal',

    'kategorik',

    undefined,

    'Master wilayah BPS',

    {

      category: 'Wilayah',

      exampleValue: 'Prapen',

    },

  ),

  v('skm-v5', 'Jenis layanan', 'Jenis layanan perizinan yang diakses', 'kategorik', undefined, 'Antrian / OSS', {

    category: 'Layanan',

    exampleValue: 'Izin usaha mikro',

  }),

  v('skm-v6', 'Skor persyaratan', 'Penilaian kejelasan persyaratan layanan (1–4)', 'numerik', 'skor', 'SKM PermenPANRB', {

    category: 'Unsur SKM',

    scale: 'ordinal',

    exampleValue: '3',

  }),

  v('skm-v7', 'Skor prosedur', 'Penilaian kemudahan prosedur layanan (1–4)', 'numerik', 'skor', 'SKM PermenPANRB', {

    category: 'Unsur SKM',

    scale: 'ordinal',

    exampleValue: '4',

  }),

  v(

    'skm-v8',

    'Skor waktu pelayanan',

    'Penilaian kecepatan waktu pelayanan (1–4)',

    'numerik',

    'skor',

    'SKM PermenPANRB',

    {

      category: 'Unsur SKM',

      scale: 'ordinal',

      exampleValue: '3',

    },

  ),

  v('skm-v9', 'Skor biaya', 'Penilaian kewajaran biaya/tarif (1–4)', 'numerik', 'skor', 'SKM PermenPANRB', {

    category: 'Unsur SKM',

    scale: 'ordinal',

    exampleValue: '4',

  }),

  v(

    'skm-v10',

    'Skor produk layanan',

    'Penilaian kesesuaian produk layanan (1–4)',

    'numerik',

    'skor',

    'SKM PermenPANRB',

    {

      category: 'Unsur SKM',

      scale: 'ordinal',

      exampleValue: '3',

    },

  ),

  v(

    'skm-v11',

    'Skor kompetensi petugas',

    'Penilaian kompetensi petugas (1–4)',

    'numerik',

    'skor',

    'SKM PermenPANRB',

    {

      category: 'Unsur SKM',

      scale: 'ordinal',

      exampleValue: '4',

    },

  ),

  v(

    'skm-v12',

    'Skor perilaku petugas',

    'Penilaian kesopanan dan keramahan petugas (1–4)',

    'numerik',

    'skor',

    'SKM PermenPANRB',

    {

      category: 'Unsur SKM',

      scale: 'ordinal',

      exampleValue: '4',

    },

  ),

  v(

    'skm-v13',

    'Skor sarana',

    'Penilaian kualitas sarana dan prasarana (1–4)',

    'numerik',

    'skor',

    'SKM PermenPANRB',

    {

      category: 'Unsur SKM',

      scale: 'ordinal',

      exampleValue: '3',

    },

  ),

  v(

    'skm-v14',

    'Skor pengaduan',

    'Penilaian penanganan pengaduan (1–4)',

    'numerik',

    'skor',

    'SKM PermenPANRB',

    {

      category: 'Unsur SKM',

      scale: 'ordinal',

      exampleValue: '3',

    },

  ),

]



export const indSkm: IndicatorDef[] = [

  ind(

    'skm-i1',

    'Indeks Kepuasan Masyarakat (IKM)',

    'Rata-rata tertimbang sembilan unsur pelayanan × 25 (skala 0–100)',

    ['Skor persyaratan', 'Skor prosedur', 'Skor waktu pelayanan', 'Skor biaya'],

  ),

  ind(

    'skm-i2',

    'Persentase responden puas',

    '(Jumlah responden dengan IKM ≥ 76,61 / total responden) × 100',

    ['Skor persyaratan', 'Skor produk layanan'],

  ),

]



/** Pendataan UMKM — Dinas Koperasi (Demo Example) */

export const varsUmkm: VariableDef[] = [

  v(

    'umkm-v1',

    'Nama usaha',

    'Nama resmi usaha yang digunakan responden',

    'teks',

    undefined,

    'Wawancara pelaku usaha',

    {

      category: 'Identitas usaha',

      exampleValue: 'Toko Berkah',

    },

  ),

  v(

    'umkm-v2',

    'NIB',

    'Nomor Induk Berusaha yang dimiliki pelaku usaha',

    'teks',

    undefined,

    'OSS / Pelaku Usaha',

    {

      category: 'Identitas usaha',

      exampleValue: '9120401234567',

      missingValueRule: 'Kosong jika belum memiliki NIB',

    },

  ),

  v(

    'umkm-v3',

    'Jenis usaha',

    'Klasifikasi jenis kegiatan usaha',

    'kategorik',

    undefined,

    'KBLI / wawancara pelaku usaha',

    {

      category: 'Karakteristik usaha',

      exampleValue: 'Perdagangan eceran',

    },

  ),

  v(

    'umkm-v4',

    'Skala usaha',

    'Klasifikasi skala usaha: Mikro / Kecil / Menengah',

    'kategorik',

    undefined,

    'UU UMKM / wawancara pelaku usaha',

    {

      category: 'Karakteristik usaha',

      scale: 'ordinal',

      exampleValue: 'Mikro',

    },

  ),

  v(

    'umkm-v5',

    'Kecamatan',

    'Lokasi kecamatan tempat usaha beroperasi',

    'kategorik',

    undefined,

    'Master wilayah BPS',

    {

      category: 'Wilayah',

      exampleValue: 'Praya',

    },

  ),

  v(

    'umkm-v6',

    'Desa/Kelurahan',

    'Lokasi desa/kelurahan tempat usaha beroperasi',

    'kategorik',

    undefined,

    'Master wilayah BPS',

    {

      category: 'Wilayah',

      exampleValue: 'Prapen',

    },

  ),

  v(

    'umkm-v7',

    'Jumlah tenaga kerja',

    'Jumlah pekerja termasuk pemilik usaha',

    'numerik',

    'orang',

    'Wawancara pelaku usaha',

    {

      category: 'Ketenagakerjaan',

      exampleValue: '3',

    },

  ),

  v(

    'umkm-v8',

    'Omzet bulanan',

    'Perkiraan omzet rata-rata per bulan',

    'numerik',

    'Rp',

    'Wawancara pelaku usaha',

    {

      category: 'Keuangan',

      exampleValue: '8500000',

    },

  ),

  v(

    'umkm-v9',

    'Modal usaha',

    'Estimasi modal usaha pada saat pendataan',

    'numerik',

    'Rp',

    'Wawancara pelaku usaha',

    {

      category: 'Keuangan',

      exampleValue: '15000000',

    },

  ),

  v(

    'umkm-v10',

    'Status legalitas',

    'Status kepemilikan NIB atau izin usaha (sudah berizin / belum berizin)',

    'kategorik',

    undefined,

    'Wawancara pelaku usaha',

    {

      category: 'Legalitas',

      exampleValue: 'Sudah berizin',

    },

  ),

  v(

    'umkm-v11',

    'Jenis kelamin pemilik',

    'Jenis kelamin pemilik usaha',

    'kategorik',

    undefined,

    'Wawancara pelaku usaha',

    {

      category: 'Pemilik',

      exampleValue: 'Laki-laki',

    },

  ),

  v(

    'umkm-v12',

    'Pendidikan pemilik',

    'Pendidikan terakhir pemilik usaha',

    'kategorik',

    undefined,

    'Wawancara pelaku usaha',

    {

      category: 'Pemilik',

      scale: 'ordinal',

      exampleValue: 'SMA/SMK',

    },

  ),

]



export const indUmkm: IndicatorDef[] = [

  ind(

    'umkm-i1',

    'Jumlah UMKM terdata',

    'Jumlah unit usaha yang berhasil didata pada seluruh kecamatan',

    ['Nama usaha', 'Skala usaha'],

  ),

  ind(

    'umkm-i2',

    'Rasio UMKM berizin',

    '(Jumlah UMKM dengan NIB / total UMKM terdata) × 100',

    ['Status legalitas', 'NIB'],

  ),

]



/** Integrasi Data Penduduk — Disdukcapil (Demo Example) */

export const varsDukcapil: VariableDef[] = [

  v(

    'duk-v1',

    'Jumlah penduduk',

    'Jumlah penduduk menurut wilayah administratif',

    'numerik',

    'jiwa',

    'SIAK / Dukcapil',

    {

      category: 'Agregat kependudukan',

      exampleValue: '125430',

    },

  ),

  v(

    'duk-v2',

    'Jumlah KK',

    'Jumlah kartu keluarga aktif',

    'numerik',

    'KK',

    'SIAK / Dukcapil',

    {

      category: 'Agregat kependudukan',

      exampleValue: '38210',

    },

  ),

  v(

    'duk-v3',

    'Jenis kelamin',

    'Distribusi penduduk menurut jenis kelamin',

    'kategorik',

    undefined,

    'SIAK / Dukcapil',

    {

      category: 'Karakteristik penduduk',

      exampleValue: 'Laki-laki',

    },

  ),

  v(

    'duk-v4',

    'Kelompok umur',

    'Distribusi penduduk menurut kelompok umur 5 tahunan',

    'kategorik',

    undefined,

    'SIAK / Dukcapil',

    {

      category: 'Karakteristik penduduk',

      exampleValue: '25–29',

      scale: 'ordinal',

    },

  ),

  v(

    'duk-v5',

    'Kecamatan',

    'Kode dan nama kecamatan',

    'kategorik',

    undefined,

    'SIAK / Dukcapil',

    {

      category: 'Wilayah',

      exampleValue: 'Praya',

    },

  ),

  v(

    'duk-v6',

    'Desa/Kelurahan',

    'Kode dan nama desa/kelurahan',

    'kategorik',

    undefined,

    'SIAK / Dukcapil',

    {

      category: 'Wilayah',

      exampleValue: 'Prapen',

    },

  ),

  v(

    'duk-v7',

    'Status perkawinan',

    'Status perkawinan penduduk',

    'kategorik',

    undefined,

    'SIAK / Dukcapil',

    {

      category: 'Karakteristik penduduk',

      exampleValue: 'Kawin',

    },

  ),

  v(

    'duk-v8',

    'Agama',

    'Agama yang dianut penduduk',

    'kategorik',

    undefined,

    'SIAK / Dukcapil',

    {

      category: 'Karakteristik penduduk',

      exampleValue: 'Islam',

    },

  ),

]



export const indDukcapil: IndicatorDef[] = [

  ind(

    'duk-i1',

    'Laju pertumbuhan penduduk',

    '((Penduduk tahun t − penduduk tahun t−1) / penduduk tahun t−1) × 100',

    ['Jumlah penduduk'],

  ),

  ind(

    'duk-i2',

    'Rasio jenis kelamin',

    '(Jumlah laki-laki / jumlah perempuan) × 100',

    ['Jenis kelamin', 'Jumlah penduduk'],

  ),

]



/** Statistik Produksi Padi — Dinas Pertanian (Demo Example) */

export const varsPadi: VariableDef[] = [

  v(

    'padi-v1',

    'Nama petani',

    'Nama pengelola lahan pertanian',

    'teks',

    undefined,

    'Wawancara petani',

    {

      category: 'Identitas',

      exampleValue: 'Inisial / kode responden (bukan identitas penuh di demo)',

    },

  ),

  v(

    'padi-v2',

    'Kecamatan',

    'Lokasi kecamatan lahan',

    'kategorik',

    undefined,

    'Master wilayah BPS',

    {

      category: 'Wilayah',

      exampleValue: 'Praya',

    },

  ),

  v(

    'padi-v3',

    'Desa',

    'Lokasi desa lahan',

    'kategorik',

    undefined,

    'Master wilayah BPS',

    {

      category: 'Wilayah',

      exampleValue: 'Prapen',

    },

  ),

  v(

    'padi-v4',

    'Luas tanam',

    'Luas lahan yang ditanami padi pada musim tanam',

    'numerik',

    'ha',

    'Observasi / wawancara petani',

    {

      category: 'Lahan',

      exampleValue: '0.75',

    },

  ),

  v(

    'padi-v5',

    'Luas panen',

    'Luas lahan yang dipanen pada musim panen',

    'numerik',

    'ha',

    'Observasi / wawancara petani',

    {

      category: 'Lahan',

      exampleValue: '0.70',

    },

  ),

  v(

    'padi-v6',

    'Produksi gabah',

    'Hasil produksi gabah kering giling',

    'numerik',

    'ton',

    'Wawancara / timbangan',

    {

      category: 'Produksi',

      exampleValue: '3.2',

    },

  ),

  v(

    'padi-v7',

    'Varietas padi',

    'Varietas padi yang ditanam',

    'kategorik',

    undefined,

    'Wawancara petani',

    {

      category: 'Budidaya',

      exampleValue: 'Ciherang',

    },

  ),

  v(

    'padi-v8',

    'Musim tanam',

    'Musim tanam (MT I / MT II / Gadu)',

    'kategorik',

    undefined,

    'Kalender tanam OPD',

    {

      category: 'Budidaya',

      exampleValue: 'MT I',

    },

  ),

  v(

    'padi-v9',

    'Sumber irigasi',

    'Sumber air untuk lahan (irigasi teknis / setengah teknis / tadah hujan)',

    'kategorik',

    undefined,

    'Wawancara petani',

    {

      category: 'Budidaya',

      exampleValue: 'Irigasi teknis',

    },

  ),

  v(

    'padi-v10',

    'Penggunaan pupuk',

    'Jenis pupuk utama yang digunakan',

    'kategorik',

    undefined,

    'Wawancara petani',

    {

      category: 'Budidaya',

      exampleValue: 'Urea + NPK',

    },

  ),

]



export const indPadi: IndicatorDef[] = [

  ind(

    'padi-i1',

    'Produktivitas padi',

    'Produksi gabah (ton) / luas panen (ha)',

    ['Produksi gabah', 'Luas panen'],

  ),

  ind(

    'padi-i2',

    'Total produksi padi kabupaten',

    'Jumlah produksi gabah seluruh sampel dikalikan faktor ekspansi',

    ['Produksi gabah', 'Luas panen'],

  ),

]



/** Pendataan Sarana Pendidikan — Dinas Pendidikan (Demo Example) */

export const varsPendidikan: VariableDef[] = [

  v(

    'pend-v1',

    'Nama satuan pendidikan',

    'Nama resmi sekolah/satuan pendidikan',

    'teks',

    undefined,

    'Dapodik / Dinas Pendidikan',

    {

      category: 'Identitas satuan',

      exampleValue: 'SDN 1 Praya',

    },

  ),

  v(

    'pend-v2',

    'NPSN',

    'Nomor Pokok Sekolah Nasional',

    'teks',

    undefined,

    'Dapodik',

    {

      category: 'Identitas satuan',

      exampleValue: '50201234',

      missingValueRule: 'Kosong tidak diizinkan jika satuan terdaftar di Dapodik',

    },

  ),

  v(

    'pend-v3',

    'Jenjang pendidikan',

    'Jenjang satuan pendidikan: SD / SMP / SMA / SMK / SLB',

    'kategorik',

    undefined,

    'Dapodik',

    {

      category: 'Karakteristik satuan',

      scale: 'ordinal',

      exampleValue: 'SD',

    },

  ),

  v(

    'pend-v4',

    'Status sekolah',

    'Status kepemilikan satuan: Negeri / Swasta',

    'kategorik',

    undefined,

    'Dapodik',

    {

      category: 'Karakteristik satuan',

      exampleValue: 'Negeri',

    },

  ),

  v(

    'pend-v5',

    'Kecamatan',

    'Lokasi kecamatan satuan pendidikan',

    'kategorik',

    undefined,

    'Dapodik',

    {

      category: 'Wilayah',

      exampleValue: 'Praya',

    },

  ),

  v(

    'pend-v6',

    'Jumlah peserta didik',

    'Jumlah siswa aktif pada tahun ajaran berjalan',

    'numerik',

    'orang',

    'Dapodik',

    {

      category: 'Peserta didik & tenaga',

      exampleValue: '248',

    },

  ),

  v(

    'pend-v7',

    'Jumlah guru',

    'Jumlah guru aktif',

    'numerik',

    'orang',

    'Dapodik',

    {

      category: 'Peserta didik & tenaga',

      exampleValue: '12',

    },

  ),

  v(

    'pend-v8',

    'Jumlah ruang kelas',

    'Jumlah ruang kelas layak pakai',

    'numerik',

    'ruang',

    'Dapodik',

    {

      category: 'Sarana',

      exampleValue: '8',

    },

  ),

  v(

    'pend-v9',

    'Kondisi bangunan',

    'Kondisi bangunan: Baik / Rusak ringan / Rusak sedang / Rusak berat',

    'kategorik',

    undefined,

    'Dinas Pendidikan',

    {

      category: 'Sarana',

      scale: 'ordinal',

      exampleValue: 'Baik',

    },

  ),

  v(

    'pend-v10',

    'Akses internet',

    'Ketersediaan akses internet di satuan pendidikan',

    'kategorik',

    undefined,

    'Dinas Pendidikan',

    {

      category: 'Sarana',

      exampleValue: 'Tersedia',

    },

  ),

]



export const indPendidikan: IndicatorDef[] = [

  ind(

    'pend-i1',

    'Rasio murid–guru',

    'Jumlah peserta didik / jumlah guru',

    ['Jumlah peserta didik', 'Jumlah guru'],

  ),

  ind(

    'pend-i2',

    'Persentase sekolah dengan bangunan rusak',

    '(Jumlah sekolah rusak sedang+berat / total sekolah) × 100',

    ['Kondisi bangunan', 'Nama satuan pendidikan'],

  ),

]


