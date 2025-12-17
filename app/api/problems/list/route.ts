import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export const runtime = "nodejs"

function getToken(req: Request) {
  const h = req.headers.get("authorization") || ""
  const m = h.match(/^Bearer\s+(.+)$/i)
  return m?.[1] ?? ""
}

export async function GET(req: Request) {
  try {
    const token = getToken(req)
    if (!token) return NextResponse.json({ error: "no token" }, { status: 401 })

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token)
    if (userErr || !userData.user) {
      return NextResponse.json({ error: "bad token" }, { status: 401 })
    }
    const user = userData.user

    // 1) 問題一覧
    const { data: problems, error: pErr } = await supabaseAdmin
      .from("problems")
      .select("id,title,problem_type,difficulty")
      .order("id", { ascending: true })

    if (pErr) return NextResponse.json({ error: pErr.message }, { status: 500 })

    // 2) クリア済み一覧（このユーザー）
    const { data: clears, error: cErr } = await supabaseAdmin
      .from("problem_clears")
      .select("problem_id")
      .eq("user_id", user.id)

    if (cErr) return NextResponse.json({ error: cErr.message }, { status: 500 })

    const clearedSet = new Set((clears ?? []).map((x) => Number(x.problem_id)))

    const out = (problems ?? []).map((p) => ({
      ...p,
      cleared: clearedSet.has(Number(p.id)),
    }))

    return NextResponse.json({ problems: out }, { status: 200 })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "server error" }, { status: 500 })
  }
}
