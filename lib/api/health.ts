const HEALTHY_TTL_MS = 10_000
const UNHEALTHY_TTL_MS = 2_000
const PROBE_TIMEOUT_MS = 2_500

type CacheEntry = { healthy: boolean; expiresAt: number }

let cache: CacheEntry | null = null
let inflight: Promise<boolean> | null = null

export async function isApiHealthy(force = false): Promise<boolean> {
  const now = Date.now()
  if (!force && cache && cache.expiresAt > now) return cache.healthy
  if (inflight) return inflight

  inflight = probe()
    .then((healthy) => {
      cache = {
        healthy,
        expiresAt: Date.now() + (healthy ? HEALTHY_TTL_MS : UNHEALTHY_TTL_MS),
      }
      return healthy
    })
    .finally(() => {
      inflight = null
    })

  return inflight
}

async function probe(): Promise<boolean> {
  // health.ts roda no middleware (server-side). Prefere a URL interna do container.
  const apiUrl = process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL
  if (!apiUrl) return false

  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)

  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      signal: controller.signal,
      cache: "no-store",
      redirect: "manual",
    })
    return res.status < 500
  } catch {
    return false
  } finally {
    clearTimeout(timeout)
  }
}
