"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { extractTextFromFile } from "@/lib/file-parser"
import { analyzeBlueprint } from "@/lib/gemini"

export async function uploadExamAction(prevState: any, formData: FormData) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Bạn chưa đăng nhập." }
    }

    const title = formData.get("title") as string
    const grade_level = parseInt(formData.get("grade") as string, 10)
    const file = formData.get("file") as File

    if (!file || file.size === 0) {
      return { error: "Vui lòng chọn file hợp lệ." }
    }

    // Lấy nội dung text từ PDF hoặc DOCX
    const buffer = Buffer.from(await file.arrayBuffer())
    const textContent = await extractTextFromFile(buffer, file.name, file.type)

    if (!textContent || textContent.length < 50) {
       return { error: "Không thể nhận diện văn bản từ file này. Hãy thử file có chứa văn bản rõ ràng." }
    }

    // TODO: Upload file nguyên thể lên Supabase Storage (bỏ qua lúc này vì demo)

    // Tạo record exam trong bảng
    const { data: examData, error: examError } = await supabase
      .from("exams")
      .insert({
        title,
        grade_level,
        teacher_id: user.id,
        status: "analyzed", // Vì gemini rất nhanh nên đổi luôn sang analyzed
      }).select().single()

    if (examError) throw new Error("Database error: " + examError.message)

    // Gọi Gemini API phân tích lấy JSON
    const blueprint = await analyzeBlueprint(textContent, grade_level.toString())

    // Lưu vào exam_blueprints
    const { data: bpData, error: bpError } = await supabase
      .from("exam_blueprints")
      .insert({
        exam_id: examData.id,
        structure_data: blueprint,
      }).select().single()

    if (bpError) throw new Error("Database blueprint error: " + bpError.message)

    // Chuyển hướng tới trang review blueprint
    redirect(`/dashboard/blueprints/${bpData.id}`)

  } catch (error: any) {
    console.error("Upload error:", error)
    // Avoid catching next/navigation redirect error
    if (error.message === "NEXT_REDIRECT") {
       throw error
    }
    return { error: error.message || "Đã xảy ra lỗi hệ thống." }
  }
}
