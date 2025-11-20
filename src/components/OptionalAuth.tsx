// src/components/OptionalAuth.tsx
'use client';

import Link from 'next/link';
import { useAuth } from '../contexts/AuthContext';

interface OptionalAuthProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showLoginPrompt?: boolean;
}

/**
 * Component cho trang có thể xem mà không cần đăng nhập
 * Nhưng hiện thêm tính năng khi đã đăng nhập
 */
export default function OptionalAuth({ 
  children, 
  fallback,
  showLoginPrompt = false 
}: OptionalAuthProps) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    );
  }

  // Nếu chưa đăng nhập và có fallback component
  if (!isAuthenticated && fallback) {
    return <>{fallback}</>;
  }

  // Nếu chưa đăng nhập và muốn hiện login prompt
  if (!isAuthenticated && showLoginPrompt) {
    return (
      <div className="text-center p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-600 mb-2">
          Đăng nhập để sử dụng tính năng này
        </p>
        <Link 
          href="/login"
          className="text-blue-500 hover:underline text-sm"
        >
          Đăng nhập ngay
        </Link>
      </div>
    );
  }

  // Nếu đã đăng nhập, hiển thị children
  if (isAuthenticated) {
    return <>{children}</>;
  }

  // Mặc định không hiện gì nếu chưa đăng nhập
  return null;
}