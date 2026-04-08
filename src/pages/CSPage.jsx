import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, Headphones, MessageSquare, Info } from 'lucide-react'

const CSPage = () => {
  return (
    <div className="w-full bg-white text-[#111] pb-28 px-4">
      <div className="max-w-[1200px] mx-auto text-center py-20">
        <h1 className="text-[32px] font-black tracking-[-0.05em] text-[#111]">고객센터</h1>
      </div>

      <div className="max-w-[860px] mx-auto">
        <div className="bg-white rounded-[40px] border border-gray-100 p-12 md:p-16 shadow-[0_15px_50px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_60px_rgba(0,0,0,0.06)] transition-all overflow-hidden relative">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="w-full">
              <div className="flex items-center gap-2 mb-8 justify-center md:justify-start">
                <Headphones size={20} className="text-[#3ea76e]" strokeWidth={2.5} />
                <h2 className="text-[#3ea76e] text-[14px] font-extrabold uppercase tracking-widest">고객센터</h2>
              </div>

              <div className="text-[42px] md:text-[56px] font-black mb-8 tracking-[-0.06em] leading-none text-center md:text-left text-[#111]">
                032-212-2202
              </div>

              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 justify-center md:justify-start text-gray-500 text-base md:text-lg font-bold tracking-tight">
                <span className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#3ea76e] rounded-full"></span>
                  평일 10:00 — 18:00
                </span>
                <span className="hidden md:block text-gray-200">|</span>
                <span className="text-gray-400">점심 13:00 — 14:00</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-xl font-black text-[#111] tracking-tight shrink-0">커뮤니티</h2>
            <div className="h-[2px] w-full bg-gray-50"></div>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {[
              { title: 'NOTICE', link: '/notice', icon: <Info size={24} className="text-gray-300 group-hover:text-[#3ea76e] transition-colors" /> },
              { title: 'FAQ', link: '/faq', icon: <MessageSquare size={24} className="text-gray-300 group-hover:text-[#3ea76e] transition-colors" /> },
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="flex items-center justify-between p-10 bg-white border border-gray-100 rounded-[32px] hover:border-[#3ea76e] hover:shadow-[0_20px_40px_rgba(0,0,0,0.03)] transition-all group"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-4">
                    {item.icon}
                    <span className="text-[20px] font-black tracking-[-0.03em] group-hover:text-[#3ea76e] transition-colors">
                      {item.title}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[15px] font-bold group-hover:text-gray-600 transition-colors tracking-tight pl-[40px]">
                    {item.desc}
                  </p>
                </div>
                <div className="w-14 h-14 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#3ea76e] group-hover:text-white transition-all border border-gray-100 shadow-sm shrink-0">
                  <ChevronRight size={28} strokeWidth={2} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CSPage