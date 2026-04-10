import { useEffect } from 'react'

export default function Alert({ message, onConfirm, buttonText = '확인' }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onConfirm} />
      <div className="relative bg-white rounded-[24px] w-[340px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        <div className="px-8 py-10 text-center">
          <p className="text-[16px] font-bold text-[#111] leading-relaxed tracking-tight">{message}</p>
        </div>
        <button
          onClick={onConfirm}
          className="w-full py-5 bg-[#3ea76e] text-white font-black text-[16px] tracking-tight border-none cursor-pointer hover:bg-[#318a57] transition-colors"
        >
          {buttonText}
        </button>
      </div>
    </div>
  )
}