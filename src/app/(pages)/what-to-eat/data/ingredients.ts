export interface Ingredient {
  id: string;
  name: string; // e.g., "Ức gà", "Gạo lứt", "Trứng gà", "Rau bina"
  pricePer100g: number; // Average market price in VND
  caloriesPer100g: number;
  proteinPer100g: number;
  fatPer100g: number;
  carbsPer100g: number;
  tier: 'Tiết kiệm' | 'Tiêu chuẩn' | 'Cao cấp';
}

export const INGREDIENTS: Ingredient[] = [
  // Tiết kiệm (Budget)
  { id: '1', name: 'Ức gà', pricePer100g: 8000, caloriesPer100g: 165, proteinPer100g: 31, fatPer100g: 3.6, carbsPer100g: 0, tier: 'Tiết kiệm' },
  { id: '2', name: 'Trứng gà', pricePer100g: 3500, caloriesPer100g: 155, proteinPer100g: 13, fatPer100g: 11, carbsPer100g: 1.1, tier: 'Tiết kiệm' },
  { id: '3', name: 'Đậu phụ', pricePer100g: 2000, caloriesPer100g: 76, proteinPer100g: 8, fatPer100g: 4.8, carbsPer100g: 1.9, tier: 'Tiết kiệm' },
  { id: '4', name: 'Cà rốt', pricePer100g: 2000, caloriesPer100g: 41, proteinPer100g: 0.9, fatPer100g: 0.2, carbsPer100g: 9.6, tier: 'Tiết kiệm' },
  { id: '5', name: 'Khoai lang', pricePer100g: 2500, caloriesPer100g: 86, proteinPer100g: 1.6, fatPer100g: 0.1, carbsPer100g: 20, tier: 'Tiết kiệm' },
  { id: '6', name: 'Cà chua', pricePer100g: 2000, caloriesPer100g: 18, proteinPer100g: 0.9, fatPer100g: 0.2, carbsPer100g: 3.9, tier: 'Tiết kiệm' },
  { id: '7', name: 'Cá basa', pricePer100g: 6000, caloriesPer100g: 130, proteinPer100g: 15, fatPer100g: 7, carbsPer100g: 0, tier: 'Tiết kiệm' },
  { id: '8', name: 'Lạc (đậu phộng)', pricePer100g: 6000, caloriesPer100g: 567, proteinPer100g: 26, fatPer100g: 49, carbsPer100g: 16, tier: 'Tiết kiệm' },
  
  // Tiêu chuẩn (Standard)
  { id: '9', name: 'Gạo lứt', pricePer100g: 3500, caloriesPer100g: 111, proteinPer100g: 2.6, fatPer100g: 0.9, carbsPer100g: 23, tier: 'Tiêu chuẩn' },
  { id: '10', name: 'Rau bina', pricePer100g: 5000, caloriesPer100g: 23, proteinPer100g: 2.9, fatPer100g: 0.4, carbsPer100g: 3.6, tier: 'Tiêu chuẩn' },
  { id: '11', name: 'Bông cải xanh', pricePer100g: 4000, caloriesPer100g: 34, proteinPer100g: 2.8, fatPer100g: 0.4, carbsPer100g: 6.6, tier: 'Tiêu chuẩn' },
  { id: '12', name: 'Bơ (quả)', pricePer100g: 8000, caloriesPer100g: 160, proteinPer100g: 2, fatPer100g: 15, carbsPer100g: 8.5, tier: 'Tiêu chuẩn' },
  { id: '13', name: 'Thịt lợn nạc', pricePer100g: 13000, caloriesPer100g: 143, proteinPer100g: 26, fatPer100g: 3.5, carbsPer100g: 0, tier: 'Tiêu chuẩn' },
  { id: '14', name: 'Sữa tươi không đường', pricePer100g: 3500, caloriesPer100g: 62, proteinPer100g: 3.2, fatPer100g: 3.3, carbsPer100g: 4.8, tier: 'Tiêu chuẩn' },
  { id: '15', name: 'Nấm đùi gà', pricePer100g: 10000, caloriesPer100g: 43, proteinPer100g: 3.3, fatPer100g: 0.4, carbsPer100g: 6.6, tier: 'Tiêu chuẩn' },

  // Cao cấp (Premium)
  { id: '16', name: 'Thịt bò', pricePer100g: 25000, caloriesPer100g: 250, proteinPer100g: 26, fatPer100g: 15, carbsPer100g: 0, tier: 'Cao cấp' },
  { id: '17', name: 'Cá hồi', pricePer100g: 45000, caloriesPer100g: 208, proteinPer100g: 20, fatPer100g: 13, carbsPer100g: 0, tier: 'Cao cấp' },
  { id: '18', name: 'Hạt hạnh nhân', pricePer100g: 30000, caloriesPer100g: 579, proteinPer100g: 21, fatPer100g: 50, carbsPer100g: 22, tier: 'Cao cấp' },
  { id: '19', name: 'Dầu oliu', pricePer100g: 20000, caloriesPer100g: 884, proteinPer100g: 0, fatPer100g: 100, carbsPer100g: 0, tier: 'Cao cấp' },
  { id: '20', name: 'Tôm', pricePer100g: 25000, caloriesPer100g: 99, proteinPer100g: 24, fatPer100g: 0.3, carbsPer100g: 0.2, tier: 'Cao cấp' },
];
