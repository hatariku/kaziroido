import { NextResponse } from "next/server"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function isAllowed(url: URL) {
  // Supabase Storage だけ許可（オープンプロキシ防止）
  const okHost = url.hostname.endsWith(".supabase.co")
  const okPath =
    url.pathname.startsWith("/storage/v1/object/") ||
    url.pathname.startsWith("/storage/v1/object/public/")
  return okHost && okPath
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const raw = searchParams.get("url")
  if (!raw) return NextResponse.json({ error: "missing url" }, { status: 400 })

  let target: URL
  try {
    target = new URL(raw)
  } catch {
    return NextResponse.json({ error: "bad url" }, { status: 400 })
  }

  if (!isAllowed(target)) {
    return NextResponse.json({ error: "not allowed" }, { status: 403 })
  }

  // ★Range を上流に渡す（PDF表示で重要）
  const range = req.headers.get("range") ?? undefined
  const upstream = await fetch(target.toString(), {
    headers: range ? { range } : undefined,
    cache: "no-store",
  })

  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json(
      { error: `upstream ${upstream.status}` },
      { status: upstream.status }
    )
  }

  const headers = new Headers()

  // 表示に必要なヘッダをなるべく引き継ぐ
  const pass = [
    "content-type",
    "content-length",
    "accept-ranges",
    "content-range",
    "etag",
    "last-modified",
  ] as const

  for (const k of pass) {
    const v = upstream.headers.get(k)
    if (v) headers.set(k, v)
  }

  headers.set("content-disposition", "inline")
  headers.set("cache-control", "public, max-age=3600")
  headers.set("x-content-type-options", "nosniff")

  return new Response(upstream.body, {
    status: upstream.status, // 200 or 206
    headers,
  })
}
