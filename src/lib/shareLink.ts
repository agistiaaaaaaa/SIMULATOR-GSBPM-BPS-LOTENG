/**
 * Share project planning state via URL hash (client-only, no backend).
 * Uses gzip CompressionStream when available; falls back to base64 JSON.
 */
import type { Project } from '@/domain/types'

const SHARE_PREFIX = 'statplan1:'
const MAX_HASH_CHARS = 1_800_000

export type SharePayload = {
  v: 1
  exportedAt: string
  project: Project
}

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]!)
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function base64UrlToBytes(b64url: string): Uint8Array {
  const padded = b64url.replace(/-/g, '+').replace(/_/g, '/')
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
  const binary = atob(padded + pad)
  const out = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i)
  return out
}

async function gzipEncode(text: string): Promise<string> {
  if (typeof CompressionStream === 'undefined') {
    return SHARE_PREFIX + 'raw.' + bytesToBase64Url(new TextEncoder().encode(text))
  }
  const cs = new CompressionStream('gzip')
  const stream = new Blob([text]).stream().pipeThrough(cs)
  const buf = await new Response(stream).arrayBuffer()
  return SHARE_PREFIX + 'gz.' + bytesToBase64Url(new Uint8Array(buf))
}

async function gzipDecode(token: string): Promise<string> {
  if (!token.startsWith(SHARE_PREFIX)) throw new Error('Format tautan berbagi tidak dikenali')
  const body = token.slice(SHARE_PREFIX.length)
  if (body.startsWith('raw.')) {
    return new TextDecoder().decode(base64UrlToBytes(body.slice(4)))
  }
  if (body.startsWith('gz.')) {
    if (typeof DecompressionStream === 'undefined') {
      throw new Error('Browser tidak mendukung dekompresi gzip')
    }
    const bytes = base64UrlToBytes(body.slice(3))
    const ds = new DecompressionStream('gzip')
    const stream = new Blob([bytes]).stream().pipeThrough(ds)
    return await new Response(stream).text()
  }
  throw new Error('Payload berbagi rusak atau tidak didukung')
}

function stripForShare(project: Project): Project {
  // Keep full planning state; id will be regenerated on import
  return {
    ...project,
    // Avoid leaking demo activity noise — keep structure only
  }
}

export async function encodeProjectShare(project: Project): Promise<{
  hash: string
  tooLarge: boolean
  approxChars: number
}> {
  const payload: SharePayload = {
    v: 1,
    exportedAt: new Date().toISOString(),
    project: stripForShare(project),
  }
  const encoded = await gzipEncode(JSON.stringify(payload))
  const approxChars = encoded.length
  return {
    hash: encoded,
    tooLarge: approxChars > MAX_HASH_CHARS,
    approxChars,
  }
}

export async function decodeProjectShare(token: string): Promise<SharePayload> {
  const json = await gzipDecode(token.trim())
  const data = JSON.parse(json) as SharePayload
  if (!data || data.v !== 1 || !data.project?.name) {
    throw new Error('Isi tautan berbagi tidak valid')
  }
  return data
}

export function buildShareUrl(hashPayload: string): string {
  const url = new URL(window.location.href)
  url.pathname = '/app'
  url.search = ''
  url.hash = `share=${hashPayload}`
  return url.toString()
}

export function readShareTokenFromLocation(loc: {
  hash: string
  search: string
}): string | null {
  if (loc.hash.startsWith('#share=')) return decodeURIComponent(loc.hash.slice('#share='.length))
  if (loc.hash.startsWith('#share%3D')) {
    return decodeURIComponent(loc.hash.slice(1).replace(/^share=/, ''))
  }
  const q = new URLSearchParams(loc.search)
  return q.get('share')
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    return false
  }
}
