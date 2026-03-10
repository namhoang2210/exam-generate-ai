"use client"

import { useState, useRef, useEffect } from "react"
import { LogOut, User, Settings, CreditCard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { logout } from "@/app/login/actions"
import { cn } from "@/lib/utils"

interface UserNavProps {
  user: {
    email?: string
    id: string
  }
  profile?: {
    full_name?: string
  } | null
}

export function UserNav({ user, profile }: UserNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Đóng menu khi click ra ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full p-4 rounded-[2rem] bg-zinc-50 border border-zinc-100 mb-2 relative overflow-hidden group transition-all hover:bg-zinc-100 active:scale-[0.98] cursor-pointer",
          isOpen && "ring-2 ring-indigo-500/20 border-indigo-200 bg-white shadow-lg shadow-indigo-500/5 transition-all"
        )}
      >
        <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100/30 rounded-full blur-2xl -z-10 group-hover:bg-indigo-200/40 transition-colors" />
        <div className="flex items-center gap-3 relative z-10 text-left">
          <div className="flex size-10 items-center justify-center rounded-2xl bg-white border border-zinc-200 shadow-sm text-indigo-600 font-black shrink-0 group-hover:scale-110 transition-transform">
            {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-black truncate text-zinc-900">{profile?.full_name || user.email?.split("@")[0]}</p>
            <p className="text-[10px] text-zinc-400 font-bold truncate uppercase tracking-widest leading-none mt-0.5">{user.email}</p>
          </div>
        </div>
      </button>

      {/* Popover Menu */}
      {isOpen && (
        <div className="absolute bottom-full left-0 w-full mb-3 p-2 rounded-[2rem] bg-white border border-zinc-100 shadow-2xl shadow-indigo-500/10 animate-in fade-in slide-in-from-bottom-2 duration-200 z-50">
          <div className="space-y-1">
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group cursor-pointer">
              <User className="size-4 text-zinc-300 group-hover:text-indigo-600" />
              Hồ sơ của tôi
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group cursor-pointer">
              <Settings className="size-4 text-zinc-300 group-hover:text-indigo-600" />
              Cài đặt
            </button>
            <button className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-zinc-500 hover:text-indigo-600 hover:bg-indigo-50/50 transition-all group border-b border-zinc-50 mb-1 pb-4 cursor-pointer">
              <CreditCard className="size-4 text-zinc-300 group-hover:text-indigo-600" />
              Gói dịch vụ
            </button>
            
            <form action={logout}>
              <button
                type="submit"
                className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-destructive hover:bg-destructive/5 transition-all group cursor-pointer"
              >
                <LogOut className="size-4 text-zinc-300 group-hover:text-destructive" />
                Đăng xuất
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
