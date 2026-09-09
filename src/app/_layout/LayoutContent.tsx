import Footer from '@/src/layouts/footer'
import Spotlight from '@/src/components/ui/Spotlight'
import Snowfall from '@/src/components/snow-fall'

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative bg-black-100 flex flex-col min-h-screen justify-center items-center overflow-hidden">
      <Snowfall />
      <div className="absolute inset-0 pointer-events-none">
        <Spotlight className="top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
        <Spotlight className="h-[80vh] w-[50vw] top-10 left-full" fill="purple" />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>
      <div className="relative h-screen flex-1 w-full max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
      <div className="w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Footer />
      </div>
    </div>
  )
}

export default LayoutContent
