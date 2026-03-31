import React, { useState, useEffect, useMemo } from 'react'
import { FiChevronDown } from 'react-icons/fi'
import {
  ActivityLevel,
  Gender,
  WeightLossDeficit,
  MacroRatios,
  MACRO_PRESETS,
  DEFAULT_MACRO_RATIOS,
  getBMIInfo,
  BMIInfo,
} from '../utils/calculator'
import { BudgetTier } from '../utils/generateMealPlan'
import { saveUserProfile, loadUserProfile } from '../utils/storage'
import { CUISINE_THEMES } from '../utils/constants'

export interface UserProfile {
  gender: Gender
  age: number
  weight: number
  height: number
  activityLevel: ActivityLevel
  budgetTier: BudgetTier
  deficit: WeightLossDeficit
  macroRatios: MacroRatios
  cuisineTheme: string
}

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void
}

const DEFAULT_PROFILE: UserProfile = {
  gender: 'male',
  age: 25,
  weight: 65,
  height: 170,
  activityLevel: 'sedentary',
  budgetTier: 'Tiêu chuẩn',
  deficit: 400,
  macroRatios: DEFAULT_MACRO_RATIOS,
  cuisineTheme: 'Ngẫu nhiên',
}

const DEFICIT_OPTIONS: { value: WeightLossDeficit; label: string; tag: string; desc: string }[] = [
  { value: 300, label: 'Nhẹ nhàng', tag: '-300 kcal', desc: 'Dễ duy trì lâu dài' },
  { value: 400, label: 'Vừa phải', tag: '-400 kcal', desc: 'Cân bằng & hiệu quả' },
  { value: 500, label: 'Nhanh hơn', tag: '-500 kcal', desc: 'Tốc độ giảm cân cao' },
]

// Static Tailwind class maps — prevent purge of dynamic BMI color classes
const BMI_BADGE_STYLES = {
  blue: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  green: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  yellow: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  red: 'bg-red-500/20 text-red-300 border-red-500/30',
} as const

// Shared Tailwind for all custom selects — extracted for DRY
const SELECT_CLASS =
  'w-full bg-white/10 border border-white/20 rounded-xl pl-4 pr-10 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none'
const INPUT_CLASS =
  'w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium'

/** Wrapper component for selects that adds a custom chevron icon */
function SelectWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
    </div>
  )
}

