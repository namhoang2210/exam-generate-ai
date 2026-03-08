import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { FileUp, Search } from "lucide-react"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  // Fetch recent uploaded exams
  const { data: exams, error } = await supabase
    .from("exams")
    .select("*, exam_blueprints(id, generated_exams(id, status))")
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-gray-500 mt-2">Theo dõi các đề thi Tiếng Anh bạn đã upload và tạo mới.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Tổng Đề Tải Lên</h3>
            <FileUp className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">{exams?.length || 0}</div>
        </div>
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="tracking-tight text-sm font-medium">Đề Đã Generate</h3>
            <Search className="h-4 w-4 text-gray-500" />
          </div>
          <div className="text-2xl font-bold">0</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Đề tải lên gần đây</h2>
          <Link href="/dashboard/upload" className="text-sm rounded-md bg-blue-600 text-white px-4 py-2 hover:bg-blue-700 font-medium">
            Upload Đề Mới
          </Link>
        </div>
        
        <div className="rounded-xl border bg-white overflow-hidden">
          {!exams || exams.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Chưa có đề thi nào trong hệ thống.
            </div>
          ) : (
            <div className="divide-y">
              {exams.map((exam) => (
                <div key={exam.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                  <div>
                    <h4 className="font-medium text-gray-900">{exam.title}</h4>
                    <p className="text-sm text-gray-500">
                      Khối {exam.grade_level} • {new Date(exam.created_at).toLocaleDateString("vi-VN")}
                    </p>
                  </div>
                  <div>
                    <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold bg-gray-100 text-gray-800">
                      {exam.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
