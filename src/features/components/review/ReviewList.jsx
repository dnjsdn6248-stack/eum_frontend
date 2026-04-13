import { useState } from 'react'
import { Star } from 'lucide-react'
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

export default function ReviewList() {
  const [reviews, setReviews] = useState(INIT_REVIEWS)
  const [page, setPage] = useState(1)
  const [showForm, setShowForm] = useState(false)
  const [rating, setRating] = useState(5)
  const [hovered, setHovered] = useState(0)
  const [text, setText] = useState('')

  const totalPages = Math.ceil(reviews.length / PAGE_SIZE)
  const pagedReviews = reviews.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  const handleSubmit = () => {
    if (!text.trim()) return
    const newReview = {
      id: Date.now(),
      name: '나****',
      date: new Date().toLocaleDateString('ko-KR', { year: '2-digit', month: '2-digit', day: '2-digit' }).replace(/\. /g, '. '),
      views: 0,
      rating,
      text: text.trim(),
      imgs: [],
      comments: [],
    }
    setReviews(prev => [newReview, ...prev])
    setText('')
    setRating(5)
    setShowForm(false)
    setPage(1)
  }

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
          onClick={() => setShowForm(prev => !prev)}
          className="h-10 px-5 rounded-full bg-[#3ea76e] text-white font-black text-[13px] border-none cursor-pointer hover:bg-[#318a57] transition-all"
        >
          {showForm ? '작성 취소' : '리뷰 작성'}
        </button>
      </div>

      {showForm && (
        <div className="mb-8 p-6 bg-[#f9f9f9] rounded-[24px] border border-[#eee]">
          <p className="text-[14px] font-black text-[#111] mb-4">별점</p>
          <div className="flex items-center gap-1 mb-5">
            {[1, 2, 3, 4, 5].map(n => (
              <button
                key={n}
                onMouseEnter={() => setHovered(n)}
                onMouseLeave={() => setHovered(0)}
                onClick={() => setRating(n)}
                className="bg-transparent border-none cursor-pointer p-0"
              >
                <Star
                  size={28}
                  className={`transition-colors ${n <= (hovered || rating) ? 'fill-[#f5a623] text-[#f5a623]' : 'fill-[#ddd] text-[#ddd]'}`}
                />
              </button>
            ))}
            <span className="ml-2 text-[14px] font-black text-[#111]">{hovered || rating}점</span>
          </div>

          <p className="text-[14px] font-black text-[#111] mb-2">후기</p>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="상품은 어떠셨나요? 솔직한 후기를 남겨주세요 🐾"
            maxLength={500}
            rows={4}
            className="w-full bg-white rounded-2xl px-5 py-4 text-[14px] font-bold text-[#333] outline-none border border-[#eee] focus:border-[#3ea76e] resize-none transition-colors"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[12px] font-bold text-[#bbb]">{text.length}/500</span>
            <button
              onClick={handleSubmit}
              disabled={!text.trim()}
              className="h-10 px-6 bg-[#3ea76e] text-white rounded-full font-black text-[13px] border-none cursor-pointer hover:bg-[#318a57] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              등록하기
            </button>
          </div>
        </div>
      )}

      <div>
        {pagedReviews.map(review => (
          <ReviewItem key={review.id} review={review} onAddComment={handleAddComment} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />
    </div>
  )
}
