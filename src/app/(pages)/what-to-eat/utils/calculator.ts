export type Gender = 'male' | 'female'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active'
export type WeightLossDeficit = 300 | 400 | 500

// ─── Mifflin-St Jeor BMR ──────────────────────────────────────────────────────
export function calculateBMR(gender: Gender, weight: number, height: number, age: number): number {
  const base = 10 * weight + 6.25 * height - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

// ─── TDEE ─────────────────────────────────────────────────────────────────────
export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): number {
  const multipliers: Record<ActivityLevel, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
  }
  return bmr * multipliers[activityLevel]
}

// ─── Target Calories with safe deficit ──────────────────────────────────────
export function calculateTargetCalories(tdee: number, deficit: WeightLossDeficit = 400): number {
  return Math.max(1200, Math.round(tdee - deficit))
}

// ─── BMI ──────────────────────────────────────────────────────────────────────
export type BMIColor = 'blue' | 'green' | 'yellow' | 'red'

export interface BMIInfo {
  value: number
  category: string
  color: BMIColor
}

export function getBMIInfo(weight: number, height: number): BMIInfo {
  const heightM = height / 100
  const bmi = parseFloat((weight / (heightM * heightM)).toFixed(1))

  if (bmi < 18.5) return { value: bmi, category: 'Thiếu cân', color: 'blue' }
  if (bmi < 25.0) return { value: bmi, category: 'Bình thường', color: 'green' }
  if (bmi < 30.0) return { value: bmi, category: 'Thừa cân', color: 'yellow' }
  return { value: bmi, category: 'Béo phì', color: 'red' }
}

// ─── Macro Distribution ───────────────────────────────────────────────────────
export interface MacroRatios {
  protein: number // percentage 0–100
  carb: number
  fat: number
}

export interface MacroTargetsGram {
  protein: number
  carb: number
  fat: number
}

export interface MacroPreset {
  label: string
  description: string // e.g. "Protein 30% / Carb 40% / Fat 30%"
  ratios: MacroRatios
}

export const MACRO_PRESETS: MacroPreset[] = [
  {
    label: 'Cân bằng',
    description: 'Protein 30% / Carb 40% / Fat 30%',
    ratios: { protein: 30, carb: 40, fat: 30 },
  },
  {
    label: 'Nhiều Protein',
    description: 'Protein 40% / Carb 35% / Fat 25%',
    ratios: { protein: 40, carb: 35, fat: 25 },
  },
  {
    label: 'Ít Carb',
    description: 'Protein 35% / Carb 25% / Fat 40%',
    ratios: { protein: 35, carb: 25, fat: 40 },
  },
]

export const DEFAULT_MACRO_RATIOS: MacroRatios = MACRO_PRESETS[0].ratios

/**
 * Chuyển đổi tỉ lệ % sang gram thực tế:
 * Protein & Carb = 4 kcal/g | Fat = 9 kcal/g
 */
export function calculateMacroTargets(targetCalories: number, ratios: MacroRatios): MacroTargetsGram {
  return {
    protein: Math.round((targetCalories * (ratios.protein / 100)) / 4),
    carb: Math.round((targetCalories * (ratios.carb / 100)) / 4),
    fat: Math.round((targetCalories * (ratios.fat / 100)) / 9),
  }
}
