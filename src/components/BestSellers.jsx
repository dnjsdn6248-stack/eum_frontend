import { useState } from 'react'

const bestSellers = [
  {
    name: '[판매 1위] 오독오독 바삭 10종 골라담기',
    desc: '100% 자연산 식재료로 만든 스위피 대표 제품',
    price: '15,900원',
    img: 'https://swiffy.cafe24.com/web/product/medium/202603/ea7408135b9b2fccd849dd507338272e.jpg',
    href: '#',
  },
  {
    name: '[판매 2위] 어글어글 육포 50g 5종',
    desc: '5개 이상 구매시 1개 추가증정 이벤트',
    price: '7,500원',
    img: 'https://swiffy.cafe24.com/web/product/medium/202303/8b961050a6dfe4e80ec2fd11f1fa2765.png',
    href: '#',
  },
  {
    name: '[판매 3위] 스위피 꽈배기츄 40g',
    desc: '천천히 오래 씹는 재미, 스트레스 해소에 최고',
    price: '12,900원',
    img: 'https://swiffy.cafe24.com/web/product/medium/202509/176fcea2e13d45fbe314503f5eeece33.png',
    href: '#',
  },
]

export default function BestSellers() {
  return (
    <div className="bg-white w-full max-w-[1200px] mx-auto mb-20 px-6">
      
      {/* 타이틀: font-black 유지하되 무채색으로 변경 */}
      <div className="flex items-center justify-start pt-16 pb-8">
        <h2 className="text-[24px] font-black text-[#111111] tracking-tighter">
          베스트셀러
        </h2>
      </div>
      
      {/* 상품 그리드: 3열 구조 */}
      <div className="grid grid-cols-3 gap-10">
        {bestSellers.map((product, idx) => (
          <a
            key={idx}
            href={product.href}
            className="flex flex-col group"
          >
            {/* 상품 이미지: 액자(배경색) 빼고 사진만 돋보이게 */}
            <div className="relative aspect-square overflow-hidden rounded-[24px] mb-5">
              <img
                src={product.img}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            
            {/* 상품 정보: 텍스트 두께 기강 잡기 */}
            <div className="flex flex-col items-start space-y-1.5 px-1">
              {/* 상품명: font-black -> font-bold (700) */}
              <h3 className="text-[15px] font-bold text-[#111111] leading-tight line-clamp-1 tracking-tighter">
                {product.name}
              </h3>
              
              {/* 설명: font-medium (500) + 흐린 회색 */}
              <p className="text-[13px] text-[#999999] line-clamp-1 font-medium tracking-tighter">
                {product.desc}
              </p>
              
              {/* 가격: font-black (900) 유지하여 정보 강조 */}
              <p className="text-[18px] font-black text-[#111111] mt-1 tracking-tighter">
                {product.price}
              </p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}