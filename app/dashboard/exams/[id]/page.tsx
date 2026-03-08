import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Printer } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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
    return <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground p-8">Bài thi chưa hoàn thiện hoặc không tồn tại.</div>
  }

  const content = exam.content_json

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-4">
            <Link href="/dashboard/exams" className={cn(buttonVariants({ variant: "ghost", size: "icon" }), "rounded-full")}>
               <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">{content?.title || "Đề thi Tiếng Anh"}</h1>
              <p className="text-muted-foreground mt-2">Dựa trên cấu trúc đề: {exam.exam_blueprints?.exams?.title}</p>
            </div>
         </div>
         <Button variant="outline" className="gap-2">
            <Printer className="size-4" />
            In đề thi / In PDF
         </Button>
      </div>

      <Card className="p-8 print:shadow-none print:border-none print:p-0">
         <div className="text-center mb-8 pb-8 border-b">
            <h2 className="text-2xl font-bold uppercase text-foreground">{content?.title || "ĐỀ THI TIẾNG ANH"}</h2>
            <p className="text-sm font-medium text-muted-foreground mt-2">Thời gian làm bài: {content?.totalTimeMinutes || 45} phút</p>
         </div>

         <div className="space-y-10">
            {content?.sections?.map((section: any, idx: number) => (
              <div key={idx} className="space-y-4">
                 <h3 className="text-lg font-bold uppercase tracking-tight text-foreground">I. {section.sectionName}</h3>
                 {section.directions && <p className="italic text-muted-foreground text-sm mb-4">{section.directions}</p>}
                 
                 <div className="space-y-6">
                    {section.questions?.map((q: any, qIdx: number) => (
                      <div key={qIdx} className="space-y-2">
                         <div className="flex gap-2 text-foreground">
                            <span className="font-semibold">{qIdx + 1}.</span>
                            <span>{q.questionText}</span>
                         </div>
                         {q.options && q.options.length > 0 && (
                           <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pl-6 mt-3">
                              {q.options.map((opt: string, optIdx: number) => (
                                <div key={optIdx} className="flex gap-2 text-sm text-foreground">
                                   <span className="font-semibold">{String.fromCharCode(65 + optIdx)}.</span> {opt}
                                </div>
                              ))}
                           </div>
                         )}
                         {q.correctAnswer && (
                           <div className="hidden print:hidden mt-3 ml-6 p-3 bg-muted rounded-md border text-sm text-muted-foreground">
                             <strong className="text-foreground">Đáp án:</strong> <span className="text-primary font-medium">{q.correctAnswer}</span> 
                             {q.explanation && <span> - {q.explanation}</span>}
                           </div>
                         )}
                      </div>
                    ))}
                 </div>
              </div>
            ))}
         </div>
      </Card>
    </div>
  )
}
