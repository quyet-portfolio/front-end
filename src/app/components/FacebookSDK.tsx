'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    FB: any;
    fbAsyncInit: () => void;
  }
}

export default function FacebookSDK() {
  useEffect(() => {
    if (window.FB) return;

    window.fbAsyncInit = function () {
      window.FB.init({
        appId   : process.env.NEXT_PUBLIC_FB_APP_ID,
        cookie  : true,
        xfbml   : false,
        version : 'v20.0',
      });
    };

    const script = document.createElement('script');
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  return null;
}
