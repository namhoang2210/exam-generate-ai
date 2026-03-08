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
    <div className="flex min-h-screen w-full bg-muted/30">
      <aside className="w-64 flex-col border-r bg-background px-4 py-6 hidden md:flex h-screen sticky top-0">
        <div className="flex items-center gap-2 px-2 border-b pb-6 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
            <GraduationCap className="size-5" />
          </div>
          <span className="text-lg font-display tracking-wide">ExamGen AI</span>
        </div>
        
        <nav className="flex-1 space-y-1.5 flex flex-col">
          <Link href="/dashboard" className={cn(buttonVariants({ variant: "ghost" }), "justify-start gap-3 w-full")}>
            <LayoutDashboard className="size-4 text-muted-foreground" />
            Tổng quan
          </Link>
          <Link href="/dashboard/upload" className={cn(buttonVariants({ variant: "ghost" }), "justify-start gap-3 w-full")}>
            <FileUp className="size-4 text-muted-foreground" />
            Upload Đề Mẫu
          </Link>
          <Link href="/dashboard/exams" className={cn(buttonVariants({ variant: "ghost" }), "justify-start gap-3 w-full")}>
            <Files className="size-4 text-muted-foreground" />
            Đề Đã Tạo
          </Link>
        </nav>
        
        <div className="border-t pt-6 space-y-4">
          <div className="px-3">
            <p className="text-sm font-medium">{profile?.full_name || user.email?.split("@")[0]}</p>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
          </div>
          <form action={logout}>
            <Button variant="destructive" className="w-full justify-start gap-3" type="submit">
              <LogOut className="size-4" />
              Đăng xuất
            </Button>
          </form>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-h-screen">
        <header className="flex h-14 items-center border-b bg-background px-4 md:hidden">
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="size-5" />
          </Button>
          <span className="text-lg font-display tracking-wide">ExamGen AI</span>
          <div className="ml-auto">
             <form action={logout}>
                <Button variant="ghost" size="sm" type="submit" className="text-destructive">Đăng xuất</Button>
             </form>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-8 md:max-w-6xl w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
