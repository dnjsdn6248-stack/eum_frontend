const reviews = [
  { img: 'https://swiffy.cafe24.com/web/product/tiny/202412/99ac4306c7aa1a40ec93ac76910bf7aa.jpg', title: 'NEW 오독오독 바삭 캥거루/미니 황태 2종 ...', rating: '★ 4.9(159)', href: '#' },
  { img: 'https://swiffy.cafe24.com/web/product/tiny/202603/3e38ede9b50f13af99b9ecc5802c2b59.jpg', title: '❤️ 이 링크에서만 10% 할인❤️ 오독오독 ...', rating: '★ 4.9(159)', href: '#' },
  { img: 'https://swiffy.cafe24.com/web/product/tiny/202308/1d405c874cb17ca9b20719d4f7b3be89.jpg', title: '어글어글 스팀 100g 8종', rating: '★ 4.8(89)', href: '#' },
]

export default function PhotoReviews() {
  return (
    <div className="bg-white pb-4 mb-2">
      <h2 className="text-[17px] font-bold text-[#222] px-4 pt-4 pb-3">베스트 포토리뷰</h2>
      <div className="flex gap-2 px-3 overflow-x-auto scrollbar-hide">
        {reviews.map((review, idx) => (
          <a
            key={idx}
            href={review.href}
            className="flex-none w-[160px] lg:w-[220px] flex flex-col border border-[#eee] rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square overflow-hidden bg-[#f8f8f8]">
              <img
                src={review.img}
                alt={review.title}
                className="w-full h-full object-contain transition-transform duration-300 hover:scale-[1.04]"
              />
            </div>
            <div className="p-2">
              <p className="text-[11px] text-[#333] leading-snug mb-1 line-clamp-2">{review.title}</p>
              <p className="text-[11px] text-[#f5a623] font-medium">{review.rating}</p>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
