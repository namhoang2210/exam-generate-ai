"use client"

import { useActionState } from "react"
import { uploadExamAction } from "./actions"
import { Loader2, Upload, FileType2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function UploadPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => await uploadExamAction(prevState, formData),
    null
  )

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-black tracking-tight uppercase text-zinc-900">Upload đề mẫu</h1>
        <p className="text-zinc-500 font-medium">Hệ thống sẽ phân tích cấu trúc từ đề thi tải lên (PDF/DOCX) và tạo ra bản thiết kế Blueprint bằng AI.</p>
      </div>

      <Card className="rounded-[2.5rem] border-zinc-100 shadow-2xl shadow-indigo-500/5 bg-white/70 backdrop-blur-xl overflow-hidden">
        <CardContent className="p-10">
          <form action={formAction} className="space-y-8">
            {state?.error && (
              <div className="p-4 bg-destructive/5 text-destructive rounded-2xl text-xs border border-destructive/10 font-bold uppercase tracking-widest text-center animate-in fade-in zoom-in duration-300">
                {state.error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest ml-1 text-zinc-500">Tên đề thi</Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  required
                  placeholder="VD: Đề thi Giữa kì 1 Tiếng Anh 6"
                  className="rounded-2xl border-zinc-100 bg-zinc-50/50 h-12 focus-visible:ring-indigo-500/20 focus-visible:border-indigo-500/50 transition-all font-medium px-4"
                />
              </div>
              
              <div className="space-y-3">
                <Label htmlFor="grade" className="text-xs font-black uppercase tracking-widest ml-1 text-zinc-500">Khối lớp (Grade)</Label>
                <select 
                  id="grade"
                  name="grade" 
                  required
                  className="flex h-12 w-full items-center justify-between rounded-2xl border border-zinc-100 bg-zinc-50/50 px-4 py-2 text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E')] bg-size-[1.2em] bg-position-[right_1rem_center] bg-no-repeat"
                  defaultValue="6"
                >
                  <option value="6">Khối 6</option>
                  <option value="7">Khối 7</option>
                  <option value="8">Khối 8</option>
                  <option value="9">Khối 9</option>
                </select>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <Label htmlFor="file-upload" className="text-xs font-black uppercase tracking-widest ml-1 text-zinc-500">File đề thi (PDF, DOCX)</Label>
              <div className="mt-2 flex justify-center rounded-[2rem] border-2 border-dashed border-zinc-200 px-6 py-16 transition-all hover:border-indigo-400 hover:bg-indigo-50/30 group cursor-pointer relative">
                <input id="file-upload" name="file" type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept=".pdf,.doc,.docx" required />
                <div className="text-center relative z-0">
                  <div className="mx-auto flex size-16 items-center justify-center rounded-[1.5rem] bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-indigo-100/50">
                    <Upload className="size-8" aria-hidden="true" />
                  </div>
                  <div className="mt-6 flex text-sm leading-6 text-zinc-600 justify-center font-bold">
                    <span className="text-indigo-600 hover:underline">Tải file lên</span>
                    <p className="pl-1 text-zinc-400">hoặc kéo thả vào đây</p>
                  </div>
                  <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mt-2">Hỗ trợ PDF, DOCX tối đa 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-zinc-100">
              <Button
                type="submit"
                disabled={isPending}
                className="h-12 px-8 rounded-2xl flex gap-3 font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20 group hover:scale-[1.02] active:scale-[0.98] transition-all bg-linear-to-br from-indigo-600 to-blue-600"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-5 animate-spin" />
                    Đang phân tích AI...
                  </>
                ) : (
                  <>
                    <FileType2 className="size-5 group-hover:rotate-12 transition-transform" />
                    Bắt đầu phân tích
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
