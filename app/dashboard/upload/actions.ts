"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { extractTextFromFile } from "@/lib/file-parser"
import { analyzeBlueprint } from "@/lib/groq"

export async function uploadExamAction(prevState: any, formData: FormData) {
  let redirectUrl: string | null = null
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Bạn chưa đăng nhập." }
    }

    const file = formData.get("file") as File

    console.log(`[UPLOAD_START] User: ${user.id}, File: ${file?.name}`)

    if (!file || file.size === 0) {
      return { error: "Vui lòng chọn file hợp lệ." }
    }

    // 1. Trích xuất văn bản
    console.log(`[STEP 1] Extracting text from file...`)
    const buffer = Buffer.from(await file.arrayBuffer())
    const textContent = await extractTextFromFile(buffer, file.name, file.type)

    if (!textContent || textContent.length < 50) {
       console.error(`[ERROR] Text extraction failed or content too short.`)
       return { error: "Không thể nhận diện văn bản từ file này. Hãy thử file có chứa văn bản rõ ràng." }
    }
    console.log(`[TEXT_EXTRACTED] Length: ${textContent.length} chars.`)

    // 2. Phân tích AI để lấy Blueprint và Meta-data
    console.log(`[STEP 2] AI Analysis starting (Groq Cloud - Llama 3.3)...`)
    const blueprint = await analyzeBlueprint(textContent)
    console.log(`[AI_ANALYZED] Success. Suggested Title: ${blueprint.exam_meta?.title}`)

    // 3. Quyết định Title và Grade (Hoàn toàn từ AI)
    const finalTitle = blueprint.exam_meta?.title || `Đề thi mới (${new Date().toLocaleDateString('vi-VN')})`
    
    // Tự nhận diện khối lớp từ tiêu đề (Tìm số 6, 7, 8, 9)
    let finalGrade = 9;
    const gradeMatch = finalTitle.match(/(?:lớp|khối|grade|class)\s*(\d+)/i);
    if (gradeMatch) {
      finalGrade = parseInt(gradeMatch[1], 10);
    } else if (finalTitle.includes("10")) {
      finalGrade = 9; // Ôn thi vào 10
    }

    // 4. Lưu vào Database
    console.log(`[STEP 3] Saving to Database...`)
    const { data: examData, error: examError } = await supabase
      .from("exams")
      .insert({
        title: finalTitle,
        grade_level: finalGrade,
        teacher_id: user.id,
        content: textContent, // Lưu nội dung để sinh đề sau này
        status: "analyzed",
      }).select().single()

    if (examError) {
      console.error(`[DB_ERROR] Exams table: ${examError.message}`)
      throw new Error("Database error: " + examError.message)
    }

    // Lưu vào exam_blueprints
    const { data: bpData, error: bpError } = await supabase
      .from("exam_blueprints")
      .insert({
        exam_id: examData.id,
        structure_data: blueprint,
      }).select().single()

    if (bpError) {
      console.error(`[DB_ERROR] Blueprints table: ${bpError.message}`)
      throw new Error("Database blueprint error: " + bpError.message)
    }

    console.log(`[UPLOAD_SUCCESS] Exam ID: ${examData.id}, Blueprint ID: ${bpData.id}`)

    redirectUrl = `/dashboard/blueprints/${bpData.id}`

  } catch (error: any) {
    console.error("Upload error:", error)
    return { error: error.message || "Đã xảy ra lỗi hệ thống." }
  }

  if (redirectUrl) {
    redirect(redirectUrl)
  }
}
