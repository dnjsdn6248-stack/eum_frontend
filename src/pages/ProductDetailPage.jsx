import { useState } from 'react'
import { useParams } from 'react-router-dom'

const ALL_PRODUCTS = [
  {
    id: 1,
    name: '어글어글 제주 야채 믹스 샐러드',
    desc: '원물을 그대로 말린 제품으로 채소를 골고루 잘 먹는 댕댕이들에게 추천합니다!',
    price: 6500,
    img: 'https://swiffy.co.kr/web/product/small/202303/a221b9c1eee2dc27e3131515ef3c9514.jpg',
    options: [
      { label: '제주 야채 믹스 샐러드 15g', extra: 0 },
      { label: '제주 야채 믹스 샐러드 45g', extra: 4500 },
    ],
    reviews: [
      { name: 'je****', date: '25.03.22', rating: 5, text: '넘좋아요 내가먹어두 야채에 꼬신맛이 굿~~~~' },
      { name: 'je****', date: '25.02.19', rating: 5, text: '잘먹어요 늘구매하는 상품입니다' },
      { name: '카카****', date: '24.03.31', rating: 5, text: '만족 너무좋아요~' },
    ],
    detailImgs: [
      'https://ai.esmplus.com/swiffy0903/uglugl/SNACK/SALAD_01.jpg',
      'https://ai.esmplus.com/swiffy0903/uglugl/SNACK/SALAD_CHECK.jpg',
      'https://ai.esmplus.com/swiffy0903/uglugl/SNACK/UGLUGL.jpg',
    ]
  },
]

export default function ProductDetailPage() {
  const { id } = useParams()
  const product = ALL_PRODUCTS.find(p => p.id === Number(id)) || ALL_PRODUCTS[0]

  const [selectedOption, setSelectedOption] = useState('')
  const [qty, setQty] = useState(1)
  const [activeTab, setActiveTab] = useState('detail')

  const optionPrice = selectedOption
    ? product.options.find(o => o.label === selectedOption)?.extra || 0
    : 0
  const totalPrice = (product.price + optionPrice) * qty

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-10">
      <div className="flex gap-16 mb-16">
        <div className="w-[500px] shrink-0">
          <div className="aspect-square rounded-2xl overflow-hidden bg-[#f8f8f8] border border-[#eee]">
            <img src={product.img} alt={product.name} className="w-full h-full object-contain" />
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-5 py-2">
          <div>
            <p className="text-xs text-[#3ea76e] font-bold mb-1">어글어글</p>
            <h1 className="text-[22px] font-black text-[#222] leading-snug mb-2">{product.name}</h1>
            <p className="text-sm text-[#888]">{product.desc}</p>
          </div>
          <div className="border-t border-[#f0f0f0] pt-5">
            <p className="text-[28px] font-black text-[#222]">{product.price.toLocaleString()}원</p>
            <p className="text-xs text-[#aaa] mt-1">50,000원 이상 구매 시 무료배송 (기본 배송비 5,000원)</p>
          </div>
          <div>
            <p className="text-sm font-bold text-[#444] mb-2">중량 선택</p>
            <select
              value={selectedOption}
              onChange={e => setSelectedOption(e.target.value)}
              className="w-full border border-[#ddd] rounded-xl px-4 py-3 text-sm text-[#333] outline-none focus:border-[#3ea76e] cursor-pointer"
            >
              <option value="">- 제품을 선택해 주세요 -</option>
              {product.options.map(opt => (
                <option key={opt.label} value={opt.label}>
                  {opt.label} {opt.extra > 0 ? `(+${opt.extra.toLocaleString()}원)` : ''}
                </option>
              ))}
            </select>
          </div>
          {selectedOption && (
            <div className="flex items-center gap-4">
              <p className="text-sm font-bold text-[#444]">수량</p>
              <div className="flex items-center border border-[#ddd] rounded-xl overflow-hidden">
                <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-10 h-10 text-lg text-[#555] hover:bg-[#f5f5f5] transition-colors border-none bg-white cursor-pointer">-</button>
                <span className="w-12 text-center text-sm font-bold">{qty}</span>
                <button onClick={() => setQty(q => q + 1)} className="w-10 h-10 text-lg text-[#555] hover:bg-[#f5f5f5] transition-colors border-none bg-white cursor-pointer">+</button>
              </div>
            </div>
          )}
          <div className="border-t border-[#f0f0f0] pt-4 flex items-center justify-between">
            <p className="text-sm text-[#888]">총 금액</p>
            <p className="text-[22px] font-black text-[#3ea76e]">{totalPrice.toLocaleString()}원</p>
          </div>
          <div className="flex gap-3">
            <button className="flex-1 py-4 border-2 border-[#3ea76e] text-[#3ea76e] font-black text-[15px] rounded-xl hover:bg-[#f0faf4] transition-colors cursor-pointer">장바구니</button>
            <button className="flex-1 py-4 bg-[#3ea76e] text-white font-black text-[15px] rounded-xl hover:bg-[#318a57] transition-colors cursor-pointer">구매하기</button>
          </div>
        </div>
      </div>

      <div className="flex border-b border-[#eee] mb-10">
        {[
          { key: 'detail', label: '상세정보' },
          { key: 'review', label: `사용후기 (${product.reviews.length})` },
          { key: 'qna', label: '제품문의' },
          { key: 'info', label: '배송/교환/반품' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-8 py-4 text-sm font-bold transition-colors cursor-pointer border-none bg-transparent ${
              activeTab === tab.key ? 'text-[#3ea76e] border-b-2 border-[#3ea76e]' : 'text-[#888] hover:text-[#333]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'detail' && (
        <div className="flex flex-col items-center">
          {product.detailImgs.map((src, i) => (
            <img key={i} src={src} alt={`상세 ${i + 1}`} className="w-full max-w-[860px]" />
          ))}
        </div>
      )}
      {activeTab === 'review' && (
        <div className="flex flex-col gap-4">
          {product.reviews.map((r, i) => (
            <div key={i} className="border border-[#eee] rounded-xl p-5">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-[#f5a623] text-sm">{'★'.repeat(r.rating)}</span>
                <span className="text-sm font-bold text-[#333]">{r.name}</span>
                <span className="text-xs text-[#aaa]">{r.date}</span>
              </div>
              <p className="text-sm text-[#555]">{r.text}</p>
            </div>
          ))}
        </div>
      )}
      {activeTab === 'qna' && (
        <div className="text-center py-20 text-[#aaa] text-sm">게시물이 없습니다.</div>
      )}
      {activeTab === 'info' && (
        <div className="flex flex-col gap-6 text-sm text-[#555] leading-relaxed">
          <div>
            <h3 className="font-bold text-[#222] mb-2">배송 안내</h3>
            <p>배송 방법: 택배 / 배송비: 5,000원 (50,000원 이상 무료)</p>
            <p>배송 기간: 1일 ~ 2일 (도서산간 지역 배송 불가)</p>
          </div>
          <div>
            <h3 className="font-bold text-[#222] mb-2">교환/반품 안내</h3>
            <p>상품 수령 후 7일 이내 교환/반품 가능</p>
            <p>냉동제품 단순변심 교환/반품 불가</p>
            <p>카카오톡 스위피 채널로 문의해주세요</p>
          </div>
        </div>
      )}
    </div>
  )
}