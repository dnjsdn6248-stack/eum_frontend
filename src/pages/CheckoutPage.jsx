import React, { useState } from "react";
import { ChevronLeft, ChevronUp, ShoppingBag, X, Search } from "lucide-react";

const CheckoutPage = () => {
  // 상태 관리: 배송지 선택, 결제 수단, 입력 필드 등
  const [addrType, setAddrType] = useState("same"); // 'same' (회원정보와 동일), 'new' (새로운 배송지)
  const [paymentMethod, setPaymentMethod] = useState("bank"); // 결제 수단 선택상태
  const [isAddrOpen, setIsAddrOpen] = useState(true); // 섹션 접기/펴기

  // 결제 수단 옵션 데이터
  const paymentOptions = [
    { id: "bank", label: "계좌이체" },
    { id: "card", label: "카드결제" },
    { id: "npay", label: "N Pay", logo: "N" },
    { id: "kpay", label: "kakao pay", logo: "K" },
    { id: "toss", label: "toss", logo: "T" },
    { id: "cash", label: "무통장입금" },
  ];

  return (
    <div className="max-w-md mx-auto bg-gray-50 min-h-screen pb-24 font-sans text-sm text-gray-800 border-x border-gray-100">
      {/* --- Header --- */}
      <header className="sticky top-0 bg-white border-b border-gray-200 z-50 px-4 py-3 flex items-center justify-between">
        <ChevronLeft className="w-6 h-6 cursor-pointer" />
        <h1 className="text-lg font-bold">주문/결제</h1>
        <div className="relative">
          <ShoppingBag className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
            0
          </span>
        </div>
      </header>

      <main className="space-y-2 mt-2">
        {/* --- 배송지 섹션 --- */}
        <section className="bg-white p-4">
          <div
            className="flex justify-between items-center mb-4 cursor-pointer"
            onClick={() => setIsAddrOpen(!isAddrOpen)}
          >
            <h2 className="text-base font-bold">배송지</h2>
            {isAddrOpen ? (
              <ChevronUp className="w-5 h-5 text-gray-400" />
            ) : (
              <ChevronUp className="w-5 h-5 text-gray-400 rotate-180" />
            )}
          </div>

          {isAddrOpen && (
            <div className="animate-in fade-in duration-300">
              <div className="flex border-b border-gray-200 mb-4">
                <button className="flex-1 py-2 text-center text-gray-400 border-b-2 border-transparent">
                  최근 배송지
                </button>
                <button className="flex-1 py-2 text-center font-bold text-black border-b-2 border-black">
                  직접입력
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex gap-6 py-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addrType"
                      checked={addrType === "same"}
                      onChange={() => setAddrType("same")}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>회원 정보와 동일</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="addrType"
                      checked={addrType === "new"}
                      onChange={() => setAddrType("new")}
                      className="w-4 h-4 accent-blue-600"
                    />
                    <span>새로운 배송지</span>
                  </label>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center">
                    <label className="w-24 text-gray-600">
                      받는사람 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 p-2.5 rounded focus:outline-blue-500"
                      defaultValue="최현우"
                    />
                  </div>

                  <div className="flex items-start">
                    <label className="w-24 mt-2 text-gray-600">
                      주소 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex-1 space-y-2">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          className="flex-1 border border-gray-200 bg-gray-50 p-2.5 rounded text-gray-500"
                          placeholder="우편번호"
                          readOnly
                        />
                        <button className="bg-gray-800 text-white px-4 py-2 rounded text-xs font-medium hover:bg-gray-700">
                          주소검색
                        </button>
                      </div>
                      <input
                        type="text"
                        className="w-full border border-gray-200 bg-gray-50 p-2.5 rounded text-gray-500"
                        placeholder="기본주소"
                        readOnly
                      />
                      <input
                        type="text"
                        className="w-full border border-gray-300 p-2.5 rounded focus:outline-blue-500"
                        placeholder="나머지 주소(선택 입력 가능)"
                      />
                    </div>
                  </div>

                  <div className="flex items-center">
                    <label className="w-24 text-gray-600">
                      휴대폰 <span className="text-red-500">*</span>
                    </label>
                    <div className="flex flex-1 gap-1">
                      <select className="border border-gray-300 p-2.5 rounded w-20 bg-white">
                        <option>010</option>
                      </select>
                      <span className="py-2">-</span>
                      <input
                        type="text"
                        className="border border-gray-300 p-2.5 rounded flex-1 text-center"
                        defaultValue="6482"
                      />
                      <span className="py-2">-</span>
                      <input
                        type="text"
                        className="border border-gray-300 p-2.5 rounded flex-1 text-center"
                        defaultValue="2555"
                      />
                    </div>
                  </div>

                  <select className="w-full border border-gray-300 p-2.5 rounded bg-white text-gray-500 mt-2">
                    <option>-- 메시지 선택 (선택사항) --</option>
                    <option>부재 시 문 앞에 놓아주세요</option>
                    <option>배송 전 미리 연락주세요</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* --- 주문상품 섹션 --- */}
        <section className="bg-white p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-base font-bold">주문상품</h2>
            <ChevronUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="flex gap-3 py-3 border-t border-gray-50">
            <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden">
              <img
                src="https://via.placeholder.com/100"
                alt="product"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 relative">
              <h3 className="font-medium text-xs leading-relaxed pr-6">
                어글어글 우유껌 50g 7종
              </h3>
              <p className="text-[11px] text-gray-400 mt-1">
                [옵션: 제주 베리클리 우유껌 50g]
              </p>
              <p className="text-[11px] text-gray-400">수량: 3개</p>
              <p className="font-bold text-sm mt-1">19,500원</p>
              <X className="absolute top-0 right-0 w-4 h-4 text-gray-300 cursor-pointer" />
            </div>
          </div>
          <div className="flex justify-between py-2 text-[11px] text-gray-500 border-t border-gray-50 mt-2">
            <span>배송비</span>
            <span>+3,000원</span>
          </div>
        </section>

        {/* --- 할인/결제 정보 요약 --- */}
        <section className="bg-white p-4 space-y-3">
          <div className="flex justify-between items-center text-gray-600">
            <span>주문상품</span>
            <span className="font-medium text-black">19,500원</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>배송비</span>
            <span className="font-medium text-black">+3,000원</span>
          </div>
          <div className="flex justify-between items-center text-gray-600">
            <span>할인/부가결제</span>
            <span className="font-medium text-red-500">-0원</span>
          </div>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100 font-bold text-lg">
            <span>최종 결제 금액</span>
            <span className="text-blue-600">22,500원</span>
          </div>
        </section>

        {/* --- 결제수단 섹션 --- */}
        <section className="bg-white p-4">
          <h2 className="text-base font-bold mb-4">결제수단 선택</h2>
          <div className="grid grid-cols-1 border border-gray-200 rounded overflow-hidden">
            {paymentOptions.map((option) => (
              <div
                key={option.id}
                onClick={() => setPaymentMethod(option.id)}
                className={`p-4 border-b border-gray-100 last:border-0 cursor-pointer transition-colors flex items-center justify-between ${
                  paymentMethod === option.id
                    ? "bg-blue-50"
                    : "bg-white hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                      paymentMethod === option.id
                        ? "border-blue-600 bg-blue-600"
                        : "border-gray-300"
                    }`}
                  >
                    {paymentMethod === option.id && (
                      <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    )}
                  </div>
                  <span
                    className={
                      paymentMethod === option.id
                        ? "font-bold text-blue-600"
                        : "text-gray-600"
                    }
                  >
                    {option.label}
                  </span>
                </div>
                {option.logo && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 font-bold text-gray-400">
                    {option.logo}
                  </span>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-4 text-[11px] text-gray-500 leading-relaxed">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="save-payment"
                className="accent-blue-600"
              />
              <label htmlFor="save-payment">
                결제수단과 입력정보를 다음에도 사용
              </label>
            </div>
            <p className="p-3 bg-gray-50 rounded border border-gray-100">
              * 에스크로 구매안전서비스를 적용합니다.
              <br />* 소액 결제의 경우 PG사 정책에 따라 결제 금액 제한이 있을 수
              있습니다.
            </p>
          </div>
        </section>
      </main>

      {/* --- 고정 푸터 결제 버튼 --- */}
      <footer className="fixed bottom-0 left-0 right-0 max-w-md mx-auto z-50">
        <button className="w-full bg-blue-600 text-white py-5 font-bold text-base shadow-[0_-4px_10px_rgba(0,0,0,0.1)] active:bg-blue-700 transition-colors">
          22,500원 결제하기
        </button>
      </footer>
    </div>
  );
};

export default CheckoutPage;