import { useState } from 'react'

const ALL_PRODUCTS = [
  {
    id: 1,
    name: '[판매 1위] 오독오독 바삭 10종 골라담기 (3개 이상 구매시 5% 할인)',
    img: 'https://swiffy.cafe24.com/web/product/medium/202603/ea7408135b9b2fccd849dd507338272e.jpg',
    originalPrice: '15,900원',
    discountPrice: '',
    set: false,
    href: '#',
  },
  {
    id: 2,
    name: '오독오독 바삭 3종 세트 360g',
    img: 'https://swiffy.cafe24.com/web/product/medium/202602/88dc41a9da050cd48f2b0d436b510bff.jpg',
    originalPrice: '47,700원',
    discountPrice: '45,310원',
    set: true,
    href: '#',
  },
  {
    id: 3,
    name: '오독오독 바삭 덕블연 3종 세트 360g',
    img: 'https://swiffy.cafe24.com/web/product/medium/202602/234f37a7bf9b9cb81cffef5f2f4ab228.jpg',
    originalPrice: '52,700원',
    discountPrice: '50,060원',
    set: true,
    href: '#',
  },
  {
    id: 4,
    name: '오독오독 바삭 6종 세트',
    img: 'https://swiffy.cafe24.com/web/product/medium/202602/5b3ea48600b39acab71bd618b2d95bce.jpg',
    originalPrice: '100,400원',
    discountPrice: '95,380원',
    set: true,
    href: '#',
  },
  {
    id: 5,
    name: '오독오독 바삭 연어껍질 120g',
    img: 'https://swiffy.cafe24.com/web/product/medium/202602/8ad4f1881d54123ea9c35166dc068df3.jpg',
    originalPrice: '15,900원',
    discountPrice: '',
    set: false,
    href: '#',
  },
  {
    id: 6,
    name: '오독오독 바삭 당근 120g',
    img: 'https://swiffy.cafe24.com/web/product/medium/202602/3e711c9bce25aec42ad19576490380e2.jpg',
    originalPrice: '15,900원',
    discountPrice: '',
    set: false,
    href: '#',
  },
  {
    id: 7,
    name: '오독오독 바삭 시금치 120g',
    img: 'https://swiffy.cafe24.com/web/product/medium/202602/f18638491ff5316ee2e0df5236680947.jpg',
    originalPrice: '15,900원',
    discountPrice: '',
    set: false,
    href: '#',
  },
  {
    id: 8,
    name: '오독오독 바삭 치킨블루베리 120g',
    img: 'https://swiffy.cafe24.com/web/product/medium/202602/b19779faba7bd1e18b9f08d01390b8a4.jpg',
    originalPrice: '15,900원',
    discountPrice: '',
    set: false,
    href: '#',
  },
  {
    id: 9,
    name: '오독오독 바삭 덕브로콜리 120g',
    img: 'https://swiffy.cafe24.com/web/product/medium/202602/27a9316be3e2f8ac3411c928d8c24e5f.jpg',
    originalPrice: '20,900원',
    discountPrice: '',
    set: false,
    href: '#',
  },
  {
    id: 10,
    name: '오독오독 바삭 고구마 120g',
    img: 'https://swiffy.cafe24.com/web/product/medium/202602/66d8ca54080d513871ba17b00fa3a20e.jpg',
    originalPrice: '15,900원',
    discountPrice: '',
    set: false,
    href: '#',
  },
  {
    id: 11,
    name: '스위피 오독오독 미니 2종 60g',
    img: 'https://swiffy.cafe24.com/web/product/medium/202602/4296d14eb76035973fe8070a8df02280.jpg',
    originalPrice: '9,800원',
    discountPrice: '',
    set: false,
    href: '#',
  },
  {
    id: 12,
    name: '오독오독 포켓 3종 대용량 (5개입)',
    img: 'https://swiffy.cafe24.com/web/product/medium/202412/a2bc279e1f9da3e33fbd1d5b759c8716.jpg',
    originalPrice: '19,000원',
    discountPrice: '',
    set: false,
    href: '#',
  },
]

const ITEMS_PER_PAGE = 8
const SORT_OPTIONS = ['인기상품', '신상품', '낮은가격', '높은가격']

