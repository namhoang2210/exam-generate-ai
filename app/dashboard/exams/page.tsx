import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import GeneratedExamsList from "./_components/generated-exams-list"

export const dynamic = 'force-dynamic'
export const revalidate = 0

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
        <GeneratedExamsList initialExams={generatedExams || []} />
      </div>
    </div>
  )
}
