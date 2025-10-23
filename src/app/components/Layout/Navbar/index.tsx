'use client'
import { menuItems } from '@/src/app/data/helper'
import { cn } from '@/src/lib/utils'
import { LoginOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { motion, AnimatePresence, useMotionValueEvent, useScroll } from 'framer-motion'
import Link from 'next/link'
import React, { useState } from 'react'

type TNavbar = {
  navItems: {
    name: string
    link: string
    icon?: JSX.Element
  }[]
  className?: string
}

const Navbar = ({ navItems, className }: TNavbar) => {
  const { scrollYProgress } = useScroll()
  const [visible, setVisible] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  // useMotionValueEvent(scrollYProgress, "change", (current) => {
  //   if (typeof current === "number") {
  //     let direction = current! - scrollYProgress.getPrevious()!;

  //     if (scrollYProgress.get() < 0.05) {
  //       setVisible(true);
  //     } else {
  //       if (direction < 0) {
  //         setVisible(true);
  //       } else {
  //         setVisible(false);
  //       }
  //     }
  //   }
  // });
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{
          opacity: 1,
          y: -100,
        }}
        animate={{
          y: visible ? 0 : -100,
          opacity: visible ? 1 : 0,
        }}
        transition={{
          duration: 0.2,
        }}
        className={cn(
          'flex max-w-7xl fixed z-[5000] top-4 inset-x-0 mx-auto items-center justify-between gap-4',
          className,
        )}
      >
        <div className="relative">
          <motion.button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            <MenuUnfoldOutlined className="text-neutral-50 text-xl" />
          </motion.button>
          {/* Dropdown Menu */}
          <AnimatePresence>
            {isMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute top-full mt-2 left-0 min-w-[180px] rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]"
                style={{
                  backdropFilter: 'blur(16px) saturate(180%)',
                  backgroundColor: 'rgba(17, 25, 40, 0.75)',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.125)',
                }}
              >
                <div className="flex flex-col py-2">
                  {menuItems.map((navItem: any, idx: number) => (
                    <Link
                      key={`dropdown-link-${idx}`}
                      href={navItem.link}
                      onClick={() => setIsMenuOpen(false)}
                      className={cn(
                        'relative dark:text-neutral-50 items-center flex space-x-3 text-neutral-600 dark:hover:text-neutral-300 hover:text-neutral-500 px-6 py-3 hover:bg-white/10 transition-colors',
                      )}
                    >
                      <span>{navItem.icon}</span>
                      <span className="text-sm">{navItem.name}</span>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div
          className="flex px-10 py-5 rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] items-center justify-center space-x-4"
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

        <motion.button
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
      </motion.div>
    </AnimatePresence>
  )
}

export default Navbar
