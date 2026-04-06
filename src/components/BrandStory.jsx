export default function BrandStory() {
  return (
    // max-w-[1200px] mx-auto 추가하여 수직 라인 일치
    <a href="/brand-story" className="block bg-white mb-20 group max-w-[1200px] mx-auto px-0">
      
      <div className="relative w-full aspect-[4/3] lg:aspect-[2/1] rounded-2xl overflow-hidden mb-6">
        <img
          src="https://swiffy.cafe24.com/web/upload/appfiles/ZaReJam3QiELznoZeGGkMG/ecfab71e5e42861fd9a45e1f887b245b.png"
          alt="브랜드 스토리"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        
        <div className="absolute inset-0 p-8 flex items-end">
           <h2 className="text-white text-5xl font-black italic leading-tight tracking-tighter opacity-90">
             BRAND<br />STORY
           </h2>
        </div>
      </div>

      <div className="px-1">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          반려동물과의 행복한 교감<br />
          SWIFFY
        </h3>
        <p className="text-[14px] text-gray-400 leading-relaxed mb-6">
          한결같이 나를 바라봐주는 존재에게<br />
          내가 줄 수 있는 최고의 것을 주고 싶다는 마음으로
        </p>

        <div className="w-full py-3.5 border border-gray-200 rounded-xl text-center text-sm font-medium text-gray-600 group-hover:bg-gray-50 transition-colors">
          브랜드 스토리
        </div>
      </div>
    </a>
  )
}