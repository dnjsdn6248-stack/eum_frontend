import { useState } from 'react'
import { ChevronDown, ChevronUp, MessageCircle, Send } from 'lucide-react'

export default function ReviewItem({ review, onAddComment }) {
  const [isOpen, setIsOpen] = useState(false)
  const [commentText, setCommentText] = useState('')

  const handleCommentSubmit = (e) => {
    e.preventDefault()
    if (!commentText.trim()) return
    onAddComment(review.id, commentText.trim())
    setCommentText('')
  }

  return (
    <div className="border-b border-[#f5f5f5] last:border-none py-6 px-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left bg-transparent border-none cursor-pointer"
      >
        <div className="flex gap-0.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={`text-[18px] ${i < review.rating ? 'text-[#f5a623]' : 'text-[#eee]'}`}>★</span>
          ))}
        </div>

        <p className={`text-[15px] font-bold text-[#111] leading-relaxed mb-3 ${isOpen ? '' : 'line-clamp-2'}`}>
          {review.text}
        </p>

        <div className="flex items-center gap-2 text-[12px] font-bold text-[#bbb]">
          <span>{review.name}</span>
          <span className="text-[#eee]">·</span>
          <span>{review.date}</span>
          <span className="text-[#eee]">·</span>
          <span>조회 {review.views}</span>
          {review.comments && review.comments.length > 0 && (
            <>
              <span className="text-[#eee]">·</span>
              <span className="flex items-center gap-0.5 text-[#3ea76e]">
                <MessageCircle size={12} />
                {review.comments.length}
              </span>
            </>
          )}
          <div className="ml-auto text-[#ccc]">
            {isOpen ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </div>
        </div>
      </button>

      {isOpen && (
        <>
          {review.imgs && review.imgs.length > 0 && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {review.imgs.map((img, i) => (
                <img key={i} src={img} alt={`리뷰 이미지 ${i + 1}`} className="w-24 h-24 rounded-2xl object-cover border border-[#eee]" />
              ))}
            </div>
          )}

          <div className="mt-5 ml-2 pl-4 border-l-2 border-[#f0f0f0]">
            {review.comments && review.comments.length > 0 && (
              <div className="mb-4 flex flex-col gap-3">
                {review.comments.map(comment => (
                  <div key={comment.id} className="bg-[#f9f9f9] rounded-2xl px-4 py-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="text-[12px] font-black text-[#3ea76e]">{comment.name}</span>
                      <span className="text-[#eee]">·</span>
                      <span className="text-[11px] font-bold text-[#bbb]">{comment.date}</span>
                    </div>
                    <p className="text-[13px] font-bold text-[#333] leading-relaxed">{comment.text}</p>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleCommentSubmit} className="flex gap-2 items-center">
              <input
                type="text"
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                placeholder="댓글을 입력해주세요 🐾"
                maxLength={200}
                className="flex-1 h-10 px-4 rounded-full bg-white border border-[#eee] text-[13px] font-bold text-[#333] outline-none focus:border-[#3ea76e] transition-colors"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="h-10 w-10 rounded-full bg-[#3ea76e] text-white border-none cursor-pointer flex items-center justify-center hover:bg-[#318a57] transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Send size={15} />
              </button>
            </form>
          </div>
        </>
      )}

      {!isOpen && review.imgs && review.imgs.length > 0 && (
        <div className="flex gap-3 mt-4 flex-wrap">
          {review.imgs.map((img, i) => (
            <img key={i} src={img} alt={`리뷰 이미지 ${i + 1}`} className="w-24 h-24 rounded-2xl object-cover border border-[#eee]" />
          ))}
        </div>
      )}
    </div>
  )
}
