import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PRODUCT_TABS, TAB_PRODUCTS } from '../../../mock'

export default function ProductTabs() {
  const [activeTab, setActiveTab] = useState(PRODUCT_TABS[0])
  const products = TAB_PRODUCTS[activeTab] || []

  return (
    <div className="bg-white pb-32 w-full max-w-[1200px] mx-auto px-6">
      <div className="flex items-center gap-2 pt-16 pb-10">
        <h2 className="text-[24px] font-bold text-[#111111] tracking-tighter">
          우리 아이 취향 저격 제품
        </h2>
      </div>

      <div className="flex flex-wrap gap-2.5 pb-10">
        {PRODUCT_TABS.map(tab => (
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