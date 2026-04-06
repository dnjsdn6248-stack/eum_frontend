import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Search, User, ShoppingBag, ReceiptText, ChevronRight } from 'lucide-react'

const navItems = [
  { label: 'store 🐾', to: '/product/list' },
  { label: '정기배송 🚚', to: '#' },
  { label: '베스트셀러 🔥', to: '#' },
  { label: '브랜드 스토리', to: '#' },
]

const popularSearches = ['오독오독', '청정 육포', '꽈배기츄', '반건조 육포', '테린', '포켓']

export default function Header() {
  const [isSearchFocus, setIsSearchFocus] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  
  const scrollRef = useRef(null)
  const [isDrag, setIsDrag] = useState(false)
  const [startX, setStartX] = useState(0)
  const [showGradient, setShowGradient] = useState(true)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowGradient(scrollLeft + clientWidth < scrollWidth - 10)
    }
  }

  const onDragStart = (e) => {
    e.preventDefault()
    setIsDrag(true)
    setStartX(e.pageX + scrollRef.current.scrollLeft)
  }

  const onDragEnd = () => setIsDrag(false)
  
  const onDragMove = (e) => {
    if (isDrag) {
      scrollRef.current.scrollLeft = startX - e.pageX
      handleScroll()
    }
  }

  return (
    <header className="relative w-full bg-white z-[100] border-b border-gray-100">
   
      <div className="bg-white border-b border-gray-50 flex items-center h-[32px]">
        <div className="max-w-[1200px] mx-auto w-full flex justify-end px-6 items-center gap-6">
          {[
            { text: '로그인', to: '/login' },
            { text: '회원가입', to: '/signup' },
  
            { text: '고객센터', to: '/cs' }
          ].map((item) => (
            <Link 
              key={item.text} 
              to={item.to} 
              className="text-[11px] font-bold text-[#999] hover:text-[#3ea76e] tracking-normal transition-all"
            >
              {item.text}
            </Link>
          ))}
        </div>
      </div>

    
      <div className="max-w-[1200px] mx-auto flex items-center justify-between px-6 h-[100px]">
        <div className="flex-shrink-0">
          <Link to="/" className="inline-flex items-center">
            <div className="text-[#3ea76e] text-[38px] font-black tracking-[-0.1em] leading-none">
              SWIFFY<span className="text-[14px] align-top ml-0.5 opacity-70 italic">®</span>
            </div>
          </Link>
        </div>

     
        <div className="flex-1 max-w-[500px] mx-10 relative">
          <div className={`flex items-center bg-[#f5f5f5] rounded-full px-6 py-2.5 transition-all ${
            isSearchFocus ? 'bg-white ring-2 ring-[#3ea76e] shadow-lg' : 'hover:bg-[#eeeeee]'
          }`}>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              onFocus={() => setIsSearchFocus(true)}
              className="flex-1 outline-none text-[15px] font-medium tracking-normal text-[#333] placeholder:text-[#aaa] bg-transparent py-1"
            />
            <button className="ml-3 text-[#555] hover:text-[#3ea76e] hover:scale-110 transition-transform cursor-pointer">
              <Search size={22} strokeWidth={2.5} />
            </button>
            {isSearchFocus && (
              <button
                onClick={() => { setSearchValue(''); setIsSearchFocus(false) }}
                className="ml-4 text-[14px] font-bold text-[#999] hover:text-[#333] shrink-0 cursor-pointer"
              >
                취소
              </button>
            )}
          </div>


          {isSearchFocus && (
            <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] px-7 py-8 z-[200] border border-gray-100 rounded-[24px]">
              <p className="text-[14px] font-bold text-[#1B4332] mb-5 tracking-normal flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#3ea76e] rounded-full"></span>
                인기검색어
              </p>
              <div className="relative group/scroll">
                <div 
                  ref={scrollRef}
                  onMouseDown={onDragStart}
                  onMouseMove={onDragMove}
                  onMouseUp={onDragEnd}
                  onMouseLeave={onDragEnd}
                  onScroll={handleScroll}
                  className="flex flex-nowrap gap-2 overflow-x-auto scrollbar-hide pb-2 cursor-grab active:cursor-grabbing select-none"
                >
                  {popularSearches.map(tag => (
                    <button 
                      key={tag} 
                      onClick={() => { if(!isDrag) setSearchValue(tag) }}
                      className="whitespace-nowrap px-5 py-2.5 bg-[#f4f7f5] rounded-full text-[13px] font-bold text-[#1B4332] border border-transparent hover:bg-[#3ea76e] hover:text-white transition-all tracking-normal"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

    
        <div className="flex-shrink-0 flex justify-end gap-9 pt-1">
          {[
            { label: '로그인', icon: <User size={26} strokeWidth={1.8} />, to: '/login' },
            { label: '주문조회', icon: <ReceiptText size={26} strokeWidth={1.8} />, to: '/order/list' },
            { label: '장바구니', icon: <ShoppingBag size={26} strokeWidth={1.8} />, to: '#', badge: '2' },
          ].map((item, idx) => (
            <Link key={idx} to={item.to} className="flex flex-col items-center group text-[#111111]">
              <div className="relative group-hover:text-[#3ea76e] transition-all group-hover:-translate-y-0.5">
                {item.icon}
                {item.badge && (
                  <span className="absolute -top-1 -right-1.5 bg-[#ff5c5c] text-white text-[9px] font-bold w-[17px] h-[17px] flex items-center justify-center rounded-full ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-bold mt-2 tracking-normal opacity-70 group-hover:opacity-100 group-hover:text-[#3ea76e]">
                {item.label}
              </span>
            </Link>
          ))}
        </div>
      </div>

    
      <nav className="bg-white border-t border-gray-100 flex items-center h-[54px]">
        <div className="w-full max-w-[1200px] mx-auto flex items-center justify-center gap-16">
          {navItems.map(item => (
            <Link key={item.label} to={item.to} className="group relative py-1">
              <span className="text-[16px] font-bold text-[#111] tracking-normal transition-colors group-hover:text-[#3ea76e]">
                {item.label}
              </span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#3ea76e] transition-all group-hover:w-full"></span>
            </Link>
          ))}
        </div>
      </nav>
    </header>
  )
}