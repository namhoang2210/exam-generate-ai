"use server"

import { Client } from "@upstash/qstash"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

const qstashClient = new Client({
  token: process.env.QSTASH_TOKEN!,
})

export async function submitToQStash(formData: FormData) {
  const blueprintId = formData.get("blueprintId") as string
  const gradeLevel = formData.get("gradeLevel") as string

  // Trong thực tế cần có file .env với public URL của App (khi deploy) để QStash gọi ngược lại.
  // Ví dụ: https://my-exam-gen.vercel.app/api/webhook/generate
  // Nếu local, có thể dùng ngrok để test.
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"
  
  try {
    const supabase = await createClient()

    // 1. Tạo bản ghi generated_exams với trạng thái pending
    const { data: newExam, error: insertError } = await supabase
      .from("generated_exams")
      .insert({
        blueprint_id: blueprintId,
        status: "pending",
      }).select().single()

    if (insertError) {
      console.error("Lỗi khi thêm DB generated_exams:", insertError)
      return
    }

    // 2. Gọi QStash chạy background job
    if (process.env.QSTASH_TOKEN) {
      await qstashClient.publishJSON({
        url: `${siteUrl}/api/webhook/generate`,
        body: {
          blueprintId,
          gradeLevel,
          generatedExamId: newExam.id
        },
      })
    } else {
      console.warn("QSTASH_TOKEN is missing. Please set it to trigger the background job properly.")
    }
  } catch (error) {
    console.error("Error publishing to QStash", error)
  }

  // Chuyển về màn hình danh sách các đề
  redirect("/dashboard/exams")
}
