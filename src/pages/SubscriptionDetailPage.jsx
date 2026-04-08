import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { DETAIL_PRODUCTS } from '../mock'

const bundleOptions = [
  { qty: 1, price: 4320, save: 0 },
  { qty: 2, price: 5600, save: 40 },
  { qty: 4, price: 8020, save: 260 },
  { qty: 6, price: 10270, save: 650 },
  { qty: 10, price: 13720, save: 2480 },
]

export default function SubscriptionDetailPage() {
  const { id } = useParams()
  const product = DETAIL_PRODUCTS.find(p => p.id === Number(id)) || DETAIL_PRODUCTS[0]

  const [purchaseType, setPurchaseType] = useState('regular')
  const [deliveryCycle, setDeliveryCycle] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [activeTab, setActiveTab] = useState('detail')
  const [totalQty, setTotalQty] = useState(1)
  const [includeShipping, setIncludeShipping] = useState(true)

  const currentBundle = bundleOptions.find(b => b.qty === totalQty) || bundleOptions[0]
  const optionPrice = selectedOption ? product.options.find(o => o.label === selectedOption)?.extra || 0 : 0
  const discountPerItem = purchaseType === 'regular' ? 4000 : 0
  const totalPrice = currentBundle.price + optionPrice - discountPerItem

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 text-[#222] font-sans">
      {/* 상단: 이미지와 기본 옵션 영역 */}
      <div className="flex flex-col md:flex-row gap-12 mb-10">
        {/* 왼쪽: 상품 이미지 */}
        <div className="w-full md:w-[500px] shrink-0">
          <div className="aspect-square rounded-[32px] overflow-hidden bg-[#f8f8f8] border border-[#f0f0f0]">
            <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
          </div>
        </div>

        {/* 오른쪽: 상품 정보 및 정기배송 설정 */}
        <div className="flex-1 flex flex-col gap-6 py-2">
          <div>
            <div className="flex justify-between items-start mb-2">
              <p className="text-[14px] text-[#3ea76e] font-bold">어글어글</p>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-[#f5f5f5] rounded-full cursor-pointer border-none bg-transparent transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                </button>
                <button className="p-2 hover:bg-[#f5f5f5] rounded-full cursor-pointer border-none bg-transparent transition-colors">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
            </div>
            <h1 className="text-[26px] font-[900] tracking-tight leading-tight mb-4">{product.name}</h1>
            <p className="text-[30px] font-black text-[#111] mb-1">
              {product.price.toLocaleString()}원
            </p>
            <p className="text-[13px] text-[#aaa]">50,000원 이상 구매 시 무료배송 (기본 배송비 5,000원)</p>
          </div>

          {/* 구매방법 & 배송주기 (기존보다 톤다운된 디자인) */}
          <div className="space-y-4 pt-6 border-t border-[#f0f0f0]">
            <div className="flex items-center gap-6">
              <span className="text-[14px] font-bold text-[#888] w-16">구매방법</span>
              <div className="flex gap-8">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="pType"
                    checked={purchaseType === 'regular'}
                    onChange={() => setPurchaseType('regular')}
                    className="w-5 h-5 accent-[#3ea76e]"
                  />
                  <span className={`text-[14px] font-bold ${purchaseType === 'regular' ? 'text-[#111]' : 'text-[#aaa]'}`}>정기배송</span>
                  <span className="bg-[#f0faf4] text-[#3ea76e] text-[10px] px-2 py-0.5 rounded font-bold border border-[#3ea76e]/20">4,000원 할인 ▼</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="pType"
                    checked={purchaseType === 'once'}
                    onChange={() => setPurchaseType('once')}
                    className="w-5 h-5 accent-[#3ea76e]"
                  />
                  <span className={`text-[14px] font-bold ${purchaseType === 'once' ? 'text-[#111]' : 'text-[#aaa]'}`}>1회구매</span>
                </label>
              </div>
            </div>

            {purchaseType === 'regular' && (
              <div className="bg-[#fcfcfc] p-5 rounded-2xl border border-[#eee]">
                <p className="text-[13px] font-bold text-[#444] mb-3">배송주기</p>
                <select
                  value={deliveryCycle}
                  onChange={e => setDeliveryCycle(e.target.value)}
                  className="w-full bg-white border border-[#ddd] rounded-xl px-4 py-3 text-sm outline-none cursor-pointer focus:border-[#3ea76e] transition-colors"
                >
                  <option value="">[필수] 배송주기를 선택해 주세요.</option>
                  <option value="1w">1주</option>
                  <option value="2w">2주</option>
                  <option value="1m">1개월</option>
                </select>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[14px] font-bold text-[#444]">중량 선택</p>
            <select
              value={selectedOption}
              onChange={e => setSelectedOption(e.target.value)}
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm text-[#333] outline-none cursor-pointer bg-white focus:border-[#3ea76e] transition-colors"
            >
              <option value="">- 제품을 선택해 주세요 -</option>
              {product.options.map(opt => (
                <option key={opt.label} value={opt.label}>
                  {opt.label} {opt.extra > 0 ? `(+${opt.extra.toLocaleString()}원)` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 하단: 총 수량 번들 선택 영역 (가로로 넓게 퍼짐) */}
      <div className="mb-16 bg-white rounded-[32px] p-8 border border-[#f0f0f0] shadow-sm">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#f5f5f5]">
          <h2 className="text-[18px] font-[900]">총 수량 선택</h2>
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-[#888]">배송비 포함</span>
            <button
              onClick={() => setIncludeShipping(!includeShipping)}
              className={`w-10 h-5 rounded-full transition-colors relative border-none cursor-pointer ${includeShipping ? 'bg-[#3ea76e]' : 'bg-[#ddd]'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${includeShipping ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>

        {/* 안내 뱃지 영역 */}
        <div className="bg-[#f4f9ff]/50 border border-[#e5f0ff] p-5 rounded-2xl flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-[#3ea76e] text-white text-[11px] font-black rounded-xl flex items-center justify-center text-center leading-tight shadow-sm shrink-0">
            BEST<br/>PICK
          </div>
          <div>
            <p className="text-[13px] text-[#666] mb-1">현재 가장 많이 선택되는 구성입니다.</p>
            <p className="text-[16px] font-bold text-[#111]">정기배송 고객 70%가 <span className="text-[#3ea76e]">4개 묶음</span>을 선택 중</p>
          </div>
        </div>

        {/* 번들 옵션 그리드 (가로로 넓게 배치) */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {bundleOptions.map((opt) => (
            <label
              key={opt.qty}
              className={`relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${
                totalQty === opt.qty 
                ? 'border-[#3ea76e] bg-[#f0faf4]/30' 
                : 'border-[#f0f0f0] hover:border-[#ddd] bg-white'
              }`}
            >
              <input
                type="radio"
                name="bundle"
                checked={totalQty === opt.qty}
                onChange={() => setTotalQty(opt.qty)}
                className="absolute top-4 right-4 w-5 h-5 accent-[#3ea76e]"
              />
              <span className={`text-[20px] font-black mb-2 ${totalQty === opt.qty ? 'text-[#3ea76e]' : 'text-[#111]'}`}>
                {opt.qty}개
              </span>
              <p className="text-[16px] font-bold text-[#111] mb-1">{opt.price.toLocaleString()}원</p>
              {opt.save > 0 ? (
                <span className="text-[11px] text-[#3ea76e] font-bold bg-[#f0faf4] px-2 py-0.5 rounded-full">
                  {opt.save.toLocaleString()}원 절약
                </span>
              ) : (
                <span className="text-[11px] text-[#aaa] font-medium">기본 구성</span>
              )}
            </label>
          ))}
        </div>

        {/* 최종 합계 및 구매 버튼 */}
        <div className="mt-10 pt-8 border-t border-[#f5f5f5] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col">
            <span className="text-[14px] font-bold text-[#aaa] mb-1">최종 결제 금액</span>
            <p className="text-[36px] font-black text-[#3ea76e] tracking-tight">
              {totalPrice.toLocaleString()}<span className="text-[20px] ml-1">원</span>
            </p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button className="flex-1 md:w-[200px] py-5 border-2 border-[#3ea76e] text-[#3ea76e] font-black text-[16px] rounded-2xl hover:bg-[#f0faf4] transition-all cursor-pointer bg-transparent">
              장바구니
            </button>
            <button className="flex-1 md:w-[280px] py-5 bg-[#3ea76e] text-white font-black text-[18px] rounded-2xl hover:bg-[#318a57] transition-all cursor-pointer border-none shadow-lg shadow-[#3ea76e/20]">
              지금 바로 구매하기
            </button>
          </div>
        </div>
      </div>

      {/* 상세 탭 (기존 유지) */}
      <div className="flex mb-10 border-b border-[#eee] sticky top-0 bg-white/80 backdrop-blur-md z-10">
        {[
          { key: 'detail', label: '상세정보' },
          { key: 'review', label: `사용후기 (${product.reviews.length})` },
          { key: 'qna', label: '제품문의' },
          { key: 'info', label: '배송/교환/반품' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-10 py-5 text-[15px] font-black transition-all cursor-pointer relative border-none bg-transparent ${
              activeTab === tab.key ? 'text-[#3ea76e]' : 'text-[#aaa] hover:text-[#444]'
            }`}
          >
            {tab.label}
            {activeTab === tab.key && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3ea76e]" />}
          </button>
        ))}
      </div>

      <div className="min-h-[500px] pb-20">
        {activeTab === 'detail' && (
          <div className="flex flex-col items-center">
            {product.detailImgs.map((src, i) => (
              <img key={i} src={src} alt={`상세 이미지 ${i + 1}`} className="w-full max-w-[900px] block" />
            ))}
          </div>
        )}
        {/* ... 나머지 탭 생략 ... */}
      </div>
    </div>
  )
}