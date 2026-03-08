"use client"

import { useActionState } from "react"
import { uploadExamAction } from "./actions"
import { Loader2, Upload } from "lucide-react"

export default function UploadPage() {
  const [state, formAction, isPending] = useActionState(
    async (prevState: any, formData: FormData) => await uploadExamAction(prevState, formData),
    null
  )

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Upload đề mẫu</h1>
        <p className="text-gray-500 mt-1">Hệ thống sẽ phân tích cấu trúc từ đề thi tải lên (PDF/DOCX) và tạo ra bản thiết kế (Blueprint).</p>
      </div>

      <div className="bg-white rounded-xl border p-6 shadow-sm">
        <form action={formAction} className="space-y-6">
          {state?.error && (
             <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm border border-red-200">
               {state.error}
             </div>
          )}
          {state?.success && (
             <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm border border-green-200">
               Nạp đề tài thành công! Đang chuyển hướng...
             </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tên đề thi</label>
              <input
                type="text"
                name="title"
                required
                className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                placeholder="VD: Đề thi Giữa kì 1 Tiếng Anh 6"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Khối lớp (Grade)</label>
              <select 
                name="grade" 
                required
                className="w-full flex h-10 rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
              >
                <option value="6">Khối 6</option>
                <option value="7">Khối 7</option>
                <option value="8">Khối 8</option>
                <option value="9">Khối 9</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">File đề thi (PDF, DOCX)</label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" />
                <div className="mt-4 flex text-sm leading-6 text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-blue-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-600 focus-within:ring-offset-2 hover:text-blue-500"
                  >
                    <span>Tải file lên</span>
                    <input id="file-upload" name="file" type="file" className="sr-only" accept=".pdf,.doc,.docx" required />
                  </label>
                  <p className="pl-1">hoặc kéo thả vào đây</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">PDF, DOCX up to 10MB</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              disabled={isPending}
              className="inline-flex items-center gap-2 justify-center rounded-md text-sm font-medium h-10 px-6 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
              {isPending ? "Đang phân tích AI..." : "Phân tích cấu trúc"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
