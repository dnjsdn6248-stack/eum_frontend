import { useState } from 'react'
import { Link } from 'react-router-dom'

const tabs = ['#촉촉말랑', '#슈퍼푸드', '#한끼치트키', '#오래먹는간식', '#저칼로리']

const tabProducts = {
  '#촉촉말랑': [
    { id: 11, name: '어글어글 우유껌 50g 7종', desc: '말랑말랑 우유 베이스 간식!', price: '6,500원', img: 'https://swiffy.cafe24.com/web/product/medium/202412/c574e33c42600c960242e5ec86ab1d7a.png' },
    { id: 12, name: '[판매 2위] 어글어글 육포 50g 5종', desc: '5개 이상 구매시 1개 추가증정', price: '7,500원', img: 'https://swiffy.cafe24.com/web/product/medium/202303/8b961050a6dfe4e80ec2fd11f1fa2765.png' },
    { id: 15, name: '어글어글 제주 치킨 스윗 치즈 번', desc: '촉촉한 닭 안심과 고소한 아기 치즈!', price: '5,000원', img: 'https://swiffy.cafe24.com/web/product/medium/202303/df344e3fcfd7d5ae56ddd6e292695c93.png' },
    { id: 16, name: '어글어글 동물복지 유정란 베지 연어 마들렌', desc: '동물복지 유정란으로 만든 베이커리', price: '3,500원', img: 'https://swiffy.cafe24.com/web/product/medium/202401/19ca8dab3bd3846315fbd5d0157d74fa.png' },
    { id: 161, name: '어글어글 넙치 마들렌', desc: '제주 광어로 만든 특별한 간식', price: '4,000원', img: 'https://swiffy.cafe24.com/web/product/medium/202401/19ca8dab3bd3846315fbd5d0157d74fa.png' },
  ],
  '#슈퍼푸드': [
    { id: 21, name: '오독오독 황태 슬라이스 40g', desc: '강원도 대관령 황태의 진한 맛', price: '7,200원', img: 'https://swiffy.cafe24.com/web/product/medium/202603/ea7408135b9b2fccd849dd507338272e.jpg' },
    { id: 22, name: '어글어글 제주 야채 믹스 샐러드', desc: '신선한 제주산 채소 영양 가득', price: '6,500원', img: 'https://swiffy.cafe24.com/web/product/medium/202303/4778723bd20adbc67a8ec2f817e7db68.jpg' },
  ],
  '#한끼치트키': [
    { id: 31, name: '소고기 테린 100g', desc: '육즙 가득한 프리미엄 한 끼', price: '6,200원', img: 'https://swiffy.cafe24.com/web/product/medium/202204/b7dfd74171a920aa986c690b1faaa079.jpg' },
    { id: 32, name: '연어 테린 60g', desc: '오메가3가 풍부한 건강식', price: '4,000원', img: 'https://swiffy.cafe24.com/web/product/medium/202203/a5af436848536b61ecee509e6b700cac.jpg' },
  ],
  '#오래먹는간식': [
    { id: 41, name: '스위피 꽈배기츄 40g', desc: '치석 제거에 도움을 주는 껌', price: '12,900원', img: 'https://swiffy.cafe24.com/web/product/medium/202509/176fcea2e13d45fbe314503f5eeece33.png' },
    { id: 42, name: '건강 뼈 간식 - 닭발 구이', desc: '콜라겐이 풍부한 오독오독 뼈간식', price: '10,000원', img: 'https://swiffy.cafe24.com/web/product/medium/202303/d1a662ba747626bca2ce1453c685025f.png' },
  ],
  '#저칼로리': [
    { id: 51, name: '스팀 고구마 큐브 100g', desc: '지방 함량은 낮고 식이섬유는 듬뿍', price: '5,500원', img: 'https://swiffy.cafe24.com/web/product/medium/202412/1d253806f8e748eef43522d92c4ce9e7.jpg' },
    { id: 52, name: '대관령 황태 껍질말이', desc: '다이어트 중에도 부담 없는 고단백', price: '6,000원', img: 'https://swiffy.cafe24.com/web/product/medium/202308/830c338cf19ac192603197bc4695e4b2.png' },
  ],
}

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const products = tabProducts[activeTab] || []

  return (
    <div className="bg-white pb-32 w-full max-w-[1200px] mx-auto px-6">
      <div className="flex items-center gap-2 pt-16 pb-10">
        <h2 className="text-[24px] font-bold text-[#111111] tracking-tighter">
          우리 아이 취향 저격 제품
        </h2>
      </div>

      <div className="flex flex-wrap gap-2.5 pb-10">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`hover-primary px-6 py-2.5 text-[14px] !font-medium tracking-tighter transition-all cursor-pointer ${
              activeTab === tab ? 'active shadow-sm' : ''
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
        {products.map((product) => (
          <Link
            key={product.id}
            to={`/product/detail/${product.id}`}
            className="flex flex-col group"
          >
            <div className="relative aspect-square overflow-hidden rounded-[15px] mb-4 bg-[#f9f9f9]">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            <div className="flex flex-col px-0.5">
              <h3 className="text-[14px] !font-normal text-[#333333] leading-snug line-clamp-1 tracking-tight mb-1">
                {product.name}
              </h3>
              
              <p className="text-[12px] text-[#999999] line-clamp-1 font-normal tracking-tight mb-1.5 opacity-80">
                {product.desc}
              </p>
              
              <p className="text-[15px] font-bold text-[#111111] tracking-tight">
                {product.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}