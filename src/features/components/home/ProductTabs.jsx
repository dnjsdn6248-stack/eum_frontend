import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetCategoriesQuery } from '@/api/categoryApi'
import { useSearchProductsQuery } from '@/api/searchApi'
import Spinner from '@/shared/components/Spinner'

const PRODUCTS_PER_TAB = 8

export default function ProductTabs() {
  const { data: categories = [], isLoading: catsLoading } = useGetCategoriesQuery()
  const [activeCategory, setActiveCategory] = useState(null)

  // activeCategory는 cat.id (코드값: "ALL", "SNACK_JERKY", ...)
  const currentCategory = activeCategory ?? categories[0]?.id ?? 'ALL'

  const { data, isFetching } = useSearchProductsQuery(
    {
      category: currentCategory === 'ALL' ? undefined : currentCategory,
      page: 0,
    },
    { skip: catsLoading }
  )

  const products = data?.content?.slice(0, PRODUCTS_PER_TAB) ?? []

  return (
    <div className="bg-white pb-16 w-full max-w-[1200px] mx-auto px-6">
      <div className="flex items-center gap-2 pt-16 pb-10">
        <h2 className="text-[24px] font-black text-[#111111] tracking-tighter">
          우리 아이 취향 저격 제품
        </h2>
      </div>

      {catsLoading ? (
        <Spinner />
      ) : (
        <>
          <div className="flex flex-wrap gap-2.5 pb-10">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`hover-primary px-6 py-2.5 text-[14px] !font-medium tracking-tighter transition-all cursor-pointer ${
                  currentCategory === cat.id ? 'active shadow-sm' : ''
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {isFetching ? (
            <Spinner />
          ) : (
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
                    {product.discountTag && (
                      <span className="text-[11px] text-[#3ea76e] font-bold mb-1">
                        {product.discountTag}
                      </span>
                    )}
                    <div className="flex items-center gap-2">
                      {product.originalPrice && product.originalPrice !== product.price && (
                        <span className="text-[12px] text-[#bbb] line-through">
                          {product.originalPrice.toLocaleString()}원
                        </span>
                      )}
                      <p className="text-[15px] font-bold text-[#111111] tracking-tight">
                        {product.price?.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
