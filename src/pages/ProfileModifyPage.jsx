import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MOCK_USER } from '../mock'

// 공통 인풋 컴포넌트
const SwiffyInput = ({ label, readOnly, ...props }) => (
  <div className="flex items-center border-b border-[#ececec] py-6 last:border-none">
    <p className="w-36 text-[13px] font-black text-[#bbb] shrink-0">{label}</p>
    <input
      {...props}
      readOnly={readOnly}
      className={`flex-1 bg-transparent outline-none text-[15px] font-bold tracking-tight transition-all placeholder:text-[#ccc] ${
        readOnly 
          ? 'text-[#ccc] cursor-default' 
          : 'text-[#111] focus:text-[#3ea76e]'
      }`}
    />
  </div>
)

export default function ProfileModifyPage() {
  const user = MOCK_USER
  const [marketingApp, setMarketingApp] = useState(true)
  const [marketingSms, setMarketingSms] = useState(false)
  const [email, setEmail] = useState(user.email || 'swiffy@example.com')

  return (
    <div className="bg-[#FCFBF9] min-h-screen text-[#111]">
      <main className="max-w-[860px] mx-auto px-6 pb-28">

        {/* 타이틀 영역 */}
        <div className="text-center py-24">
          <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#111]">회원 정보 수정</h1>
        </div>

        {/* 1. 로그인 보안 섹션 */}
        <section className="bg-white rounded-[40px] border border-[#eee] px-10 pb-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] mb-8">
          <div className="py-12">
            <h3 className="text-[18px] font-black text-[#111] tracking-tight text-center">로그인 보안</h3>
          </div>
          {/* 내부 박스에 연한 그레이 배경 적용 */}
          <div className="bg-[#f7f7f7] px-8 rounded-[24px] border border-[#efefef]">
            <SwiffyInput 
              label="아이디" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="이메일을 입력해주세요"
            />
            <SwiffyInput label="새 비밀번호" type="password" placeholder="8~16자 영문, 숫자 조합" />
            <SwiffyInput label="비밀번호 확인" type="password" placeholder="비밀번호 재입력" />
          </div>
        </section>

        {/* 2. 사용자 정보 섹션 */}
        <section className="bg-white rounded-[40px] border border-[#eee] px-10 pb-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] mb-8">
          <div className="py-12">
            <h3 className="text-[18px] font-black text-[#111] tracking-tight text-center">사용자 정보</h3>
          </div>
          <div className="bg-[#f7f7f7] px-8 rounded-[24px] border border-[#efefef]">
            <SwiffyInput label="이름" type="text" defaultValue={user.name} />

            {/* 휴대폰 번호 */}
            <div className="flex items-center border-b border-[#ececec] py-6">
              <p className="w-36 text-[13px] font-black text-[#bbb] shrink-0">휴대폰 번호</p>
              <div className="flex items-center gap-2 flex-1">
                <input type="text" defaultValue="010" className="w-16 text-center bg-white border border-[#eee] py-2.5 rounded-xl text-[14px] font-bold outline-none focus:border-[#3ea76e] transition-all" />
                <span className="text-[#ddd] font-bold">-</span>
                <input type="text" defaultValue="1234" className="flex-1 text-center bg-white border border-[#eee] py-2.5 rounded-xl text-[14px] font-bold outline-none focus:border-[#3ea76e] transition-all" />
                <span className="text-[#ddd] font-bold">-</span>
                <input type="text" defaultValue="5678" className="flex-1 text-center bg-white border border-[#eee] py-2.5 rounded-xl text-[14px] font-bold outline-none focus:border-[#3ea76e] transition-all" />
              </div>
            </div>

            {/* 주소 및 주소검색 버튼 (회색톤 적용) */}
            <div className="flex items-start py-8">
              <p className="w-36 text-[13px] font-black text-[#bbb] shrink-0 mt-3">주소</p>
              <div className="flex-1 space-y-3">
                <div className="flex gap-2">
                  <input type="text" placeholder="우편번호" className="w-32 bg-[#fff] border border-[#eee] px-4 py-3 rounded-xl text-[13px] font-bold outline-none text-[#bbb]" readOnly />
                  {/* 주소 검색 버튼을 촌스럽지 않은 연회색 톤으로 변경 */}
                  <button 
                    type="button" 
                    className="px-6 h-[46px] bg-[#f0f0f0] text-[#666] border border-[#e5e5e5] rounded-xl text-[13px] font-black hover:bg-[#e8e8e8] hover:text-[#111] transition-all shrink-0 cursor-pointer"
                  >
                    주소 검색
                  </button>
                </div>
                <input type="text" placeholder="기본 주소" className="w-full bg-[#fff] border border-[#eee] px-4 py-3 rounded-xl text-[13px] font-bold outline-none text-[#bbb]" readOnly />
                <input type="text" placeholder="상세 주소 입력" className="w-full bg-[#fff] border border-[#eee] px-4 py-3 rounded-xl text-[13px] font-bold outline-none focus:border-[#3ea76e] transition-all" />
              </div>
            </div>
          </div>
        </section>

        {/* 3. 마케팅 수신 동의 */}
        <section className="bg-white rounded-[40px] border border-[#eee] px-10 pb-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)] mb-12">
          <div className="py-12">
            <h3 className="text-[18px] font-black text-[#111] tracking-tight text-center">마케팅 정보 수신 동의</h3>
          </div>
          <div className="flex gap-4">
            {[
              { label: '앱 푸시 알림', state: marketingApp, setState: setMarketingApp },
              { label: 'SMS 문자 수신', state: marketingSms, setState: setMarketingSms },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between gap-4 bg-[#f7f7f7] border border-[#efefef] px-6 py-5 rounded-2xl flex-1 transition-all">
                <span className="text-[14px] font-black text-[#444]">{item.label}</span>
                <button
                  type="button"
                  onClick={() => item.setState(!item.state)}
                  className={`w-11 h-6 rounded-full p-1 transition-colors cursor-pointer border-none flex items-center ${item.state ? 'bg-[#3ea76e]' : 'bg-[#ccc]'}`}
                >
                  <div className={`w-4 h-4 bg-white rounded-full shadow-sm transition-transform duration-300 ${item.state ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* 하단 버튼 영역 */}
        <div className="flex flex-col gap-3 max-w-[420px] mx-auto">
          <button className="w-full h-16 bg-[#3ea76e] text-white rounded-full text-[17px] font-black hover:bg-[#318a57] border-none cursor-pointer shadow-lg shadow-[#3ea76e]/10 transition-all active:scale-[0.97]">
            변경 내용 저장하기
          </button>
          <Link to="/mypage" className="w-full h-16 flex items-center justify-center bg-[#f7f7f7] border border-[#eee] text-[#aaa] rounded-full text-[15px] font-bold hover:bg-[#efefef] hover:text-[#888] transition-all">
            취소
          </Link>
        </div>

        {/* 회원 탈퇴 */}
        <div className="mt-20 text-center">
          <button className="text-[12px] font-bold text-[#ccc] hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer underline underline-offset-4">
            회원 탈퇴하기
          </button>
        </div>

      </main>
    </div>
  )
}