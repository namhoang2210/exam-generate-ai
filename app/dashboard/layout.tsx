import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logout } from "@/app/login/actions"
import { LayoutDashboard, FileUp, Files, LogOut, GraduationCap, Menu } from "lucide-react"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex min-h-screen w-full bg-zinc-50/50 relative overflow-hidden">
      {/* Nền decor phong cách AI */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/30 rounded-full blur-[120px] -z-10 pointer-events-none" />

      {/* Sidebar Desktop */}
      <aside className="w-72 flex-col border-r border-zinc-100 bg-white/70 backdrop-blur-xl px-6 py-8 hidden md:flex h-screen sticky top-0 z-20">
        <div className="flex items-center gap-3 px-2 pb-8 mb-4">
          <Link href="/" className="flex items-center gap-2 group transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <GraduationCap className="size-6" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600">ExamGen AI</span>
          </Link>
        </div>
        
        <div className="flex-1 space-y-8 flex flex-col">
          <div>
            <p className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-400 mb-4">Điều hướng chính</p>
            <nav className="space-y-1.5">
              <Link href="/dashboard" className={cn(
                buttonVariants({ variant: "ghost" }), 
                "justify-start gap-4 w-full h-12 rounded-2xl font-bold transition-all hover:bg-indigo-50/50 hover:text-indigo-600 group active:scale-[0.98]"
              )}>
                <LayoutDashboard className="size-5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                Tổng quan
              </Link>
              <Link href="/dashboard/upload" className={cn(
                buttonVariants({ variant: "ghost" }), 
                "justify-start gap-4 w-full h-12 rounded-2xl font-bold transition-all hover:bg-indigo-50/50 hover:text-indigo-600 group active:scale-[0.98]"
              )}>
                <FileUp className="size-5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                Upload Đề Mẫu
              </Link>
              <Link href="/dashboard/exams" className={cn(
                buttonVariants({ variant: "ghost" }), 
                "justify-start gap-4 w-full h-12 rounded-2xl font-bold transition-all hover:bg-indigo-50/50 hover:text-indigo-600 group active:scale-[0.98]"
              )}>
                <Files className="size-5 text-zinc-400 group-hover:text-indigo-600 transition-colors" />
                Đề Đã Tạo
              </Link>
            </nav>
          </div>
        </div>
        
        <div className="pt-6 mt-auto">
          <div className="p-4 rounded-[2rem] bg-zinc-50 border border-zinc-100 mb-4 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-100/50 rounded-full blur-2xl -z-10" />
             <div className="flex items-center gap-3 relative z-10">
                <div className="flex size-10 items-center justify-center rounded-2xl bg-white border border-zinc-200 shadow-sm text-indigo-600 font-black">
                   {profile?.full_name?.[0] || user.email?.[0].toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-black truncate">{profile?.full_name || user.email?.split("@")[0]}</p>
                  <p className="text-[10px] text-zinc-400 font-bold truncate uppercase tracking-widest leading-none mt-0.5">{user.email}</p>
                </div>
             </div>
          </div>
          
          <form action={logout}>
            <Button variant="ghost" className="w-full justify-start gap-4 h-12 rounded-2xl font-bold text-zinc-500 hover:text-destructive hover:bg-destructive/5 transition-all group" type="submit">
              <LogOut className="size-5 text-zinc-300 group-hover:text-destructive transition-colors" />
              Đăng xuất
            </Button>
          </form>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen relative z-10 h-screen overflow-y-auto">
        {/* Header Mobile */}
        <header className="flex h-16 items-center border-b border-zinc-100 bg-white/70 backdrop-blur-md px-6 md:hidden sticky top-0 z-30">
          <Button variant="ghost" size="icon" className="mr-3 rounded-xl border border-zinc-100 hover:bg-zinc-50">
            <Menu className="size-5" />
          </Button>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-linear-to-br from-indigo-600 to-blue-600 text-white shadow-md">
              <GraduationCap className="size-5" />
            </div>
            <span className="text-lg font-black tracking-tighter uppercase bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600">ExamGen AI</span>
          </div>
          <div className="ml-auto">
             <form action={logout}>
                <Button variant="ghost" size="sm" type="submit" className="text-[10px] font-black uppercase tracking-widest text-destructive hover:bg-destructive/5 rounded-full px-4 border border-destructive/10">Log out</Button>
             </form>
          </div>
        </header>

        <div className="flex-1 p-6 md:p-12 w-full mx-auto max-w-7xl animate-in fade-in slide-in-from-bottom-4 duration-700">
          {children}
        </div>
      </main>
    </div>
  )
}
