import { menuItems } from '@/src/app/data/helper'
import { cn } from '@/src/lib/utils'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'

const SidebarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
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
  )
}

export default SidebarMenu
