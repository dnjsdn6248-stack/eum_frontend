import HeroSlider from '../features/components/home/HeroSlider'
import BestSellers from '../features/components/home/BestSellers'
import ProductTabs from '../features/components/home/ProductTabs'
import BrandStory from '../features/components/home/BrandStory'
import { Link } from 'react-router-dom'
import PhotoReviews from '../features/components/home/PhotoReviews'

export default function HomePage() {
  return (
    <div className="w-full bg-white">
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