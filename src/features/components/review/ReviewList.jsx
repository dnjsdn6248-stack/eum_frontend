import ReviewItem from './ReviewItem'

const MOCK_REVIEWS = [
  {
    id: 1,
    name: '네이****',
    date: '24. 07. 14',
    views: 156,
    rating: 5,
    text: '항상 시켜먹어요 울집 개달이 넘 좋아해요. 배송도 빠르고 포장도 꼼꼼하게 잘 돼있어요. 재구매 계속 할 예정이에요.',
    imgs: ['https://swiffy.cafe24.com/web/product/tiny/202412/99ac4306c7aa1a40ec93ac76910bf7aa.jpg'],
  },
  {
    id: 2,
    name: 'je****',
    date: '25. 03. 22',
    views: 89,
    rating: 5,
    text: '넘좋아요 내가먹어두 야채에 꼬신맛이 굿~~~~ 우리 강아지가 엄청 좋아해요.',
    imgs: [],
  },
  {
    id: 3,
    name: 'je****',
    date: '25. 02. 19',
    views: 44,
    rating: 5,
    text: '잘먹어요 늘구매하는 상품입니다. 재구매 의사 있어요.',
    imgs: [],
  },
  {
    id: 4,
    name: '카카****',
    date: '24. 03. 31',
    views: 32,
    rating: 4,
    text: '만족 너무좋아요~ 강아지가 정말 잘 먹어요. 냄새도 좋고 품질도 좋아요.',
    imgs: [],
  },
  {
    id: 5,
    name: 'ho****',
    date: '24. 02. 15',
    views: 21,
    rating: 5,
    text: '전반적으로 만족스러워요. 상품 자체는 매우 좋습니다. 정기 구매 결정했어요.',
    imgs: ['https://swiffy.cafe24.com/web/product/tiny/202603/3e38ede9b50f13af99b9ecc5802c2b59.jpg'],
  },
]

export default function ReviewList() {
  return (
    <div className="bg-white rounded-[40px] border border-[#eee] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#f5f5f5]">
        <h3 className="text-[18px] font-black tracking-tight text-[#111]">
          전체 리뷰 <span className="text-[#3ea76e]">{MOCK_REVIEWS.length}</span>
        </h3>
      </div>

      <div>
        {MOCK_REVIEWS.map(review => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>
    </div>
  )
}