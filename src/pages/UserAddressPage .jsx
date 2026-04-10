import React, { useState } from "react";
import { MapPin, Plus, Trash2, Edit2, Search, X } from "lucide-react";

export default function UserAddressPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");

  const openModal = (mode) => {
    setModalMode(mode);
    setIsModalOpen(true);
  };

  return (
    // 레이아웃 배경과 겹치지 않게 베이지색 유지
    <div className="w-full font-sans pb-28">
      {/* 헤더 섹션 */}
      <div className="py-20 flex items-center justify-between">
        <h2 className="text-[32px] font-black italic text-[#111]">
          Address <span className="text-[#3ea76e]">Book</span>
        </h2>
        <button 
          onClick={() => openModal("add")} 
          className="h-[56px] px-8 bg-[#111] text-white rounded-[20px] text-[14px] font-black hover:bg-[#333] transition-all flex items-center gap-2 cursor-pointer border-none shadow-sm"
        >
          <Plus size={18} /> 신규 배송지 등록
        </button>
      </div>

      {/* 리스트 카드 (예시 하나만) */}
      <div className="bg-white border border-[#eee] rounded-[32px] p-10 shadow-[0_10px_40px_rgba(0,0,0,0.02)] group hover:border-[#3ea76e] transition-all">
        <div className="flex justify-between items-start">
          <div className="space-y-4">
            <p className="text-[17px] font-black">우리집 (기본배송지)</p>
            <p className="text-[14px] text-neutral-500 font-medium">인천광역시 서구 보듬로 158...</p>
          </div>
          <button 
            onClick={() => openModal("edit")} 
            className="p-3 bg-[#f8f8f8] text-neutral-300 rounded-xl hover:text-[#3ea76e] cursor-pointer border-none"
          >
            <Edit2 size={18} />
          </button>
        </div>
      </div>

      {/* 🔴 [핵심] 모달 코드: 레이아웃 밖으로 튀어나오게 fixed 처리 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-6">
          {/* 검정 반투명 배경 (클릭하면 닫힘) */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            onClick={() => setIsModalOpen(false)}
          ></div>

          {/* 모달 박스 */}
          <div className="relative bg-white rounded-[32px] w-full max-w-[600px] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.3)] animate-in fade-in zoom-in duration-200">
            <button 
              onClick={() => setIsModalOpen(false)} 
              className="absolute top-6 right-6 text-neutral-300 hover:text-[#111] cursor-pointer border-none bg-transparent"
            >
              <X size={24} />
            </button>

            <h3 className="text-[28px] font-black mb-8">
              {modalMode === "add" ? "새 배송지 등록" : "배송 정보 수정"}
            </h3>

            {/* 스위피 스타일 인풋들 */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[12px] font-black text-neutral-700 ml-1 uppercase">배송지명 *</label>
                <input type="text" className="w-full bg-[#f8f8f8] border-none rounded-2xl px-6 py-4 text-sm font-bold outline-none focus:ring-2 focus:ring-[#3ea76e]/20 transition-all" />
              </div>
              
              <div className="flex gap-3 pt-6">
                <button className="flex-[2] py-5 bg-[#3ea76e] text-white rounded-[24px] font-black border-none cursor-pointer shadow-lg shadow-[#3ea76e]/10">
                  {modalMode === "add" ? "등록하기" : "수정완료"}
                </button>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-5 bg-[#f0f0f0] text-neutral-500 rounded-[24px] font-black border-none cursor-pointer"
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}