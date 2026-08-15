import type { MetadataDraft } from '@/domain/types'

export function metaSkm(): MetadataDraft {
  return {
    kegiatan: {
      nama_kegiatan: 'Survei Kepuasan Masyarakat terhadap Pelayanan Perizinan DPMPTSP 2026',
      penyelenggara: 'Dinas Penanaman Modal dan Pelayanan Terpadu Satu Pintu Kabupaten Lombok Tengah',
      tahun_kegiatan: '2026',
      cakupan_wilayah: 'Kabupaten Lombok Tengah (12 kecamatan)',
      cara_pengumpulan: 'survei',
      tujuan_kegiatan:
        'Mengukur Indeks Kepuasan Masyarakat (IKM) terhadap pelayanan perizinan sebagai bahan evaluasi dan perbaikan standar pelayanan publik.',
      penanggung_jawab: 'Kepala Bidang Pelayanan Perizinan DPMPTSP',
      periode_pelaksanaan: 'Maret–Agustus 2026',
    },
    variabel: {
      nama_variabel: 'Skor unsur pelayanan',
      definisi_variabel:
        'Nilai penilaian responden terhadap masing-masing unsur pelayanan publik pada skala 1–4 sesuai PerMenPANRB terkait SKM.',
      satuan: 'skor',
      sumber_informasi: 'Wawancara langsung kepada pengguna layanan DPMPTSP',
      metode_pengumpulan: 'Wawancara terstruktur (CAPI)',
      referensi_standar: 'Peraturan Menteri PANRB tentang Survei Kepuasan Masyarakat',
    },
    indikator: {
      nama_indikator: 'Indeks Kepuasan Masyarakat (IKM)',
      definisi_indikator:
        'Indeks komposit yang menggambarkan tingkat kepuasan masyarakat terhadap pelayanan publik unit penyelenggara.',
      rumus_perhitungan: 'Rata-rata tertimbang sembilan unsur pelayanan dikalikan 25 (skala 0–100)',
      variabel_terkait:
        'Skor persyaratan; Skor prosedur; Skor waktu; Skor biaya; Skor produk; Skor kompetensi; Skor perilaku; Skor sarana; Skor pengaduan',
      satuan_indikator: 'indeks (0–100)',
    },
  }
}

export function metaUmkm(): MetadataDraft {
  return {
    kegiatan: {
      nama_kegiatan: 'Pendataan UMKM Kabupaten Lombok Tengah 2026',
      penyelenggara: 'Dinas Koperasi, Usaha Kecil dan Menengah Kabupaten Lombok Tengah',
      tahun_kegiatan: '2026',
      cakupan_wilayah: 'Seluruh desa/kelurahan di Kabupaten Lombok Tengah',
      cara_pengumpulan: 'sensus',
      tujuan_kegiatan:
        'Memperoleh basis data lengkap UMKM untuk perencanaan pemberdayaan, penyaluran bantuan, dan penyusunan profil ekonomi lokal.',
      penanggung_jawab: 'Kepala Bidang UMKM Dinas Koperasi dan UKM',
      periode_pelaksanaan: 'Januari–Oktober 2026',
    },
    variabel: {
      nama_variabel: 'Skala usaha',
      definisi_variabel:
        'Klasifikasi usaha menjadi Mikro, Kecil, atau Menengah berdasarkan kriteria modal dan omzet sesuai ketentuan perundang-undangan UMKM.',
      satuan: 'kategori',
      sumber_informasi: 'Wawancara pemilik usaha dan observasi lapangan',
      metode_pengumpulan: 'Pendataan lengkap (sensus) dengan CAPI',
      referensi_standar: 'UU UMKM dan klasifikasi BPS terkait usaha',
    },
    indikator: {
      nama_indikator: 'Jumlah UMKM terdata',
      definisi_indikator:
        'Jumlah unit usaha mikro, kecil, dan menengah yang berhasil didata pada periode kegiatan.',
      rumus_perhitungan: 'Σ unit usaha yang memenuhi kriteria UMKM dan berhasil diverifikasi',
      variabel_terkait: 'Nama usaha; Skala usaha; Status legalitas',
      satuan_indikator: 'unit usaha',
    },
  }
}

