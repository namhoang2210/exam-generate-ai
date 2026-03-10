import Link from "next/link";
import { Button, buttonVariants } from "@/components/ui/button";
import { GraduationCap, Zap, FileSearch, Sparkles, ArrowRight, CheckCircle2, FileText } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-zinc-100">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="#" className="flex items-center gap-2 group transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-blue-600 text-white shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
              <GraduationCap className="size-6" />
            </div>
            <span className="text-xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600">ExamGen AI</span>
          </Link>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground transition-colors">
            <a href="#features" className="hover:text-primary">Tính năng</a>
            <a href="#how-it-works" className="hover:text-primary">Cách hoạt động</a>
            <Link href="/login" className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "font-semibold")}>
              Đăng nhập
            </Link>
            <Link href="/login" className={cn(buttonVariants({ size: "sm" }), "rounded-full px-5 py-5 font-bold")}>
              Bắt đầu ngay
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden py-24 md:py-32 lg:py-40">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl -z-10">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px]" />
            <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-100/50 rounded-full blur-[100px]" />
          </div>

          <div className="container mx-auto px-6 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold animate-in fade-in slide-in-from-bottom-3 duration-700">
              <Sparkles className="size-4" />
              <span>AI-Powered Exam Generation</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black leading-[1.1] tracking-tight max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000">
              Cách mạng hóa <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-600 to-violet-600">tạo đề thi</span> Tiếng Anh
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed animate-in fade-in slide-in-from-bottom-5 duration-1000">
              Phân tích cấu trúc từ đề mẫu và sinh ra hàng nghìn đề thi tương đương chỉ trong vài giây với sức mạnh của AI.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-8 text-lg font-bold h-14 shadow-xl shadow-primary/20 group")}>
                Trải nghiệm miễn phí
                <ArrowRight className="ml-2 size-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how-it-works" className={cn(buttonVariants({ variant: "outline", size: "lg" }), "rounded-full px-8 text-lg font-semibold h-14")}>
                Xem cách hoạt động
              </a>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section id="features" className="py-24 bg-zinc-50/50">
          <div className="container mx-auto px-6">
            <div className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tight">Tính năng thông minh</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Tận dụng AI để tối ưu hóa công việc soạn bài và ra đề cho giáo viên.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center mb-6">
                  <FileSearch className="size-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Phân tích chuyên sâu</h3>
                <p className="text-muted-foreground">Tự động bóc tách cấu trúc, độ khó, và phân bổ điểm số từ bất kỳ file PDF/DOCX nào bạn tải lên.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-violet-50 flex items-center justify-center mb-6">
                  <Zap className="size-6 text-violet-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Sinh đề tức thì</h3>
                <p className="text-muted-foreground">Tạo ra đề thi mới có cấu trúc tương đương 100% với nguyên bản nhưng với nội dung hoàn toàn khác biệt.</p>
              </div>
              <div className="p-8 rounded-3xl bg-white border border-zinc-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-6">
                  <CheckCircle2 className="size-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold mb-3">Độ chính xác cao</h3>
                <p className="text-muted-foreground">Bám sát chương trình học THCS Việt Nam. Giữ đúng định dạng các câu hỏi trắc nghiệm, điền từ, đọc hiểu.</p>
              </div>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="how-it-works" className="py-24 border-t border-zinc-100">
          <div className="container mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="flex-1 space-y-6 text-center lg:text-left">
                <h2 className="text-3xl md:text-5xl font-black leading-tight tracking-tight">Quy trình 3 bước đơn giản</h2>
                <div className="space-y-8 pt-4">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">1</div>
                    <div>
                      <h4 className="text-lg font-bold">Tải lên đề mẫu</h4>
                      <p className="text-muted-foreground">Chỉ cần tải lên file đề thi bạn đã có sẵn dưới định dạng PDF hoặc Word.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">2</div>
                    <div>
                      <h4 className="text-lg font-bold">AI Phân tích Blueprint</h4>
                      <p className="text-muted-foreground">Hệ thống sẽ bóc tách cấu trúc thành các "Blueprint" chi tiết để bạn kiểm tra.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 text-left">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center shrink-0 font-bold">3</div>
                    <div>
                      <h4 className="text-lg font-bold">Sinh đề & Tải xuống</h4>
                      <p className="text-muted-foreground">Bấm nút và chờ vài giây để nhận được đề thi mới hoàn toàn, sẵn sàng để in ấn.</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex-1 w-full max-w-xl aspect-square rounded-3xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-100 flex items-center justify-center p-8 relative overflow-hidden group">
                <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-indigo-100/40 via-blue-50/20 to-transparent rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-white/40 backdrop-blur-3xl group-hover:scale-110 transition-transform duration-500" />
                <FileSearch className="size-48 text-indigo-600/30 relative z-10" />
                <div className="absolute inset-x-0 bottom-0 p-8 text-center bg-gradient-to-t from-white/90 to-transparent pt-20">
                  <div className="bg-white p-4 rounded-xl shadow-lg border border-indigo-50 animate-bounce">
                    <p className="text-sm font-bold text-indigo-600 flex items-center justify-center gap-2">
                      <Sparkles className="size-4" />
                      Đang tạo đề thi mới...
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24">
          <div className="container mx-auto px-6">
            <div className="p-12 md:p-20 rounded-[3rem] bg-zinc-900 text-white text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-[100px]" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px]" />

              <div className="relative z-10 space-y-6">
                <h2 className="text-3xl md:text-5xl font-black tracking-tight">Bắt đầu tiết kiệm thời gian ngay hôm nay</h2>
                <p className="text-zinc-400 max-w-xl mx-auto text-lg leading-relaxed">
                  Gia nhập cộng đồng giáo viên hiện đại, sử dụng công nghệ để nâng cao chất lượng giảng dạy.
                </p>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-full px-10 h-14 text-lg font-bold bg-white text-zinc-900 mt-4 shadow-xl shadow-white/20 transition-all hover:scale-105 active:scale-95 hover:bg-white hover:text-zinc-900"
                >
                  Đăng ký miễn phí
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-zinc-100 text-center">
        <div className="container mx-auto px-6">
          <div className="flex flex-col items-center gap-4">
            <Link href="#" className="flex items-center gap-2 grayscale opacity-70 hover:opacity-100 transition-opacity">
              <GraduationCap className="size-5" />
              <span className="text-lg font-black tracking-tighter uppercase">ExamGen AI</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} ExamGen AI. Công cụ hỗ trợ giáo viên chuyên nghiệp.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
