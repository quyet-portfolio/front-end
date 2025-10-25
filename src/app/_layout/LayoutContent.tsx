import Footer from '../components/Layout/Footer'
import Spotlight from '../components/Layout/ui/Spotlight'

const LayoutContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative bg-black-100 flex flex-col min-h-screen justify-center items-center overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <Spotlight className="top-40 -left-10 md:-left-32 md:-top-20 h-screen" fill="white" />
        <Spotlight className="h-[80vh] w-[50vw] top-10 left-full" fill="purple" />
        <Spotlight className="left-80 top-28 h-[80vh] w-[50vw]" fill="blue" />
      </div>
      <div className="relative h-screen flex-1 max-w-[90%] lg:max-w-[75%] w-full">{children}</div>
      <div className="max-w-[75%] w-full">
        <Footer />
      </div>
    </div>
  )
}

export default LayoutContent
