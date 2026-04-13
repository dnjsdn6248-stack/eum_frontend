import { useState } from 'react'
import { Link } from 'react-router-dom'
import { X, Star } from 'lucide-react'
import { MOCK_ORDERS } from '../mock'
import Pagination from '../shared/components/Pagination'

const STATUS_OPTIONS = ['전체 주문처리상태', '입금전', '배송준비중', '배송중', '배송완료', '취소', '교환', '반품']
const PERIOD_OPTIONS = ['오늘', '1개월', '3개월', '6개월', '기간설정']
const PAGE_SIZE = 3

function ReviewModal({ item, onClose, onSubmit }) {
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState(0)
  const [text, setText] = useState('')

  const handleSubmit = () => {
    if (!text.trim()) return
    onSubmit({ itemName: item.name, rating, text })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-[32px] w-full max-w-[480px] shadow-2xl p-8">
        <button onClick={onClose} className="absolute top-6 right-6 text-[#bbb] hover:text-[#111] bg-transparent border-none cursor-pointer">
          <X size={20} />
        </button>

        <p className="text-[11px] font-black text-[#3ea76e] tracking-widest uppercase mb-2">구매후기 작성</p>
        <h3 className="text-[20px] font-black text-[#111] tracking-tight mb-1 leading-snug">{item.name}</h3>
        {item.option && <p className="text-[13px] font-bold text-[#bbb] mb-6">[{item.option}]</p>}

        <div className="mb-6">
          <p className="text-[13px] font-bold text-[#555] mb-3">별점을 선택해 주세요</p>
          <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(n)}
                className="bg-transparent border-none cursor-pointer p-0"
              >
                <Star
                  size={32}
                  className={`transition-colors ${n <= (hovered || rating) ? 'fill-[#f5a623] text-[#f5a623]' : 'fill-[#eee] text-[#eee]'}`}
                />
              </button>
            ))}
            <span className="ml-2 text-[15px] font-black text-[#111] self-center">{hovered || rating}점</span>
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[13px] font-bold text-[#555] mb-2">후기를 작성해 주세요</p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="상품은 어떠셨나요? 솔직한 후기를 남겨주세요 🐾"
            maxLength={500}
            rows={5}
            className="w-full bg-[#f8f8f8] rounded-2xl px-5 py-4 text-[14px] font-bold text-[#333] outline-none border border-transparent focus:border-[#3ea76e] resize-none transition-colors"
          />
          <p className="text-right text-[12px] font-bold text-[#bbb] mt-1">{text.length}/500</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleSubmit}
            className="flex-[2] py-4 bg-[#3ea76e] text-white rounded-full font-black text-[15px] border-none cursor-pointer hover:bg-[#318a57] transition-all disabled:opacity-40"
            disabled={!text.trim()}
          >
            후기 등록하기
          </button>
          <button onClick={onClose} className="flex-1 py-4 bg-[#f5f5f5] text-[#555] rounded-full font-black text-[15px] border-none cursor-pointer hover:bg-[#ebebeb] transition-all">
            취소
          </button>
        </div>
      </div>
    </div>
  )
}

