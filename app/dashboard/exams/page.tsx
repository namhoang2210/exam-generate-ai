import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { FileText, Loader2, CheckCircle2, AlertCircle } from "lucide-react"
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
    <div className="space-y-6">
      <div>
         <h1 className="text-3xl font-bold tracking-tight text-foreground">Đề thi đã sinh bởi AI</h1>
         <p className="text-muted-foreground mt-2">Lịch sử và trạng thái sinh đề thi từ các bản thiết kế.</p>
      </div>

      <Card className="overflow-hidden">
        {(!generatedExams || generatedExams.length === 0) ? (
           <div className="flex h-[200px] flex-col items-center justify-center text-center text-muted-foreground p-8">
             Chưa có đề thi nào được tự động tạo.
           </div>
        ) : (
          <Table>
             <TableHeader className="bg-muted/50">
               <TableRow>
                 <TableHead>Đề tham chiếu</TableHead>
                 <TableHead>Khối</TableHead>
                 <TableHead>Ngày Tạo</TableHead>
                 <TableHead>Trạng thái (AI Gen)</TableHead>
                 <TableHead className="text-right">Chi tiết</TableHead>
               </TableRow>
             </TableHeader>
             <TableBody>
               {generatedExams.map((gen: any) => (
                 <TableRow key={gen.id}>
                    <TableCell className="font-medium text-foreground">
                       {gen.exam_blueprints?.exams?.title}
                    </TableCell>
                    <TableCell><Badge variant="secondary" className="font-normal rounded-sm">Khối {gen.exam_blueprints?.exams?.grade_level}</Badge></TableCell>
                    <TableCell className="text-muted-foreground">{new Date(gen.created_at).toLocaleDateString("vi-VN")}</TableCell>
                    <TableCell>
                       {gen.status === "pending" && <Badge variant="outline" className="text-yellow-600 border-yellow-200 bg-yellow-50"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Đang chờ</Badge>}
                       {gen.status === "processing" && <Badge variant="outline" className="text-blue-600 border-blue-200 bg-blue-50"><Loader2 className="w-3 h-3 animate-spin mr-1"/> Đang xử lý</Badge>}
                       {gen.status === "completed" && <Badge variant="outline" className="text-green-600 border-green-200 bg-green-50"><CheckCircle2 className="w-3 h-3 mr-1"/> Hoàn thành</Badge>}
                       {gen.status === "failed" && <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1"/> Thất bại</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                       {gen.status === "completed" && (
                         <Link href={`/dashboard/exams/${gen.id}`} className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "text-primary gap-2")}>
                            <FileText className="w-4 h-4" /> Xem đề thi
                         </Link>
                       )}
                    </TableCell>
                 </TableRow>
               ))}
             </TableBody>
          </Table>
        )}
      </Card>
    </div>
  )
}
