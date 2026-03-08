import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { submitToQStash } from "./actions"

export default async function BlueprintReviewPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: bp, error } = await supabase
    .from("exam_blueprints")
    .select("*, exams(*)")
    .eq("id", params.id)
    .single()

  if (error || !bp) {
    return <div className="p-8 text-center">Không tìm thấy bản thiết kế đề thi.</div>
  }

  const blueprint = bp.structure_data

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Review Blueprint</h1>
          <p className="text-gray-500 mt-1">
            Đề gốc: <span className="font-medium text-gray-800">{bp.exams.title}</span> (Máy phân tích Khối {bp.exams.grade_level})
          </p>
        </div>
        
        <form action={submitToQStash}>
          <input type="hidden" name="blueprintId" value={bp.id} />
          <input type="hidden" name="gradeLevel" value={bp.exams.grade_level} />
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Duyệt & Generate Đề Mới (AI)
          </button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4">
          <h3 className="font-semibold text-lg border-b pb-2">Thông tin chung</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Mức độ difficulty</span><span className="font-medium">{blueprint.difficultyLevel}</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Khối</span><span className="font-medium">{blueprint.targetGrade}</span></div>
            <div className="flex justify-between border-b pb-2"><span className="text-gray-500">Mục đích</span><span className="font-medium">{blueprint.examPurpose}</span></div>
            <div className="flex justify-between pb-2"><span className="text-gray-500">Tổng số câu hỏi</span><span className="font-medium">{blueprint.totalQuestions}</span></div>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm space-y-4 max-h-[500px] overflow-auto">
           <h3 className="font-semibold text-lg border-b pb-2">Cấu trúc các phần (Sections)</h3>
           {blueprint.sections?.map((sec: any, idx: number) => (
             <div key={idx} className="bg-gray-50 rounded-lg p-4 space-y-2 border">
                <div className="font-semibold text-gray-800">{sec.sectionName}</div>
                <div className="text-sm flex justify-between"><span className="text-gray-500">Dạng:</span> <span className="font-medium text-blue-600">{sec.questionType}</span></div>
                <div className="text-sm flex justify-between"><span className="text-gray-500">Số câu:</span> <span>{sec.questionCount}</span></div>
                <div className="text-sm flex justify-between"><span className="text-gray-500">Điểm:</span> <span>{sec.totalPoints}</span></div>
                
                {sec.sampleQuestionFormat && (
                  <div className="text-xs mt-2 bg-gray-200 p-2 rounded text-gray-700">
                    <span className="font-semibold">Mẫu:</span> {sec.sampleQuestionFormat}
                  </div>
                )}
             </div>
           ))}
        </div>
      </div>
    </div>
  )
}