export default function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>(DEFAULT_PROFILE)
  const [hydrated, setHydrated] = useState(false)

  // Load saved profile from localStorage on mount
  useEffect(() => {
    const saved = loadUserProfile<UserProfile>()
    if (saved) {
      setFormData((prev) => ({ ...prev, ...saved }))
    }
    setHydrated(true)
  }, [])

  // Persist profile to localStorage whenever formData changes (after hydration)
  useEffect(() => {
    if (hydrated) {
      saveUserProfile(formData)
    }
  }, [formData, hydrated])

  // ─── Live BMI Preview ──────────────────────────────────────────────────────
  const liveBmi: BMIInfo | null = useMemo(() => {
    if (formData.weight >= 30 && formData.height >= 100) {
      return getBMIInfo(formData.weight, formData.height)
    }
    return null
  }, [formData.weight, formData.height])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: ['age', 'weight', 'height'].includes(name) ? Number(value) : value,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  const isActivePreset = (preset: MacroRatios) =>
    formData.macroRatios.protein === preset.protein &&
    formData.macroRatios.carb === preset.carb &&
    formData.macroRatios.fat === preset.fat

  return (
    <div className="bg-white/5 backdrop-blur-md rounded-2xl p-6 md:p-8 shadow-2xl border border-white/10 w-full max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-emerald-400 mb-8 text-center">Xác định chỉ số cơ thể</h2>
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* ─── Thông tin cơ bản ────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Giới tính</label>
            <SelectWrapper>
              <select name="gender" value={formData.gender} onChange={handleChange} className={SELECT_CLASS}>
                <option value="male" className="text-gray-900">Nam</option>
                <option value="female" className="text-gray-900">Nữ</option>
              </select>
            </SelectWrapper>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tuổi (năm)</label>
            <input
              type="number" name="age" min="10" max="100" required
              value={formData.age} onChange={handleChange}
              className={INPUT_CLASS}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Cân nặng (kg)</label>
            <input
              type="number" name="weight" min="30" max="200" step="0.1" required
              value={formData.weight} onChange={handleChange}
              className={INPUT_CLASS}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Chiều cao (cm)</label>
            <input
              type="number" name="height" min="100" max="250" required
              value={formData.height} onChange={handleChange}
              className={INPUT_CLASS}
            />
          </div>

          {/* ─── Live BMI Badge ─── */}
          {liveBmi && (
            <div className="md:col-span-2 flex items-center justify-center animate-in fade-in duration-300">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold ${BMI_BADGE_STYLES[liveBmi.color]}`}>
                <span>BMI: {liveBmi.value}</span>
                <span className="opacity-70">·</span>
                <span>{liveBmi.category}</span>
              </div>
            </div>
          )}

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Mức độ hoạt động</label>
            <SelectWrapper>
              <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} className={SELECT_CLASS}>
                <option value="sedentary" className="text-gray-900">Ít vận động (nhân viên văn phòng)</option>
                <option value="light" className="text-gray-900">Vận động nhẹ (1-3 ngày/tuần)</option>
                <option value="moderate" className="text-gray-900">Vận động vừa (3-5 ngày/tuần)</option>
                <option value="active" className="text-gray-900">Vận động nhiều (6-7 ngày/tuần)</option>
              </select>
            </SelectWrapper>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Ngân sách dự kiến / ngày</label>
            <SelectWrapper>
              <select name="budgetTier" value={formData.budgetTier} onChange={handleChange} className={SELECT_CLASS}>
                <option value="Tiết kiệm" className="text-gray-900">Tiết kiệm (Phù hợp học sinh, sinh viên)</option>
                <option value="Tiêu chuẩn" className="text-gray-900">Tiêu chuẩn (Phổ thông, dân văn phòng)</option>
                <option value="Cao cấp" className="text-gray-900">Cao cấp (Nguyên liệu cao cấp, cá hồi, bò úc)</option>
              </select>
            </SelectWrapper>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Chủ đề ẩm thực</label>
            <SelectWrapper>
              <select name="cuisineTheme" value={formData.cuisineTheme} onChange={handleChange} className={SELECT_CLASS}>
                <option value="Ngẫu nhiên" className="text-gray-900">Ngẫu nhiên (AI tự chọn)</option>
                {CUISINE_THEMES.map((theme) => (
                  <option key={theme} value={theme} className="text-gray-900">
                    {theme}
                  </option>
                ))}
              </select>
            </SelectWrapper>
          </div>
        </div>

        {/* ─── Tốc độ giảm cân (Deficit) ───────────────────────────────── */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-200">Tốc độ giảm cân</label>
            <p className="text-xs text-gray-500 mt-0.5">Mức thâm hụt calo an toàn mỗi ngày (−300 đến −500 kcal)</p>
          </div>
          {/* grid-cols-3 on all screens — cards are compact enough */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {DEFICIT_OPTIONS.map((opt) => {
              const isActive = formData.deficit === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, deficit: opt.value }))}
                  className={`flex flex-col items-center p-2.5 sm:p-3 rounded-xl border text-center transition-all duration-200 ${isActive
                      ? 'bg-emerald-500/20 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                >
                  <span className={`font-bold text-xs sm:text-sm ${isActive ? 'text-emerald-400' : 'text-gray-300'}`}>
                    {opt.label}
                  </span>
                  <span className={`text-[10px] sm:text-xs font-mono mt-1 ${isActive ? 'text-emerald-300' : 'text-gray-500'}`}>
                    {opt.tag}
                  </span>
                  <span className="text-[10px] sm:text-xs text-gray-500 mt-1 leading-tight hidden sm:block">{opt.desc}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ─── Phân bổ Macro ───────────────────────────────────────────── */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-200">Phân bổ Macro dinh dưỡng</label>
            <p className="text-xs text-gray-500 mt-0.5">AI sẽ lựa chọn nguyên liệu phù hợp với mục tiêu dinh dưỡng của bạn</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {MACRO_PRESETS.map((preset) => {
              const isActive = isActivePreset(preset.ratios)
              return (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, macroRatios: preset.ratios }))}
                  className={`flex flex-col items-start p-4 rounded-xl border text-left transition-all duration-200 ${isActive
                      ? 'bg-teal-500/15 border-teal-500/50 shadow-[0_0_12px_rgba(20,184,166,0.15)]'
                      : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                >
                  <span className={`font-bold text-sm ${isActive ? 'text-teal-300' : 'text-gray-300'}`}>
                    {preset.label}
                  </span>
                  {/* Mini macro bar */}
                  <div className="flex w-full h-1.5 rounded-full overflow-hidden mt-2 gap-px">
                    <div className="bg-emerald-400 rounded-l-full" style={{ width: `${preset.ratios.protein}%` }} />
                    <div className="bg-blue-400" style={{ width: `${preset.ratios.carb}%` }} />
                    <div className="bg-purple-400 rounded-r-full" style={{ width: `${preset.ratios.fat}%` }} />
                  </div>
                  <span className="text-xs text-gray-500 mt-2">{preset.description}</span>
                </button>
              )
            })}
          </div>
          {/* Macro legend */}
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />Protein</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />Carb</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />Fat</span>
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold py-4 px-6 rounded-xl transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transform hover:-translate-y-1 active:scale-95"
        >
          Lên món ngay
        </button>
      </form>
    </div>
  )
}
