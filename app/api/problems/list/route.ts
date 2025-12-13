import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { supabaseAuth } from "@/lib/supabase/auth"

function getToken(req: Request) {
  const h = req.headers.get("authorization") || ""
  return h.startsWith("Bearer ") ? h.slice(7) : ""
}

export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  const token = getToken(req)
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 })

  const { data: u, error: ue } = await supabaseAuth.auth.getUser(token)
  if (ue || !u.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  // 一覧（PDF型も含む）
  const { data, error } = await supabaseAdmin
    .from("problems")
    .select("id, title, problem_type, problem_pdf_url, choices_image_url, max_number, tags, difficulty")
    .order("id", { ascending: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ problems: data ?? [] })
}
