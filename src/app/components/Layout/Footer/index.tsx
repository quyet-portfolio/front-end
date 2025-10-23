import React from 'react'
import MagicButton from '../ui/MagicButton'
import { FaLocationArrow } from 'react-icons/fa6'
import { socialMedia } from '@/src/app/data/helper'

const Footer = () => {
  return (
    <footer className="w-full pt-20 pb-10" id="contact">
      <div className="flex flex-col items-center">
        <a>
          <MagicButton
            title="Send me an email"
            icon={<FaLocationArrow />}
            position="right"
            handleClick={() => {
              const email = 'bquyet09@gmail.com'
              const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`

              window.open(gmailURL, '_blank')
            }}
          />
        </a>
      </div>
      <div className="flex mt-16 md:flex-row flex-col justify-between items-center">
        <p className="md:text-base text-sm md:font-normal font-light">Copyright © 2024 Bui Duy Quyet</p>

        <div className="flex items-center md:gap-3 gap-6">
          {socialMedia.map((info) => (
            <div
              key={info.id}
              onClick={() => window.open(info.link)}
              className="w-10 h-10 cursor-pointer flex justify-center items-center backdrop-filter backdrop-blur-lg saturate-180 bg-opacity-75 bg-black-200 rounded-lg border border-black-300"
            >
              <img src={info.img} alt="icons" width={20} height={20} />
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
