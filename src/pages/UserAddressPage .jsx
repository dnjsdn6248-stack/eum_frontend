import { useState } from 'react'
import { Plus, Trash2, Edit2, Search, X, MapPin } from 'lucide-react'

const EMPTY_FORM = {
  title: '', name: '', phone: '', zipcode: '', addr1: '', addr2: '', isDefault: false
}

export default function UserAddressPage() {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      title: '우리집',
      name: '서령님',
      phone: '010-6482-2955',
      zipcode: '22664',
      addr1: '인천광역시 서구 보듬로 158 (오류동)',
      addr2: '공존동 4층 430호',
      isDefault: true,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('add')
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)

  const openAdd = () => {
    setForm(EMPTY_FORM)
    setModalMode('add')
    setEditId(null)
    setIsModalOpen(true)
  }

  const openEdit = (item) => {
    setForm({ title: item.title, name: item.name, phone: item.phone, zipcode: item.zipcode, addr1: item.addr1, addr2: item.addr2, isDefault: item.isDefault })
    setModalMode('edit')
    setEditId(item.id)
    setIsModalOpen(true)
  }

  const handleDelete = (id) => setAddresses(prev => prev.filter(a => a.id !== id))

  const handleSubmit = () => {
    if (!form.title || !form.name || !form.addr1) return
    if (modalMode === 'add') {
      const newItem = { ...form, id: Date.now() }
      if (form.isDefault) {
        setAddresses(prev => [...prev.map(a => ({ ...a, isDefault: false })), newItem])
      } else {
        setAddresses(prev => [...prev, newItem])
      }
    } else {
      setAddresses(prev => prev.map(a => {
        if (form.isDefault && a.id !== editId) return { ...a, isDefault: false }
        if (a.id === editId) return { ...a, ...form }
        return a
      }))
    }
    setIsModalOpen(false)
  }

  const set = (key, val) => setForm(prev => ({ ...prev, [key]: val }))

  return (
    <div className="w-full bg-[#FCFBF9] min-h-screen pb-28 px-4 text-[#111]">
      <div className="max-w-[1200px] mx-auto text-center py-24">
        <h1 className="text-[36px] font-black tracking-[-0.05em] text-[#111]">배송지 관리</h1>
      </div>

      <div className="max-w-[680px] mx-auto">
        <div className="flex items-center justify-between mb-6 px-1">
          <span className="text-[14px] font-bold text-[#aaa]">
            총 <span className="text-[#111] font-black">{addresses.length}</span>개
          </span>
          <button
            onClick={openAdd}
            className="h-10 px-5 bg-[#3ea76e] text-white rounded-full text-[13px] font-black hover:bg-[#318a57] transition-all flex items-center gap-1.5 cursor-pointer border-none"
          >
            <Plus size={14} /> 신규 등록
          </button>
        </div>

        <div className="space-y-3">
          {addresses.length === 0 && (
            <div className="text-center py-24">
              <MapPin size={32} className="text-[#eee] mx-auto mb-4" />
              <p className="text-[#bbb] font-bold text-[14px]">등록된 배송지가 없어요</p>
            </div>
          )}
          {addresses.map((item) => (
            <div key={item.id} className="bg-white border border-[#eee] rounded-[24px] px-6 py-5 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:border-[#ddd] transition-all">
              <div className="flex justify-between items-center">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[15px] font-black text-[#111]">{item.title}</span>
                    {item.isDefault && (
                      <span className="bg-[#f0faf4] text-[#3ea76e] text-[11px] font-black px-2 py-0.5 rounded-full">기본</span>
                    )}
                  </div>
                  <div className="text-[13px] font-bold text-[#555]">
                    {item.name} <span className="text-[#ddd] mx-1">|</span>
                    <span className="text-[#888] font-medium">{item.phone}</span>
                  </div>
                  <p className="text-[13px] text-[#aaa] font-medium">
                    <span className="text-[#3ea76e] font-bold">[{item.zipcode}]</span> {item.addr1} {item.addr2}
                  </p>
                </div>

                <div className="flex gap-2 shrink-0 ml-4">
                  <button
                    onClick={() => openEdit(item)}
                    className="h-9 px-4 bg-[#f5f5f5] text-[#555] rounded-full text-[12px] font-bold border-none cursor-pointer hover:bg-[#3ea76e] hover:text-white transition-all"
                  >
                    수정
                  </button>
                  {!item.isDefault && (
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="h-9 px-4 bg-[#f5f5f5] text-[#555] rounded-full text-[12px] font-bold border-none cursor-pointer hover:bg-red-50 hover:text-red-400 transition-all"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative bg-white rounded-[32px] w-full max-w-[480px] max-h-[90vh] overflow-y-auto shadow-2xl p-8">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 text-[#bbb] hover:text-[#111] bg-transparent border-none cursor-pointer">
              <X size={20} />
            </button>

            <h3 className="text-[20px] font-black text-[#111] tracking-tight mb-7">
              {modalMode === 'add' ? '새 배송지 등록' : '배송지 수정'}
            </h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[12px] font-bold text-[#aaa] mb-1.5 ml-1">배송지명 *</p>
                  <input type="text" value={form.title} onChange={e => set('title', e.target.value)} placeholder="예) 우리집" className="w-full bg-[#f8f8f8] rounded-2xl px-4 py-3 text-[13px] font-bold outline-none border-none" />
                </div>
                <div>
                  <p className="text-[12px] font-bold text-[#aaa] mb-1.5 ml-1">성명 *</p>
                  <input type="text" value={form.name} onChange={e => set('name', e.target.value)} placeholder="받는 분" className="w-full bg-[#f8f8f8] rounded-2xl px-4 py-3 text-[13px] font-bold outline-none border-none" />
                </div>
              </div>

              <div>
                <p className="text-[12px] font-bold text-[#aaa] mb-1.5 ml-1">휴대폰</p>
                <input type="text" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="010-0000-0000" className="w-full bg-[#f8f8f8] rounded-2xl px-4 py-3 text-[13px] font-bold outline-none border-none" />
              </div>

              <div>
                <p className="text-[12px] font-bold text-[#aaa] mb-1.5 ml-1">주소 *</p>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <input type="text" value={form.zipcode} onChange={e => set('zipcode', e.target.value)} placeholder="우편번호" className="w-28 bg-[#f8f8f8] rounded-2xl px-4 py-3 text-[13px] font-bold outline-none border-none" />
                    <button className="h-[44px] px-4 bg-[#111] text-white text-[12px] font-black rounded-2xl border-none cursor-pointer hover:bg-[#333] transition-all flex items-center gap-1.5">
                      <Search size={13} /> 검색
                    </button>
                  </div>
                  <input type="text" value={form.addr1} onChange={e => set('addr1', e.target.value)} placeholder="기본주소" className="w-full bg-[#f8f8f8] rounded-2xl px-4 py-3 text-[13px] font-bold outline-none border-none" />
                  <input type="text" value={form.addr2} onChange={e => set('addr2', e.target.value)} placeholder="나머지 주소 (선택)" className="w-full bg-[#f8f8f8] rounded-2xl px-4 py-3 text-[13px] font-bold outline-none border-none" />
                </div>
              </div>

              <label className="flex items-center gap-3 cursor-pointer pt-1">
                <input type="checkbox" checked={form.isDefault} onChange={e => set('isDefault', e.target.checked)} className="w-4 h-4 accent-[#3ea76e] cursor-pointer" />
                <span className="text-[13px] font-bold text-[#555]">기본 배송지로 저장</span>
              </label>

              <div className="flex gap-3 pt-4 border-t border-[#f5f5f5]">
                <button onClick={handleSubmit} className="flex-[2] py-3.5 bg-[#3ea76e] text-white rounded-full font-black text-[14px] border-none cursor-pointer hover:bg-[#318a57] transition-all">
                  {modalMode === 'add' ? '등록하기' : '수정완료'}
                </button>
                <button onClick={() => setIsModalOpen(false)} className="flex-1 py-3.5 bg-[#f5f5f5] text-[#555] rounded-full font-black text-[14px] border-none cursor-pointer hover:bg-[#ebebeb] transition-all">
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}