import { NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { createClient } from "@supabase/supabase-js"
import { generateExamContent } from "@/lib/groq"

export const maxDuration = 60
export const dynamic = 'force-dynamic'

async function handler(req: Request) {
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const payload = await req.json()
  const { blueprintId, gradeLevel, generatedExamId } = payload

  try {
    // 1. Fetch blueprint và exam content (để làm reference)
    console.log(`[WEBHOOK] Processing Blueprint: ${blueprintId}`);
    const { data: blueprintReq, error: fetchErr } = await supabaseAdmin
      .from("exam_blueprints")
      .select("*, exams(content)")
      .eq("id", blueprintId)
      .single()

    if (fetchErr || !blueprintReq) {
      console.error("[WEBHOOK_ERROR] Blueprint not found", fetchErr)
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
    }

    // 2. Chuyển trạng thái sang processing
    await supabaseAdmin
      .from("generated_exams")
      .update({ status: "processing" })
      .eq("id", generatedExamId)

    // 3. Gọi Groq AI để sinh đề
    console.log(`[WEBHOOK] Calling Groq AI Llama 3.3 for generation...`);
    const referenceContent = blueprintReq.exams?.content?.substring(0, 5000) || "";
    const finalExamContent = await generateExamContent(blueprintReq.structure_data, referenceContent);
    console.log(`[WEBHOOK] AI Content Generated FULL JSON:`, JSON.stringify(finalExamContent, null, 2));

    // 4. Cập nhật kết quả vào DB
    console.log(`[WEBHOOK] Saving content to generatedExamId: ${generatedExamId}`);
    const { error: updateErr } = await supabaseAdmin
      .from("generated_exams")
      .update({
        status: "completed",
        content_json: finalExamContent,
      })
      .eq("id", generatedExamId)

    if (updateErr) throw updateErr;

    console.log(`[WEBHOOK_SUCCESS] Exam generated and saved.`);
    revalidatePath("/dashboard/exams")
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("[WEBHOOK_CRITICAL_ERROR]", error)

    // Cập nhật trạng thái failed
    await supabaseAdmin
      .from("generated_exams")
      .update({ status: "failed" })
      .eq("id", generatedExamId)

    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Bọc handler với middleware verify chữ ký từ QStash
export const POST = process.env.NODE_ENV === "development"
  ? async (req: Request) => handler(req)
  : verifySignatureAppRouter(handler)
