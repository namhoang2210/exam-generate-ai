"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { signup } from "../login/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, UserPlus, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { registerSchema, type RegisterValues } from "@/lib/auth-schema"
import { cn } from "@/lib/utils"

export default function RegisterPage() {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, setIsPending] = useState(false)

  const form = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: RegisterValues) {
    setIsPending(true)
    setError(null)
    setSuccess(null)
    
    try {
      const formData = new FormData()
      formData.append("email", values.email)
      formData.append("password", values.password)
      
      const result = await signup(formData)
      if (result?.error) {
        setError(result.error)
      } else if (result?.success) {
        setSuccess(result.success)
        form.reset()
      }
    } catch (e) {
      setError("Có lỗi xảy ra, vui lòng thử lại.")
    } finally {
      setIsPending(false)
    }
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center p-6 md:p-10 overflow-hidden bg-white">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-100/50 rounded-full blur-[120px] -z-10" />

      <div className="flex w-full max-w-[480px] flex-col gap-8 relative z-10">
        <div className="flex flex-col items-center gap-4 text-center">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-600 to-blue-600 text-white shadow-xl shadow-indigo-200">
              <GraduationCap className="size-7" />
            </div>
            <span className="text-2xl font-black tracking-tighter uppercase bg-clip-text text-transparent bg-linear-to-r from-indigo-600 to-blue-600">ExamGen AI</span>
          </Link>
        </div>
        
        <Card className="shadow-2xl border-zinc-100/50 bg-white/70 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
          <CardHeader className="pt-8 pb-4 text-center">
            <CardTitle className="text-xl font-black uppercase tracking-tight">Tạo tài khoản giáo viên</CardTitle>
          </CardHeader>
          <CardContent className="px-10 pb-8 flex flex-col gap-6">
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              {error && (
                <div className="p-4 text-xs font-bold text-destructive bg-destructive/5 rounded-2xl border border-destructive/10 text-center flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                  <AlertCircle className="size-4" />
                  {error}
                </div>
              )}

              {success && (
                <div className="p-4 text-xs font-bold text-emerald-600 bg-emerald-50 rounded-2xl border border-emerald-100 text-center flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
                  <CheckCircle2 className="size-4" />
                  {success}
                </div>
              )}
              
              <div className="space-y-2.5">
                <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest ml-1 text-zinc-500">Email Address</Label>
                <div className="space-y-1">
                  <Input
                    {...form.register("email")}
                    id="email"
                    type="email"
                    placeholder="nhagiao@example.com"
                    className={cn(
                      "rounded-2xl border-zinc-100 bg-zinc-50/50 h-12 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-medium px-4",
                      form.formState.errors.email && "border-destructive/50 bg-destructive/5"
                    )}
                  />
                  {form.formState.errors.email && (
                    <p className="text-[10px] font-bold text-destructive ml-1 uppercase">{form.formState.errors.email.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="password" className="text-xs font-black uppercase tracking-widest ml-1 text-zinc-500">Mật khẩu</Label>
                <div className="space-y-1">
                  <Input
                    {...form.register("password")}
                    id="password"
                    type="password"
                    className={cn(
                      "rounded-2xl border-zinc-100 bg-zinc-50/50 h-12 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-medium px-4",
                      form.formState.errors.password && "border-destructive/50 bg-destructive/5"
                    )}
                  />
                  {form.formState.errors.password && (
                    <p className="text-[10px] font-bold text-destructive ml-1 uppercase">{form.formState.errors.password.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2.5">
                <Label htmlFor="confirmPassword" className="text-xs font-black uppercase tracking-widest ml-1 text-zinc-500">Xác nhận mật khẩu</Label>
                <div className="space-y-1">
                  <Input
                    {...form.register("confirmPassword")}
                    id="confirmPassword"
                    type="password"
                    className={cn(
                      "rounded-2xl border-zinc-100 bg-zinc-50/50 h-12 focus-visible:ring-primary/20 focus-visible:border-primary/50 transition-all font-medium px-4",
                      form.formState.errors.confirmPassword && "border-destructive/50 bg-destructive/5"
                    )}
                  />
                  {form.formState.errors.confirmPassword && (
                    <p className="text-[10px] font-bold text-destructive ml-1 uppercase">{form.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col gap-4 pt-4">
                <Button 
                  type="submit"
                  disabled={isPending}
                  className="w-full h-12 rounded-2xl flex gap-2 font-black uppercase tracking-widest shadow-lg shadow-primary/20 group hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  {isPending ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <UserPlus className="size-4" />
                  )}
                  {isPending ? "Đang xử lý..." : "Đăng ký ngay"}
                </Button>
                
                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-zinc-100"></span>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-white/0 backdrop-blur-none px-2 text-zinc-400 font-bold">Đã có tài khoản?</span>
                  </div>
                </div>

                <Link 
                  href="/login" 
                  className="w-full h-12 rounded-2xl flex items-center justify-center gap-2 font-black uppercase tracking-widest border border-zinc-100 bg-white hover:bg-zinc-50 hover:scale-[1.02] active:scale-[0.98] transition-all text-sm"
                >
                  <ArrowLeft className="size-4" />
                  Quay lại đăng nhập
                </Link>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-zinc-50/50 border-t border-zinc-100/50 p-6 px-10">
            <p className="text-[10px] text-center w-full text-zinc-400 font-bold uppercase tracking-widest leading-relaxed">
              Bằng cách tiếp tục, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.
            </p>
          </CardFooter>
        </Card>
        
        <p className="text-center text-xs text-zinc-500 font-medium">
          © {new Date().getFullYear()} ExamGen AI. Professional Teacher Tools.
        </p>
      </div>
    </div>
  )
}
