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

const IconUser = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
)

const IconPhone = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
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

const inputStyle = { border: '1.5px solid transparent', background: '#F8F8F8' }
const inputFocusStyle = { border: '1.5px solid #3ea76e', background: '#ffffff' }

export default function SignupPage() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ email: '', password: '', name: '', phoneNumber: '' })
  const [focusField, setFocusField] = useState('')

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-[420px]">
        <div className="bg-white rounded-3xl shadow-xl shadow-black/5 px-8 py-10 relative">
          <button
            onClick={() => navigate(-1)}
            style={{ border: 'none', background: 'none' }}
            className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full text-gray-300 hover:text-gray-500 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>

          <div className="text-center mb-8">
            <h1 className="text-[36px] font-black text-[#1A1A1A] mb-2">회원가입</h1>
            <p className="text-[13px] text-gray-400">스위피 회원이 되어 다양한 혜택을 누리세요</p>
          </div>

          <div className="space-y-3 mb-6">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"><IconUser /></span>
              <input
                type="text"
                value={formData.name}
                placeholder="이름 *"
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                onFocus={() => setFocusField('name')}
                onBlur={() => setFocusField('')}
                style={focusField === 'name' ? inputFocusStyle : inputStyle}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-[14px] outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"><IconPhone /></span>
              <input
                type="tel"
                value={formData.phoneNumber}
                placeholder="전화번호"
                onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                onFocus={() => setFocusField('phone')}
                onBlur={() => setFocusField('')}
                style={focusField === 'phone' ? inputFocusStyle : inputStyle}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-[14px] outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"><IconMail /></span>
              <input
                type="email"
                value={formData.email}
                placeholder="이메일 *"
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                onFocus={() => setFocusField('email')}
                onBlur={() => setFocusField('')}
                style={focusField === 'email' ? inputFocusStyle : inputStyle}
                className="w-full pl-11 pr-4 py-3.5 rounded-2xl text-[14px] outline-none transition-all placeholder:text-gray-300"
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300"><IconLock /></span>
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                placeholder="비밀번호 *"
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                onFocus={() => setFocusField('password')}
                onBlur={() => setFocusField('')}
                style={focusField === 'password' ? inputFocusStyle : inputStyle}
                className="w-full pl-11 pr-12 py-3.5 rounded-2xl text-[14px] outline-none transition-all placeholder:text-gray-300"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ border: 'none', background: 'none' }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500 cursor-pointer"
              >
                {showPassword ? <IconEyeOff /> : <IconEye />}
              </button>
            </div>

            <button
              type="button"
              style={{ border: 'none', background: '#3ea76e' }}
              className="w-full py-3.5 rounded-2xl text-white font-bold text-[14px] hover:opacity-90 active:scale-[0.98] transition-all cursor-pointer"
            >
              회원가입
            </button>

            <div className="text-center text-[13px] text-gray-400">
              <Link to="/login" className="hover:text-[#3ea76e] transition-colors">이미 계정이 있으신가요? 로그인</Link>
            </div>
          </div>
        </div>
        <p className="text-center text-[12px] text-gray-300 mt-5">가입 시 이용약관 및 개인정보처리방침에 동의합니다</p>
      </div>
    </div>
  )
}