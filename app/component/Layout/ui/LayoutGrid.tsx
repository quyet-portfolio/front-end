import { cn } from '@/lib/utils'
import React, { useState } from 'react'
import MagicButton from './MagicButton'
import { IoCopyOutline } from 'react-icons/io5'
import Image from 'next/image'

type TLayoutGrid = {
  className?: string
  id: number
  title?: string | React.ReactNode
  description?: string | React.ReactNode
  img?: string
  imgClassName?: string
  titleClassName?: string
  spareImg?: string
}

export const LayoutGrid = ({ className, children }: { className?: string; children?: React.ReactNode }) => {
  return (
    <div
      className={cn('grid grid-cols-1 md:grid-cols-6 lg:grid-cols-5 md:grid-row-7 gap-4 lg:gap-8 mx-auto', className)}
    >
      {children}
    </div>
  )
}

export const LayoutGridItem = ({
  className,
  id,
  title,
  description,
  img,
  imgClassName,
  titleClassName,
  spareImg,
}: TLayoutGrid) => {
  const leftLists = ['NodeJS', 'ReactJS', 'Typescript']
  const rightLists = ['RemixJS', 'NextJS', 'MySql']

  const [copied, setCopied] = useState(false)

  // const defaultOptions = {
  //   loop: copied,
  //   autoplay: copied,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // };

  const handleCopy = () => {
    const text = 'bquyet09@gmail.com'
    navigator.clipboard.writeText(text)
    setCopied(true)
  }

  return (
    <div
      className={cn(
        'row-span-1 relative overflow-hidden rounded-3xl border border-white/[0.1] group/bento hover:shadow-xl transition duration-200 shadow-input dark:shadow-none justify-between flex flex-col space-y-4',
        className,
      )}
      style={{
        background: 'rgb(4,7,29)',
        backgroundColor: 'linear-gradient(90deg, rgba(4,7,29,1) 0%, rgba(12,14,35,1) 100%)',
      }}
    >
      <div className={`h-full`}>
        {/* {id === 6 && (
          <div className="absolute z-50 inset-0 flex items-center text-white font-bold px-4 pointer-events-none text-3xl  md:text-4xl lg:text-7xl"></div>
        )} */}

        <div
          className={cn(
            titleClassName,
            'group-hover/bento:translate-x-2 transition duration-200 relative md:h-full min-h- flex flex-col px-5 p-5 lg:p-4',
          )}
        >
          <div className={`font-sans text-lg font-bold z-10`}>{title}</div>

          {id === 3 && (
            <div className="flex gap-1 lg:gap-5 w-fit absolute -right-3 lg:-right-2">
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                {leftLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg  bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
                <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg  bg-[#10132E]"></span>
              </div>
              <div className="flex flex-col gap-3 md:gap-3 lg:gap-8">
                <span className="lg:py-4 lg:px-3 py-4 px-3 rounded-lg  bg-[#10132E]"></span>
                {rightLists.map((item, i) => (
                  <span
                    key={i}
                    className="lg:py-4 lg:px-3 py-2 px-3 text-xs lg:text-base opacity-50 
                    lg:opacity-100 rounded-lg  bg-[#10132E]"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default LayoutGrid
