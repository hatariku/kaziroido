import { NextResponse } from "next/server"
import { supabaseAdmin } from "@/lib/supabase/admin"

export const runtime = "nodejs"

function getToken(req: Request) {
  const h = req.headers.get("authorization") || ""
  const m = h.match(/^Bearer\s+(.+)$/i)
  return m?.[1] ?? ""
}

export async function POST(req: Request) {
  try {
    const token = getToken(req)
    if (!token) {
      return NextResponse.json({ error: "no token" }, { status: 401 })
    }

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token)
    if (userErr || !userData.user) {
      return NextResponse.json({ error: "bad token" }, { status: 401 })
    }
    const user = userData.user

    const body = await req.json()
    const problemId = Number(body.problemId)
    const answers = (body.answers ?? {}) as Record<string, number>

    if (!Number.isFinite(problemId)) {
      return NextResponse.json({ error: "bad problemId" }, { status: 400 })
    }

    // 1) 正解データ取得（A〜P）
    const { data: blanks, error: blanksErr } = await supabaseAdmin
      .from("problem_blanks")
      .select("blank_label, correct_number")
      .eq("problem_id", problemId)

    if (blanksErr) {
      return NextResponse.json({ error: blanksErr.message }, { status: 500 })
    }

    const perBlank =
      (blanks ?? []).map((b) => {
        const your = answers[b.blank_label]
        const correct = Number(your) === Number(b.correct_number)
        return {
          label: b.blank_label,
          your: Number.isFinite(your) ? your : null,
          correct,
          correctNumber: b.correct_number,
        }
      }) ?? []

    const ok = perBlank.length > 0 && perBlank.every((x) => x.correct)

    // 2) 正解なら「クリア記録」を保存（同じ問題を何回正解しても1回だけ）
    if (ok) {
      const { error: insErr } = await supabaseAdmin
        .from("problem_clears")
        .upsert(
          { user_id: user.id, problem_id: problemId },
          { onConflict: "user_id,problem_id" }
        )

      if (insErr) {
        return NextResponse.json({ error: insErr.message }, { status: 500 })
      }
    }

    // 3) 全問クリア判定（problems 全体で判定）
    const { count: totalCount, error: totalErr } = await supabaseAdmin
      .from("problems")
      .select("id", { count: "exact", head: true })

    if (totalErr) {
      return NextResponse.json({ error: totalErr.message }, { status: 500 })
    }

    const { count: clearedCount, error: clearedErr } = await supabaseAdmin
      .from("problem_clears")
      .select("problem_id", { count: "exact", head: true })
      .eq("user_id", user.id)

    if (clearedErr) {
      return NextResponse.json({ error: clearedErr.message }, { status: 500 })
    }

    const allCleared = !!totalCount && (clearedCount ?? 0) >= totalCount

    return NextResponse.json({
      ok,
      perBlank,
      // 間違えたときの解説（今は固定。あとで problems に explanation を追加してもOK）
      explanation: ok ? "" : "もう一度PDFを見直して、空欄の番号を確認してみてください。",
      allCleared,
      clearedCount: clearedCount ?? 0,
      totalCount: totalCount ?? 0,
      // 全問クリア時に飛ばしたい場所
      nextUrl: allCleared ? "/archive" : null,
    })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "server error" }, { status: 500 })
  }
}
