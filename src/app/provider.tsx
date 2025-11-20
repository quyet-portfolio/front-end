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
            colorPrimary: '#667eea',
            colorSuccess: '#52c41a',
            colorWarning: '#faad14',
            colorError: '#ff4d4f',
            colorInfo: '#1890ff',

            // Background
            colorBgBase: '#000000',
            colorBgContainer: '#141414',
            colorBgElevated: '#1a1a1a',

            // Text
            colorText: '#ffffff',
            colorTextSecondary: 'rgba(255, 255, 255, 0.65)',
            colorTextTertiary: 'rgba(255, 255, 255, 0.45)',

            // Border
            colorBorder: '#434343',
            colorBorderSecondary: '#303030',
            borderRadius: 8,

            // Font
            fontSize: 14,
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          components: {
            Button: {
              primaryShadow: '0 2px 0 rgba(102, 126, 234, 0.1)',
              algorithm: true,
            },
            Input: {
              colorBgContainer: '#0a0f24',
              colorBorder: 'transparent',
              hoverBorderColor: '#0a0f24',
              activeBorderColor: '#0a0f24',
              colorText: '#fff',
              colorTextPlaceholder: '#bbb',
              paddingBlock: 8,
              paddingInline: 12,
              borderRadius: 8,
              controlHeight: 40,
              fontSize: 14,
            },
            Card: {
              headerBg: 'transparent',
              colorBgContainer: 'rgba(255, 255, 255, 0.05)',
            },
            Modal: {
              contentBg: '#1a1a1a',
              headerBg: 'transparent',
            },
            Menu: {
              darkItemBg: 'transparent',
              darkItemSelectedBg: 'rgba(102, 126, 234, 0.2)',
            },
            Table: {
              headerBg: 'rgba(255, 255, 255, 0.05)',
              rowHoverBg: 'rgba(255, 255, 255, 0.08)',
            },
            Message: {
              zIndexPopup: 9999
            }
          },
        }}
      >
        {children}
      </ConfigProvider>
    </NextThemesProvider>
  )
}