export function metaDukcapil(): MetadataDraft {
  return {
    kegiatan: {
      nama_kegiatan: 'Integrasi dan Kompilasi Data Kependudukan untuk Statistik Sektoral 2026',
      penyelenggara: 'Dinas Kependudukan dan Pencatatan Sipil Kabupaten Lombok Tengah',
      tahun_kegiatan: '2026',
      cakupan_wilayah: 'Kabupaten Lombok Tengah',
      cara_pengumpulan: 'kompromin',
      tujuan_kegiatan:
        'Mengompilasi data administratif kependudukan dari SIAK menjadi statistik kependudukan yang siap digunakan OPD dan publikasi resmi daerah.',
      penanggung_jawab: 'Kepala Bidang Pengelolaan Informasi Administrasi Kependudukan',
      periode_pelaksanaan: 'Januari–Juni 2026',
    },
    variabel: {
      nama_variabel: 'Jumlah penduduk',
      definisi_variabel:
        'Jumlah penduduk yang tercatat dalam basis data kependudukan menurut wilayah administratif pada tanggal cut-off yang ditetapkan.',
      satuan: 'jiwa',
      sumber_informasi: 'Sistem Informasi Administrasi Kependudukan (SIAK)',
      metode_pengumpulan: 'Kompilasi produk administrasi (ekstraksi dan validasi data sekunder)',
      referensi_standar: 'Standar Data Statistik Nasional — kependudukan',
    },
    indikator: {
      nama_indikator: 'Laju pertumbuhan penduduk',
      definisi_indikator: 'Persentase perubahan jumlah penduduk dibanding periode sebelumnya.',
      rumus_perhitungan: '((P_t − P_t−1) / P_t−1) × 100',
      variabel_terkait: 'Jumlah penduduk',
      satuan_indikator: 'persen',
    },
  }
}

export function metaPadi(): MetadataDraft {
  return {
    kegiatan: {
      nama_kegiatan: 'Survei Produksi Padi Kabupaten Lombok Tengah Musim Tanam 2026',
      penyelenggara: 'Dinas Pertanian Kabupaten Lombok Tengah',
      tahun_kegiatan: '2026',
      cakupan_wilayah: 'Kecamatan penghasil padi utama di Kabupaten Lombok Tengah',
      cara_pengumpulan: 'survei',
      tujuan_kegiatan:
        'Mengestimasi luas tanam, luas panen, produksi, dan produktivitas padi sebagai dasar perencanaan ketahanan pangan daerah.',
      penanggung_jawab: 'Kepala Bidang Tanaman Pangan Dinas Pertanian',
      periode_pelaksanaan: 'Februari–September 2026',
    },
    variabel: {
      nama_variabel: 'Produksi gabah',
      definisi_variabel:
        'Jumlah hasil panen padi yang dinyatakan dalam ton gabah kering giling pada musim tanam yang diamati.',
      satuan: 'ton',
      sumber_informasi: 'Wawancara petani sampel dan verifikasi lapangan',
      metode_pengumpulan: 'Survei sampel (stratified sampling) dengan CAPI',
      referensi_standar: 'Konsep dan definisi statistik pertanian BPS',
    },
    indikator: {
      nama_indikator: 'Produktivitas padi',
      definisi_indikator: 'Hasil produksi gabah per satuan luas panen.',
      rumus_perhitungan: 'Produksi gabah (ton) / luas panen (ha)',
      variabel_terkait: 'Produksi gabah; Luas panen',
      satuan_indikator: 'ton/ha',
    },
  }
}

export function metaPendidikan(): MetadataDraft {
  return {
    kegiatan: {
      nama_kegiatan: 'Kompilasi Data Sarana dan Prasarana Pendidikan 2026',
      penyelenggara: 'Dinas Pendidikan Kabupaten Lombok Tengah',
      tahun_kegiatan: '2026',
      cakupan_wilayah: 'Seluruh satuan pendidikan di Kabupaten Lombok Tengah',
      cara_pengumpulan: 'kompromin',
      tujuan_kegiatan:
        'Mengompilasi data sarana pendidikan dari Dapodik dan pelaporan dinas untuk perencanaan rehabilitasi sekolah dan pemerataan akses pendidikan.',
      penanggung_jawab: 'Kepala Bidang Sarana dan Prasarana Pendidikan',
      periode_pelaksanaan: 'Januari–Mei 2026',
    },
    variabel: {
      nama_variabel: 'Kondisi bangunan',
      definisi_variabel:
        'Klasifikasi kondisi fisik bangunan satuan pendidikan: baik, rusak ringan, rusak sedang, atau rusak berat.',
      satuan: 'kategori',
      sumber_informasi: 'Dapodik dan verifikasi Dinas Pendidikan',
      metode_pengumpulan: 'Kompilasi produk administrasi + validasi lapangan terbatas',
      referensi_standar: 'Standar sarana dan prasarana pendidikan Kemendikbudristek',
    },
    indikator: {
      nama_indikator: 'Rasio murid–guru',
      definisi_indikator:
        'Perbandingan jumlah peserta didik terhadap jumlah guru pada satuan pendidikan.',
      rumus_perhitungan: 'Jumlah peserta didik / jumlah guru',
      variabel_terkait: 'Jumlah peserta didik; Jumlah guru',
      satuan_indikator: 'rasio',
    },
  }
}
