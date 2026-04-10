import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Phone, X } from 'lucide-react'

export default function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phoneNumber: '' })

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">
      
      {/* 1. 왼쪽 배너 (LoginPage와 동일하게 유지) */}
      <div className="hidden lg:flex flex-[1.1] relative items-center justify-center p-20 bg-[#3ea76e] overflow-hidden">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-10 left-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all border border-white/20 z-20"
        >
          <X size={24} strokeWidth={2.5} />
        </button>

        <div className="relative z-10 w-full h-full flex flex-col justify-between">
          <div className="text-left">
            <div className="text-white text-4xl font-black tracking-[-0.08em] select-none mb-24">
              SWIFFY<span className="text-xs align-top ml-0.5 opacity-70 italic font-black">®</span>
            </div>
            <div className="space-y-6">
              <h1 className="text-[64px] font-black text-white leading-[1.05] tracking-[-0.05em]">
                말하지 않아도 <br />
                <span className="text-[#1B4332]">전해지는 진심.</span>
              </h1>
              <p className="text-[18px] text-white/70 font-bold tracking-tight max-w-xs leading-relaxed">
                스위피와 함께 만드는 <br /> 우리 아이와의 깊은 기록.
              </p>
            </div>
          </div>
          <div className="relative self-end mb-10 mr-[-5%]">
            <img src="/dog.png" alt="Swiffy Dog" className="w-[440px] h-auto rounded-[48px] rotate-[-4deg] drop-shadow-[0_45px_45px_rgba(0,0,0,0.3)]" />
          </div>
        </div>
      </div>

      {/* 2. 오른쪽 회원가입 폼 (LoginPage의 스타일과 통일) */}
      <div className="flex-1 bg-[#FCFBF9] flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[420px]">
          
          <div className="mb-10">
            <h2 className="text-[48px] font-black text-[#1B4332] tracking-[-0.07em] leading-none mb-3">Sign Up</h2>
            <div className="h-1.5 w-12 bg-[#3ea76e] rounded-full" />
          </div>

          <div className="w-full space-y-4">
            {/* 이름 입력 */}
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bbb] group-focus-within:text-[#3ea76e] transition-colors" size={17} />
              <input
                type="text"
                placeholder="이름 *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-14 pl-12 pr-6 bg-white border border-[#eee] rounded-2xl text-[14px] font-bold tracking-tight outline-none transition-all placeholder:text-[#ccc] text-[#111] focus:border-[#3ea76e] focus:shadow-sm"
              />
            </div>

            {/* 전화번호 입력 */}
            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bbb] group-focus-within:text-[#3ea76e] transition-colors" size={17} />
              <input
                type="tel"
                placeholder="전화번호"
                value={formData.phoneNumber}
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full h-14 pl-12 pr-6 bg-white border border-[#eee] rounded-2xl text-[14px] font-bold tracking-tight outline-none transition-all placeholder:text-[#ccc] text-[#111] focus:border-[#3ea76e] focus:shadow-sm"
              />
            </div>

            {/* 이메일 입력 */}
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bbb] group-focus-within:text-[#3ea76e] transition-colors" size={17} />
              <input
                type="email"
                placeholder="이메일 *"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full h-14 pl-12 pr-6 bg-white border border-[#eee] rounded-2xl text-[14px] font-bold tracking-tight outline-none transition-all placeholder:text-[#ccc] text-[#111] focus:border-[#3ea76e] focus:shadow-sm"
              />
            </div>

            {/* 비밀번호 입력 */}
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bbb] group-focus-within:text-[#3ea76e] transition-colors" size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호 *"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full h-14 pl-12 pr-12 bg-white border border-[#eee] rounded-2xl text-[14px] font-bold tracking-tight outline-none transition-all placeholder:text-[#ccc] text-[#111] focus:border-[#3ea76e] focus:shadow-sm"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-[#bbb] hover:text-[#3ea76e] cursor-pointer bg-transparent border-none transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <button
              type="button"
              className="w-full h-14 rounded-2xl bg-[#3ea76e] text-white font-black text-[15px] tracking-tight hover:bg-[#318a57] transition-all active:scale-[0.98] cursor-pointer border-none"
            >
              회원가입
            </button>
          </div>

          <div className="mt-8 flex justify-center text-[#888] font-bold text-[13px] tracking-tight">
            <Link to="/login" className="hover:text-[#3ea76e] transition-colors">
              이미 계정이 있으신가요? <span className="underline ml-1">로그인</span>
            </Link>
          </div>

          <p className="text-center text-[11px] text-[#ccc] mt-10 font-medium">
            가입 시 이용약관 및 개인정보처리방침에 동의합니다
          </p>

        </div>
      </div>
    </div>
  )
}