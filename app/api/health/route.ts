import { NextResponse } from "next/server"
import { isApiHealthy } from "@/lib/api/health"

export const dynamic = "force-dynamic"

export async function GET() {
  const healthy = await isApiHealthy(true)
  return NextResponse.json({ healthy })
}
