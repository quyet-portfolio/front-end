// components/FacebookSDK.js
'use client' // Bắt buộc phải có dòng này để định nghĩa đây là Client Component

import Script from 'next/script'

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function FacebookSDK() {
  return (
    <Script
      src="https://connect.facebook.net/en_US/sdk.js"
      strategy="afterInteractive" // Thay lazyOnload bằng afterInteractive để tối ưu hơn
      onLoad={() => {
        window.fbAsyncInit = () => {
          window.FB.init({
            appId      : process.env.NEXT_PUBLIC_FB_APP_ID,
            cookie     : true,
            xfbml      : true,
            version    : 'v20.0'
          });
        };
      }}
    />
  )
}