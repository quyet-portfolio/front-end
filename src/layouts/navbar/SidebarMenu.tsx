import { menuItems } from '@/src/app/data/helper'
import { cn } from '@/src/lib/utils'
import { MenuUnfoldOutlined } from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const SidebarMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isMenuOpen) return

    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setIsMenuOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setIsMenuOpen(false)
      // Trả focus về nút mở, nếu không người dùng bàn phím sẽ mất vị trí.
      buttonRef.current?.focus()
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('touchstart', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('touchstart', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [isMenuOpen])

  return (
    <div className="relative lg:block" ref={containerRef}>
      <motion.button
        ref={buttonRef}
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
        aria-controls="sidebar-menu"
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className="p-3 rounded-lg border shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)] focus:outline-none focus-visible:ring-2 focus-visible:ring-purple focus-visible:ring-offset-2 focus-visible:ring-offset-black-100"
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
            id="sidebar-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className={cn(
              // Mobile
              'fixed top-[60px] bottom-auto max-h-[80vh] overflow-y-auto',
              // Desktop
              'lg:absolute lg:top-full lg:mt-2 lg:left-0 lg:inset-x-auto lg:max-h-[70vh]',
              'min-w-[250px] rounded-lg border shadow-2xl z-50',
            )}
            style={{
              backdropFilter: 'blur(16px) saturate(180%)',
              backgroundColor: 'rgba(17, 25, 40, 0.75)',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.125)',
            }}
          >
            <nav aria-label="Pages" className="flex flex-col py-2">
              {menuItems.map((navItem: any, idx: number) => (
                <Link
                  key={`dropdown-link-${idx}`}
                  href={navItem.link}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    'relative text-neutral-50 items-center flex space-x-3 hover:text-neutral-300 px-6 py-3 hover:bg-white/10 transition-colors',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-purple',
                  )}
                >
                  <span aria-hidden>{navItem.icon}</span>
                  <span className="text-sm">{navItem.name}</span>
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default SidebarMenu
