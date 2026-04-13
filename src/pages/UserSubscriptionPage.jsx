import { useState } from 'react'
import { CreditCard, Plus, Info, Package, XCircle, RefreshCw } from 'lucide-react'
import { MOCK_SUBSCRIPTIONS } from '../mock'
import Pagination from '../shared/components/Pagination'

const PAGE_SIZE = 3

export default function UserSubscriptionPage() {
  const [activeTab, setActiveTab] = useState('apply')

  const applyList = MOCK_SUBSCRIPTIONS.filter(s => s.status === '구독중')
  const cancelList = MOCK_SUBSCRIPTIONS.filter(s => s.status === '해지')

  const [applyPage, setApplyPage] = useState(1)
  const [cancelPage, setCancelPage] = useState(1)

  const currentList = activeTab === 'apply' ? applyList : cancelList
  const currentPage = activeTab === 'apply' ? applyPage : cancelPage
  const setCurrentPage = activeTab === 'apply' ? setApplyPage : setCancelPage
  const totalPages = Math.ceil(currentList.length / PAGE_SIZE)
  const pagedList = currentList.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="bg-[#FCFBF9] min-h-screen text-[#111] font-sans pb-28">
      <main className="max-w-[800px] mx-auto px-6">

        <div className="py-24 text-center">
          <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#111]">정기배송 관리</h1>
        </div>

        <section className="bg-white rounded-[32px] border border-[#eee] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden mb-12">
          <div className="bg-[#fbfbfb]/80 px-10 py-6 border-b border-[#eee] flex items-center gap-3">
            <div className="bg-[#f0faf4] p-2 rounded-xl text-[#3ea76e]">
              <CreditCard size={20} />
            </div>
            <h3 className="text-[16px] font-black">결제수단</h3>
          </div>

          <div className="p-10 text-center">
            <p className="text-[11px] text-neutral-400 font-black uppercase tracking-widest mb-2">Payment Method</p>
            <h4 className="text-[22px] font-black text-[#3ea76e] mb-4">카드를 등록해 주세요.</h4>
            <p className="text-neutral-400 text-sm font-medium mb-10">결제수단이 등록되어 있을 경우 빠른 정기배송 신청이 가능합니다.</p>
            <button className="w-full max-w-[400px] py-5 bg-[#3ea76e] text-white rounded-[24px] font-black text-base hover:bg-[#318a57] transition-all shadow-lg shadow-[#3ea76e]/10 border-none cursor-pointer flex items-center justify-center gap-2 mx-auto">
              <Plus size={20} /> 결제수단 등록하기
            </button>
          </div>

          <div className="bg-[#f9f9f9] px-10 py-5 flex items-start gap-2 text-neutral-400 border-t border-[#f0f0f0]">
            <Info size={14} className="mt-0.5 shrink-0" />
            <p className="text-[12px] font-bold leading-relaxed">결제예정일(주기별 배송시작일 하루 전)에 위의 결제 정보로 정기배송 상품이 결제됩니다.</p>
          </div>
        </section>

        <section>
          <div className="flex justify-center gap-12 mb-10 border-b border-[#eee]">
            <button
              onClick={() => setActiveTab('apply')}
              className={`pb-4 text-[16px] font-black transition-all bg-transparent border-none cursor-pointer ${activeTab === 'apply' ? 'text-[#111] border-b-2 border-solid border-[#3ea76e]' : 'text-neutral-300 hover:text-neutral-500'}`}
            >
              신청내역 <span className="ml-1 text-[14px] opacity-60">({applyList.length}건)</span>
            </button>
            <button
              onClick={() => setActiveTab('cancel')}
              className={`pb-4 text-[16px] font-black transition-all bg-transparent border-none cursor-pointer ${activeTab === 'cancel' ? 'text-[#111] border-b-2 border-solid border-[#3ea76e]' : 'text-neutral-300 hover:text-neutral-500'}`}
            >
              해지내역 <span className="ml-1 text-[14px] opacity-60">({cancelList.length}건)</span>
            </button>
          </div>

          {currentList.length === 0 ? (
            <div className="bg-white rounded-[32px] border border-[#eee] p-24 text-center">
              <div className="bg-[#f8f8f8] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                {activeTab === 'apply' ? <Package size={32} className="text-neutral-200" /> : <XCircle size={32} className="text-neutral-200" />}
              </div>
              <p className="text-neutral-300 font-black text-[18px]">
                {activeTab === 'apply' ? '신청 내역이 없습니다.' : '해지 내역이 없습니다.'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {pagedList.map(sub => (
                <div key={sub.id} className="bg-white rounded-[28px] border border-[#eee] p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                  <div className="flex gap-5 items-center">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#eee] shrink-0">
                      <img src={sub.img} alt={sub.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="text-[15px] font-black text-[#111] mb-1 tracking-tight">{sub.name}</p>
                      <p className="text-[13px] font-bold text-[#bbb] mb-3">[{sub.option}]</p>
                      <div className="flex items-center gap-4 text-[13px] font-bold">
                        <span className="text-[#aaa]">주기 <span className="text-[#111]">{sub.cycle}</span></span>
                        {sub.nextDate !== '-' && (
                          <span className="text-[#aaa]">다음배송 <span className="text-[#3ea76e]">{sub.nextDate}</span></span>
                        )}
                        <span className="text-[#aaa]">{sub.price.toLocaleString()}원</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2 shrink-0">
                      <span className={`text-[12px] font-black px-3 py-1 rounded-full ${sub.status === '구독중' ? 'bg-[#f0faf4] text-[#3ea76e]' : 'bg-[#f5f5f5] text-[#aaa]'}`}>
                        {sub.status}
                      </span>
                      {sub.status === '구독중' && (
                        <button className="flex items-center gap-1 text-[12px] font-bold text-[#aaa] hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer">
                          <XCircle size={13} /> 해지
                        </button>
                      )}
                      {sub.status === '해지' && (
                        <button className="flex items-center gap-1 text-[12px] font-bold text-[#aaa] hover:text-[#3ea76e] transition-colors bg-transparent border-none cursor-pointer">
                          <RefreshCw size={13} /> 재신청
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              <Pagination page={currentPage} totalPages={totalPages} onChange={setCurrentPage} />
            </div>
          )}
        </section>

      </main>
    </div>
  )
}
