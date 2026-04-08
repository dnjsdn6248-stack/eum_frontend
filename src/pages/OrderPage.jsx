import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MOCK_ORDERS } from '../mock'

const STATUS_OPTIONS = ['전체 주문처리상태', '입금전', '배송준비중', '배송중', '배송완료', '취소', '교환', '반품']
const PERIOD_OPTIONS = ['오늘', '1개월', '3개월', '6개월', '기간설정']

export default function OrderPage() {
  const [activeMainTab, setActiveMainTab] = useState('주문내역')
  const [status, setStatus] = useState('전체 주문처리상태')
  const [period, setPeriod] = useState('3개월')

  const filtered = status === '전체 주문처리상태' ? MOCK_ORDERS : MOCK_ORDERS.filter(o => o.status === status)

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-20 bg-white min-h-screen">
      <h1 className="text-[36px] font-black text-center mb-16 text-[#111] tracking-tight">주문조회</h1>

      <div className="flex justify-center gap-24 mb-14 border-b border-[#f5f5f5]">
        {[
          { key: '주문내역', label: `주문내역 조회 (${MOCK_ORDERS.length}건)` },
          { key: '취소교환반품', label: '취소/교환/반품 내역 (1건)' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveMainTab(tab.key)}
            className={`pb-5 text-[18px] font-bold border-none bg-transparent cursor-pointer transition-all tracking-tight ${
              activeMainTab === tab.key ? 'text-[#3ea76e] border-b-2 border-[#3ea76e]' : 'text-[#bbb] hover:text-[#999]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-[#fcfdfc] border border-[#eef2ef] p-12 mb-20 rounded-[32px]">
        <div className="flex items-center gap-8 mb-6">
          <span className="text-[15px] font-bold text-[#666] w-20">상태</span>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            className="w-full max-w-[450px] h-12 border border-[#ddd] bg-white px-5 outline-none text-[#333] rounded-full text-[14px] focus:border-[#3ea76e] transition-colors font-bold"
          >
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-8 mb-8">
          <span className="text-[15px] font-bold text-[#666] w-20">기간</span>
          <div className="flex w-full max-w-[650px] gap-2">
            {PERIOD_OPTIONS.map(p => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`flex-1 h-12 text-[14px] font-bold cursor-pointer transition-all tracking-tight rounded-full border ${
                  period === p 
                    ? 'bg-[#3ea76e] text-white border-[#3ea76e] shadow-md shadow-green-100' 
                    : 'bg-white text-[#666] border-[#eee] hover:border-[#3ea76e] hover:text-[#3ea76e]'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
        <div className="pt-8 border-t border-[#f0f4f0] space-y-3 text-[14px] text-[#999] tracking-tight">
          <div className="flex items-center gap-3">
            <span className="w-5 h-5 rounded-full bg-[#3ea76e] text-white flex items-center justify-center text-[11px] shrink-0 font-bold italic">!</span>
            <span>취소/교환/반품 신청은 배송완료일 기준 3일까지만 가능합니다.</span>
          </div>
        </div>
      </div>

      <div className="space-y-16">
        {filtered.map(order => (
          <div key={order.id} className="border border-[#f0f0f0] rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between px-12 py-8 bg-[#fcfdfc] border-b border-[#f5f5f5]">
              <div className="flex items-center gap-8">
                <span className="text-[22px] font-black text-[#111] tracking-tighter">{order.date}</span>
                <span className="text-[15px] font-bold text-[#ccc] tracking-normal">{order.id}</span>
              </div>
              <Link to="#" className="text-[14px] font-bold text-[#888] hover:text-[#3ea76e] transition-colors">주문 상세정보 &gt;</Link>
            </div>
            <div className="divide-y divide-[#f9f9f9]">
              {order.items.map((item, i) => (
                <div key={i} className="p-12">
                  <div className="flex gap-12 items-center">
                    <div className="w-40 h-40 bg-[#f8f8f8] rounded-[24px] overflow-hidden shrink-0 border border-[#eee]">
                      <img src={item.img} className="w-full h-full object-cover" alt={item.name} />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-6 tracking-tight">
                        <div>
                          <p className="text-[20px] font-black text-[#111] mb-2">{item.name}</p>
                          <p className="text-[16px] font-medium text-[#aaa]">[옵션: {item.option}]</p>
                        </div>
                        <div className="text-right">
                          <p className="text-[22px] font-black text-[#111]">{item.price.toLocaleString()}원</p>
                          <p className="text-[16px] font-bold text-[#ccc]">{item.qty}개</p>
                        </div>
                      </div>
                      <div className="mt-10 pt-10 border-t border-[#f8faf8] flex items-center justify-between tracking-tight">
                        <span className="text-[18px] font-black text-[#3ea76e]">{order.status}</span>
                        <div className="flex gap-3">
                          <button className="px-12 py-4 text-[14px] font-bold bg-white border border-[#eee] text-[#666] hover:border-[#3ea76e] hover:text-[#3ea76e] transition-all cursor-pointer rounded-full">
                            배송조회
                          </button>
                          <button className="px-12 py-4 text-[14px] font-bold bg-white border border-[#eee] text-[#666] hover:border-[#3ea76e] hover:text-[#3ea76e] transition-all cursor-pointer rounded-full">
                            구매후기
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="px-12 py-10 bg-[#fcfdfc] border-t border-[#f5f5f5] flex items-center justify-between">
              <p className="text-[14px] font-medium text-[#bbb] tracking-tight">
                상품금액 {order.productPrice.toLocaleString()} + 배송비 {order.shippingPrice.toLocaleString()} - 할인 {order.discountPrice.toLocaleString()}
              </p>
              <div className="flex items-center gap-6">
                <span className="text-[17px] font-bold text-[#888]">최종 결제금액</span>
                <span className="text-[32px] font-black text-[#111] tracking-tighter">{order.total.toLocaleString()}원</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}