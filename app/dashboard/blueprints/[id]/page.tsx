import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { submitToQStash } from "./actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layers, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

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
    return <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground p-8">Không tìm thấy bản thiết kế đề thi.</div>
  }

  const blueprint = bp.structure_data

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Review Blueprint</h1>
          <p className="text-muted-foreground mt-2">
            Đề gốc: <span className="font-medium text-foreground">{bp.exams.title}</span> (Máy AI phân tích Khối {bp.exams.grade_level})
          </p>
        </div>
        
        <form action={submitToQStash}>
          <input type="hidden" name="blueprintId" value={bp.id} />
          <input type="hidden" name="gradeLevel" value={bp.exams.grade_level} />
          <Button
            type="submit"
            size="lg"
            className={cn("w-full sm:w-auto gap-2")}
          >
            <Zap className="size-4" />
            Duyệt & Generate Đề Mới (AI)
          </Button>
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-fit">
          <CardHeader>
             <CardTitle className="text-lg">Thông tin chung</CardTitle>
             <CardDescription>Cấu trúc toàn cảnh của đề thi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Mức độ (Difficulty)</span><span className="font-medium bg-muted px-2 py-0.5 rounded">{blueprint.difficultyLevel}</span></div>
            <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Khối lớp (Grade)</span><span className="font-medium">{blueprint.targetGrade}</span></div>
            <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Mục đích (Purpose)</span><span className="font-medium">{blueprint.examPurpose}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Tổng số câu hỏi</span><span className="font-bold text-lg leading-none">{blueprint.totalQuestions}</span></div>
          </CardContent>
        </Card>

        <Card className="max-h-[600px] flex flex-col">
           <CardHeader className="pb-4">
             <CardTitle className="text-lg flex items-center gap-2">
               <Layers className="size-5 text-primary" />
               Cấu trúc các phần (Sections)
             </CardTitle>
           </CardHeader>
           <CardContent className="flex-1 overflow-auto space-y-4">
             {blueprint.sections?.map((sec: any, idx: number) => (
               <div key={idx} className="bg-muted/50 rounded-lg p-4 space-y-3 border shadow-sm">
                  <div className="font-semibold text-foreground">{sec.sectionName}</div>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="space-y-1">
                      <span className="text-muted-foreground text-xs block">Dạng câu hỏi</span> 
                      <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">{sec.questionType}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs block">Số câu</span> 
                        <span className="font-medium">{sec.questionCount}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-xs block">Tổng điểm</span> 
                        <span className="font-medium">{sec.totalPoints}</span>
                      </div>
                    </div>
                  </div>
                  
                  {sec.sampleQuestionFormat && (
                    <div className="text-xs mt-3 bg-background p-3 rounded-md text-muted-foreground border">
                      <span className="font-semibold text-foreground block mb-1">Ví dụ/Định dạng:</span> 
                      {sec.sampleQuestionFormat}
                    </div>
                  )}
               </div>
             ))}
           </CardContent>
        </Card>
      </div>
    </div>
  )
}
