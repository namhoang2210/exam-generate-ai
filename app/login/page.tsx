"use client"

import { useActionState } from "react"
import { login, signup } from "./actions"

export default function LoginPage() {
  // Using useActionState from React 19 for form actions
  const [loginState, loginAction, pendingLogin] = useActionState(
    async (prevState: any, formData: FormData) => await login(formData), 
    null
  )
  
  const [signupState, signupAction, pendingSignup] = useActionState(
    async (prevState: any, formData: FormData) => await signup(formData), 
    null
  )

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-md">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Exam Generator AI</h1>
          <p className="text-sm text-gray-500">Đăng nhập vào hệ thống dành cho Giáo viên</p>
        </div>
        
        <form className="space-y-4" action={loginAction}>
          {(loginState?.error || signupState?.error) && (
            <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
              {loginState?.error || signupState?.error}
            </div>
          )}
          
          {signupState?.success && (
            <div className="p-3 text-sm text-green-500 bg-green-50 rounded-md">
              {signupState?.success}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-sm rounded-md font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="email"
              name="email"
              type="email"
              placeholder="nhagiao@domain.com"
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              id="password"
              name="password"
              type="password"
              required
            />
          </div>
          
          <div className="flex flex-col gap-3 py-2">
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              formAction={loginAction}
              disabled={pendingLogin || pendingSignup}
            >
              {pendingLogin ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium h-10 px-4 py-2 bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              formAction={signupAction}
              disabled={pendingLogin || pendingSignup}
            >
              {pendingSignup ? "Đang đăng ký..." : "Đăng ký tài khoản mới"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
