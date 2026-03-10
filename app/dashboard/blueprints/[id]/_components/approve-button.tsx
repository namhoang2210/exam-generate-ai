"use client"

import { useFormStatus } from "react-dom"
import { Button } from "@/components/ui/button"
import { Loader2, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

export default function ApproveButton() {
  const { pending } = useFormStatus()

  return (
    <Button
      type="submit"
      disabled={pending}
      size="lg"
      className={cn(
        "w-full sm:w-auto h-14 px-10 rounded-2xl flex gap-3 font-black uppercase tracking-widest shadow-2xl transition-all relative overflow-hidden group cursor-pointer",
        pending 
          ? "bg-indigo-600 animate-pulse-glow" 
          : "bg-linear-to-br from-indigo-600 to-blue-700 hover:scale-[1.02] active:scale-[0.98] shadow-indigo-600/20"
      )}
    >
      {/* AI Shimmer effect layer */}
      {pending && (
        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/60 to-transparent animate-shimmer" />
      )}
      
      <div className="relative z-10 flex items-center gap-3">
        {pending ? (
          <>
            <Loader2 className="size-5 animate-spin" />
            Đang gửi Job AI...
          </>
        ) : (
          <>
            <Sparkles className="size-5 group-hover:rotate-12 transition-transform text-amber-300" />
            Duyệt & Sinh Đề Mới (AI)
          </>
        )}
      </div>
    </Button>
  )
}
