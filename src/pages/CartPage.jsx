import { useNavigate } from 'react-router-dom'
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
} from '../api/cartApi'
import {
  selectCheckedItemIds,
  toggleCheckItem,
  checkAllItems,
  uncheckAllItems,
} from '../features/cart/cartSlice'
import useAppSelector from '../hooks/useAppSelector'
import useAppDispatch from '../hooks/useAppDispatch'
import Pagination from '../shared/components/Pagination'
import Spinner from '../shared/components/Spinner'
import { useState, useEffect } from 'react'

const PAGE_SIZE = 3

export default function CartPage() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [page, setPage] = useState(1)

  const { data: cartItems = [], isLoading } = useGetCartQuery()
  const [updateCartItem] = useUpdateCartItemMutation()
  const [removeCartItem] = useRemoveCartItemMutation()
  const [clearCart] = useClearCartMutation()

  const checkedIds = useAppSelector(selectCheckedItemIds)

  const checkedItems = cartItems.filter(item => checkedIds.includes(item.id))
  const subTotal = checkedItems.reduce((acc, item) => acc + (item.price * item.qty), 0)
  const rewardPoints = Math.floor(subTotal * 0.01)

  const totalPages = Math.ceil(cartItems.length / PAGE_SIZE)
  const pagedItems = cartItems.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  useEffect(() => {
    if (page > Math.max(totalPages, 1)) {
      setPage(Math.max(totalPages, 1))
    }
  }, [page, totalPages])

  const handleToggleAll = (e) => {
    if (e.target.checked) {
      dispatch(checkAllItems(cartItems.map(i => i.id)))
    } else {
      dispatch(uncheckAllItems())
    }
  }

  const handleRemove = (cartItemId) => {
    removeCartItem(cartItemId)
    setPage(1)
  }

  const handleClearAll = () => {
    clearCart()
    setPage(1)
  }

  const handleUpdateQty = (item, delta) => {
    const newQty = Math.max(1, item.qty + delta)
    updateCartItem({ cartItemId: item.cartItemId, quantity: newQty })
  }

  const handleChangeOption = (item, newOption) => {
    updateCartItem({ cartItemId: item.cartItemId, option: newOption })
  }

  if (isLoading) return <Spinner fullscreen />

  return (
    <div className="bg-[#FCFBF9] min-h-screen pb-28 px-4 text-[#111]">
      <div className="max-w-[1200px] mx-auto text-center py-24">
        <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#111]">장바구니</h1>
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 items-start">

        <div className="flex-[2.2] w-full space-y-6">
          <div className="flex justify-between items-center pb-5 sticky top-0 bg-[#FCFBF9] z-10 px-2 border-b border-[#eee]">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={cartItems.length > 0 && checkedIds.length === cartItems.length}
                onChange={handleToggleAll}
                className="w-5 h-5 accent-[#3ea76e] cursor-pointer"
              />
              <span className="text-[15px] font-extrabold text-[#111]">전체선택 ({checkedIds.length}/{cartItems.length})</span>
            </label>
            <button onClick={handleClearAll} className="text-[14px] font-bold text-[#aaa] hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer">선택삭제</button>
          </div>

          {cartItems.length === 0 && (
            <div className="text-center py-24 text-[#bbb] font-bold text-[16px]">장바구니가 비어있어요 🐾</div>
          )}

          {pagedItems.map((item) => (
            <div key={item.id} className="bg-white p-10 relative rounded-[40px] border border-[#eee] shadow-[0_10px_40px_rgba(0,0,0,0.02)]">
              <div className="absolute top-10 left-8">
                <input
                  type="checkbox"
                  checked={checkedIds.includes(item.id)}
                  onChange={() => dispatch(toggleCheckItem(item.id))}
                  className="w-5 h-5 accent-[#3ea76e] cursor-pointer"
                />
              </div>

              <div className="flex gap-8 items-start mb-8 pl-10">
                <div className="w-32 h-32 rounded-[24px] overflow-hidden shrink-0 border border-[#eee]">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-[18px] font-black tracking-tight text-[#111]">{item.name}</h3>
                    <button onClick={() => handleRemove(item.cartItemId)} className="text-[#ccc] hover:text-red-400 bg-transparent border-none cursor-pointer transition-colors">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12"/></svg>
                    </button>
                  </div>
                  {item.options && item.options.length > 0 && (
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[12px] font-bold text-[#aaa] shrink-0">옵션</span>
                      <select
                        value={item.option}
                        onChange={(e) => handleChangeOption(item, e.target.value)}
                        className="flex-1 text-[13px] font-bold text-[#444] bg-[#f8f8f8] border border-[#e8e8e8] rounded-full px-3 py-1.5 focus:outline-none focus:border-[#3ea76e] cursor-pointer"
                      >
                        {item.option === '' && <option value="">- 옵션을 선택해 주세요 -</option>}
                        {item.options.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  {item.delivery && (
                    <p className="text-[13px] font-bold text-[#bbb]">배송 : {item.delivery}</p>
                  )}
                  <span className="text-[22px] font-black block tracking-tighter text-[#111] pt-2">
                    {(item.price * item.qty).toLocaleString()}원
                  </span>
                  <div className="flex items-center gap-3 pt-3">
                    <div className="flex items-center bg-[#f8f8f8] rounded-full border border-[#eee] px-2">
                      <button onClick={() => handleUpdateQty(item, -1)} className="w-8 h-8 flex items-center justify-center font-bold text-[#aaa] hover:text-[#111] bg-transparent border-none cursor-pointer">－</button>
                      <span className="w-8 text-center font-bold text-[14px]">{item.qty}</span>
                      <button onClick={() => handleUpdateQty(item, 1)} className="w-8 h-8 flex items-center justify-center font-bold text-[#aaa] hover:text-[#111] bg-transparent border-none cursor-pointer">＋</button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-[#f5f5f5]">
                <button onClick={() => handleRemove(item.cartItemId)} className="h-10 px-6 rounded-full bg-[#f5f5f5] text-[#666] font-bold text-[13px] border border-[#eee] hover:bg-[#efefef] transition-all cursor-pointer border-none">삭제</button>
                <button onClick={() => navigate('/wishlist')} className="h-10 px-6 rounded-full bg-[#f5f5f5] text-[#666] font-bold text-[13px] border border-[#eee] hover:bg-[#efefef] transition-all cursor-pointer border-none">관심상품</button>
                <button onClick={() => navigate('/checkout')} className="h-10 px-6 rounded-full bg-[#3ea76e] text-white font-bold text-[13px] border-none hover:bg-[#318a57] transition-all cursor-pointer">주문하기</button>
              </div>
            </div>
          ))}

          <Pagination page={page} totalPages={totalPages} onChange={(p) => { setPage(p); window.scrollTo(0, 0) }} />
        </div>

        <div className="flex-1 w-full lg:sticky lg:top-10">
          <div className="bg-white border border-[#eee] rounded-[40px] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
            <div className="text-center mb-10">
              <h2 className="text-[22px] font-black tracking-tight text-[#111]">주문 예상 금액</h2>
              <div className="w-8 h-[3px] bg-[#3ea76e] mx-auto mt-3 rounded-full"></div>
            </div>

            <div className="space-y-5 mb-8">
              <div className="flex justify-between text-[15px] font-bold">
                <span className="text-[#aaa]">총 상품 금액</span>
                <span className="text-[#111] font-black">{subTotal.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between text-[15px] font-bold">
                <span className="text-[#aaa]">배송비</span>
                <span className="text-[#111] font-black">{subTotal >= 50000 ? '무료' : '5,000원'}</span>
              </div>
            </div>

            <div className="pt-8 mb-8 border-t border-dashed border-[#eee]">
              <div className="flex justify-between items-center mb-5">
                <span className="text-[15px] font-bold text-[#111]">최종 결제 금액</span>
                <span className="text-[26px] font-black tracking-tighter text-[#111]">
                  {(subTotal >= 50000 ? subTotal : subTotal + 5000).toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between items-center bg-[#f9f9f9] rounded-2xl p-4 border border-[#f0f0f0]">
                <span className="text-[13px] font-bold text-[#666]">적립 예정 금액</span>
                <span className="text-[15px] font-black text-[#3ea76e]">{rewardPoints.toLocaleString()}원</span>
              </div>
            </div>

            <button onClick={() => navigate('/checkout')} className="h-16 w-full rounded-full bg-[#3ea76e] text-white font-black text-[17px] tracking-tight border-none cursor-pointer hover:bg-[#318a57] transition-all active:scale-[0.97]">
              결제하기
            </button>
            <button onClick={() => navigate('/product/list')} className="mt-5 w-full text-center text-[13px] font-bold text-[#aaa] hover:text-[#111] transition-colors bg-transparent border-none cursor-pointer">
              쇼핑 계속하기
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
