import type { QuestionnaireItem } from '@/domain/types'

function q(
  id: string,
  number: string,
  text: string,
  type: QuestionnaireItem['type'],
  options?: string[],
): QuestionnaireItem {
  return { id, number, text, type, options }
}

/** Survei Kepuasan Masyarakat — unsur pelayanan PerMenPANRB */
export const qSkm: QuestionnaireItem[] = [
  q('skm-q0', '1', 'Nama responden', 'terbuka'),
  q('skm-q1', '2', 'Jenis kelamin responden', 'tertutup', ['Laki-laki', 'Perempuan']),
  q('skm-q2', '3', 'Usia responden (tahun)', 'terbuka'),
  q('skm-q3', '4', 'Kecamatan tempat tinggal', 'terbuka'),
  q('skm-q4', '5', 'Jenis layanan yang diakses pada kunjungan ini', 'tertutup', [
    'Izin usaha / NIB',
    'Izin mendirikan bangunan',
    'Izin gangguan (HO)',
    'Izin lokasi',
    'Lainnya',
  ]),
  q(
    'skm-q5',
    '6',
    'Bagaimana pendapat Anda tentang kesesuaian persyaratan pelayanan dengan jenis pelayanannya?',
    'skala',
    ['1 Tidak sesuai', '2 Kurang sesuai', '3 Sesuai', '4 Sangat sesuai'],
  ),
  q(
    'skm-q6',
    '7',
    'Bagaimana kemudahan prosedur pelayanan di unit ini?',
    'skala',
    ['1 Tidak mudah', '2 Kurang mudah', '3 Mudah', '4 Sangat mudah'],
  ),
  q(
    'skm-q7',
    '8',
    'Bagaimana kecepatan waktu dalam memberikan pelayanan?',
    'skala',
    ['1 Tidak cepat', '2 Kurang cepat', '3 Cepat', '4 Sangat cepat'],
  ),
  q(
    'skm-q8',
    '9',
    'Bagaimana kewajaran biaya/tarif dalam pelayanan?',
    'skala',
    ['1 Sangat mahal', '2 Cukup mahal', '3 Murah', '4 Gratis / sangat murah'],
  ),
  q(
    'skm-q9',
    '10',
    'Bagaimana kesesuaian produk pelayanan antara yang tercantum dalam standar pelayanan dengan hasil yang diberikan?',
    'skala',
    ['1 Tidak sesuai', '2 Kurang sesuai', '3 Sesuai', '4 Sangat sesuai'],
  ),
  q(
    'skm-q10',
    '11',
    'Bagaimana kompetensi petugas dalam memberikan pelayanan?',
    'skala',
    ['1 Tidak kompeten', '2 Kurang kompeten', '3 Kompeten', '4 Sangat kompeten'],
  ),
  q(
    'skm-q11',
    '12',
    'Bagaimana perilaku petugas dalam memberikan pelayanan kepada masyarakat?',
    'skala',
    ['1 Tidak sopan', '2 Kurang sopan', '3 Sopan', '4 Sangat sopan'],
  ),
  q(
    'skm-q12',
    '13',
    'Bagaimana kualitas sarana dan prasarana pendukung pelayanan?',
    'skala',
    ['1 Buruk', '2 Cukup', '3 Baik', '4 Sangat baik'],
  ),
  q(
    'skm-q13',
    '14',
    'Bagaimana penanganan pengaduan pengguna layanan?',
    'skala',
    ['1 Tidak ada', '2 Berfungsi kurang maksimal', '3 Berfungsi', '4 Dikelola dengan baik'],
  ),
  q('skm-q14', '15', 'Saran perbaikan pelayanan (opsional)', 'terbuka'),
]

/** Pendataan UMKM — sensus/pendataan lengkap */
export const qUmkm: QuestionnaireItem[] = [
  q('umkm-q1', '1', 'Nama usaha', 'terbuka'),
  q('umkm-q2', '2', 'Apakah usaha memiliki NIB?', 'tertutup', ['Ya', 'Tidak']),
  q('umkm-q3', '3', 'Nomor Induk Berusaha (jika ada)', 'terbuka'),
  q('umkm-q4', '4', 'Jenis usaha utama', 'tertutup', [
    'Kuliner / makanan minuman',
    'Kerajinan',
    'Perdagangan',
    'Jasa',
    'Pertanian / pengolahan hasil pertanian',
    'Lainnya',
  ]),
  q('umkm-q5', '5', 'Skala usaha', 'tertutup', ['Mikro', 'Kecil', 'Menengah']),
  q('umkm-q6', '6', 'Kecamatan lokasi usaha', 'terbuka'),
  q('umkm-q7', '7', 'Desa/kelurahan lokasi usaha', 'terbuka'),
  q('umkm-q8', '8', 'Jumlah tenaga kerja (termasuk pemilik)', 'terbuka'),
  q('umkm-q9', '9', 'Perkiraan omzet rata-rata per bulan (Rp)', 'terbuka'),
  q('umkm-q10', '10', 'Jenis kelamin pemilik usaha', 'tertutup', ['Laki-laki', 'Perempuan']),
  q('umkm-q11', '11', 'Pendidikan terakhir pemilik usaha', 'tertutup', [
    'Tidak sekolah / SD',
    'SMP',
    'SMA/SMK',
    'Diploma',
    'Sarjana atau lebih tinggi',
  ]),
  q('umkm-q12', '12', 'Apakah usaha pernah menerima bantuan pemerintah?', 'tertutup', [
    'Ya',
    'Tidak',
  ]),
]

/** Survei produksi padi */
export const qPadi: QuestionnaireItem[] = [
  q('padi-q1', '1', 'Nama petani / pengelola lahan', 'terbuka'),
  q('padi-q2', '2', 'Kecamatan', 'terbuka'),
  q('padi-q3', '3', 'Desa', 'terbuka'),
  q('padi-q4', '4', 'Musim tanam yang dilaporkan', 'tertutup', [
    'Musim Tanam I (rendeng)',
    'Musim Tanam II (gadu)',
  ]),
  q('padi-q5', '5', 'Luas tanam padi (hektare)', 'terbuka'),
  q('padi-q6', '6', 'Luas panen padi (hektare)', 'terbuka'),
  q('padi-q7', '7', 'Hasil produksi gabah kering giling (ton)', 'terbuka'),
  q('padi-q8', '8', 'Varietas padi utama', 'tertutup', [
    'Ciherang',
    'Inpari',
    'IR64',
    'Situ Bagendit',
    'Lainnya',
  ]),
  q('padi-q9', '9', 'Sumber irigasi utama', 'tertutup', [
    'Irigasi teknis',
    'Irigasi setengah teknis',
    'Irigasi sederhana',
    'Tadah hujan',
  ]),
  q('padi-q10', '10', 'Jenis pupuk utama yang digunakan', 'tertutup', [
    'Urea',
    'NPK',
    'Organik',
    'Campuran',
  ]),
]
