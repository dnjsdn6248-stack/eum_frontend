import { useState, useEffect } from 'react'
import StoreProductGrid from '../components/StoreProductGrid'

const TABS = ['ALL', 'Snack & Jerky', 'Meal', 'Bakery']

const ALL_PRODUCTS = [
  { id: 1, img: 'https://swiffy.cafe24.com/web/product/medium/202603/ea7408135b9b2fccd849dd507338272e.jpg', name: '[판매 1위] 오독오독 바삭 10종 골라담기', price: '15,900원', category: 'Snack & Jerky' },
  { id: 2, img: 'https://swiffy.cafe24.com/web/product/medium/202204/b7dfd74171a920aa986c690b1faaa079.jpg', name: '테린 내 맘대로 세트', price: '2,800원', category: 'Meal' },
  { id: 3, img: 'https://swiffy.cafe24.com/web/product/medium/202509/176fcea2e13d45fbe314503f5eeece33.png', name: '[판매 3위] 스위피 꽈배기츄 40g', price: '12,900원', category: 'Snack & Jerky' },
  { id: 4, img: 'https://swiffy.cafe24.com/web/product/medium/202203/a5af436848536b61ecee509e6b700cac.jpg', name: '연어 테린 60g', price: '4,000원', category: 'Meal' },
  { id: 5, img: 'https://swiffy.cafe24.com/web/product/medium/202308/ff7cee434eec6f04709bfcb3d3289310.jpg', name: '어글어글 스팀 대용량 간식 8종', price: '24,000원', category: 'Snack & Jerky' },
  { id: 6, img: 'https://swiffy.cafe24.com/web/product/medium/202603/88dc41a9da050cd48f2b0d436b510bff.jpg', name: '오독오독 바삭 3종 세트 360g', price: '47,700원', category: 'Snack & Jerky' },
  { id: 7, img: 'https://swiffy.cafe24.com/web/product/medium/202203/6db698101c622e01aa9c995264ac7738.jpg', name: '대구 테린', price: '4,000원', category: 'Meal' },
  { id: 8, img: 'https://swiffy.cafe24.com/web/product/medium/202603/5b3ea48600b39acab71bd618b2d95bce.jpg', name: '오독오독 바삭 6종 세트', price: '100,400원', category: 'Snack & Jerky' },
  { id: 9, img: 'https://swiffy.cafe24.com/web/product/medium/202203/c8c8493601aaee3f1b8355a403744344.jpg', name: '냉매제 추가 (아이스팩)', price: '500원', category: 'Snack & Jerky' },
  { id: 10, img: 'https://swiffy.cafe24.com/web/product/medium/202412/c574e33c42600c960242e5ec86ab1d7a.png', name: '어글어글 우유껌 50g 7종', price: '6,500원', category: 'Snack & Jerky' },
  { id: 11, img: 'https://swiffy.cafe24.com/web/product/medium/202303/8b961050a6dfe4e80ec2fd11f1fa2765.png', name: '[판매 2위] 어글어글 육포 50g 5종', price: '7,500원', category: 'Snack & Jerky' },
  { id: 12, img: 'https://swiffy.cafe24.com/web/product/medium/202204/4a56950d703c6dee57c0f31d48d4644f.jpg', name: '테린 2주 세트 (14개)', price: '50,400원', category: 'Meal' },
  { id: 13, img: 'https://swiffy.cafe24.com/web/product/medium/202204/3b4d92cd5ee8989d6904c85d7a0f0440.jpg', name: '테린 한 달 세트 (30개)', price: '107,200원', category: 'Meal' },
  { id: 14, img: 'https://swiffy.cafe24.com/web/product/medium/202303/df344e3fcfd7d5ae56ddd6e292695c93.png', name: '어글어글 제주 치킨 스윗 치즈 번', price: '5,000원', category: 'Bakery' },
  { id: 15, img: 'https://swiffy.cafe24.com/web/product/medium/202401/19ca8dab3bd3846315fbd5d0157d74fa.png', name: '어글어글 동물복지 유정란 베지 연어 마들렌', price: '3,500원', category: 'Bakery' },
  { id: 16, img: 'https://swiffy.cafe24.com/web/product/medium/202303/d1a662ba747626bca2ce1453c685025f.png', name: '어글어글 뼈 간식 4종', price: '12,000원', category: 'Snack & Jerky' },
  { id: 17, img: 'https://swiffy.cafe24.com/web/product/medium/202308/830c338cf19ac192603197bc4695e4b2.png', name: '어글어글 강원도 대관령 무염 황태채 40g', price: '6,500원', category: 'Snack & Jerky' },
  { id: 18, img: 'https://swiffy.cafe24.com/web/product/medium/202205/3a979de30618c777958c42e50de4efe9.jpg', name: '스위피 소이밀크 펫두유 1BOX', price: '12,000원', category: 'Meal' },
  { id: 19, img: 'https://swiffy.cafe24.com/web/product/medium/202412/1d253806f8e748eef43522d92c4ce9e7.jpg', name: '어글어글 스팀 100g 8종', price: '8,000원', category: 'Snack & Jerky' },
  { id: 20, img: 'https://swiffy.cafe24.com/web/product/medium/202303/4778723bd20adbc67a8ec2f817e7db68.jpg', name: '어글어글 제주 야채 믹스 샐러드', price: '6,500원', category: 'Meal' },
  { id: 21, img: 'https://swiffy.cafe24.com/web/product/medium/202603/ea7408135b9b2fccd849dd507338272e.jpg', name: '오독오독 황태 슬라이스 40g', price: '7,200원', category: 'Snack & Jerky' },
  { id: 22, img: 'https://swiffy.cafe24.com/web/product/medium/202204/b7dfd74171a920aa986c690b1faaa079.jpg', name: '소고기 테린 100g', price: '6,200원', category: 'Meal' },
  { id: 23, img: 'https://swiffy.cafe24.com/web/product/medium/202509/176fcea2e13d45fbe314503f5eeece33.png', name: '스위피 꼬꼬츄 꽈배기껌', price: '11,500원', category: 'Snack & Jerky' },
  { id: 24, img: 'https://swiffy.cafe24.com/web/product/medium/202303/df344e3fcfd7d5ae56ddd6e292695c93.png', name: '제주 고구마 치즈 번', price: '4,500원', category: 'Bakery' },
  { id: 25, img: 'https://swiffy.cafe24.com/web/product/medium/202401/19ca8dab3bd3846315fbd5d0157d74fa.png', name: '제주 광어 마들렌 2구', price: '4,000원', category: 'Bakery' },
  { id: 26, img: 'https://swiffy.cafe24.com/web/product/medium/202308/ff7cee434eec6f04709bfcb3d3289310.jpg', name: '닭가슴살 스팀 대용량', price: '22,000원', category: 'Snack & Jerky' },
  { id: 27, img: 'https://swiffy.cafe24.com/web/product/medium/202204/e19db860c1871a13fc48895f22b53e8f.jpg', name: '오리 테린 100g', price: '5,900원', category: 'Meal' },
  { id: 28, img: 'https://swiffy.cafe24.com/web/product/medium/202603/88dc41a9da050cd48f2b0d436b510bff.jpg', name: '바삭 간식 기프트 박스', price: '32,000원', category: 'Snack & Jerky' },
  { id: 29, img: 'https://swiffy.cafe24.com/web/product/medium/202412/c574e33c42600c960242e5ec86ab1d7a.png', name: '산양유 우유껌 50g', price: '6,900원', category: 'Snack & Jerky' },
  { id: 30, img: 'https://swiffy.cafe24.com/web/product/medium/202303/8b961050a6dfe4e80ec2fd11f1fa2765.png', name: '제주 흑돼지 안심 육포', price: '7,800원', category: 'Snack & Jerky' },
  { id: 31, img: 'https://swiffy.cafe24.com/web/product/medium/202204/4a56950d703c6dee57c0f31d48d4644f.jpg', name: '테린 소화 돕는 7일 세트', price: '26,000원', category: 'Meal' },
  { id: 32, img: 'https://swiffy.cafe24.com/web/product/medium/202205/3a979de30618c777958c42e50de4efe9.jpg', name: '펫두유 낱개입 (150ml)', price: '1,500원', category: 'Meal' },
  { id: 33, img: 'https://swiffy.cafe24.com/web/product/medium/202303/d1a662ba747626bca2ce1453c685025f.png', name: '건강 뼈 간식 - 닭발 구이', price: '10,000원', category: 'Snack & Jerky' },
  { id: 34, img: 'https://swiffy.cafe24.com/web/product/medium/202308/830c338cf19ac192603197bc4695e4b2.png', name: '대관령 황태 껍질말이', price: '6,000원', category: 'Snack & Jerky' },
  { id: 35, img: 'https://swiffy.cafe24.com/web/product/medium/202412/1d253806f8e748eef43522d92c4ce9e7.jpg', name: '스팀 고구마 큐브 100g', price: '5,500원', category: 'Snack & Jerky' },
  { id: 36, img: 'https://swiffy.cafe24.com/web/product/medium/202303/df344e3fcfd7d5ae56ddd6e292695c93.png', name: '베지터블 치즈 마들렌', price: '3,800원', category: 'Bakery' },
  { id: 37, img: 'https://swiffy.cafe24.com/web/product/medium/202603/5b3ea48600b39acab71bd618b2d95bce.jpg', name: '오독오독 실속형 대용량 팩', price: '18,500원', category: 'Snack & Jerky' },
  { id: 38, img: 'https://swiffy.cafe24.com/web/product/medium/202204/3b4d92cd5ee8989d6904c85d7a0f0440.jpg', name: '테린 비기너 패키지 (5개입)', price: '12,500원', category: 'Meal' },
]

