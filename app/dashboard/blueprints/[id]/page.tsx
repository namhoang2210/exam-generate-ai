import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { submitToQStash } from "./actions"
import ApproveButton from "./_components/approve-button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layers } from "lucide-react"
import { cn } from "@/lib/utils"

export default async function BlueprintReviewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: bp, error } = await supabase
    .from("exam_blueprints")
    .select("*, exams(*)")
    .eq("id", id)
    .single()

  if (error || !bp) {
    return <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground p-8">Không tìm thấy bản thiết kế đề thi.</div>
  }

  const blueprint = bp.structure_data

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Review Blueprint</h1>
          <p className="text-muted-foreground mt-2">
            Đề gốc: <span className="font-medium text-foreground">{bp.exams.title}</span> (Máy AI phân tích Khối {bp.exams.grade_level})
          </p>
        </div>

        <form action={async (formData) => { "use server"; await submitToQStash(formData); }}>
          <input type="hidden" name="blueprintId" value={bp.id} />
          <input type="hidden" name="gradeLevel" value={bp.exams.grade_level} />
          <ApproveButton />
        </form>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="h-fit md:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Thông tin chung</CardTitle>
            <CardDescription>Cấu trúc toàn cảnh của đề thi</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Mức độ (Difficulty)</span><span className="font-medium bg-muted px-2 py-0.5 rounded uppercase">{blueprint.difficulty_profile?.overall}</span></div>
            <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Thời gian (Duration)</span><span className="font-medium">{blueprint.exam_meta?.duration_minutes} phút</span></div>
            <div className="flex justify-between border-b pb-3"><span className="text-muted-foreground">Thang điểm (Max Points)</span><span className="font-medium">{blueprint.exam_meta?.total_points}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Môn học</span><span className="font-bold text-primary">{blueprint.exam_meta?.subject}</span></div>
          </CardContent>
        </Card>

        <Card className="flex flex-col md:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg flex items-center gap-2">
              <Layers className="size-5 text-primary" />
              Cấu trúc các phần (Sections)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {blueprint.sections?.map((sec: any, idx: number) => (
              <div key={idx} className="bg-muted/50 rounded-lg p-4 space-y-3 border shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-foreground">{sec.title}</div>
                  <Badge variant="secondary">{sec.points}đ</Badge>
                </div>

                <div className="space-y-2">
                  {sec.question_groups?.map((group: any, gIdx: number) => (
                    <div key={gIdx} className="grid grid-cols-2 gap-2 text-sm bg-background p-2 rounded border border-zinc-100">
                      <div className="space-y-1">
                        <span className="text-muted-foreground text-[10px] block uppercase font-bold">Dạng câu hỏi</span>
                        <span className="font-medium text-xs">{group.type}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1 text-right">
                          <span className="text-muted-foreground text-[10px] block uppercase font-bold">Số câu</span>
                          <span className="font-medium">{group.count}</span>
                        </div>
                        <div className="space-y-1 text-right">
                          <span className="text-muted-foreground text-[10px] block uppercase font-bold">Định dạng</span>
                          <span className="text-[10px] font-medium bg-indigo-50 text-indigo-600 px-1 py-0.5 rounded">{group.question_format}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
