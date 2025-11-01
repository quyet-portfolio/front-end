'use client'
import { cn } from '@/src/lib/utils'
import { LoginOutlined } from '@ant-design/icons'
import { Tooltip } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import SidebarMenu from './SidebarMenu'

type TNavbar = {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
  isShowLoginButton?: boolean
}

const Navbar = ({ navItems, className, isShowLoginButton }: TNavbar) => {
  const router = useRouter()
  const [visible, setVisible] = useState(true)

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          'flex max-w-[90%] lg:max-w-[75%] fixed z-[5000] top-4 inset-x-0 mx-auto items-center justify-between gap-4',
          className,
        )}
      >
        <SidebarMenu />
        <div
          className="hidden md:flex px-6 lg:px-10 py-4 lg:py-5 rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-3 lg:space-x-4"
          style={{
            backdropFilter: 'blur(16px) saturate(180%)',
            backgroundColor: 'rgba(17, 25, 40, 0.75)',
            borderRadius: '12px',
            border: '1px solid rgba(255, 255, 255, 0.125)',
          }}
        >
          {navItems.map((navItem: any, idx: number) => (
            <Link
              key={`link=${idx}`}
              href={navItem.link}
              className={cn(
                'relative dark:text-neutral-50 items-center flex space-x-1 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500',
              )}
            >
              <span className="block sm:hidden">{navItem.icon}</span>
              <span className="text-sm !cursor-pointer">{navItem.name}</span>
            </Link>
          ))}
        </div>

        <div className="w-[50px]">
          {
            isShowLoginButton ? (
          <Tooltip title="Login" color="#10132E">
            <motion.button
              onClick={() => router.push('/login')}
              className="p-3 rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
              style={{
                backdropFilter: 'blur(16px) saturate(180%)',
                backgroundColor: 'rgba(17, 25, 40, 0.5)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.125)',
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <LoginOutlined className="text-neutral-50 text-xl" />
            </motion.button>
          </Tooltip>
            ) : null
          }
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

export default Navbar
