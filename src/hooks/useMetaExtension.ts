// hooks/useMetaExtension.js
'use client'
import { useState } from 'react';

export const useMetaExtension = (configId: string) => {
  const [loading, setLoading] = useState(false);

  const launchMBE = () => {
    return new Promise((resolve, reject) => {
      if (!window.FB) {
        return reject("SDK chưa sẵn sàng");
      }

      setLoading(true);

      window.FB.ui({
        method: 'business_extension',
        config_id: configId,
      }, (response: any) => {
        setLoading(false);
        if (!response) {
          return reject("Người dùng đã đóng popup");
        }
        if (response.error_code) {
          return reject(response.error_message);
        }
        
        // Response này sẽ chứa access_token tạm thời hoặc mã cài đặt
        resolve(response);
      });
    });
  };

  return { launchMBE, loading };
};