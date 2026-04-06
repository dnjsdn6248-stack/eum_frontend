import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Eye, EyeOff, X, MessageCircle } from 'lucide-react'
import { useLoginMutation } from '@/api/authApi'

const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? '/api'

const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
)

export default function LoginPage() {
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [lockTimer, setLockTimer] = useState(null)

  // ─── PKCE OAuth (소셜 로그인) ────────────────────────────────────────────────

  const generatePKCE = async () => {
    const verifier =
      crypto.randomUUID().replace(/-/g, '') +
      crypto.randomUUID().replace(/-/g, '')
    const encoder = new TextEncoder()
    const digest = await crypto.subtle.digest('SHA-256', encoder.encode(verifier))
    const challenge = btoa(String.fromCharCode(...new Uint8Array(digest)))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
    sessionStorage.setItem('pkce_verifier', verifier)
    return challenge
  }

  const handleSocialLogin = async (provider) => {
    const challenge = await generatePKCE()
    window.location.href =
      `${BASE_URL}/oauth2/authorization/${provider}` +
      `?code_challenge=${challenge}&code_challenge_method=S256`
  }

  // ─── 계정 잠금 카운트다운 ────────────────────────────────────────────────────

  const startLockCountdown = (seconds) => {
    setLockTimer(seconds)
    const interval = setInterval(() => {
      setLockTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setError('')
          return null
        }
        return prev - 1
      })
    }, 1000)
  }

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return m > 0 ? `${m}분 ${s}초` : `${s}초`
  }

  // ─── 폼 로그인 ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLockTimer(null)

    if (!formData.username || !formData.password) {
      setError('아이디와 비밀번호를 입력해주세요.')
      return
    }

    try {
      await login(formData).unwrap()
      navigate('/')
    } catch (err) {
      const status = err?.status
      const data = err?.data ?? {}

      if (status === 423) {
        const remain = data.remainSeconds ?? 900
        startLockCountdown(remain)
        return
      }
      if (status === 400 || status === 401) {
        setError(data.error || '아이디 또는 비밀번호가 올바르지 않습니다.')
        return
      }
      setError('로그인 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.')
    }
  }

  return (
    <div className="min-h-screen flex font-sans overflow-hidden bg-white">
      {/* ── 왼쪽 브랜드 패널 ───────────────────────────────────────────────────── */}
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
                말하지 않아도 <br/>
                <span className="text-[#1B4332]">전해지는 진심.</span>
              </h1>
              <p className="text-xl text-white/70 font-black tracking-tighter max-w-xs leading-relaxed">
                스위피와 함께 만드는 <br /> 우리 아이와의 깊은 기록.
              </p>
            </div>
          </div>

          <div className="relative self-end mb-10 mr-[-5%]">
            <img
              src="/dog.png"
              alt="Swiffy Dog"
              className="w-[440px] h-auto rounded-[48px] rotate-[-4deg] drop-shadow-[0_45px_45px_rgba(0,0,0,0.3)]"
            />
          </div>
        </div>
      </div>

      {/* ── 오른쪽 로그인 폼 ───────────────────────────────────────────────────── */}
      <div className="flex-1 bg-[#FCFBF9] flex items-center justify-center p-8 lg:p-16 relative">
        <div className="w-full max-w-[420px]">
          <div className="mb-12">
            <h2 className="text-[56px] font-black text-[#1B4332] tracking-[-0.07em] leading-none mb-3">Login</h2>
            <div className="h-1.5 w-12 bg-[#3ea76e] rounded-full" />
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3ea76e] transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="아이디를 입력해주세요"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full pl-14 pr-6 py-5 bg-white border-2 border-[#D1D5DB] rounded-[24px] text-[16px] font-black tracking-tighter shadow-sm focus:border-[#3ea76e] focus:bg-white outline-none transition-all placeholder:text-gray-400 text-[#1B4332]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="relative group">
                <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#3ea76e] transition-colors" size={18} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="비밀번호를 입력해주세요"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-14 pr-14 py-5 bg-white border-2 border-[#D1D5DB] rounded-[24px] text-[16px] font-black tracking-tighter shadow-sm focus:border-[#3ea76e] focus:bg-white outline-none transition-all placeholder:text-gray-400 text-[#1B4332]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#3ea76e]"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {(error || lockTimer != null) && (
              <p className="text-xs text-red-500 font-black tracking-tighter pl-2">
                {lockTimer != null
                  ? `계정이 잠겼습니다. ${formatTime(lockTimer)} 후 다시 시도해주세요.`
                  : error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading || lockTimer != null}
              className="w-full py-5 mt-4 rounded-[24px] bg-[#1B4332] text-white font-black text-xl tracking-tighter shadow-xl hover:bg-[#143225] hover:-translate-y-1 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
            >
              {isLoading ? '로그인 중...' : '스위피 시작하기'}
            </button>
          </form>

          <div className="mt-8 mb-16 flex justify-center gap-8 text-[#666] font-black text-[14px] tracking-tighter">
            <Link to="/signup" className="hover:text-[#3ea76e]">회원가입</Link>
            <span className="text-gray-200 font-light text-lg">|</span>
            <button className="hover:text-[#3ea76e]">비밀번호 찾기</button>
          </div>

          {/* ── 소셜 로그인 ───────────────────────────────────────────────────── */}
          <div className="space-y-3">
            <div className="relative flex items-center mb-8">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-[10px] font-black text-gray-400 tracking-[0.2em]">간편 로그인</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => handleSocialLogin('google')}
                className="w-full py-4 bg-white border-2 border-[#D1D5DB] text-[#1B4332] rounded-2xl font-black text-[15px] tracking-tighter flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm"
              >
                <GoogleIcon /> 구글 계정으로 로그인
              </button>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleSocialLogin('kakao')}
                  className="py-4 bg-[#FEE500] text-[#3C1E1E] rounded-2xl font-black text-[14px] tracking-tighter flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <MessageCircle size={18} fill="currentColor" /> 카카오
                </button>
                <button
                  onClick={() => handleSocialLogin('naver')}
                  className="py-4 bg-[#03C75A] text-white rounded-2xl font-black text-[14px] tracking-tighter flex items-center justify-center gap-2 hover:opacity-90 transition-all"
                >
                  <span className="italic text-lg font-black pr-1">N</span> 네이버
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
