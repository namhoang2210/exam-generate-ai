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
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Upload đề mẫu</h1>
        <p className="text-muted-foreground mt-2">Hệ thống sẽ phân tích cấu trúc từ đề thi tải lên (PDF/DOCX) và tạo ra bản thiết kế Blueprint.</p>
      </div>

      <Card className="shadow-sm">
        <CardContent className="p-6">
          <form action={formAction} className="space-y-6">
            {state?.error && (
              <div className="p-3 bg-destructive/10 text-destructive rounded-md text-sm border border-destructive/20 font-medium">
                {state.error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="title">Tên đề thi</Label>
                <Input
                  id="title"
                  type="text"
                  name="title"
                  required
                  placeholder="VD: Đề thi Giữa kì 1 Tiếng Anh 6"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grade">Khối lớp (Grade)</Label>
                <select 
                  id="grade"
                  name="grade" 
                  required
                  className="flex h-9 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="6"
                >
                  <option value="6">Khối 6</option>
                  <option value="7">Khối 7</option>
                  <option value="8">Khối 8</option>
                  <option value="9">Khối 9</option>
                </select>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <Label htmlFor="file-upload">File đề thi (PDF, DOCX)</Label>
              <div className="mt-2 flex justify-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-6 py-12 transition-colors hover:border-muted-foreground/50 bg-muted/10">
                <div className="text-center">
                  <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-primary/10">
                    <FileType2 className="size-6 text-primary" aria-hidden="true" />
                  </div>
                  <div className="mt-4 flex text-sm leading-6 text-muted-foreground justify-center">
                    <label
                      htmlFor="file-upload"
                      className="relative cursor-pointer rounded-md bg-transparent font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                    >
                      <span>Tải file lên</span>
                      <input id="file-upload" name="file" type="file" className="sr-only" accept=".pdf,.doc,.docx" required />
                    </label>
                    <p className="pl-1">hoặc kéo thả vào đây</p>
                  </div>
                  <p className="text-xs leading-5 text-muted-foreground mt-1">Hỗ trợ định dạng PDF, DOCX tối đa 10MB</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                type="submit"
                disabled={isPending}
                className="gap-2"
              >
                {isPending ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Đang phân tích AI...
                  </>
                ) : (
                  <>
                    <Upload className="size-4" />
                    Phân tích cấu trúc
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
