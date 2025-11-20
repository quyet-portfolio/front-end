'use client'

import { createContext, ReactNode, useContext } from 'react'
import { message } from 'antd'
import type { MessageInstance } from 'antd/es/message/interface'

const MessageContext = createContext<MessageInstance | null>(null)

export const useMessageApi = () => useContext(MessageContext)

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messageApi, contextHolder] = message.useMessage()

  return (
    <MessageContext.Provider value={messageApi}>
      {contextHolder}
      {children}
    </MessageContext.Provider>
  )
}
