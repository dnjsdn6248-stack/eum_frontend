import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

const IconMail = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

const IconLock = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
)

const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const IconEyeOff = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

export default function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phoneNumber: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!formData.email || !formData.password || !formData.name) {
      setError('필수 항목을 모두 입력해주세요.')
      return
    }
    setLoading(true)
    try {
      await fetch('http://localhost:8072/api/v1/csrf', { credentials: 'include' })
      const csrfToken = document.cookie.match(/XSRF-TOKEN=([^;]+)/)?.[1] || ''

      const res = await fetch('http://localhost:8072/auth/signup', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'X-XSRF-TOKEN': decodeURIComponent(csrfToken),
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phoneNumber: formData.phoneNumber,
        }),
      })

      if (res.status === 400) {
        const data = await res.json()
        setError(Object.values(data.details || {}).join(' ') || '입력값을 확인해주세요.')
        return
      }
      if (res.status === 409) {
        setError('이미 사용 중인 이메일입니다.')
        return
      }
      if (!res.ok) {
        setError('회원가입에 실패했습니다.')
        return
      }

      navigate('/login')
    } catch {
      setError('서버 연결에 실패했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 px-8 py-10 relative">

          <button onClick={() => navigate(-1)} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-[36px] font-black text-[#1A1A1A] mb-2">회원가입</h1>
            <p className="text-[13px] text-gray-400">스위피 회원이 되어 다양한 혜택을 누리세요</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 mb-6">
            <div className="relative">
              <input
                type="text"
                value={formData.name}
                placeholder="이름 *"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3.5 bg-[#F8F8F8] border border-transparent rounded-2xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3ea76e]/30 focus:bg-white transition-all placeholder:text-gray-300"
              />
            </div>
            <div className="relative">
              <input
                type="tel"
                value={formData.phoneNumber}
                placeholder="전화번호"
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                className="w-full px-4 py-3.5 bg-[#F8F8F8] border border-transparent rounded-2xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3ea76e]/30 focus:bg-white transition-all placeholder:text-gray-300"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"><IconMail /></span>
              <input
                type="email"
                value={formData.email}
                placeholder="이메일 *"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-11 pr-4 py-3.5 bg-[#F8F8F8] border border-transparent rounded-2xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3ea76e]/30 focus:bg-white transition-all placeholder:text-gray-300"
              />
            </div>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"><IconLock /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                placeholder="비밀번호 *"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full pl-11 pr-12 py-3.5 bg-[#F8F8F8] border border-transparent rounded-2xl text-[14px] focus:outline-none focus:ring-2 focus:ring-[#3ea76e]/30 focus:bg-white transition-all placeholder:text-gray-300"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>

            {error && <p className="text-[12px] text-red-400 font-medium pl-1">{error}</p>}

            <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-[#3ea76e] text-white font-bold text-[14px] hover:bg-[#318a57] active:scale-[0.98] transition-all disabled:opacity-50">
              {loading ? '처리 중...' : '회원가입'}
            </button>

            <div className="text-center text-[13px] text-gray-400">
              <Link to="/login" className="hover:text-[#3ea76e] transition-colors">이미 계정이 있으신가요? 로그인</Link>
            </div>
          </form>
        </div>
        <p className="text-center text-[12px] text-gray-300 mt-5">가입 시 이용약관 및 개인정보처리방침에 동의합니다</p>
      </div>
    </div>
  )
}