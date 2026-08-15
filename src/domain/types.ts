export type JenisKegiatan = 'survei' | 'sensus' | 'kompromin'
export type ProjectStatus = 'draft' | 'in_progress' | 'ready_for_review' | 'archived'
export type Klasifikasi = 'dasar' | 'sektoral' | 'khusus'
export type SdiStageId = 'perencanaan' | 'pengumpulan' | 'pemeriksaan' | 'penyebarluasan'
export type GsbpmPhaseId =
  | 'specify_need'
  | 'design'
  | 'build'
  | 'collect'
  | 'process'
  | 'analyse'
  | 'disseminate'
  | 'evaluate'

export interface ChecklistItem {
  id: string
  label: string
  required: boolean
  /** Applies only to these activity types; omit = all */
  jenis?: JenisKegiatan[]
  /** Applies only to these klasifikasi; omit = all */
  klasifikasi?: Klasifikasi[]
  done?: boolean
}

export interface SubProcess {
  id: string
  code: string
  title: string
  description: string
  activities: string[]
  checklist: ChecklistItem[]
  outputs: string[]
  skipWhen?: JenisKegiatan[]
  /** Rujukan slide Materi Proses Bisnis.pdf */
  pdfRef?: string
}

export interface GsbpmPhase {
  id: GsbpmPhaseId
  code: string
  title: string
  titleId: string
  purpose: string
  sdiStage: SdiStageId
  subProcesses: SubProcess[]
  pdfRef?: string
}

export interface SdiStage {
  id: SdiStageId
  title: string
  subtitle: string
  phases: GsbpmPhaseId[]
  order: number
}

export interface VariableDef {
  id: string
  name: string
  definition: string
  type: 'kategorik' | 'numerik' | 'teks' | 'tanggal'
  unit?: string
  source?: string
  /** Skala pengukuran (nominal / ordinal / interval / rasio) — metadata demo */
  scale?: 'nominal' | 'ordinal' | 'interval' | 'rasio'
  exampleValue?: string
  missingValueRule?: string
  /** Optional grouping label in variable manager */
  category?: string
}

export interface ActivityLogItem {
  id: string
  projectId?: string
  projectName?: string
  action: string
  detail: string
  at: string
  actor: string
}

export interface IndicatorDef {
  id: string
  name: string
  formula: string
  relatedVariables: string[]
}

export interface TimelineItem {
  id: string
  title: string
  phaseId: GsbpmPhaseId
  startWeek: number
  endWeek: number
}

export interface QuestionnaireItem {
  id: string
  number: string
  text: string
  type: 'tertutup' | 'terbuka' | 'skala'
  options?: string[]
}

export interface MetadataDraft {
  kegiatan: Record<string, string>
  variabel: Record<string, string>
  indikator: Record<string, string>
}

export interface DesignSettings {
  caraPengumpulan: JenisKegiatan | ''
  metodePengumpulan: 'wawancara' | 'self_enumeration' | 'observasi' | ''
  modaPengumpulan: 'papi' | 'capi' | 'cati' | 'cawi' | ''
  metodeSampling: string
  ukuranSampel: string
}

export interface PortalSdiCheck {
  checked: boolean
  sirusaChecked: boolean
  romantikChecked: boolean
  notes: string
  checkedAt?: string
}

export interface RekomendasiBps {
  namaKegiatan: string
  penyelenggara: string
  tujuan: string
  periode: string
  catatan: string
}

export interface AiRecommendation {
  jenis: JenisKegiatan
  confidence: number
  rationale: string[]
  groundedRefs: string[]
}

export interface Project {
  id: string
  name: string
  description: string
  topik: string
  /** Estimasi anggaran perencanaan (opsional) — intake README */
  estimasiAnggaran?: string
  klasifikasi: Klasifikasi
  jenisKegiatan: JenisKegiatan
  aiRecommendation?: AiRecommendation
  objectives: string[]
  variables: VariableDef[]
  indicators: IndicatorDef[]
  timeline: TimelineItem[]
  questionnaire: QuestionnaireItem[]
  design: DesignSettings
  portalSdi: PortalSdiCheck
  rekomendasiBps: RekomendasiBps
  metadata: MetadataDraft
  checklistState: Record<string, boolean>
  currentPhaseId: GsbpmPhaseId
  status: ProjectStatus
  createdAt: string
  updatedAt: string
}
