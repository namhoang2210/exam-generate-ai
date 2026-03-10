"use client"

import { useActionState, useState, useRef } from "react"
import { uploadExamAction } from "./actions"
import { Loader2, Upload, FileType2, FileText, X, Sparkles } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => await uploadExamAction(prevState, formData),
    null
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      const validTypes = ['.pdf', '.doc', '.docx']
      const extension = file.name.substring(file.name.lastIndexOf('.')).toLowerCase()
      
      if (validTypes.includes(extension)) {
        setSelectedFile(file)
        // Cập nhật giá trị cho input file ẩn để form action nhận được
        if (fileInputRef.current) {
          const dataTransfer = new DataTransfer()
          dataTransfer.items.add(file)
          fileInputRef.current.files = dataTransfer.files
        }
      }
    }
  }

  const clearFile = (e: React.MouseEvent) => {
    e.preventDefault()
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

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

            {/* UI input đã được loại bỏ để AI tự nhận diện */}

            <div className="space-y-3 pt-2">
              <Label htmlFor="file-upload" className="text-xs font-black uppercase tracking-widest ml-1 text-zinc-500">File đề thi (PDF, DOCX)</Label>
              <div 
                className={cn(
                  "mt-2 flex justify-center rounded-[2rem] border-2 border-dashed px-6 py-16 transition-all group relative overflow-hidden",
                  isDragging ? "border-indigo-500 bg-indigo-50/50" : "border-zinc-200 hover:border-indigo-400 hover:bg-indigo-50/30",
                  selectedFile ? "border-emerald-500 bg-emerald-50/10" : ""
                )}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input 
                  id="file-upload" 
                  name="file" 
                  type="file" 
                  ref={fileInputRef}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                  accept=".pdf,.doc,.docx" 
                  onChange={handleFileChange}
                  required={!selectedFile} 
                />
                
                <div className="text-center relative z-0 w-full">
                  {!selectedFile ? (
                    <>
                      <div className="mx-auto flex size-16 items-center justify-center rounded-[1.5rem] bg-indigo-50 text-indigo-600 group-hover:scale-110 transition-transform duration-300 shadow-sm border border-indigo-100/50">
                        <Upload className="size-8" aria-hidden="true" />
                      </div>
                      <div className="mt-6 flex text-sm leading-6 text-zinc-600 justify-center font-bold">
                        <span className="text-indigo-600 hover:underline">Tải file lên</span>
                        <p className="pl-1 text-zinc-400">hoặc kéo thả vào đây</p>
                      </div>
                      <p className="text-[10px] uppercase tracking-widest font-black text-zinc-400 mt-2">Hỗ trợ PDF, DOCX tối đa 10MB</p>
                    </>
                  ) : (
                    <div className="flex flex-col items-center animate-in fade-in zoom-in duration-300">
                      <div className="mx-auto flex size-16 items-center justify-center rounded-[1.5rem] bg-emerald-50 text-emerald-600 shadow-sm border border-emerald-100/50">
                        <FileText className="size-8" />
                      </div>
                      <div className="mt-6 space-y-2">
                        <p className="text-sm font-black text-zinc-900 truncate max-w-xs mx-auto">{selectedFile.name}</p>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      <button 
                        onClick={clearFile}
                        className="mt-6 flex items-center gap-2 px-4 py-2 rounded-xl bg-destructive/5 text-destructive text-[10px] font-black uppercase tracking-widest hover:bg-destructive/10 transition-colors z-20"
                      >
                        <X className="size-3" />
                        Gỡ file này
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-zinc-100">
              <Button
                type="submit"
                disabled={isPending || !selectedFile}
                className={cn(
                  "h-14 px-10 rounded-2xl flex gap-3 font-black uppercase tracking-widest shadow-2xl transition-all relative overflow-hidden group cursor-pointer",
                  isPending 
                    ? "bg-indigo-600 animate-pulse-glow" 
                    : "bg-linear-to-br from-indigo-600 to-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-indigo-600/20"
                )}
              >
                {/* AI Shimmer effect layer */}
                {isPending && (
                  <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
                )}
                
                <div className="relative z-10 flex items-center gap-3">
                  {isPending ? (
                    <>
                      <Loader2 className="size-5 animate-spin" />
                      Đang phân tích AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-5 group-hover:rotate-12 transition-transform" />
                      Bắt đầu phân tích
                    </>
                  )}
                </div>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
