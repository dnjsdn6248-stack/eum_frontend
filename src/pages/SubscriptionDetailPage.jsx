import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DETAIL_PRODUCTS, BUNDLE_OPTIONS, PRODUCT_TEST_IMAGES } from '../mock'
import SwiffyReviewSummary from './ReviewPage'

export default function SubscriptionDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = DETAIL_PRODUCTS.find(p => p.id === Number(id)) || DETAIL_PRODUCTS[0]
  const productImages = product.images || PRODUCT_TEST_IMAGES

  const [currentIdx, setCurrentIdx] = useState(0)
  const [purchaseType, setPurchaseType] = useState('regular')
  const [deliveryCycle, setDeliveryCycle] = useState('')
  const [selectedOption, setSelectedOption] = useState('')
  const [activeTab, setActiveTab] = useState('detail')
  const [totalQty, setTotalQty] = useState(1)
  const [includeShipping, setIncludeShipping] = useState(true)
  const [optionError, setOptionError] = useState(false)
  const [cycleError, setCycleError] = useState(false)

  useEffect(() => { setCurrentIdx(0) }, [id])

  const nextSlide = () => setCurrentIdx(prev => prev === productImages.length - 1 ? 0 : prev + 1)
  const prevSlide = () => setCurrentIdx(prev => prev === 0 ? productImages.length - 1 : prev - 1)

  const currentBundle = BUNDLE_OPTIONS.find(b => b.qty === totalQty) || BUNDLE_OPTIONS[0]
  const optionPrice = selectedOption ? product.options.find(o => o.label === selectedOption)?.extra || 0 : 0
  const discountPerItem = purchaseType === 'regular' ? 4000 : 0
  const totalPrice = currentBundle.price + optionPrice - discountPerItem

  const handleCart = () => {
    let hasError = false
    if (!selectedOption) { setOptionError(true); hasError = true } else setOptionError(false)
    if (purchaseType === 'regular' && !deliveryCycle) { setCycleError(true); hasError = true } else setCycleError(false)
    if (hasError) return
    navigate('/cart')
  }

  const handleBuy = () => {
    let hasError = false
    if (!selectedOption) { setOptionError(true); hasError = true } else setOptionError(false)
    if (purchaseType === 'regular' && !deliveryCycle) { setCycleError(true); hasError = true } else setCycleError(false)
    if (hasError) return
    navigate('/checkout')
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10 text-[#111]">
      <div className="flex flex-col md:flex-row gap-12 mb-10">

        <div className="w-full md:w-[500px] shrink-0">
          <div className="relative aspect-square rounded-[32px] overflow-hidden bg-[#f8f8f8] border border-[#eee] group">
            <div className="flex h-full transition-transform duration-500 ease-in-out" style={{ transform: `translateX(-${currentIdx * 100}%)` }}>
              {productImages.map((img, i) => (
                <img key={i} src={img} className="w-full h-full object-contain shrink-0" alt="" />
              ))}
            </div>
            {productImages.length > 1 && (
              <>
                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md cursor-pointer border-none z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-lg font-bold text-[#111]">〈</span>
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 rounded-full flex items-center justify-center shadow-md cursor-pointer border-none z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-lg font-bold text-[#111]">〉</span>
                </button>
              </>
            )}
            <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2 z-10">
              {productImages.map((_, i) => (
                <div key={i} onClick={() => setCurrentIdx(i)} className={`h-1 rounded-full cursor-pointer transition-all ${currentIdx === i ? 'bg-[#3ea76e] w-8' : 'bg-black/10 w-4'}`} />
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
            {productImages.map((img, idx) => (
              <div key={idx} onClick={() => setCurrentIdx(idx)} className={`w-20 h-20 shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${currentIdx === idx ? 'border-[#3ea76e] opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                <img src={img} className="w-full h-full object-cover" alt="" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col gap-6 py-2">
          <div>
            <div className="flex justify-between items-start mb-2">
              <p className="text-[13px] text-[#3ea76e] font-bold">어글어글</p>
              <div className="flex gap-2">
                <button className="p-2 hover:bg-[#f5f5f5] rounded-full cursor-pointer border-none bg-transparent transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13"/></svg>
                </button>
                <button className="p-2 hover:bg-[#f5f5f5] rounded-full cursor-pointer border-none bg-transparent transition-colors">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.84-8.84 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                </button>
              </div>
            </div>
            <h1 className="text-[24px] font-black tracking-tight leading-tight mb-3 text-[#111]">{product.name}</h1>
            <p className="text-[30px] font-black text-[#111] mb-1 tracking-tight">{product.price.toLocaleString()}원</p>
            <p className="text-[13px] text-[#bbb] font-bold">50,000원 이상 구매 시 무료배송 (기본 배송비 5,000원)</p>
          </div>

          <div className="space-y-4 pt-5 border-t border-[#f0f0f0]">
            <div className="flex items-center gap-6">
              <span className="text-[14px] font-bold text-[#aaa] w-16 shrink-0">구매방법</span>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="pType" checked={purchaseType === 'regular'} onChange={() => setPurchaseType('regular')} className="w-4 h-4 accent-[#3ea76e]" />
                  <span className={`text-[14px] font-black ${purchaseType === 'regular' ? 'text-[#111]' : 'text-[#aaa]'}`}>정기배송</span>
                  <span className="bg-[#f0faf4] text-[#3ea76e] text-[11px] px-2 py-0.5 rounded-full font-bold border border-[#3ea76e]/20">4,000원 할인</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="pType" checked={purchaseType === 'once'} onChange={() => setPurchaseType('once')} className="w-4 h-4 accent-[#3ea76e]" />
                  <span className={`text-[14px] font-black ${purchaseType === 'once' ? 'text-[#111]' : 'text-[#aaa]'}`}>1회구매</span>
                </label>
              </div>
            </div>

            {purchaseType === 'regular' && (
              <div className="bg-[#f9f9f9] p-5 rounded-2xl border border-[#eee]">
                <p className="text-[13px] font-bold text-[#555] mb-3">배송주기</p>
                <select
                  value={deliveryCycle}
                  onChange={e => { setDeliveryCycle(e.target.value); setCycleError(false) }}
                  className={`w-full bg-white border rounded-2xl px-5 py-3 text-[14px] outline-none cursor-pointer focus:border-[#3ea76e] transition-colors font-bold ${cycleError ? 'border-red-400 bg-red-50' : 'border-[#eee]'}`}
                >
                  <option value="">[필수] 배송주기를 선택해 주세요.</option>
                  <option value="1w">1주</option>
                  <option value="2w">2주</option>
                  <option value="1m">1개월</option>
                </select>
                {cycleError && <p className="text-red-400 text-[13px] font-bold mt-2 ml-1">배송주기를 선택해주세요.</p>}
              </div>
            )}
          </div>

          <div className="space-y-2">
            <p className="text-[14px] font-bold text-[#555]">중량 선택</p>
            <select
              value={selectedOption}
              onChange={e => { setSelectedOption(e.target.value); setOptionError(false) }}
              className={`w-full border rounded-2xl px-5 py-3 text-[14px] text-[#333] outline-none cursor-pointer bg-white transition-colors font-bold ${optionError ? 'border-red-400 bg-red-50' : 'border-[#eee] focus:border-[#3ea76e]'}`}
            >
              <option value="">- 제품을 선택해 주세요 -</option>
              {product.options.map(opt => (
                <option key={opt.label} value={opt.label}>
                  {opt.label} {opt.extra > 0 ? `(+${opt.extra.toLocaleString()}원)` : ''}
                </option>
              ))}
            </select>
            {optionError && <p className="text-red-400 text-[13px] font-bold mt-2 ml-1">옵션을 선택해주세요.</p>}
          </div>
        </div>
      </div>

      <div className="mb-16 bg-white rounded-[40px] p-10 border border-[#eee] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
        <div className="flex justify-between items-center mb-8 pb-6 border-b border-[#f5f5f5]">
          <h2 className="text-[20px] font-black tracking-tight">총 수량 선택</h2>
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-[#aaa]">배송비 포함</span>
            <button onClick={() => setIncludeShipping(!includeShipping)} className={`w-10 h-5 rounded-full transition-colors relative border-none cursor-pointer ${includeShipping ? 'bg-[#3ea76e]' : 'bg-[#ddd]'}`}>
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${includeShipping ? 'left-6' : 'left-1'}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {BUNDLE_OPTIONS.map((opt) => (
            <label key={opt.qty} className={`relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all cursor-pointer ${totalQty === opt.qty ? 'border-[#3ea76e] bg-[#f0faf4]/50' : 'border-[#eee] hover:border-[#ddd] bg-white'}`}>
              <input type="radio" name="bundle" checked={totalQty === opt.qty} onChange={() => setTotalQty(opt.qty)} className="absolute top-4 right-4 w-4 h-4 accent-[#3ea76e]" />
              <span className={`text-[20px] font-black mb-2 ${totalQty === opt.qty ? 'text-[#3ea76e]' : 'text-[#111]'}`}>{opt.qty}개</span>
              <p className="text-[15px] font-black text-[#111] mb-1">{opt.price.toLocaleString()}원</p>
              {opt.save > 0 && <span className="text-[11px] text-[#3ea76e] font-bold bg-[#f0faf4] px-2 py-0.5 rounded-full">{opt.save.toLocaleString()}원 절약</span>}
            </label>
          ))}
        </div>

        <div className="mt-10 pt-8 border-t border-[#f5f5f5] flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <span className="text-[13px] font-bold text-[#aaa] block mb-1">최종 결제 금액</span>
            <p className="text-[36px] font-black text-[#3ea76e] tracking-tight">{totalPrice.toLocaleString()}<span className="text-[20px] ml-1">원</span></p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <button onClick={handleCart} className="flex-1 md:w-[180px] py-5 border-2 border-[#3ea76e] text-[#3ea76e] font-black text-[15px] rounded-2xl hover:bg-[#f0faf4] transition-all cursor-pointer bg-transparent">
              장바구니
            </button>
            <button onClick={handleBuy} className="flex-1 md:w-[260px] py-5 bg-[#3ea76e] text-white font-black text-[16px] rounded-2xl hover:bg-[#318a57] transition-all cursor-pointer border-none">
              {purchaseType === 'regular' ? '정기배송 신청하기' : '지금 바로 구매하기'}
            </button>
          </div>
        </div>
      </div>

      <div className="flex mb-10 border-b border-[#eee] sticky top-0 bg-white z-10">
        {[
          { key: 'detail', label: '상세정보' },
          { key: 'review', label: `사용후기 (${product.reviews.length})` },
          { key: 'qna', label: '제품문의' },
          { key: 'info', label: '배송/교환/반품' },
        ].map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-8 py-5 text-[14px] font-black transition-all cursor-pointer relative border-none bg-transparent ${activeTab === tab.key ? 'text-[#3ea76e]' : 'text-[#aaa] hover:text-[#444]'}`}>
            {tab.label}
            {activeTab === tab.key && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3ea76e] rounded-full" />}
          </button>
        ))}
      </div>

      <div className="min-h-[500px] pb-20">
        {activeTab === 'detail' && (
          <div className="flex flex-col items-center">
            {product.detailImgs.map((src, i) => <img key={i} src={src} alt={`상세 이미지 ${i + 1}`} className="w-full max-w-[900px] block" />)}
          </div>
        )}
        {activeTab === 'review' && <SwiffyReviewSummary />}
        {activeTab === 'qna' && <div className="text-center py-24 text-[#bbb] font-bold text-[15px]">게시물이 없습니다.</div>}
        {activeTab === 'info' && (
          <div className="flex flex-col gap-8 text-[14px] text-[#555] leading-relaxed py-4">
            <div>
              <h3 className="font-black text-[#111] mb-3 text-[16px]">배송 안내</h3>
              <p className="font-bold text-[#888]">배송 방법: 택배 / 배송비: 5,000원 (50,000원 이상 무료)</p>
              <p className="font-bold text-[#888]">배송 기간: 1일 ~ 2일 (도서산간 지역 배송 불가)</p>
            </div>
            <div>
              <h3 className="font-black text-[#111] mb-3 text-[16px]">교환/반품 안내</h3>
              <p className="font-bold text-[#888]">상품 수령 후 7일 이내 교환/반품 가능</p>
              <p className="font-bold text-[#888]">냉동제품 단순변심 교환/반품 불가</p>
              <p className="font-bold text-[#888]">카카오톡 스위피 채널로 문의해주세요</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}