export default function OrderPage() {
  const [activeMainTab, setActiveMainTab] = useState('주문내역')
  const [status, setStatus] = useState('전체 주문처리상태')
  const [period, setPeriod] = useState('3개월')
  const [page, setPage] = useState(1)
  const [reviewTarget, setReviewTarget] = useState(null)
  const [submittedReviews, setSubmittedReviews] = useState([])

  const filtered = status === '전체 주문처리상태' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === status)
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const pagedOrders = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleFilterChange = (setter, val) => { setter(val); setPage(1) }

  const handleReviewSubmit = ({ itemName, rating, text }) => {
    setSubmittedReviews(prev => [...prev, { itemName, rating, text, date: new Date().toLocaleDateString('ko-KR') }])
  }

  return (
    <div className="w-full bg-[#FCFBF9] min-h-screen pb-28 px-4">
      {reviewTarget && (
        <ReviewModal
          item={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={handleReviewSubmit}
        />
      )}

      <div className="max-w-[1200px] mx-auto text-center py-24">
        <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#111]">주문조회</h1>
      </div>

      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-center gap-16 md:gap-24 mb-16 border-b border-[#eee]">
          {[
            { key: '주문내역', label: `주문내역 조회 (${MOCK_ORDERS.length}건)` },
            { key: '취소교환반품', label: '취소/교환/반품 내역 (1건)' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveMainTab(tab.key)}
              className={`pb-6 text-[16px] font-black border-none bg-transparent cursor-pointer transition-all tracking-tight relative ${
                activeMainTab === tab.key ? 'text-[#3ea76e]' : 'text-[#bbb] hover:text-[#999]'
              }`}
            >
              {tab.label}
              {activeMainTab === tab.key && (
                <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3ea76e] rounded-full" />
              )}
            </button>
          ))}
        </div>

        <div className="bg-white border border-[#eee] p-10 md:p-14 mb-16 rounded-[40px] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-8">
            <span className="text-[15px] font-extrabold text-[#111] w-20 shrink-0">주문상태</span>
            <select
              value={status}
              onChange={e => handleFilterChange(setStatus, e.target.value)}
              className="w-full max-w-[450px] h-14 border border-[#eee] bg-[#f9f9f9] px-6 outline-none text-[#333] rounded-full text-[15px] focus:border-[#3ea76e] focus:bg-white transition-all font-bold cursor-pointer"
            >
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10 mb-10">
            <span className="text-[15px] font-extrabold text-[#111] w-20 shrink-0">조회기간</span>
            <div className="flex w-full max-w-[650px] gap-3">
              {PERIOD_OPTIONS.map(p => (
                <button
                  key={p}
                  onClick={() => handleFilterChange(setPeriod, p)}
                  className={`flex-1 h-12 text-[14px] font-bold cursor-pointer transition-all tracking-tight rounded-full border ${
                    period === p
                      ? 'bg-[#3ea76e] text-white border-[#3ea76e] shadow-md shadow-green-100'
                      : 'bg-white text-[#aaa] border-[#eee] hover:border-[#3ea76e] hover:text-[#3ea76e]'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-8 border-t border-[#f5f5f5] flex items-center gap-3 text-[14px] text-[#aaa] font-bold">
            <div className="w-5 h-5 rounded-full bg-[#f0faf4] text-[#3ea76e] flex items-center justify-center text-[12px] shrink-0 font-black">!</div>
            <span>취소/교환/반품 신청은 배송완료일 기준 3일까지만 가능합니다.</span>
          </div>
        </div>

        {submittedReviews.length > 0 && (
          <div className="mb-8 bg-[#f0faf4] border border-[#c8ead8] rounded-[24px] p-6">
            <p className="text-[13px] font-black text-[#3ea76e] mb-3">작성된 후기 ({submittedReviews.length})</p>
            {submittedReviews.map((r, i) => (
              <div key={i} className="flex items-center gap-3 text-[13px] font-bold text-[#555] py-2 border-b border-[#d4ead9] last:border-none">
                <span className="text-[#f5a623]">{'★'.repeat(r.rating)}</span>
                <span className="font-black text-[#111]">{r.itemName}</span>
                <span className="text-[#aaa] ml-auto">{r.date}</span>
              </div>
            ))}
          </div>
        )}

        <div className="space-y-10">
          {filtered.length === 0 && (
            <div className="text-center py-24 text-[#bbb] font-bold text-[16px]">해당 조건의 주문 내역이 없습니다.</div>
          )}
          {pagedOrders.map(order => (
            <div key={order.id} className="bg-white border border-[#eee] rounded-[40px] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.04)] transition-all">
              <div className="flex items-center justify-between px-10 py-8 bg-[#fcfcfc] border-b border-[#f5f5f5]">
                <div className="flex items-center gap-8">
                  <span className="text-[20px] font-black text-[#111] tracking-tighter">{order.date}</span>
                  <span className="text-[13px] font-bold text-[#ccc] tracking-widest">{order.id}</span>
                </div>
                <Link to={`/order/detail/${order.id}`} className="text-[14px] font-bold text-[#aaa] hover:text-[#3ea76e] transition-colors">상세보기 &gt;</Link>
              </div>

              <div className="divide-y divide-[#f9f9f9]">
                {order.items.map((item, i) => (
                  <div key={i} className="p-10 md:p-14">
                    <div className="flex gap-10 items-center">
                      <div className="w-32 h-32 bg-[#f8f8f8] rounded-[24px] overflow-hidden shrink-0 border border-[#eee]">
                        <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-5">
                          <div>
                            <p className="text-[18px] font-black text-[#111] mb-1.5 tracking-tight">{item.name}</p>
                            <p className="text-[14px] font-bold text-[#bbb]">[옵션: {item.option}]</p>
                          </div>
                          <div className="text-right">
                            <p className="text-[20px] font-black text-[#111] tracking-tighter">{item.price.toLocaleString()}원</p>
                            <p className="text-[14px] font-bold text-[#ccc] mt-1">{item.qty}개</p>
                          </div>
                        </div>

                        <div className="mt-6 pt-6 border-t border-[#f5f5f5] flex items-center justify-between">
                          <span className="text-[16px] font-black text-[#3ea76e]">{order.status}</span>
                          <div className="flex gap-3">
                            <button className="h-11 px-8 text-[13px] font-bold bg-[#f5f5f5] text-[#555] border-none transition-all active:scale-[0.95] hover:bg-[#ebebeb] cursor-pointer rounded-full">
                              배송조회
                            </button>
                            <button
                              onClick={() => setReviewTarget(item)}
                              className="h-11 px-8 text-[13px] font-bold bg-[#3ea76e] text-white border-none transition-all active:scale-[0.95] hover:bg-[#318a57] cursor-pointer rounded-full"
                            >
                              구매후기
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="px-10 md:px-14 py-8 bg-[#fcfcfc] border-t border-[#f5f5f5] flex flex-col md:flex-row items-center justify-between gap-4">
                <p className="text-[13px] font-bold text-[#bbb] tracking-tight">
                  상품금액 {order.productPrice.toLocaleString()} + 배송비 {order.shippingPrice.toLocaleString()} - 할인 {order.discountPrice.toLocaleString()}
                </p>
                <div className="flex items-center gap-5">
                  <span className="text-[15px] font-bold text-[#888]">최종 결제금액</span>
                  <span className="text-[28px] font-black text-[#111] tracking-tighter">{order.total.toLocaleString()}원</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo(0, 0) }} />
      </div>
    </div>
  )
}
