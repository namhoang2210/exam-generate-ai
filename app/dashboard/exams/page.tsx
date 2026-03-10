import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, Loader2, CheckCircle2, AlertCircle, CalendarIcon } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export default async function GeneratedExamsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

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
    <div className="space-y-10">
      <div className="flex flex-col gap-2">
         <h1 className="text-4xl font-black tracking-tight uppercase text-zinc-900">Đề thi đã sinh bởi AI</h1>
         <p className="text-zinc-500 font-medium">Lịch sử và trạng thái sinh đề thi tương đương từ các bản thiết kế Blueprint.</p>
      </div>

      <div className="space-y-4">
        {(!generatedExams || generatedExams.length === 0) ? (
           <Card className="rounded-[2.5rem] border-zinc-100 shadow-xl shadow-zinc-200/20 bg-white/50 backdrop-blur-sm p-20">
             <div className="flex flex-col items-center justify-center text-center">
                <div className="flex size-20 items-center justify-center rounded-[2rem] bg-zinc-50 border border-zinc-100 mb-8">
                  <FileText className="size-10 text-zinc-200" />
                </div>
                <h3 className="font-black text-2xl uppercase tracking-tight text-zinc-400">Chưa có kết quả</h3>
                <p className="text-sm text-zinc-400 font-medium max-w-[280px] mt-2">Hãy bắt đầu bằng cách tải lên một đề mẫu và yêu cầu AI sinh đề tương đương.</p>
             </div>
           </Card>
        ) : (
          <div className="grid gap-4">
             {generatedExams.map((gen: any) => (
                <Card key={gen.id} className="rounded-[2rem] border-zinc-100 shadow-xl shadow-zinc-500/5 hover:border-indigo-100 hover:shadow-indigo-50 transition-all duration-300 group overflow-hidden bg-white/70 backdrop-blur-xl">
                  <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-5 flex-1 min-w-0">
                      <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
                        <FileText className="size-6" />
                      </div>
                      <div className="grid gap-1 min-w-0">
                        <h3 className="font-black text-lg text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                          {gen.exam_blueprints?.exams?.title}
                        </h3>
                        <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                          <span className="bg-zinc-100 px-2.5 py-1 rounded-full text-zinc-500">Khối {gen.exam_blueprints?.exams?.grade_level}</span>
                          <span className="flex items-center gap-1.5">
                            <CalendarIcon className="size-3" />
                            {new Date(gen.created_at).toLocaleDateString("vi-VN")}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-row items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-50">
                      <div>
                        {gen.status === "pending" && <Badge className="rounded-full px-4 h-8 bg-amber-50 text-amber-600 border-0 font-black uppercase tracking-widest text-[10px]"><Loader2 className="w-3 h-3 animate-spin mr-2"/> Đang chờ</Badge>}
                        {gen.status === "processing" && <Badge className="rounded-full px-4 h-8 bg-blue-50 text-blue-600 border-0 font-black uppercase tracking-widest text-[10px]"><Loader2 className="w-3 h-3 animate-spin mr-2"/> Đang xử lý</Badge>}
                        {gen.status === "completed" && <Badge className="rounded-full px-4 h-8 bg-emerald-50 text-emerald-600 border-0 font-black uppercase tracking-widest text-[10px]"><CheckCircle2 className="w-3 h-3 mr-2"/> Hoàn thành</Badge>}
                        {gen.status === "failed" && <Badge className="rounded-full px-4 h-8 bg-destructive/5 text-destructive border-0 font-black uppercase tracking-widest text-[10px]"><AlertCircle className="w-3 h-3 mr-2"/> Thất bại</Badge>}
                      </div>

                      {gen.status === "completed" && (
                        <Link 
                          href={`/dashboard/exams/${gen.id}`} 
                          className={cn(
                            buttonVariants({ variant: "outline", size: "sm" }), 
                            "rounded-xl h-10 px-5 font-black uppercase tracking-widest text-[10px] border-zinc-100 hover:bg-zinc-50 hover:text-indigo-600 transition-all active:scale-95"
                          )}
                        >
                          Xem đề thi
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
             ))}
          </div>
        )}
      </div>
    </div>
  )
}
