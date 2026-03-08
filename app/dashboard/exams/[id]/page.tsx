import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Printer } from "lucide-react"

export default async function ExamDetailPage({ params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: exam, error } = await supabase
    .from("generated_exams")
    .select(`
      *,
      exam_blueprints (
         id,
         exams (title, grade_level)
      )
    `)
    .eq("id", params.id)
    .single()

  if (error || !exam || exam.status !== "completed") {
    return <div className="p-8 text-center text-gray-500">Bài thi chưa hoàn thiện hoặc không tồn tại.</div>
  }

  const content = exam.content_json

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Link href="/dashboard/exams" className="p-2 hover:bg-gray-100 rounded-full">
               <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">{content?.title || "Đề thi Tiếng Anh"}</h1>
              <p className="text-gray-500 mt-1">Dựa trên cấu trúc đề: {exam.exam_blueprints?.exams?.title}</p>
            </div>
         </div>
         <button className="inline-flex items-center gap-2 rounded-md bg-white border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
            <Printer className="w-4 h-4" />
            In đề thi / In PDF
         </button>
      </div>

      <div className="bg-white rounded-xl border p-8 shadow-sm print:shadow-none print:border-none">
         <div className="text-center mb-8 pb-8 border-b">
            <h2 className="text-2xl font-bold uppercase">{content?.title || "ĐỀ THI TIẾNG ANH"}</h2>
            <p className="text-sm font-medium mt-2">Thời gian làm bài: {content?.totalTimeMinutes || 45} phút</p>
         </div>

         <div className="space-y-10">
            {content?.sections?.map((section: any, idx: number) => (
              <div key={idx} className="space-y-4">
                 <h3 className="text-lg font-bold uppercase tracking-tight">I. {section.sectionName}</h3>
                 {section.directions && <p className="italic text-gray-700 text-sm mb-4">{section.directions}</p>}
                 
                 <div className="space-y-6">
                    {section.questions?.map((q: any, qIdx: number) => (
                      <div key={qIdx} className="space-y-2">
                         <div className="flex gap-2">
                            <span className="font-semibold">{qIdx + 1}.</span>
                            <span className="text-gray-900">{q.questionText}</span>
                         </div>
                         {q.options && q.options.length > 0 && (
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pl-6">
                              {q.options.map((opt: string, optIdx: number) => (
                                <div key={optIdx} className="flex gap-2 text-sm">
                                   <span className="font-medium">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                                </div>
                              ))}
                           </div>
                         )}
                         {q.correctAnswer && (
                           <div className="hidden print:hidden mt-2 ml-6 p-2 bg-green-50 text-green-800 text-xs rounded border border-green-200">
                             <strong>Đáp án:</strong> {q.correctAnswer} 
                             {q.explanation && <span> - {q.explanation}</span>}
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  )
}
