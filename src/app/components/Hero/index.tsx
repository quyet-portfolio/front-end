import Image from 'next/image'
import { FaLocationArrow } from 'react-icons/fa6'
import MagicButton from '../Layout/ui/MagicButton'
import TextGenerateEffect from '../Layout/ui/TextGenerateEffect'

const Hero = () => {
  return (
    <div className="pb-20 pt-36">
      <div
        className="h-screen w-full dark:bg-black-100 bg-white dark:bg-grid-white/[0.03] bg-grid-black-100/[0.2]
       absolute top-0 left-0 flex items-center justify-center"
      >
        <div
          className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black-100
         bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"
        />
      </div>

      <div className="flex justify-center relative my-5 z-10">
        <div className="max-w-[89vw] md:max-w-2xl lg:max-w-[60vw] flex flex-col items-center justify-center">
          <div className="">
            <Image className="rounded-full w-40 h-40 object-cover" src="/avt.jpg" width={160} height={160} alt="avatar_quyet" />
          </div>
          <TextGenerateEffect
            words="Hello. I am Quyet, a front-end developer"
            className="text-center text-[40px] md:text-5xl lg:text-6xl"
          />
          <a href="#about">
            <MagicButton title="Show about me" icon={<FaLocationArrow />} position="right" />
          </a>
        </div>
      </div>
    </div>
  )
}

export default Hero
