import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReviewItem from './ReviewItem'
import Pagination from '../../../shared/components/Pagination'

const INIT_REVIEWS = [
  { id: 1, name: '네이****', date: '24. 07. 14', views: 156, rating: 5, text: '항상 시켜먹어요 울집 개달이 넘 좋아해요. 배송도 빠르고 포장도 꼼꼼하게 잘 돼있어요. 재구매 계속 할 예정이에요.', imgs: ['https://swiffy.cafe24.com/web/product/tiny/202412/99ac4306c7aa1a40ec93ac76910bf7aa.jpg'], comments: [] },
  { id: 2, name: 'je****', date: '25. 03. 22', views: 89, rating: 5, text: '넘좋아요 내가먹어두 야채에 꼬신맛이 굿~~~~ 우리 강아지가 엄청 좋아해요.', imgs: [], comments: [] },
  { id: 3, name: 'je****', date: '25. 02. 19', views: 44, rating: 5, text: '잘먹어요 늘구매하는 상품입니다. 재구매 의사 있어요.', imgs: [], comments: [] },
  { id: 4, name: '카카****', date: '24. 03. 31', views: 32, rating: 4, text: '만족 너무좋아요~ 강아지가 정말 잘 먹어요. 냄새도 좋고 품질도 좋아요.', imgs: [], comments: [] },
  { id: 5, name: 'ho****', date: '24. 02. 15', views: 21, rating: 5, text: '전반적으로 만족스러워요. 상품 자체는 매우 좋습니다. 정기 구매 결정했어요.', imgs: ['https://swiffy.cafe24.com/web/product/tiny/202603/3e38ede9b50f13af99b9ecc5802c2b59.jpg'], comments: [] },
]

const PAGE_SIZE = 3

export default function ReviewList({ writeReviewState = null }) {
  const navigate = useNavigate()
  const [reviews, setReviews] = useState(INIT_REVIEWS)
  const [page, setPage] = useState(1)

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE)
  const pagedReviews = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (page > Math.max(totalPages, 1)) {
      setPage(Math.max(totalPages, 1))
    }
  }, [page, totalPages])

  const handleAddComment = (reviewId, commentText) => {
    const newComment = {
      id: Date.now(),
      name: '나****',
      date: new Date().toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '. '),
      text: commentText,
    }
    setReviews(prev =>
      prev.map(r => r.id === reviewId ? { ...r, comments: [...r.comments, newComment] } : r)
    )
  }

  return (
    <div className="bg-white rounded-[40px] border border-[#eee] p-8 md:p-12 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-between mb-6 pb-6 border-b border-[#f5f5f5]">
        <h3 className="text-[18px] font-black tracking-tight text-[#111]">
          전체 리뷰 <span className="text-[#3ea76e]">{reviews.length}</span>
        </h3>
        <button
          onClick={() => navigate('/review/write', { state: writeReviewState ?? undefined })}
          className="h-10 px-5 rounded-full bg-[#3ea76e] text-white font-black text-[13px] border-none cursor-pointer hover:bg-[#318a57] transition-all"
        >
          리뷰 작성
        </button>
      </div>

      <div>
        {pagedReviews.map(review => (
          <ReviewItem key={review.id} review={review} onAddComment={handleAddComment} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
