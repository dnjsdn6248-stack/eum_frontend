import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MOCK_CART } from '../mock'

export default function CartPage() {
  const navigate = useNavigate()
  const [cartItems, setCartItems] = useState(
    MOCK_CART.map((item, i) => ({ ...item, id: i + 1, checked: true, qty: 1 }))
  )

  const btnStyle = "bg-[#f8f8f8] text-[#444] transition-all duration-200 hover:bg-[#f1f1f1] active:scale-95 font-[800] border-none cursor-pointer"
  const subBtnStyle = "bg-[#fcfcfc] text-[#aaa] border border-[#eee] hover:text-[#ff4d4d] hover:bg-white transition-all duration-200 font-bold cursor-pointer"

  const removeItem = (id) => setCartItems(prev => prev.filter(item => item.id !== id))
  const toggleCheck = (id) => setCartItems(prev => prev.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  const toggleAll = (e) => setCartItems(prev => prev.map(item => ({ ...item, checked: e.target.checked })))
  const updateQty = (id, delta) => setCartItems(prev => prev.map(item => item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item))

  const checkedItems = cartItems.filter(item => item.checked)
  const subTotal = checkedItems.reduce((acc, item) => acc + (item.price * item.qty), 0)
  const total = subTotal

  return (
    <div className="bg-[#fcfcfc] min-h-screen p-6 md:p-12 text-[#111]">
      <div className="max-w-[1200px] mx-auto mb-10 px-4">
        <h1 className="text-[34px] font-black tracking-tight">장바구니</h1>
      </div>

      <div className="max-w-[1200px] mx-auto flex flex-col lg:flex-row gap-12 items-start">

        <div className="flex-[2.2] w-full space-y-6">
          <div className="flex justify-between items-center pb-5 sticky top-0 bg-[#fcfcfc] z-10 px-2" style={{ borderBottom: '2px solid #111' }}>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                defaultChecked
                onChange={toggleAll}
                className="w-6 h-6 accent-[#3ea76e] cursor-pointer"
              />
              <span className="text-lg font-bold text-[#111]">전체선택 ({checkedItems.length}/{cartItems.length})</span>
            </label>
            <button
              onClick={() => setCartItems([])}
              className="text-[14px] font-bold text-[#aaa] hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
            >전체삭제</button>
          </div>

          {cartItems.length === 0 && (
            <div className="text-center py-20 text-[#aaa] font-bold text-[16px]">
              장바구니가 비어있어요 🐾
            </div>
          )}

          {cartItems.map((item) => (
            <div key={item.id} className="bg-white rounded-[32px] p-8 relative" style={{ border: '1px solid #f0f0f0', boxShadow: '0 8px 30px rgba(0,0,0,0.02)' }}>
              <div className="absolute top-10 left-6">
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => toggleCheck(item.id)}
                  className="w-5 h-5 accent-[#3ea76e] cursor-pointer"
                />
              </div>

              <div className="flex flex-col md:flex-row gap-8 items-start mb-8 pl-10">
                <div className="w-36 h-36 rounded-[24px] overflow-hidden flex-shrink-0" style={{ border: '1px solid #f0f0f0' }}>
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-[20px] font-black tracking-tight text-[#111]">{item.name}</h3>
                      <p className="text-[14px] text-[#bbb] font-bold mt-1">배송 : {item.delivery}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[#ddd] hover:text-red-500 transition-colors pt-1 bg-transparent border-none cursor-pointer"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                  </div>

                  <div className="pt-2">
                    <span className="text-[28px] font-black block tracking-tighter text-[#111]">{(item.price * item.qty).toLocaleString()}원</span>
                    <span className="text-[13px] text-[#aaa] font-bold tracking-tight">할인금액 -0원</span>
                  </div>

                  <div className="flex items-center gap-3 pt-5">
                    <div className="flex items-center bg-[#f8f8f8] rounded-xl p-1" style={{ border: '1px solid #eee' }}>
                      <button onClick={() => updateQty(item.id, -1)} className="w-8 h-8 flex items-center justify-center font-black text-[#aaa] hover:text-[#111] bg-transparent border-none cursor-pointer">－</button>
                      <span className="w-10 text-center font-black text-[15px] text-[#111]">{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)} className="w-8 h-8 flex items-center justify-center font-black text-[#aaa] hover:text-[#111] bg-transparent border-none cursor-pointer">＋</button>
                    </div>
                    <button className={`px-5 py-2 rounded-xl text-[13px] ${btnStyle}`}>변경</button>
                  </div>
                </div>
              </div>

              <div className="pt-8 flex justify-between items-center px-2" style={{ borderTop: '1px solid #f8f8f8' }}>
                <div className="flex gap-2">
                  <button onClick={() => removeItem(item.id)} className={`px-4 py-1.5 rounded-lg text-[12px] ${subBtnStyle}`}>삭제</button>
                  <button className="px-4 py-1.5 rounded-lg text-[12px] bg-[#fcfcfc] text-[#aaa] border border-[#eee] hover:text-[#111] transition-all font-bold cursor-pointer">관심상품</button>
                </div>
                <div className="flex gap-3">
                  <button className={`px-6 py-2.5 rounded-[14px] text-[13px] ${btnStyle}`}>옵션변경</button>
                  <button
                    onClick={() => navigate('/checkout')}
                    className="px-8 py-2.5 rounded-[14px] text-[14px] font-black text-white bg-[#3ea76e] hover:bg-[#318a57] transition-all cursor-pointer border-none"
                  >주문하기</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex-1 w-full flex justify-center lg:sticky lg:top-10">
          <div className="relative w-[360px] h-[740px] bg-[#111] rounded-[60px] p-[14px] shrink-0" style={{ boxShadow: '0 50px 100px -20px rgba(0,0,0,0.25)', border: '1px solid #222' }}>
            <div className="absolute top-[14px] left-1/2 -translate-x-1/2 w-[130px] h-[34px] bg-[#111] rounded-b-[20px] z-20 flex items-center justify-center">
              <div className="w-10 h-1.5 bg-[#222] rounded-full"></div>
            </div>

            <div className="w-full h-full bg-white rounded-[46px] overflow-hidden flex flex-col text-[#111]">
              <div className="h-12 px-10 flex justify-between items-end pb-2">
                <span className="text-[14px] font-black">12:30</span>
                <div className="flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#111" strokeWidth="2.5">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0"/>
                    <path d="M1.42 9a16 16 0 0 1 21.16 0"/>
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/>
                    <line x1="12" y1="20" x2="12.01" y2="20"/>
                  </svg>
                  <div className="w-6 h-3.5 rounded-[3px] relative flex items-center p-[0.5px]" style={{ border: '2px solid #111' }}>
                    <div className="w-3.5 h-full bg-[#111]"></div>
                    <div className="absolute -right-[4px] w-1.5 h-1.5 bg-[#111] rounded-r-sm"></div>
                  </div>
                </div>
              </div>

              <div className="flex-1 p-10 flex flex-col">
                <h2 className="text-[20px] font-black text-center mb-12 mt-6 tracking-tight text-[#111]">주문 예상 금액</h2>

                <div className="space-y-6 mb-10">
                  <div className="flex justify-between text-[15px] font-bold">
                    <span className="text-[#aaa]">총 상품 금액</span>
                    <span className="text-[#111] font-black">{subTotal.toLocaleString()}원</span>
                  </div>
                  <div className="flex justify-between text-[15px] font-bold">
                    <span className="text-[#aaa]">배송비</span>
                    <span className="text-[#111] font-black">0원</span>
                  </div>
                  <div className="flex justify-between text-[15px] font-bold">
                    <span className="text-[#aaa]">할인 금액</span>
                    <span className="text-[#3ea76e] font-black">- 0원</span>
                  </div>
                </div>

                <div className="pt-8 mb-12" style={{ borderTop: '2px dashed #f5f5f5' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-[15px] font-black text-[#111]">최종 결제 금액</span>
                    <span className="text-[22px] font-black tracking-tighter text-[#111]">{total.toLocaleString()}원</span>
                  </div>
                </div>

                <div className="mt-auto space-y-4 pb-6">
                  <button
                    onClick={() => navigate('/checkout')}
                    className="w-full h-[72px] bg-[#3ea76e] text-white rounded-[28px] text-[20px] font-black transition-all hover:bg-[#318a57] active:scale-95 cursor-pointer border-none"
                  >
                    결제하기
                  </button>
                  <button
                    onClick={() => navigate('/product/list')}
                    className="w-full text-center text-[14px] font-bold text-[#ddd] hover:text-[#111] transition-colors bg-transparent border-none cursor-pointer"
                  >
                    쇼핑 계속하기
                  </button>
                </div>
              </div>

              <div className="h-8 flex justify-center items-center">
                <div className="w-32 h-1.5 bg-[#f0f0f0] rounded-full"></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}