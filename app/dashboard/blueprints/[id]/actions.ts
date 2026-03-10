"use server"

import { Client } from "@upstash/qstash"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
})

import { generateExamContent } from "@/lib/groq"

export async function submitToQStash(formData: FormData) {
  let redirectUrl: string | null = null
  const blueprintId = formData.get("blueprintId") as string
  const gradeLevel = formData.get("gradeLevel") as string

  console.log(`[APPROVE_BLUEPRINT] BlueprintID: ${blueprintId}, Grade: ${gradeLevel}`);
  
  try {
    const supabase = await createClient()

    // 1. Tạo bản ghi generated_exams với trạng thái pending
    console.log(`[STEP 1] Creating pending generated_exam record...`);
    const { data: newExam, error: insertError } = await supabase
      .from("generated_exams")
      .insert({
        blueprint_id: blueprintId,
        status: "pending",
      }).select().single()

    if (insertError) {
      console.error("[DB_ERROR] Failed to insert generated_exam:", insertError)
      return { error: "Lỗi cơ sở dữ liệu." }
    }

    // 2. Gọi QStash chạy background job
    console.log(`[STEP 2] Publishing Job to QStash...`);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
    
    // Đảm bảo QSTASH_TOKEN tồn tại trước khi gọi
    if (process.env.QSTASH_TOKEN) {
      await qstashClient.publishJSON({
        url: `${siteUrl}/api/webhook/generate`,
        body: {
          blueprintId,
          gradeLevel,
          generatedExamId: newExam.id
        },
      })
      console.log(`[SUCCESS] Job queued successfully for ExamID: ${newExam.id}`);
    } else {
      console.warn("[WARNING] QSTASH_TOKEN is missing. Job will not start.");
    }

    redirectUrl = "/dashboard/exams";

  } catch (error: any) {
    console.error("[CRITICAL_ERROR] QStash operation failed:", error);
    return { error: error.message };
  }

  if (redirectUrl) {
    redirect(redirectUrl)
  }
}
