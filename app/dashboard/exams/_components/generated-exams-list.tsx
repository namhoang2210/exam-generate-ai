"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { FileText, Loader2, CheckCircle2, AlertCircle, CalendarIcon, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"

export default function GeneratedExamsList({ initialExams }: { initialExams: any[] }) {
  const [exams, setExams] = useState(initialExams)
  const supabase = createClient()

  useEffect(() => {
    console.log("[REALTIME] Subscribing to generated_exams changes...")
    
    const channel = supabase
      .channel("generated_exams_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "generated_exams",
        },
        (payload) => {
          console.log("[REALTIME] Change received:", payload)
          
          if (payload.eventType === "UPDATE") {
            setExams((prev) => 
               prev.map((exam) => 
                 exam.id === payload.new.id 
                   ? { ...exam, ...payload.new } 
                   : exam
               )
            )
          } else if (payload.eventType === "INSERT") {
             // Handle insert if needed
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  if (!exams || exams.length === 0) {
    return (
      <Card className="rounded-[2.5rem] border-zinc-100 shadow-xl shadow-zinc-200/20 bg-white/50 backdrop-blur-sm p-20">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="flex size-20 items-center justify-center rounded-[2rem] bg-zinc-50 border border-zinc-100 mb-8">
            <FileText className="size-10 text-zinc-200" />
          </div>
          <h3 className="font-black text-2xl uppercase tracking-tight text-zinc-400">Chưa có kết quả</h3>
          <p className="text-sm text-zinc-400 font-medium max-w-[280px] mt-2">Hãy bắt đầu bằng cách tải lên một đề mẫu và yêu cầu AI sinh đề tương đương.</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="grid gap-4">
      {exams.map((gen: any) => (
        <Card key={gen.id} className="rounded-[2rem] border-zinc-100 shadow-xl shadow-zinc-500/5 hover:border-indigo-100 hover:shadow-indigo-50 transition-all duration-300 group overflow-hidden bg-white/70 backdrop-blur-xl">
          <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-5 flex-1 min-w-0">
              <div className="flex size-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform shadow-sm">
                <FileText className="size-6" />
              </div>
              <div className="grid gap-1 min-w-0">
                <h3 className="font-black text-lg text-zinc-900 group-hover:text-indigo-600 transition-colors truncate">
                  {gen.exam_blueprints?.exams?.title || "Đề thi đang xử lý"}
                </h3>
                <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                  <span className="bg-zinc-100 px-2.5 py-1 rounded-full text-zinc-500">Khối {gen.exam_blueprints?.exams?.grade_level || "..."}</span>
                  <span className="flex items-center gap-1.5">
                    <CalendarIcon className="size-3" />
                    {new Date(gen.created_at).toLocaleDateString("vi-VN")}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-center justify-between md:justify-end gap-4 pt-4 md:pt-0 border-t md:border-t-0 border-zinc-50">
              <div>
                {gen.status === "pending" && (
                  <Badge className="rounded-full px-4 h-8 bg-amber-50 text-amber-600 border-0 font-black uppercase tracking-widest text-[10px] relative overflow-hidden group">
                    <Sparkles className="w-3 h-3 mr-2 text-amber-500 animate-pulse" /> Đang chờ
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                  </Badge>
                )}
                {(gen.status === "generating" || gen.status === "processing") && (
                  <Badge className="rounded-full px-4 h-8 bg-indigo-50 text-indigo-600 border-0 font-black uppercase tracking-widest text-[10px] relative overflow-hidden animate-pulse-glow">
                    <Sparkles className="w-3 h-3 mr-2 text-indigo-500 animate-rotate-slow" /> {gen.status === "generating" ? "Đang sinh đề" : "Đang xử lý"}
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                  </Badge>
                )}
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
  )
}
