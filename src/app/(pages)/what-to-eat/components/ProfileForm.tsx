import React, { useState } from 'react'
import { ActivityLevel, Gender, WeightLossDeficit, MacroRatios, MACRO_PRESETS, DEFAULT_MACRO_RATIOS } from '../utils/calculator'
import { BudgetTier } from '../utils/generateMealPlan'

export interface UserProfile {
  gender: Gender
  age: number
  weight: number
  height: number
  activityLevel: ActivityLevel
  budgetTier: BudgetTier
  deficit: WeightLossDeficit
  macroRatios: MacroRatios
}

interface ProfileFormProps {
  onSubmit: (profile: UserProfile) => void
}

const DEFICIT_OPTIONS: { value: WeightLossDeficit; label: string; tag: string; desc: string }[] = [
  { value: 300, label: 'Nhẹ nhàng', tag: '-300 kcal', desc: 'Dễ duy trì lâu dài' },
  { value: 400, label: 'Vừa phải', tag: '-400 kcal', desc: 'Cân bằng & hiệu quả' },
  { value: 500, label: 'Nhanh hơn', tag: '-500 kcal', desc: 'Tốc độ giảm cân cao' },
]

export default function ProfileForm({ onSubmit }: ProfileFormProps) {
  const [formData, setFormData] = useState<UserProfile>({
    gender: 'male',
    age: 25,
    weight: 65,
    height: 170,
    activityLevel: 'sedentary',
    budgetTier: 'Tiêu chuẩn',
    deficit: 400,
    macroRatios: DEFAULT_MACRO_RATIOS,
  })

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
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
            >
              <option value="male" className="text-gray-900">Nam</option>
              <option value="female" className="text-gray-900">Nữ</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Tuổi (năm)</label>
            <input
              type="number" name="age" min="10" max="100" required
              value={formData.age} onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Cân nặng (kg)</label>
            <input
              type="number" name="weight" min="30" max="200" step="0.1" required
              value={formData.weight} onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Chiều cao (cm)</label>
            <input
              type="number" name="height" min="100" max="250" required
              value={formData.height} onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all font-medium"
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Mức độ hoạt động</label>
            <select
              name="activityLevel" value={formData.activityLevel} onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
            >
              <option value="sedentary" className="text-gray-900">Ít vận động (nhân viên văn phòng)</option>
              <option value="light" className="text-gray-900">Vận động nhẹ (1-3 ngày/tuần)</option>
              <option value="moderate" className="text-gray-900">Vận động vừa (3-5 ngày/tuần)</option>
              <option value="active" className="text-gray-900">Vận động nhiều (6-7 ngày/tuần)</option>
            </select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-300">Ngân sách dự kiến / ngày</label>
            <select
              name="budgetTier" value={formData.budgetTier} onChange={handleChange}
              className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all appearance-none"
            >
              <option value="Tiết kiệm" className="text-gray-900">Tiết kiệm (Phù hợp học sinh, sinh viên)</option>
              <option value="Tiêu chuẩn" className="text-gray-900">Tiêu chuẩn (Phổ thông, dân văn phòng)</option>
              <option value="Cao cấp" className="text-gray-900">Cao cấp (Nguyên liệu cao cấp, cá hồi, bò úc)</option>
            </select>
          </div>
        </div>

        {/* ─── Tốc độ giảm cân (Deficit) ───────────────────────────────── */}
        <div className="space-y-3">
          <div>
            <label className="text-sm font-semibold text-gray-200">Tốc độ giảm cân</label>
            <p className="text-xs text-gray-500 mt-0.5">Mức thâm hụt calo an toàn mỗi ngày (−300 đến −500 kcal)</p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {DEFICIT_OPTIONS.map((opt) => {
              const isActive = formData.deficit === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, deficit: opt.value }))}
                  className={`flex flex-col items-center p-3 rounded-xl border text-center transition-all duration-200 ${isActive
                      ? 'bg-emerald-500/20 border-emerald-500/60 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
                      : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                >
                  <span className={`font-bold text-sm ${isActive ? 'text-emerald-400' : 'text-gray-300'}`}>
                    {opt.label}
                  </span>
                  <span className={`text-xs font-mono mt-1 ${isActive ? 'text-emerald-300' : 'text-gray-500'}`}>
                    {opt.tag}
                  </span>
                  <span className="text-xs text-gray-500 mt-1 leading-tight hidden sm:block">{opt.desc}</span>
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
