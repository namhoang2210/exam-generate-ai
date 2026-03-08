import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { logout } from "@/app/login/actions"
import { LayoutDashboard, FileUp, Files, LogOut } from "lucide-react"

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

  // Lấy profile (nếu có)
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single()

  return (
    <div className="flex min-h-screen w-full bg-gray-50/50">
      {/* Sidebar */}
      <aside className="w-64 flex-col border-r bg-white px-4 py-6 hidden md:flex">
        <div className="flex items-center gap-2 px-2 border-b pb-6">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold">
            EG
          </div>
          <span className="text-lg font-bold tracking-tight">ExamGen AI</span>
        </div>
        
        <nav className="flex-1 space-y-2 py-6">
          <Link href="/dashboard" className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-900 bg-gray-100 font-medium hover:bg-gray-100 transition-colors">
            <LayoutDashboard className="w-5 h-5 text-gray-500" />
            Tổng quan
          </Link>
          <Link href="/dashboard/upload" className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <FileUp className="w-5 h-5 text-gray-500" />
            Upload Đề Mẫu
          </Link>
          <Link href="/dashboard/exams" className="flex items-center gap-3 rounded-md px-3 py-2 text-gray-600 font-medium hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <Files className="w-5 h-5 text-gray-500" />
            Đề Đã Tạo
          </Link>
        </nav>
        
        <div className="border-t pt-6 space-y-4">
          <div className="px-3">
            <p className="text-sm font-medium">{profile?.full_name || user.email?.split("@")[0]}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
          <form action={logout}>
            <button className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-red-600 font-medium hover:bg-red-50 transition-colors">
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="flex h-16 items-center border-b bg-white px-6 md:hidden">
          <span className="text-lg font-bold tracking-tight">ExamGen AI</span>
          <div className="ml-auto">
             <form action={logout}>
                <button className="text-sm text-red-600 font-medium">Đăng xuất</button>
             </form>
          </div>
        </header>
        <div className="flex-1 p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
