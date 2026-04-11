import React, { useState } from "react";
import { Link } from 'react-router-dom'
import { CreditCard, Plus, ChevronRight, Info, Package, XCircle } from "lucide-react";

export default function UserSubscriptionPage() {
  const [activeTab, setActiveTab] = useState("apply"); // "apply" or "cancel"

  return (
    <div className="bg-[#FCFBF9] min-h-screen text-[#111] font-sans pb-28">
      <main className="max-w-[800px] mx-auto px-6">
        
        
        <div className="py-24 text-center">
          <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#111]">정기배송 관리</h1>
        </div>

       
        <section className="bg-white rounded-[32px] border border-[#eee] shadow-[0_10px_40px_rgba(0,0,0,0.02)] overflow-hidden mb-12">
          <div className="bg-[#fbfbfb]/80 px-10 py-6 border-b border-[#eee] flex items-center gap-3">
            <div className="bg-[#f0faf4] p-2 rounded-xl text-[#3ea76e]">
              <CreditCard size={20} />
            </div>
            <h3 className="text-[16px] font-black">결제수단</h3>
          </div>

          <div className="p-10 text-center">
            <p className="text-[11px] text-neutral-400 font-black uppercase tracking-widest mb-2">Payment Method</p>
            <h4 className="text-[22px] font-black text-[#3ea76e] mb-4">카드를 등록해 주세요.</h4>
            <p className="text-neutral-400 text-sm font-medium mb-10">결제수단이 등록되어 있을 경우 빠른 정기배송 신청이 가능합니다.</p>
            
    
            <button className="w-full max-w-[400px] py-5 bg-[#3ea76e] text-white rounded-[24px] font-black text-base hover:bg-[#318a57] transition-all shadow-lg shadow-[#3ea76e]/10 border-none cursor-pointer flex items-center justify-center gap-2 mx-auto">
              <Plus size={20} /> 결제수단 등록하기
            </button>
          </div>
          
          <div className="bg-[#f9f9f9] px-10 py-5 flex items-start gap-2 text-neutral-400 border-t border-[#f0f0f0]">
            <Info size={14} className="mt-0.5 shrink-0" />
            <p className="text-[12px] font-bold leading-relaxed">결제예정일(주기별 배송시작일 하루 전)에 위의 결제 정보로 정기배송 상품이 결제됩니다.</p>
          </div>
        </section>

     
        <section>
          <div className="flex justify-center gap-12 mb-10 border-b border-[#eee]">
            <button 
              onClick={() => setActiveTab("apply")}
              className={`pb-4 text-[16px] font-black transition-all bg-transparent border-none cursor-pointer ${activeTab === 'apply' ? 'text-[#111] border-b-2 border-solid border-[#3ea76e]' : 'text-neutral-300 hover:text-neutral-500'}`}
            >
              신청내역 <span className="ml-1 text-[14px] opacity-60">(0건)</span>
            </button>
            <button 
              onClick={() => setActiveTab("cancel")}
              className={`pb-4 text-[16px] font-black transition-all bg-transparent border-none cursor-pointer ${activeTab === 'cancel' ? 'text-[#111] border-b-2 border-solid border-[#3ea76e]' : 'text-neutral-300 hover:text-neutral-500'}`}
            >
              해지내역 <span className="ml-1 text-[14px] opacity-60">(0건)</span>
            </button>
          </div>

    
          <div className="bg-white rounded-[32px] border border-[#eee] p-24 text-center">
            <div className="bg-[#f8f8f8] w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              {activeTab === 'apply' ? <Package size={32} className="text-neutral-200" /> : <XCircle size={32} className="text-neutral-200" />}
            </div>
            <p className="text-neutral-300 font-black text-[18px]">
              {activeTab === 'apply' ? "신청 내역이 없습니다." : "해지 내역이 없습니다."}
            </p>
            <p className="text-neutral-200 text-sm mt-2 font-bold italic uppercase tracking-tighter">No subscription records found</p>
          </div>
        </section>

      </main>
    </div>
  );
}