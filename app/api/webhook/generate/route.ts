import { NextResponse } from "next/server"
import { verifySignatureAppRouter } from "@upstash/qstash/dist/nextjs"
import { createClient } from "@supabase/supabase-js"
import { GoogleGenAI } from "@google/genai"

export const maxDuration = 60
export const dynamic = 'force-dynamic'

async function handler(req: Request) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const payload = await req.json()
  const { blueprintId, gradeLevel, generatedExamId } = payload

  try {
    // 1. Fetch lại blueprint từ DB
    const { data: blueprintReq, error: fetchErr } = await supabaseAdmin
      .from("exam_blueprints")
      .select("*")
      .eq("id", blueprintId)
      .single()

    if (fetchErr || !blueprintReq) {
      console.error("Không tìm thấy blueprint", fetchErr)
      return NextResponse.json({ error: "Blueprint not found" }, { status: 404 })
    }

    const structure = blueprintReq.structure_data

    // 2. Đổi status thành processing
    await supabaseAdmin
      .from("generated_exams")
      .update({ status: "processing" })
      .eq("id", generatedExamId)

    // 3. Prompt gọi Gemini
    const prompt = `Bạn là một giáo viên chuyên ra đề thi Tiếng Anh cấp trung học cơ sở tại Việt Nam.
Hãy sinh ra MỘT ĐỀ THI MỚI HOÀN TOÀN dành cho học sinh lớp ${gradeLevel}.
YÊU CẦU BẮT BUỘC: Đề thi mới phải tuân thủ CHÍNH XÁC cấu trúc đã được định nghĩa trong JSON Blueprint dưới đây (Số lượng câu hỏi, dạng câu hỏi, mức độ, điểm số).

BLUEPRINT JSON:
${JSON.stringify(structure, null, 2)}

Hãy trả về output là một cấu trúc JSON duy nhất chứa toàn bộ nội dung đề thi, phù hợp để render ra giao diện web. Trả về đúng dữ liệu, không giải thích.
Schema gợi ý của kết quả trả về là:
{
  "title": "Tên đề thi",
  "totalTimeMinutes": 45,
  "sections": [
     {
       "sectionName": "...",
       "directions": "...",
       "questions": [
          { "questionText": "...", "options": ["A", "B", "C", "D"], "correctAnswer": "A", "explanation": "..." }
       ]
     }
  ]
}`

    // 4. Gọi Gemini API
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.7, // Tăng sự đa dạng sáng tạo
      },
    })

    const finalExamContent = JSON.parse(response.text || "{}")

    // 5. Cập nhật kết quả vào DB
    await supabaseAdmin
      .from("generated_exams")
      .update({
        status: "completed",
        content_json: finalExamContent,
      })
      .eq("id", generatedExamId)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Lỗi trong quá trình generate đề:", error)

    // Nếu có lỗi, cập nhật status failed
    await supabaseAdmin
      .from("generated_exams")
      .update({ status: "failed" })
      .eq("id", generatedExamId)

    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

// Bọc handler với middleware verify chữ ký từ QStash (Bảo mật)
// Tạm thời nếu test local thì ta có thể bỏ qua verify để test dễ dàng.
export const POST = process.env.NODE_ENV === "development" 
  ? async (req: Request) => handler(req) 
  : verifySignatureAppRouter(handler)
