'use client'

import { ConfigProvider, theme } from 'antd'
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { type ThemeProviderProps } from 'next-themes/dist/types'

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ConfigProvider
        theme={{
          algorithm: theme.darkAlgorithm,
          token: {
            // Seed Token
            colorPrimary: '#6366F1',
            colorSuccess: '#10b981',
            colorWarning: '#f59e0b',
            colorError: '#ef4444',
            colorInfo: '#3b82f6',

            // Background
            colorBgBase: '#020617', // Bg web
            colorBgContainer: '#0f172a', // Bg big container
            colorBgElevated: '#1e293b', // Bg Modal, Popover

            // Text
            colorText: '#f8fafc',
            colorTextSecondary: '#94a3b8',
            colorTextTertiary: '#64748b',

            // Border
            colorBorder: '#1e293b',
            colorBorderSecondary: '#334155',
            borderRadius: 9,

            // Font
            fontSize: 14,
            fontFamily: 'Inter, -apple-system, system-ui, sans-serif',
          },
          components: {
            Input: {
              colorBgContainer: 'rgba(255, 255, 255, 0.03)',
              colorBorder: 'rgba(255, 255, 255, 0.1)',
              hoverBorderColor: 'rgba(255, 255, 255, 0.25)',
              activeBorderColor: '#1e293b',
              activeShadow: '0 0 8px rgba(255, 255, 255, 0.5)',
              colorText: 'rgba(255, 255, 255, 0.9)',
              colorTextPlaceholder: 'rgba(255, 255, 255, 0.3)',
              controlHeight: 40,
              borderRadius: 8,
            },
            Card: {
              colorBgContainer: 'rgba(15, 23, 42, 0.8)',
              colorBorderSecondary: 'rgba(255, 255, 255, 0.05)',
            },
            Button: {
              fontWeight: 500,
              controlHeight: 40,
              borderRadius: 8,
            },
            Table: {
              headerBg: '#1e293b',
              headerColor: '#f8fafc',
              rowHoverBg: 'rgba(124, 58, 237, 0.05)',
            },
            Modal: {
              contentBg: '#0f172a',
              headerBg: '#0f172a',
            },
            Menu: {
              itemBg: 'transparent',
              itemSelectedBg: 'rgba(124, 58, 237, 0.15)',
              itemSelectedColor: '#a78bfa',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </NextThemesProvider>
  )
}
