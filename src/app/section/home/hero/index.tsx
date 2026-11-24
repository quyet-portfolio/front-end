import Image from 'next/image'
import { FaLocationArrow, FaRegEnvelope } from 'react-icons/fa6'
import MagicButton from '@/src/components/ui/MagicButton'
import TextGenerateEffect from '@/src/components/ui/TextGenerateEffect'

const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      {/* w-screen + left-1/2 để nền lưới tràn hết viewport: container cha giờ bị
          giới hạn ở max-w-7xl nên nếu để w-full sẽ lộ mép lưới hai bên. */}
      <div
        aria-hidden
        className="h-screen w-screen bg-black-100 bg-grid-white/[0.03]
       absolute top-0 left-1/2 -translate-x-1/2 flex items-center justify-center"
      >
        <div
          className="absolute pointer-events-none inset-0 flex items-center justify-center bg-black-100
         [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>

      <div className="flex justify-center relative my-5 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <div className="">
            <Image
              className="rounded-full w-40 h-40 object-cover"
              src="/avt.jpg"
              width={160}
              height={160}
              priority
              alt="Bui Duy Quyet"
            />
          </div>
          <TextGenerateEffect
            as="h1"
            words="Hello. I am Quyet, a Front-end Developer"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />
          {/* Chữ hero fade-in bằng JS; nếu JS không chạy thì buộc hiện để crawler và
              người dùng no-JS vẫn đọc được h1. */}
          <noscript>
            <style>{`[data-text-generate] span { opacity: 1 !important; }`}</style>
          </noscript>

          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-6 w-full md:w-auto">
            <MagicButton href="#projects" title="View my work" icon={<FaLocationArrow />} position="right" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Hero
