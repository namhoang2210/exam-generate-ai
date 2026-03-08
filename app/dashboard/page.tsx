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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tổng quan hệ thống</h1>
        <p className="text-muted-foreground mt-2">Theo dõi các đề thi Tiếng Anh bạn đã upload và tạo mới qua AI.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="tracking-tight text-sm font-medium">Tổng Đề Tải Lên</CardTitle>
            <FileUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{exams?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="tracking-tight text-sm font-medium">Đề Đã Generate</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{generatedCount}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold tracking-tight">Đề tải lên gần đây</h2>
          <Link href="/dashboard/upload" className={cn(buttonVariants({ size: "sm" }), "gap-2")}>
            <PlusCircle className="size-4" />
            Upload Đề Mới
          </Link>
        </div>
        
        <Card>
          <div className="divide-y overflow-hidden rounded-xl bg-background">
            {!exams || exams.length === 0 ? (
              <div className="flex h-[200px] flex-col items-center justify-center text-center">
                 <div className="flex size-12 items-center justify-center rounded-full bg-muted mb-4">
                   <FileUp className="size-6 text-muted-foreground" />
                 </div>
                 <h3 className="font-semibold text-lg">Chưa có dữ liệu</h3>
                 <p className="text-sm text-muted-foreground">Tải lên đề mẫu đầu tiên của bạn để AI phân tích.</p>
              </div>
            ) : (
                exams.map((exam) => (
                  <div key={exam.id} className="p-4 sm:px-6 flex items-center justify-between hover:bg-muted/50 transition-colors">
                    <div className="grid gap-1">
                      <Link href={`/dashboard/exams`} className="font-semibold text-foreground hover:underline">
                        {exam.title}
                      </Link>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="secondary" className="font-normal rounded-sm px-1.5 hidden sm:inline-flex">Khối {exam.grade_level}</Badge>
                        <span className="flex items-center gap-1">
                          <CalendarIcon className="size-3" />
                         {new Date(exam.created_at).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={exam.status === 'analyzed' ? 'default' : 'outline'} className="capitalize">
                        {exam.status}
                      </Badge>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <MoreHorizontal className="size-4" />
                      </Button>
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
