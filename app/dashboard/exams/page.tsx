import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react"

export default async function GeneratedExamsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // Lấy các exam blueprint và generated_exams user đã yêu cầu
  const { data: generatedExams, error } = await supabase
    .from("generated_exams")
    .select(`
      *,
      exam_blueprints (
         id,
         exams (title, grade_level)
      )
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
         <h1 className="text-2xl font-bold tracking-tight text-gray-900">Đề thi đã sinh bởi AI</h1>
         <p className="text-gray-500 mt-1">Lịch sử và trạng thái sinh đề thi từ các bản thiết kế.</p>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden shadow-sm">
        {(!generatedExams || generatedExams.length === 0) && (
           <div className="p-8 text-center text-gray-500">Chưa có đề thi nào được tự động tạo.</div>
        )}

        {generatedExams && generatedExams.length > 0 && (
          <table className="w-full text-sm text-left text-gray-500">
             <thead className="text-xs text-gray-700 bg-gray-50 border-b">
               <tr>
                 <th className="px-6 py-3">Đề tham chiếu</th>
                 <th className="px-6 py-3">Khối</th>
                 <th className="px-6 py-3">Ngày Tạp</th>
                 <th className="px-6 py-3">Trạng thái (AI Gen)</th>
                 <th className="px-6 py-3 text-right">Chi tiết</th>
               </tr>
             </thead>
             <tbody>
               {generatedExams.map((gen: any) => (
                 <tr key={gen.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">
                       {gen.exam_blueprints?.exams?.title}
                    </td>
                    <td className="px-6 py-4">Khối {gen.exam_blueprints?.exams?.grade_level}</td>
                    <td className="px-6 py-4">{new Date(gen.created_at).toLocaleDateString("vi-VN")}</td>
                    <td className="px-6 py-4">
                       {gen.status === "pending" && <span className="flex items-center gap-1 text-yellow-600"><Loader2 className="w-4 h-4 animate-spin"/> Đang chờ...</span>}
                       {gen.status === "processing" && <span className="flex items-center gap-1 text-blue-600"><Loader2 className="w-4 h-4 animate-spin"/> Đang xử lý</span>}
                       {gen.status === "completed" && <span className="flex items-center gap-1 text-green-600"><CheckCircle2 className="w-4 h-4"/> Hoàn thành</span>}
                       {gen.status === "failed" && <span className="flex items-center gap-1 text-red-600"><AlertCircle className="w-4 h-4"/> Thất bại</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                       {gen.status === "completed" && (
                         <Link href={`/dashboard/exams/${gen.id}`} className="font-medium text-blue-600 hover:text-blue-800 flex items-center justify-end gap-1">
                            <FileText className="w-4 h-4" /> Xem đề thi
                         </Link>
                       )}
                    </td>
                 </tr>
               ))}
             </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