export default function OdogPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('인기상품')

  const totalPages = Math.ceil(ALL_PRODUCTS.length / ITEMS_PER_PAGE)
  const paginated = ALL_PRODUCTS.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  return (
    <main className="max-w-[1200px] mx-auto w-full">

      {/* ── Page Heading ─────────────────────────────────── */}
      <div className="bg-white border-b border-[#f0f0f0]">
        <div className="px-4 py-5 flex items-center gap-3">
          <div>
            <h1 className="text-[20px] font-bold text-[#222] leading-tight">오독오독</h1>
            <p className="text-[12px] text-[#888] mt-0.5">바삭하게 씹히는 자연산 간식</p>
          </div>
        </div>

        {/* Category tags */}
        <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
          {['전체', '바삭', '세트', '대용량', '미니'].map((tag, i) => (
            <button
              key={tag}
              className={`flex-none px-4 py-1.5 rounded-full border text-[12px] font-medium cursor-pointer transition-all font-[inherit] ${
                i === 0
                  ? 'border-[#3ea76e] bg-[#3ea76e] text-white'
                  : 'border-[#ddd] bg-white text-[#555] hover:border-[#3ea76e] hover:text-[#3ea76e]'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* ── Filter bar ───────────────────────────────────── */}
      <div className="bg-white flex items-center justify-between px-4 py-3 border-b border-[#f0f0f0]">
        <span className="text-[13px] text-[#888]">
          <strong className="text-[#222]">{ALL_PRODUCTS.length}</strong>개의 제품
        </span>
        <div className="relative">
          <select
            value={sortBy}
            onChange={e => {
              setSortBy(e.target.value)
              setCurrentPage(1)
            }}
            className="appearance-none text-[13px] text-[#444] font-medium bg-transparent border-none outline-none cursor-pointer pr-5 font-[inherit]"
          >
            {SORT_OPTIONS.map(opt => <option key={opt}>{opt}</option>)}
          </select>
          <span className="pointer-events-none absolute right-0 top-1/2 -translate-y-1/2 text-[#888] text-xs">∨</span>
        </div>
      </div>

      {/* ── Product Grid ──────────────────────────────────── */}
      <div className="bg-white">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-px bg-[#f0f0f0]">
          {paginated.map(product => (
            <OdogProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>

      {/* ── Pagination ────────────────────────────────────── */}
      {totalPages > 1 && (
        <div className="bg-white py-6 flex items-center justify-center gap-1 border-t border-[#f0f0f0]">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center text-[#aaa] disabled:opacity-30 text-xs hover:text-[#333] cursor-pointer border-none bg-transparent"
          >
            «
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-7 h-7 flex items-center justify-center text-[#aaa] disabled:opacity-30 text-xs hover:text-[#333] cursor-pointer border-none bg-transparent"
          >
            ‹
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-7 h-7 flex items-center justify-center rounded-full text-[13px] font-medium transition-colors cursor-pointer border-none ${
                currentPage === page
                  ? 'bg-[#222] text-white'
                  : 'bg-transparent text-[#555] hover:bg-[#f0f0f0]'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-7 h-7 flex items-center justify-center text-[#aaa] disabled:opacity-30 text-xs hover:text-[#333] cursor-pointer border-none bg-transparent"
          >
            ›
          </button>
          <button
            onClick={() => setCurrentPage(totalPages)}
            disabled={currentPage === totalPages}
            className="w-7 h-7 flex items-center justify-center text-[#aaa] disabled:opacity-30 text-xs hover:text-[#333] cursor-pointer border-none bg-transparent"
          >
            »
          </button>
        </div>
      )}

    </main>
  )
}

function OdogProductCard({ product }) {
  return (
    <a
      href={product.href}
      className="group block bg-white p-3 hover:bg-[#fafafa] transition-colors"
    >
      {/* Image wrapper */}
      <div className="relative aspect-square overflow-hidden rounded-lg bg-[#f8f8f8] mb-2.5">
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-[1.04]"
        />

        {/* SET badge */}
        {product.set && (
          <span className="absolute top-2 right-2 w-9 h-9 rounded-full bg-white/90 border border-[#ccc] flex items-center justify-center text-[10px] font-bold text-[#444] shadow-sm">
            SET
          </span>
        )}

        {/* Discount badge */}
        {product.discountPrice && (
          <span className="absolute top-2 left-2 bg-[#3ea76e] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[6px]">
            최적할인
          </span>
        )}
      </div>

      {/* Product info */}
      <p className="text-[13px] text-[#222] leading-snug line-clamp-2 mb-1.5 min-h-[38px]">
        {product.name}
      </p>

      {/* Price block */}
      {product.discountPrice ? (
        <div>
          <p className="text-[11px] text-[#bbb] line-through leading-none mb-0.5">
            {product.originalPrice}
          </p>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-semibold text-[#3ea76e]">최적할인가</span>
            <span className="text-[14px] font-bold text-[#222]">{product.discountPrice}</span>
          </div>
        </div>
      ) : (
        <p className="text-[14px] font-bold text-[#222]">{product.originalPrice}</p>
      )}
    </a>
  )
}
