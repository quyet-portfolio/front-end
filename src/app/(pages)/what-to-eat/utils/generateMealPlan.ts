import { Ingredient, INGREDIENTS } from '../data/ingredients';

export interface MealItem extends Ingredient {
  weightInGrams: number;
  totalCalories: number;
  totalPrice: number;
  totalProtein: number;
  totalFat: number;
  totalCarbs: number;
}

export interface Meal {
  name: string; // Breakfast, Lunch, Dinner
  items: MealItem[];
  totalCalories: number;
  totalPrice: number;
  totalMacros: {
    protein: number;
    fat: number;
    carbs: number;
  };
}

export interface DailyPlan {
  meals: Meal[];
  totalCalories: number;
  totalPrice: number;
  totalMacros: {
    protein: number;
    fat: number;
    carbs: number;
  };
}

export type BudgetTier = 'Tiết kiệm' | 'Tiêu chuẩn' | 'Cao cấp';

const getRandomItems = (items: Ingredient[], count: number) => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

export function generateDailyPlan(targetCalories: number, tier: BudgetTier): DailyPlan {
  // Allow cheaper tiers to be selected in more expensive tiers for variety
  const allowedTiers = tier === 'Cao cấp' ? ['Tiết kiệm', 'Tiêu chuẩn', 'Cao cấp'] 
    : tier === 'Tiêu chuẩn' ? ['Tiết kiệm', 'Tiêu chuẩn'] 
    : ['Tiết kiệm'];

  const availableIngredients = INGREDIENTS.filter(item => allowedTiers.includes(item.tier));

  // Split calories: Breakfast (25%), Lunch (40%), Dinner (35%)
  const mealRatios = [
    { name: 'Bữa sáng', ratio: 0.25, itemsCount: 2 },
    { name: 'Bữa trưa', ratio: 0.40, itemsCount: 3 },
    { name: 'Bữa tối', ratio: 0.35, itemsCount: 3 },
  ];

  const meals: Meal[] = mealRatios.map(mealDef => {
    const mealTargetCal = targetCalories * mealDef.ratio;
    
    const selectedIngredients = getRandomItems(availableIngredients, mealDef.itemsCount);
    
    // Distribute calories evenly among selected ingredients for simplicity
    const calPerItem = mealTargetCal / selectedIngredients.length;
    
    const items: MealItem[] = selectedIngredients.map(ing => {
      // Calculate weight based on target calories for this item
      const weightInGrams = Math.round((calPerItem / ing.caloriesPer100g) * 100);
      const multiplier = weightInGrams / 100;
      
      return {
        ...ing,
        weightInGrams,
        totalCalories: Math.round(ing.caloriesPer100g * multiplier),
        totalPrice: Math.round(ing.pricePer100g * multiplier),
        totalProtein: Number((ing.proteinPer100g * multiplier).toFixed(1)),
        totalFat: Number((ing.fatPer100g * multiplier).toFixed(1)),
        totalCarbs: Number((ing.carbsPer100g * multiplier).toFixed(1)),
      };
    });

    const mealCalories = items.reduce((sum, item) => sum + item.totalCalories, 0);
    const mealPrice = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const mealProtein = Number(items.reduce((sum, item) => sum + item.totalProtein, 0).toFixed(1));
    const mealFat = Number(items.reduce((sum, item) => sum + item.totalFat, 0).toFixed(1));
    const mealCarbs = Number(items.reduce((sum, item) => sum + item.totalCarbs, 0).toFixed(1));

    return {
      name: mealDef.name,
      items,
      totalCalories: mealCalories,
      totalPrice: mealPrice,
      totalMacros: {
        protein: mealProtein,
        fat: mealFat,
        carbs: mealCarbs
      }
    };
  });

  const totalCalories = meals.reduce((sum, m) => sum + m.totalCalories, 0);
  const totalPrice = meals.reduce((sum, m) => sum + m.totalPrice, 0);
  const totalProtein = Number(meals.reduce((sum, m) => sum + m.totalMacros.protein, 0).toFixed(1));
  const totalFat = Number(meals.reduce((sum, m) => sum + m.totalMacros.fat, 0).toFixed(1));
  const totalCarbs = Number(meals.reduce((sum, m) => sum + m.totalMacros.carbs, 0).toFixed(1));

  return {
    meals,
    totalCalories,
    totalPrice,
    totalMacros: {
      protein: totalProtein,
      fat: totalFat,
      carbs: totalCarbs
    }
  };
}
