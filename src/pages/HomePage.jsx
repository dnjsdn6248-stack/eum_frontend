import HeroSlider from '../components/HeroSlider'
import BestSellers from '../components/BestSellers'
import ProductTabs from '../components/ProductTabs'
import BrandStory from '../components/BrandStory'
import PhotoReviews from '../components/PhotoReviews'

export default function HomePage() {
  return (
    <div className="w-full bg-white">
  
      <section className="w-full mb-12 md:mb-16">
        <HeroSlider />
      </section>
      <main className="max-w-[1200px] mx-auto w-full px-6 md:px-8 pb-20">
      
        <div className="flex justify-between items-end mb-8">
    
        </div>
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