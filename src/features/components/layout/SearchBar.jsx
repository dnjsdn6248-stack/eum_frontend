import { useRef, useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useGetTrendingKeywordsQuery, useLazyGetAutocompleteQuery } from '@/api/searchApi'

export default function SearchBar() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  const { data: trending = [] } = useGetTrendingKeywordsQuery()
  const [triggerAutocomplete, { data: autocomplete = [] }] = useLazyGetAutocompleteQuery()

  const showAutocomplete = searchValue.trim().length > 0

  // 외부 클릭 시 닫기
  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // 입력 디바운스 → 자동완성 요청
  const handleChange = useCallback((e) => {
    const val = e.target.value
    setSearchValue(val)
    clearTimeout(debounceRef.current)
    if (val.trim()) {
      debounceRef.current = setTimeout(() => {
        triggerAutocomplete(val.trim())
      }, 250)
    }
  }, [triggerAutocomplete])

  const handleSearch = useCallback((keyword) => {
    const q = (keyword ?? searchValue).trim()
    if (!q) return
    setIsOpen(false)
    setSearchValue(q)
    navigate(`/product/list?title=${encodeURIComponent(q)}`)
  }, [searchValue, navigate])

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch()
  }

  const handleClear = () => {
    setSearchValue('')
    setIsOpen(false)
    inputRef.current?.focus()
  }

  const displayTrending = trending.slice(0, 8)

  return (
    <div ref={wrapperRef} className="flex-1 max-w-[500px] mx-10 relative">
      <div className={`flex items-center rounded-full border bg-white px-6 py-2.5 transition-all ${isOpen ? 'border-[#3ea76e] ring-2 ring-[#3ea76e]/20 shadow-lg' : 'border-gray-200 shadow-sm'}`}>
        <input
          ref={inputRef}
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchValue}
          onChange={handleChange}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className="flex-1 outline-none text-[15px] font-medium tracking-normal bg-transparent py-1"
          style={{ color: '#111', caretColor: '#3ea76e' }}
        />
        {searchValue && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 text-[#bbb] hover:text-[#777] transition-colors cursor-pointer"
            style={{ border: 'none', background: 'none' }}
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}
        <button
          type="button"
          onClick={() => handleSearch()}
          className="ml-3 text-[#111] hover:scale-110 transition-transform cursor-pointer"
          style={{ border: 'none', background: 'none' }}
        >
          <Search size={22} strokeWidth={2.5} />
        </button>
        {isOpen && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-4 text-[14px] font-bold text-[#999] hover:text-[#111] shrink-0 cursor-pointer"
            style={{ border: 'none', background: 'none' }}
          >
            취소
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-[calc(100%+10px)] left-0 w-full bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] px-7 py-8 z-[200] border border-gray-100 rounded-[24px]">

          {/* 자동완성 */}
          {showAutocomplete ? (
            <>
              <p className="text-[14px] font-bold text-[#1B4332] mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#3ea76e] rounded-full" />
                추천 검색어
              </p>
              {autocomplete.length > 0 ? (
                <ul>
                  {autocomplete.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        onClick={() => handleSearch(item.title)}
                        className="w-full text-left px-2 py-2.5 text-[14px] text-[#333] hover:text-[#3ea76e] hover:bg-[#f4f7f5] rounded-xl transition-all cursor-pointer flex items-center gap-3"
                        style={{ border: 'none', background: 'none' }}
                      >
                        <Search size={14} strokeWidth={2} className="text-[#bbb] shrink-0" />
                        {item.title}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[13px] text-[#aaa] py-2">검색 결과가 없습니다.</p>
              )}
            </>
          ) : (
            /* 인기 검색어 */
            <>
              <p className="text-[14px] font-bold text-[#1B4332] mb-5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-[#3ea76e] rounded-full" />
                인기검색어
              </p>
              <div className="flex flex-wrap gap-2">
                {displayTrending.map((item) => (
                  <button
                    key={item.rank}
                    type="button"
                    onClick={() => handleSearch(item.keyword)}
                    className="whitespace-nowrap px-5 py-2.5 rounded-full text-[13px] font-bold text-[#1B4332] hover:bg-[#3ea76e] hover:text-white transition-all tracking-normal cursor-pointer"
                    style={{ border: '1px solid transparent', background: '#f4f7f5' }}
                  >
                    <span className="text-[#3ea76e] mr-1.5">{item.rank}</span>
                    {item.keyword}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
