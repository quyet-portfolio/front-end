'use client';

import { useState, useEffect } from 'react';
import { Blog } from '../lib/types';
import { blogApi } from '../lib/api/blog';

export const useBlog = (slug: string) => {
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBlog = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await blogApi.getBlogBySlug(slug);
      setBlog(data.blog);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch blog');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (slug) {
      fetchBlog();
    }
  }, [slug]);

  return { blog, loading, error, refetch: fetchBlog };
};