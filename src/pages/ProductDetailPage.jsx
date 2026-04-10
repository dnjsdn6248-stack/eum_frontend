import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { DETAIL_PRODUCTS, BUNDLE_PRODUCTS, PRODUCT_TEST_IMAGES } from '../mock'
import SwiffyReviewSummary from './ReviewPage'
import Alert from '../features/components/ui/Alert'

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const product = DETAIL_PRODUCTS.find(p => p.id === Number(id)) || DETAIL_PRODUCTS[0]
  const productImages = product.images || PRODUCT_TEST_IMAGES

  const [currentIdx, setCurrentIdx] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('detail')
  const [bundleSelections, setBundleSelections] = useState({})
  const [bundleOpen, setBundleOpen] = useState(true)
  const [optionError, setOptionError] = useState(false)
  const [alertMsg, setAlertMsg] = useState('')

  useEffect(() => { setCurrentIdx(0) }, [id])

  const nextSlide = () => setCurrentIdx(prev => prev === productImages.length - 1 ? 0 : prev + 1)
  const prevSlide = () => setCurrentIdx(prev => prev === 0 ? productImages.length - 1 : prev - 1)

  const optionPrice = selectedOption ? product.options.find(o => o.label === selectedOption)?.extra || 0 : 0
  const totalPrice = (product.price + optionPrice) * qty

  const handleCart = () => {
    if (!selectedOption) { setAlertMsg('상품 옵션을 선택해주세요.'); return }
    navigate('/cart')
  }

  const handleBuy = () => {
    if (!selectedOption) { setAlertMsg('상품 옵션을 선택해주세요.'); return }
    navigate('/checkout')
  }

  return (
    <>
      {/* 옵션 미선택 알림 모달 */}
      {alertMsg && <Alert message={alertMsg} onConfirm={() => setAlertMsg('')} />}

      <div className="max-w-[1200px] mx-auto px-6 py-10 text-[#111]">

        {/* 상단: 이미지 + 상품정보 */}
        <div className="flex flex-col md:flex-row gap-12 mb-10">

          {/* 이미지 슬라이드 */}
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
            {/* 썸네일 */}
            <div className="flex gap-3 mt-4 overflow-x-auto pb-2 scrollbar-hide">
              {productImages.map((img, idx) => (
                <div key={idx} onClick={() => setCurrentIdx(idx)} className={`w-20 h-20 shrink-0 rounded-2xl overflow-hidden cursor-pointer border-2 transition-all ${currentIdx === idx ? 'border-[#3ea76e] opacity-100' : 'border-transparent opacity-40 hover:opacity-100'}`}>
                  <img src={img} className="w-full h-full object-cover" alt="" />
                </div>
              ))}
            </div>
          </div>

          {/* 상품 정보 */}
          <div className="flex-1 flex flex-col gap-5 py-2">
            <div>
              <p className="text-[13px] text-[#3ea76e] font-bold mb-2">어글어글</p>
              <h1 className="text-[24px] font-black text-[#111] leading-snug mb-2 tracking-tight">{product.name}</h1>
              <p className="text-[14px] text-[#aaa] font-bold">{product.desc}</p>
            </div>

            <div className="pt-5 border-t border-[#f0f0f0]">
              <p className="text-[30px] font-black text-[#111] tracking-tight">{product.price.toLocaleString()}원</p>
              <p className="text-[13px] text-[#bbb] mt-1 font-bold">50,000원 이상 구매 시 무료배송 (기본 배송비 5,000원)</p>
            </div>

            {/* 옵션 선택 */}
            <div>
              <p className="text-[14px] font-bold text-[#555] mb-2">중량 선택</p>
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

            {/* 수량 */}
            {selectedOption && (
              <div className="flex items-center gap-4">
                <p className="text-[14px] font-bold text-[#555]">수량</p>
                <div className="flex items-center rounded-full overflow-hidden border border-[#eee] bg-[#f8f8f8] px-2">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center font-bold text-[#aaa] hover:text-[#111] bg-transparent border-none cursor-pointer text-lg">－</button>
                  <span className="w-10 text-center text-[14px] font-black text-[#111]">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 flex items-center justify-center font-bold text-[#aaa] hover:text-[#111] bg-transparent border-none cursor-pointer text-lg">＋</button>
                </div>
              </div>
            )}

            {/* 총 금액 */}
            <div className="pt-5 border-t border-[#f0f0f0] flex items-center justify-between">
              <p className="text-[14px] font-bold text-[#aaa]">총 금액</p>
              <p className="text-[24px] font-black text-[#3ea76e] tracking-tight">{totalPrice.toLocaleString()}원</p>
            </div>

            {/* 장바구니 / 구매하기 */}
            <div className="flex gap-3">
              <button onClick={handleCart} className="flex-1 py-4 border-2 border-[#3ea76e] text-[#3ea76e] font-black text-[15px] rounded-2xl hover:bg-[#f0faf4] transition-all cursor-pointer bg-transparent">
                장바구니
              </button>
              <button onClick={handleBuy} className="flex-1 py-4 bg-[#3ea76e] text-white font-black text-[15px] rounded-2xl hover:bg-[#318a57] transition-all cursor-pointer border-none">
                구매하기
              </button>
            </div>
          </div>
        </div>

        {/* 함께 구매하면 좋은 제품 */}
        <div className="mb-10 bg-[#FCFBF9] rounded-[40px] border border-[#eee] overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <button onClick={() => setBundleOpen(!bundleOpen)} className="w-full flex items-center justify-between px-10 py-6 bg-transparent border-none cursor-pointer hover:bg-black/5 transition-colors">
            <span className="text-[16px] font-black text-[#111] tracking-tight">함께 구매하면 좋은 제품</span>
            <span className="text-[20px] font-bold text-[#aaa]">{bundleOpen ? '−' : '+'}</span>
          </button>
          {bundleOpen && (
            <div className="divide-y divide-[#eee]">
              {BUNDLE_PRODUCTS.map(item => (
                <div key={item.id} className="flex items-center gap-5 px-10 py-6">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden border border-[#eee] shrink-0 bg-white">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[14px] font-black text-[#111] mb-1 tracking-tight">{item.name}</p>
                    {item.discountPrice ? (
                      <div className="flex items-center gap-2">
                        <span className="text-[13px] font-bold text-[#bbb] line-through">{item.originalPrice.toLocaleString()}원</span>
                        <span className="text-[15px] font-black text-[#3ea76e]">{item.discountPrice.toLocaleString()}원</span>
                      </div>
                    ) : (
                      <p className="text-[15px] font-black text-[#111]">{item.originalPrice.toLocaleString()}원</p>
                    )}
                  </div>
                  <div className="w-[200px] shrink-0">
                    <select
                      value={bundleSelections[item.id] || ''}
                      onChange={e => setBundleSelections(prev => ({ ...prev, [item.id]: e.target.value }))}
                      className="w-full border border-[#eee] rounded-2xl px-4 py-2.5 text-[13px] text-[#333] outline-none cursor-pointer bg-white focus:border-[#3ea76e] transition-colors font-bold"
                    >
                      {item.options.map((opt, i) => (
                        <option key={i} value={i === 0 ? '' : opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 상세 탭 */}
        <div className="flex mb-10 border-b border-[#eee] sticky top-0 bg-white z-10">
          {[
            { key: 'detail', label: '상세정보' },
            { key: 'review', label: `사용후기 (${product.reviews.length})` },
            { key: 'qna', label: '제품문의' },
            { key: 'info', label: '배송/교환/반품' },
          ].map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`px-8 py-5 text-[14px] font-black transition-colors cursor-pointer relative border-none bg-transparent ${activeTab === tab.key ? 'text-[#3ea76e]' : 'text-[#aaa] hover:text-[#333]'}`}>
              {tab.label}
              {activeTab === tab.key && <span className="absolute bottom-0 left-0 w-full h-[3px] bg-[#3ea76e] rounded-full" />}
            </button>
          ))}
        </div>

        {/* 탭 컨텐츠 */}
        {activeTab === 'detail' && (
          <div className="flex flex-col items-center">
            {product.detailImgs.map((src, i) => <img key={i} src={src} alt={`상세 ${i + 1}`} className="w-full max-w-[860px]" />)}
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
    </>
  )
}