const ITEMS_PER_PAGE = 12 

export default function StorePage() {
  const [activeTab, setActiveTab] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState('인기상품순')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [currentPage, activeTab])

  const filtered = activeTab === 'ALL'
    ? ALL_PRODUCTS
    : ALL_PRODUCTS.filter(p => p.category === activeTab)

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleTabChange = (tab) => {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  return (
    <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 pb-20">
      <div className="flex justify-center gap-3 py-10">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`hover-primary px-7 py-2.5 text-[14px] !font-medium tracking-tighter transition-all cursor-pointer ${
              activeTab === tab ? 'active shadow-sm' : ''
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-between pb-6 border-b border-gray-100 mb-10">
        <span className="text-[14px] !font-normal text-[#111111] tracking-tighter">
          총 <span className="text-[#3ea76e] font-bold">{filtered.length}</span>개의 제품
        </span>
        <select
          value={sortBy}
          onChange={e => setSortBy(e.target.value)}
          className="text-[14px] !font-medium text-[#111111] bg-transparent outline-none cursor-pointer tracking-tighter"
        >
          <option value="인기상품순">인기상품순</option>
          <option value="신상품순">신상품순</option>
          <option value="낮은가격순">낮은가격순</option>
          <option value="높은가격순">높은가격순</option>
        </select>
      </div>

      <StoreProductGrid products={paginated} />

      {totalPages > 1 && (
        <div className="py-16 flex items-center justify-center gap-2 border-t border-gray-50 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full text-[14px] !font-medium transition-all cursor-pointer ${
                currentPage === page
                  ? 'bg-[#3ea76e] !text-white shadow-md'
                  : 'bg-transparent text-[#999999] hover:bg-[#3ea76e] hover:!text-white'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </main>
  )
}