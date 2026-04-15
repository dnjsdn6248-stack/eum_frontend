import { useState, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import HeroSlider from '../features/components/home/HeroSlider'
import BestSellers from '../features/components/home/BestSellers'
import ProductTabs from '../features/components/home/ProductTabs'
import BrandStory from '../features/components/home/BrandStory'
import PhotoReviews from '../features/components/home/PhotoReviews'
import Toast from '../features/components/ui/Toast'
import { PROVIDER_LABELS } from '@/shared/utils/oauth2'

export default function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [toast, setToast] = useState(null) // { message, isError }

  // 소셜 계정 연동 성공: /?linked={provider}
  // 소셜 계정 연동 실패: /?link_error={reason}
  useEffect(() => {
    const linked    = searchParams.get('linked')
    const linkError = searchParams.get('link_error')

    if (linked) {
      const label = PROVIDER_LABELS[linked] ?? linked
      setToast({ message: `${label} 계정 연동이 완료됐어요!`, isError: false })
      setSearchParams({}, { replace: true })
    } else if (linkError) {
      setToast({ message: '계정 연동에 실패했습니다. 다시 시도해 주세요.', isError: true })
      setSearchParams({}, { replace: true })
    }
  }, [])

  return (
    <div className="w-full bg-white">
      {toast && (
        <Toast
          message={toast.message}
          isError={toast.isError}
          onClose={() => setToast(null)}
        />
      )}

      <section className="w-full mb-12 md:mb-16">
        <HeroSlider />
      </section>
      <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 pb-20">
        <div className="space-y-24">
          <BestSellers />
          <ProductTabs />
          <BrandStory />
          <PhotoReviews />
        </div>
      </main>
    </div>
  )
}
