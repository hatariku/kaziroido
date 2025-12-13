import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { supabaseAuth } from "@/lib/supabase/auth"

function getToken(req: Request) {
  const h = req.headers.get("authorization") || ""
  return h.startsWith("Bearer ") ? h.slice(7) : ""
}

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  const token = getToken(req)
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 })

  const { data: u, error: ue } = await supabaseAuth.auth.getUser(token)
  if (ue || !u.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const { id } = await req.json()

  const { data: problem, error: pe } = await supabaseAdmin
    .from("problems")
    .select("id, title, body, problem_type, problem_pdf_url, choices_image_url, max_number")
    .eq("id", id)
    .single()

  if (pe || !problem) {
    return NextResponse.json({ error: pe?.message ?? "not found" }, { status: 400 })
  }

  const { data: blanks, error: be } = await supabaseAdmin
    .from("problem_blanks")
    .select("blank_label")
    .eq("problem_id", id)
    .order("blank_label", { ascending: true })

  if (be) return NextResponse.json({ error: be.message }, { status: 400 })

  return NextResponse.json({
    problem,
    blankLabels: (blanks ?? []).map((b) => b.blank_label),
  })
}
