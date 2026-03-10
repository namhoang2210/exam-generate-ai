import { createClient } from "@/lib/supabase/server"
import Link from "next/link"
import { FileUp, Search, PlusCircle, CalendarIcon, MoreHorizontal } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: exams, error } = await supabase
    .from("exams")
    .select("*, exam_blueprints(id, generated_exams(id, status))")
    .order("created_at", { ascending: false })
    .limit(5)

  // Đếm sơ bộ số lượng đề đã sinh từ blueprints của user
  // Đây là ví dụ truy vấn thủ công, thực tế có thể cần aggregate sum
  let generatedCount = 0;
  exams?.forEach(ex => {
    ex.exam_blueprints?.forEach((bp: any) => {
      generatedCount += bp.generated_exams?.length || 0;
    })
  });

  return (
    <div className="space-y-12">
      {/* Header section */}
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight uppercase">Tổng quan hệ thống</h1>
        <p className="text-zinc-500 font-medium">Theo dõi các đề thi Tiếng Anh bạn đã upload và tạo mới qua AI.</p>
      </div>

      {/* Stats section */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="rounded-[2.5rem] border-zinc-100 shadow-xl shadow-indigo-500/5 overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Tổng Đề Tải Lên</CardTitle>
            <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
              <FileUp className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-2">
            <div className="text-4xl font-black text-indigo-600 leading-none">{exams?.length || 0}</div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">Tài liệu đã phân tích</p>
          </CardContent>
        </Card>

        <Card className="rounded-[2.5rem] border-zinc-100 shadow-xl shadow-blue-500/5 overflow-hidden group hover:scale-[1.02] transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2 px-8 pt-8">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400">Đề Đã Generate</CardTitle>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Search className="size-4" />
            </div>
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-2">
            <div className="text-4xl font-black text-blue-600 leading-none">{generatedCount}</div>
            <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-2">Biến thể AI sản sinh</p>
          </CardContent>
        </Card>

        {/* Action card */}
        <div className="md:col-span-1">
          <Link href="/dashboard/upload" className="block h-full cursor-pointer">
            <div className="h-full rounded-[2.5rem] bg-linear-to-br from-indigo-600 to-blue-600 p-8 text-white shadow-xl shadow-indigo-200 relative overflow-hidden group hover:scale-[1.02] active:scale-[0.98] transition-all">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <PlusCircle className="size-24" />
              </div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <PlusCircle className="size-8 mb-4" />
                  <h3 className="text-xl font-black uppercase tracking-tight">Tạo đề mới</h3>
                  <p className="text-indigo-100/80 text-sm font-medium mt-1">Bắt đầu quy trình AI phân tích</p>
                </div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest bg-white/20 backdrop-blur-sm w-fit px-4 py-2 rounded-full mt-4">
                  Bắt đầu ngay
                </div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Recent Activity section */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-2xl font-black tracking-tight uppercase">Đề tải lên gần đây</h2>
          <Link href="/dashboard/exams" className="text-xs font-black uppercase tracking-widest text-indigo-600 hover:underline">
            Xem tất cả
          </Link>
        </div>
        
        <Card className="rounded-[2.5rem] border-zinc-100 shadow-xl shadow-zinc-200/20 overflow-hidden bg-white/50 backdrop-blur-sm p-4">
          <div className="space-y-3">
            {!exams || exams.length === 0 ? (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                 <div className="flex size-16 items-center justify-center rounded-[2rem] bg-zinc-50 border border-zinc-100 mb-6">
                   <FileUp className="size-8 text-zinc-300" />
                 </div>
                 <h3 className="font-black text-xl uppercase tracking-tight text-zinc-400">Chưa có dữ liệu</h3>
                 <p className="text-sm text-zinc-400 font-medium max-w-[240px] mt-2">Tải lên đề mẫu đầu tiên của bạn để AI phân tích và lưu trữ tại đây.</p>
                 <Link href="/dashboard/upload" className={cn(buttonVariants({ size: "lg" }), "mt-8 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-indigo-100")}>
                    Tải đề ngay
                 </Link>
              </div>
            ) : (
                exams.map((exam) => (
                  <div key={exam.id} className="group relative">
                    <div className="p-5 rounded-[2rem] bg-white border border-zinc-50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-indigo-100 hover:shadow-lg hover:shadow-indigo-50 transition-all duration-300">
                      <div className="flex items-center gap-5 min-w-0 flex-1">
                        <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 shrink-0 group-hover:scale-110 transition-transform">
                          <PlusCircle className="size-6" />
                        </div>
                        <div className="grid gap-1 min-w-0">
                          <Link href={`/dashboard/exams`} className="font-black text-lg text-zinc-900 hover:text-indigo-600 transition-colors truncate">
                            {exam.title}
                          </Link>
                          <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                            <span className="bg-zinc-100 px-2.5 py-1 rounded-full text-zinc-500">Khối {exam.grade_level}</span>
                            <span className="flex items-center gap-1.5">
                              <CalendarIcon className="size-3" />
                              {new Date(exam.created_at).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-zinc-50">
                        <Badge 
                          variant={exam.status === 'analyzed' ? 'default' : 'outline'} 
                          className={cn(
                            "rounded-full px-4 h-8 border-0 font-black uppercase tracking-widest text-[10px]",
                            exam.status === 'analyzed' ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 shadow-none" : "bg-zinc-50 text-zinc-400 shadow-none hover:bg-zinc-100"
                          )}
                        >
                          {exam.status === 'analyzed' ? "Đã phân tích" : "Đang chờ"}
                        </Badge>
                        <Button variant="ghost" size="icon" className="size-10 rounded-xl hover:bg-zinc-50 text-zinc-300 hover:text-zinc-600">
                          <MoreHorizontal className="size-5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
            )}
          </div>
        </Card>
      </div>
    </div>
  )
}
