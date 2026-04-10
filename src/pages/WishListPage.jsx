import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronDown, Check, X, Heart, ShoppingBag } from 'lucide-react'

// 1. 샘플 데이터 (데이터가 없을 때를 대비한 Mock)
const MOCK_WISHLIST = [
  {
    id: 1,
    name: '[판매 2위] 어글어글 육포 50g 5종',
    price: 7500,
    img: 'https://swiffy.cafe24.com/web/product/medium/202303/8b961050a6dfe4e80ec2fd11f1fa2765.png',
    currentOption: '제주 닭 안심 육포 50g',
    options: ['제주 닭 안심 육포 50g', '강원도 황태채 40g', '우유껌 50g'],
  },
  {
    id: 2,
    name: '어글어글 우유껌 50g 7종',
    price: 6500,
    img: 'https://swiffy.cafe24.com/web/product/medium/202412/c574e33c42600c960242e5ec86ab1d7a.png',
    currentOption: '산양유 우유껌',
    options: ['제주 베리클리 우유껌', '산양유 우유껌', '오트밀 우유껌'],
  }
]

// 2. [컴포넌트] 옵션 드롭다운 (디자인 시스템 반영)
function OptionDropdown({ currentOption, options = [], onSelect }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative w-fit">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#f8f8f8] border border-[#eee] hover:border-[#3ea76e] transition-all cursor-pointer"
      >
        <span className="text-[12px] font-bold text-[#bbb]">
          옵션: <span className="text-[#666] ml-1">{currentOption}</span>
        </span>
        <ChevronDown size={14} className={`text-[#bbb] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-[220px] bg-white rounded-2xl shadow-xl z-20 overflow-hidden py-2 border border-[#eee]">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onSelect(opt); setIsOpen(false) }}
              className="w-full flex items-center justify-between px-4 py-3 hover:bg-[#f0faf4] transition-colors border-none bg-transparent cursor-pointer text-left"
            >
              <span className={`text-[13px] ${currentOption === opt ? 'text-[#3ea76e] font-bold' : 'text-[#666] font-medium'}`}>
                {opt}
              </span>
              {currentOption === opt && <Check size={14} className="text-[#3ea76e]" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// 3. [컴포넌트] 개별 아이템 (에러 방어 로직 추가)
function WishItem({ item, onRemove }) {
  // 🔴 에러 방어: item이 없으면 렌더링하지 않음
  if (!item) return null;

  const [selectedOption, setSelectedOption] = useState(item.currentOption || '옵션 선택')

  return (
    <div className="bg-white rounded-[30px] border border-[#eee] p-6 shadow-sm hover:shadow-md transition-all group">
      <div className="flex items-center gap-6">
        {/* 체크박스 */}
        <input type="checkbox" className="w-5 h-5 rounded border-[#eee] accent-[#3ea76e] cursor-pointer" />
        
        {/* 이미지 */}
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-[#f9f9f9] border border-[#f5f5f5] shrink-0">
          <img src={item.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500" />
        </div>

        {/* 정보 */}
        <div className="flex-1 min-w-0">
          <h4 className="text-[15px] font-bold text-[#111] mb-2 truncate">{item.name}</h4>
          <OptionDropdown 
            currentOption={selectedOption} 
            options={item.options} 
            onSelect={setSelectedOption} 
          />
        </div>

        {/* 가격 및 삭제 */}
        <div className="text-right flex flex-col items-end gap-3 shrink-0">
          <button onClick={() => onRemove(item.id)} className="text-[#eee] group-hover:text-[#bbb] transition-colors cursor-pointer">
            <X size={20} />
          </button>
          <span className="text-[18px] font-bold text-[#111]">{item.price?.toLocaleString()}원</span>
          <button className="px-5 py-2.5 bg-[#f0faf4] text-[#3ea76e] rounded-xl text-[12px] font-bold hover:bg-[#e6f7ed] transition-all flex items-center gap-1">
            <ShoppingBag size={14} /> 담기
          </button>
        </div>
      </div>
    </div>
  )
}

// 4. [페이지] 메인 관심상품 페이지
export default function WishListPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState(MOCK_WISHLIST)

  const handleRemove = (id) => setItems(prev => prev.filter(item => item.id !== id))
  const totalPrice = items.reduce((acc, item) => acc + (item.price || 0), 0)

  return (
    <div className="bg-[#FCFBF9] min-h-screen text-[#111] pb-20">
      <main className="max-w-[800px] mx-auto px-6">
        
        <div className="py-20 text-center">
          <h1 className="text-[28px] font-bold tracking-tight">관심상품</h1>
        </div>

        {/* 요약 섹션: 디자인 시스템 반영 */}
        <section className="bg-white rounded-[30px] border border-[#eee] p-6 mb-8 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-10 ml-4">
            <div className="flex flex-col">
              <span className="text-[12px] text-[#bbb] font-bold mb-1">담긴 상품</span>
              <span className="text-[20px] font-bold">{items.length}건</span>
            </div>
            <div className="w-[1px] h-8 bg-[#eee]" />
            <div className="flex flex-col">
              <span className="text-[12px] text-[#bbb] font-bold mb-1">예상 금액</span>
              <span className="text-[20px] font-bold text-[#3ea76e]">{totalPrice.toLocaleString()}원</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/checkout')}
            className="bg-[#3ea76e] text-white px-8 py-3.5 rounded-full text-[14px] font-bold hover:bg-[#318a57] transition-all flex items-center gap-2 shadow-lg shadow-green-100 cursor-pointer border-none"
          >
            전체 주문하기
          </button>
        </section>

        {/* 컨트롤 영역 */}
        <div className="flex justify-end pr-2 mb-4">
          <button onClick={() => setItems([])} className="text-[11px] font-bold text-[#bbb] hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer">
            전체삭제
          </button>
        </div>

        {/* 리스트 출력 */}
        {items.length === 0 ? (
          <div className="bg-white rounded-[30px] border border-[#eee] py-32 text-center shadow-sm">
            <Heart size={40} className="text-[#f5f5f5] mx-auto mb-4" />
            <p className="text-[#bbb] font-bold text-[15px]">관심상품이 비어있습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map(item => (
              <WishItem key={item.id} item={item} onRemove={handleRemove} />
            ))}
          </div>
        )}
      </main>
    </div>
  )
}