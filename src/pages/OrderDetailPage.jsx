import { useNavigate } from 'react-router-dom';

export default function OrderDetailPage() {
  const navigate = useNavigate();

  return (
    <div className="font-['Pretendard'] pb-28 text-[#111]">
      
      {/* 1. 페이지 타이틀 (중앙 정렬 및 하단 여백 확대) */}
      <div className="text-center py-24">
        <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#111]">주문상세조회</h1>
      </div>

      <div className="space-y-12"> {/* 섹션 사이의 간격을 10 -> 12로 확대 */}
        
        {/* 2. 주문 정보 섹션 */}
        <section className="bg-white rounded-[32px] p-10 md:p-12 border border-[#eee] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          {/* 타이틀 하단 mb-10으로 갭 확대 */}
          <h2 className="text-[20px] font-black mb-10 flex items-center gap-2.5 tracking-tight">
            <span className="w-1.5 h-6 bg-[#3ea76e] rounded-full"></span>
            주문 정보
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-7">
            <InfoRow label="주문번호" value="20240401-0000288" />
            <InfoRow label="주문일자" value="2024-04-01 15:34:52" />
            <InfoRow label="주문자" value="허서정" />
            <InfoRow label="주문처리상태" value="배송완료" isHighlight />
          </div>
        </section>

        {/* 3. 주문 상품 목록 섹션 */}
        <section className="bg-white rounded-[32px] p-10 md:p-12 border border-[#eee] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          {/* 타이틀 하단 mb-10으로 갭 확대 */}
          <h2 className="text-[20px] font-black mb-10 tracking-tight flex items-center justify-between">
            주문 상품 (총 2개)
            <span className="text-[#aaa] text-[14px] font-bold tracking-tight">전체 무료배송</span>
          </h2>
          
          <div className="divide-y divide-[#f5f5f5]">
            <ProductItem 
              company="CJ대한통운"
              name="[판매 2위] 어글어글 육포 50g 5종"
              option="[옵션: 제주산 안심 육포 50g/1개입]"
              price={13000}
              qty={1}
              trackingNo="6972-6552-7964"
              status="배송완료"
            />
            <ProductItem 
              company="CJ대한통운"
              name="냉매제 추가 (아이스팩)"
              option="[옵션: 아이스팩(대)]"
              price={0}
              qty={1}
              trackingNo="6972-6552-7964"
              status="배송완료"
            />
          </div>

          {/* [개별배송] 상세 계산식 박스 (상단 mt-10으로 갭 확대) */}
          <div className="mt-10 p-8 bg-[#FCFBF9] rounded-[24px] border border-[#eee]">
            <div className="flex flex-wrap items-center gap-4 text-[15px] font-bold text-[#555] tracking-tight">
              <span className="text-[#3ea76e] font-black">[개별배송]</span>
              <span>상품구매금액 <b className="text-[#111] font-black">500원</b></span>
              <span className="text-[#ccc]">+</span>
              <span>배송비 <b className="text-[#111] font-black">0원</b></span>
              <span className="text-[#ccc]">+</span>
              <span>지역배송비 <b className="text-[#111] font-black">0원</b></span>
              <span className="text-[#ccc]">=</span>
              <span className="text-[18px] font-black text-[#111]">합계 : 500원</span>
            </div>
          </div>
        </section>

        {/* 4. 결제 정보 섹션 */}
        <section className="bg-white rounded-[32px] p-10 md:p-12 border border-[#eee] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <h2 className="text-[20px] font-black mb-10 tracking-tight">최초 결제 정보</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16"> {/* 내부 갭을 12 -> 16으로 확대 */}
            <div className="bg-[#FCFBF9] rounded-[24px] p-8 border border-[#eee] flex flex-col justify-center">
              <div className="mb-6">
                <p className="text-[#555] font-bold text-[14px] mb-2">결제수단</p>
                <p className="text-[18px] font-black text-[#111]">신용카드</p>
                <p className="text-[#bbb] text-[12px] font-bold mt-1 tracking-tight">명세서에 토스페이먼츠(결제)로 표시됩니다.</p>
              </div>
              <div className="h-[1px] bg-[#eee] w-full mb-6" />
              <div className="flex justify-between items-center">
                <span className="text-[#111] font-black text-[16px]">총 결제금액</span>
                <span className="text-[28px] font-black text-[#3ea76e] tracking-[-0.05em]">8,000원</span>
              </div>
            </div>

            <div className="space-y-6 py-2">
              <div className="flex justify-between items-center">
                <span className="text-[#555] font-bold">총 주문금액</span>
                <span className="font-black text-[18px] tracking-tight">13,000원</span>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#555] font-bold">총 할인금액</span>
                  <span className="font-black text-[18px] text-[#3ea76e] tracking-tight">-5,000원</span>
                </div>
                <div className="bg-[#fffcfc] p-5 rounded-xl border border-[#ffebeb] flex justify-between items-center">
                  <span className="text-[14px] font-bold text-[#3ea76e]">ㄴ 쿠폰할인</span>
                  <span className="text-[14px] font-black text-[#3ea76e]">5,000원</span>
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[#555] font-bold">배송비</span>
                <span className="font-black text-[18px] tracking-tight">0원</span>
              </div>
            </div>
          </div>
        </section>

        {/* 5. 배송지 정보 섹션 */}
        <section className="bg-white rounded-[32px] p-10 md:p-12 border border-[#eee] shadow-[0_10px_40px_rgba(0,0,0,0.03)]">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-[20px] font-black tracking-tight">배송지 정보</h2>
            <button className="h-10 px-6 rounded-full bg-[#f5f5f5] text-[#555] font-bold text-[13px] hover:bg-[#3ea76e] hover:text-white transition-all border-none cursor-pointer">
              수령지 안내
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-[160px_1fr] gap-y-9 text-[16px]"> {/* 그리드 왼쪽 간격 확대 */}
            <span className="text-[#555] font-bold">받으시는 분</span>
            <span className="font-black">허서정</span>
            
            <span className="text-[#555] font-bold">우편번호</span>
            <span className="font-black text-[#3ea76e]">46915</span>

            <span className="text-[#555] font-bold">주소</span>
            <span className="font-black leading-relaxed tracking-tight">
              부산 사상구 운산로 25 동양한신아파트 102동 408호
            </span>

            <span className="text-[#555] font-bold">휴대폰</span>
            <span className="font-black">010-2059-5477</span>

            <span className="text-[#555] font-bold">배송메시지</span>
            <div className="bg-[#FCFBF9] p-6 rounded-2xl border border-[#eee] font-bold text-[#555] leading-relaxed tracking-tight">
              부재 시 문 앞에 놓아주세요.
            </div>
          </div>
        </section>

        {/* 6. 하단 버튼 */}
        <div className="pt-16">
          <button 
            onClick={() => navigate('/order/list')}
            className="w-full h-20 rounded-full bg-[#3ea76e] text-white font-black text-[20px] tracking-[-0.05em] hover:bg-[#318a57] transition-all active:scale-[0.98] border-none cursor-pointer shadow-lg shadow-[#3ea76e/20]"
          >
            주문목록보기
          </button>
        </div>
      </div>
    </div>
  );
}

// --- 공통 유틸리티 ---

function InfoRow({ label, value, isHighlight }) {
  return (
    <div className="flex justify-between items-center py-2">
      <span className="text-[#555] font-bold text-[15px]">{label}</span>
      <span className={`font-black text-[16px] tracking-tight ${isHighlight ? 'text-[#3ea76e]' : 'text-[#111]'}`}>
        {value}
      </span>
    </div>
  );
}

function ProductItem({ company, name, option, price, qty, trackingNo, status }) {
  return (
    <div className="flex gap-10 py-10 first:pt-0"> {/* 상품간 내부 갭 확대 */}
      <div className="w-32 h-32 rounded-[28px] overflow-hidden border border-[#eee] shrink-0 bg-[#f9f9f9]">
        <img src="/api/placeholder/150/150" alt="product" className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-[#555] text-[13px] font-black mb-1">{company}</p>
            <h3 className="text-[19px] font-black tracking-[-0.05em] text-[#111]">{name}</h3>
          </div>
          <span className="px-5 py-1.5 rounded-full bg-white border-2 border-[#3ea76e] text-[#3ea76e] text-[13px] font-black">
            {status}
          </span>
        </div>
        <p className="text-[14px] font-bold text-[#bbb] mb-5 tracking-tight">{option}</p>
        <div className="flex justify-between items-end gap-6">
          <div className="space-y-2">
            <p className="text-[13px] text-[#ccc] font-bold">송장번호 : [{trackingNo}]</p>
            <p className="text-[16px] font-black text-[#111]">수량 : {qty}개 / <span className="text-[20px]">{(price * qty).toLocaleString()}원</span></p>
          </div>
          <div className="flex flex-col items-end gap-3">
            <span className="text-[12px] text-[#ccc] font-bold">개별배송비 0원</span>
            <button className="h-10 px-8 rounded-full bg-[#f5f5f5] text-[#555] font-bold text-[13px] hover:bg-[#3ea76e] hover:text-white transition-all border-none cursor-pointer">
              구매후기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}