import React, { useState } from "react";
import {
  Truck,
  CreditCard,
  Plus,
  Info,
  Calendar,
  Package,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

const UserSubscriptionPage = () => {
  const [hasCard, setHasCard] = useState(false); 
  const [subscriptions, setSubscriptions] = useState([]); 

  return (
    <div className="bg-[#F9FAFB] min-h-screen text-neutral-900 font-sans pb-20">
      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Page Header */}
        <div className="mb-10">
          <h2 className="text-3xl font-black tracking-tight text-neutral-800 uppercase italic">
            Regular <span className="text-[#3ea76e]">Subscription</span>
          </h2>
          <p className="text-neutral-400 text-sm mt-2 font-medium">
            정기적으로 배송되는 스마트한 쇼핑 환경을 관리하세요.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Left Side: Payment Method & Stats */}
          <aside className="w-full lg:w-80 shrink-0 sticky top-24">
            <div className="bg-white border border-neutral-200 rounded-[32px] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="bg-[#f0f9f4] p-3 rounded-2xl">
                  <CreditCard size={24} className="text-[#3ea76e]" />
                </div>
                <div>
                  <p className="text-xs text-neutral-400 font-bold uppercase">
                    Payment
                  </p>
                  <p className="text-lg font-black text-neutral-800">
                    결제 수단
                  </p>
                </div>
              </div>

              {!hasCard ? (
                <div className="space-y-4">
                  <div className="p-5 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200 text-center">
                    <p className="text-[13px] font-bold text-[#3ea76e] mb-1">
                      카드를 등록해주세요.
                    </p>
                    <p className="text-[10px] text-neutral-400 leading-relaxed">
                      결제 수단이 등록되어 있을 경우
                      <br />
                      빠른 정기배송 신청이 가능합니다.
                    </p>
                  </div>
                  <button className="w-full py-3.5 bg-neutral-900 text-white rounded-2xl text-[11px] font-bold hover:bg-neutral-800 transition-all flex items-center justify-center gap-2">
                    <Plus size={14} /> 결제수단 등록하기
                  </button>
                </div>
              ) : (
                <div className="p-5 bg-[#f0f9f4] rounded-2xl border border-[#e8f5ee]">
                  <p className="text-[11px] text-neutral-400 mb-1 font-bold">
                    등록된 카드
                  </p>
                  <p className="text-sm font-bold text-neutral-800">
                    신한카드 (****-****-1234)
                  </p>
                </div>
              )}

              <div className="mt-8 pt-6 border-t border-neutral-50 flex items-start gap-2">
                <Info size={14} className="text-neutral-300 mt-0.5 shrink-0" />
                <p className="text-[10px] text-neutral-400 leading-relaxed">
                  결제예정일(주기별 배송시작일 하루 전)에 위의 결제 정보로
                  상품이 자동 결제됩니다.
                </p>
              </div>
            </div>
          </aside>

          {/* Right Side: Subscription History */}
          <section className="flex-1 w-full space-y-6">
            {/* Tab Navigation */}
            <div className="flex gap-8 border-b border-neutral-200 px-4">
              <button className="pb-4 text-sm font-bold text-neutral-800 border-b-2 border-[#3ea76e] relative">
                신청내역{" "}
                <span className="ml-1 text-[#3ea76e]">
                  {subscriptions.length}
                </span>
              </button>
              <button className="pb-4 text-sm font-bold text-neutral-400 hover:text-neutral-600 transition-colors">
                해지내역 <span className="ml-1 text-neutral-300">0</span>
              </button>
            </div>

            {subscriptions.length > 0 ? (
              /* 내역이 있을 때의 카드 스타일 (예시) */
              <div className="space-y-4">{/* 데이터가 있다면 맵핑 */}</div>
            ) : (
              /* Empty State */
              <div className="bg-white border border-neutral-200 rounded-[32px] p-20 text-center shadow-sm">
                <div className="bg-neutral-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck size={36} className="text-neutral-200" />
                </div>
                <h4 className="text-base font-bold text-neutral-800 mb-2">
                  신청 내역이 없습니다.
                </h4>
                <p className="text-sm text-neutral-400 mb-8">
                  매번 주문하기 번거로운 상품을 정기배송으로 만나보세요.
                </p>
                <button className="px-8 py-3 bg-[#3ea76e] text-white rounded-2xl text-sm font-bold hover:bg-[#34925e] transition-all shadow-lg shadow-[#3ea76e]/20">
                  정기배송 상품 보러가기
                </button>
              </div>
            )}

            {/* Subscription Guide Card */}
            <div className="bg-neutral-900 rounded-[28px] p-8 text-white flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-5 text-center md:text-left">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Calendar size={24} className="text-[#3ea76e]" />
                </div>
                <div>
                  <p className="text-[15px] font-bold">
                    정기배송은 최대 10%까지 할인됩니다.
                  </p>
                  <p className="text-xs text-white/50 mt-1">
                    원하는 주기에 맞춰 편리하고 알뜰하게 쇼핑하세요.
                  </p>
                </div>
              </div>
              <button className="px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-[11px] font-bold transition-all flex items-center gap-1">
                자세히 보기 <ChevronRight size={14} />
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default UserSubscriptionPage;
