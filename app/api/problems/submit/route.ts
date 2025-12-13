import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"
import { supabaseAuth } from "@/lib/supabase/auth"

function getToken(req: Request) {
  const h = req.headers.get("authorization") || ""
  return h.startsWith("Bearer ") ? h.slice(7) : ""
}

export const dynamic = "force-dynamic"

type SubmitBody = {
  problemId: number
  answers: Record<string, number> // { "A": 3, "B": 6, ... }
}

export async function POST(req: Request) {
  const token = getToken(req)
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 })

  const { data: u, error: ue } = await supabaseAuth.auth.getUser(token)
  if (ue || !u.user) return NextResponse.json({ error: "Invalid token" }, { status: 401 })

  const body = (await req.json()) as SubmitBody
  const problemId = Number(body.problemId)
  const answers = body.answers || {}

  if (!problemId) return NextResponse.json({ error: "problemId is required" }, { status: 400 })

  // 問題取得
  const { data: problem, error: pe } = await supabaseAdmin
    .from("problems")
    .select("id, title, problem_type, max_number")
    .eq("id", problemId)
    .single()

  if (pe || !problem) return NextResponse.json({ error: pe?.message ?? "not found" }, { status: 400 })

  // 正解一覧（A〜P）
  const { data: blanks, error: be } = await supabaseAdmin
    .from("problem_blanks")
    .select("blank_label, correct_number")
    .eq("problem_id", problemId)

  if (be) return NextResponse.json({ error: be.message }, { status: 400 })

  const correctMap = new Map<string, number>()
  ;(blanks ?? []).forEach((b) => correctMap.set(b.blank_label, b.correct_number))

  // 判定
  const details = Array.from(correctMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([label, correct]) => {
      const givenRaw = answers[label]
      const given = typeof givenRaw === "number" ? givenRaw : Number(givenRaw)
      const ok = Number.isFinite(given) && given === correct
      return { label, given: Number.isFinite(given) ? given : null, correct, ok }
    })

  const allCorrect = details.every((d) => d.ok)

  // ここはあとで problems に explanation を追加してDBから返すのが理想。
  // 今は最低限で、間違えた空欄だけメッセージを返す。
  const wrong = details.filter((d) => !d.ok)

  return NextResponse.json({
    correct: allCorrect,
    message: allCorrect ? "正解！" : "不正解…",
    details,
    explanation: allCorrect
      ? undefined
      : wrong.map((w) => `${w.label} は ${w.correct} が正解`).join(" / "),
  })
}
