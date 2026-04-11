import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, User, Phone, X, AtSign, CheckCircle } from 'lucide-react'

function EmailVerifyModal({ onClose, onVerified }) {
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [verified, setVerified] = useState(false)

  const handleSend = () => {
    if (!email) return
    setCodeSent(true)
  }

  const handleVerify = () => {
    if (!code) return
    setVerified(true)
    setTimeout(() => {
      onVerified(email)
      onClose()
    }, 800)
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[32px] w-full max-w-[560px] p-12 shadow-2xl">
        <button onClick={onClose} className="absolute top-7 right-7 text-[#bbb] hover:text-[#111] bg-transparent border-none cursor-pointer">
          <X size={20} />
        </button>

        <div className="mb-10">
          <h3 className="text-[24px] font-black text-[#111] tracking-tight mb-2">이메일 인증</h3>
          <p className="text-[14px] font-bold text-[#bbb]">가입하실 이메일로 인증번호를 보내드려요</p>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-[12px] font-bold text-[#aaa] mb-2 ml-1">이메일 주소 *</p>
            <div className="flex gap-3">
              <div className="relative group flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#bbb] group-focus-within:text-[#3ea76e] transition-colors" size={16} />
                <input
                  type="email"
                  placeholder="example@email.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setCodeSent(false); setVerified(false) }}
                  disabled={verified}
                  className={`w-full h-14 pl-11 pr-4 bg-[#f8f8f8] border rounded-2xl text-[14px] font-bold tracking-tight outline-none transition-all placeholder:text-[#ccc] text-[#111] focus:border-[#3ea76e] ${verified ? 'border-[#3ea76e] bg-[#f0faf4]' : 'border-transparent'}`}
                />
              </div>
              <button
                type="button"
                onClick={handleSend}
                disabled={verified}
                className={`h-14 px-5 rounded-2xl text-[13px] font-black border-none cursor-pointer transition-all shrink-0 ${verified ? 'bg-[#f0faf4] text-[#3ea76e]' : 'bg-[#f5f5f5] text-[#555] hover:bg-[#ebebeb]'}`}
              >
                {codeSent ? '재발송' : '발송'}
              </button>
            </div>
          </div>

          {codeSent && !verified && (
            <div>
              <p className="text-[12px] font-bold text-[#aaa] mb-2 ml-1">인증번호</p>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="인증번호 6자리 입력"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  maxLength={6}
                  className="flex-1 h-14 px-5 bg-[#f8f8f8] border border-transparent rounded-2xl text-[14px] font-bold tracking-tight outline-none transition-all placeholder:text-[#ccc] text-[#111] focus:border-[#3ea76e]"
                />
                <button
                  type="button"
                  onClick={handleVerify}
                  className="h-14 px-5 rounded-2xl bg-[#f5f5f5] text-[#555] text-[13px] font-black border-none cursor-pointer hover:bg-[#ebebeb] transition-all shrink-0"
                >
                  확인
                </button>
              </div>
            </div>
          )}

          {verified && (
            <div className="flex items-center gap-2 text-[#3ea76e] text-[13px] font-black px-1">
              <CheckCircle size={16} />
              <span>인증이 완료되었어요!</span>
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-[#f5f5f5]">
            <button
              type="button"
              onClick={handleSend}
              disabled={!email || verified}
              className="flex-[2] h-14 rounded-full bg-[#3ea76e] text-white font-black text-[15px] border-none cursor-pointer hover:bg-[#318a57] transition-all disabled:bg-[#eee] disabled:text-[#ccc] disabled:cursor-not-allowed"
            >
              {codeSent ? '인증번호 재발송' : '인증번호 발송'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-14 rounded-full bg-[#f5f5f5] text-[#555] font-black text-[15px] border-none cursor-pointer hover:bg-[#ebebeb] transition-all"
            >
              취소
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ username: '', email: '', password: '', name: '', phoneNumber: '' })
  const [emailVerified, setEmailVerified] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)

  const handleEmailVerified = (email) => {
    setFormData(prev => ({ ...prev, email }))
    setEmailVerified(true)
  }

  return (
    <div className="min-h-screen flex overflow-hidden bg-white">

      {showEmailModal && (
        <EmailVerifyModal
          onClose={() => setShowEmailModal(false)}
          onVerified={handleEmailVerified}
        />
      )}

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

      <div className="flex-1 bg-[#FCFBF9] flex items-center justify-center p-8 lg:p-16">
        <div className="w-full max-w-[420px]">

          <div className="mb-10">
            <h2 className="text-[48px] font-black text-[#1B4332] tracking-[-0.07em] leading-none mb-3">Sign Up</h2>
            <div className="h-1.5 w-12 bg-[#3ea76e] rounded-full" />
          </div>

          <div className="w-full space-y-4">

            {/* 이메일 인증 버튼 — 맨 위 */}
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className={`w-full h-14 rounded-2xl text-[14px] font-black cursor-pointer transition-all flex items-center justify-center gap-2 ${
                emailVerified
                  ? 'bg-[#f0faf4] text-[#3ea76e] border-none'
                  : 'bg-white text-[#555] hover:border-[#3ea76e] hover:text-[#3ea76e]'
              }`}
              style={{ border: emailVerified ? 'none' : '1px solid #eee' }}
            >
              <Mail size={17} className={emailVerified ? 'text-[#3ea76e]' : 'text-[#bbb]'} />
              {emailVerified ? `${formData.email} ✓` : '이메일 인증하기'}
            </button>

            <div className="relative group">
              <AtSign className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bbb] group-focus-within:text-[#3ea76e] transition-colors" size={17} />
              <input
                type="text"
                placeholder="아이디 *"
                value={formData.username}
                onChange={e => setFormData({ ...formData, username: e.target.value })}
                className="w-full h-14 pl-12 pr-6 bg-white border border-[#eee] rounded-2xl text-[14px] font-bold tracking-tight outline-none transition-all placeholder:text-[#ccc] text-[#111] focus:border-[#3ea76e] focus:shadow-sm"
              />
            </div>

            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bbb] group-focus-within:text-[#3ea76e] transition-colors" size={17} />
              <input
                type="text"
                placeholder="이름 *"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full h-14 pl-12 pr-6 bg-white border border-[#eee] rounded-2xl text-[14px] font-bold tracking-tight outline-none transition-all placeholder:text-[#ccc] text-[#111] focus:border-[#3ea76e] focus:shadow-sm"
              />
            </div>

            <div className="relative group">
              <Phone className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bbb] group-focus-within:text-[#3ea76e] transition-colors" size={17} />
              <input
                type="tel"
                placeholder="전화번호"
                value={formData.phoneNumber}
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full h-14 pl-12 pr-6 bg-white border border-[#eee] rounded-2xl text-[14px] font-bold tracking-tight outline-none transition-all placeholder:text-[#ccc] text-[#111] focus:border-[#3ea76e] focus:shadow-sm"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#bbb] group-focus-within:text-[#3ea76e] transition-colors" size={17} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="비밀번호 *"
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
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