/**
 * Cung cấp các hàm tiện ích để giao tiếp với Local Storage nhằm lưu trữ
 * lịch sử các món ăn đã được tạo, giúp tránh việc AI đề xuất trùng lặp món.
 */

const STORAGE_KEY = 'recent_meals';
const MAX_RECENT_MEALS = 15;

/**
 * Lấy danh sách các món ăn gần đây từ localStorage
 */
export const getRecentMeals = (): string[] => {
  if (typeof window === 'undefined') return []; // Fallback cho SSR
  
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading recent meals from localStorage', error);
    return [];
  }
};

/**
 * Thêm các món ăn mới vào danh sách lịch sử, giới hạn số lượng tối đa là 15
 */
export const addRecentMeals = (newMeals: string[]) => {
  if (typeof window === 'undefined') return;

  try {
    const currentMeals = getRecentMeals();
    // Tạo mảng mới: thêm món ăn mới vào đầu, loại bỏ các món ăn trùng lặp cũ
    // (Dùng Set để loại bỏ trùng sau cùng cũng là một cách, nhưng ta luôn muốn giữ món MỚI nhất)
    
    // Gộp mảng, dùng Set để loại trùng (giữ lại xuất hiện đầu tiên)
    const combined = [...newMeals, ...currentMeals];
    const uniqueMeals = Array.from(new Set(combined));
    
    // Giới hạn ở MAX_RECENT_MEALS
    const limitedMeals = uniqueMeals.slice(0, MAX_RECENT_MEALS);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedMeals));
  } catch (error) {
    console.error('Error writing recent meals to localStorage', error);
  }
};

/**
 * Xóa bộ nhớ lịch sử món ăn (tùy chọn nếu người dùng muốn làm mới hoàn toàn)
 */
export const clearRecentMeals = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
};

// ─── User Profile Persistence ────────────────────────────────────────────────

const PROFILE_KEY = 'user_profile';

/**
 * Lưu hồ sơ người dùng vào localStorage để auto-fill khi quay lại
 */
export const saveUserProfile = <T>(profile: T) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch (error) {
    console.error('Error saving user profile to localStorage', error);
  }
};

/**
 * Tải hồ sơ người dùng đã lưu từ localStorage
 */
export const loadUserProfile = <T>(): T | null => {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(PROFILE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error loading user profile from localStorage', error);
    return null;
  }
};
