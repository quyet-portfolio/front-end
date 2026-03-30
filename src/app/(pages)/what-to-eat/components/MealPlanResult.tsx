import React from 'react'
import { FiActivity, FiClock, FiArrowRight, FiCheckCircle } from 'react-icons/fi'
import type { BMIInfo, MacroRatios, MacroTargetsGram } from '../utils/calculator'

export interface AIMealPlan {
  meals: {
    type: string
    dishName: string
    ingredients: {
      name: string
      weightGram: number
    }[]
    totalCalories: number
  }[]
  dailyTotalCalories: number
  appliedTheme: string
}

interface MealPlanResultProps {
  tdee: number
  targetCalories: number
  plan: AIMealPlan
  bmiInfo: BMIInfo
  macroTargets: MacroTargetsGram
  macroRatios: MacroRatios
  onReset: () => void
}

// Static Tailwind class maps — required to prevent Tailwind purging dynamic classes
const BMI_STYLES = {
  blue: {
    card: 'bg-blue-500/10 border-blue-500/20',
    iconWrap: 'bg-blue-500/20 border-blue-500/30',
    icon: 'text-blue-400',
    value: 'text-blue-400',
    badge: 'bg-blue-500/20 text-blue-300 border border-blue-500/30',
  },
  green: {
    card: 'bg-emerald-500/10 border-emerald-500/20',
    iconWrap: 'bg-emerald-500/20 border-emerald-500/30',
    icon: 'text-emerald-400',
    value: 'text-emerald-400',
    badge: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30',
  },
  yellow: {
    card: 'bg-yellow-500/10 border-yellow-500/20',
    iconWrap: 'bg-yellow-500/20 border-yellow-500/30',
    icon: 'text-yellow-400',
    value: 'text-yellow-400',
    badge: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
  },
  red: {
    card: 'bg-red-500/10 border-red-500/20',
    iconWrap: 'bg-red-500/20 border-red-500/30',
    icon: 'text-red-400',
    value: 'text-red-400',
    badge: 'bg-red-500/20 text-red-300 border border-red-500/30',
  },
} as const

// BMI icon: a simple scale indicator SVG
function BmiIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  )
}

export default function MealPlanResult({ tdee, targetCalories, plan, bmiInfo, macroTargets, macroRatios, onReset }: MealPlanResultProps) {
  const bmiStyle = BMI_STYLES[bmiInfo.color]
  const totalMacroGrams = macroTargets.protein + macroTargets.carb + macroTargets.fat

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ─── Header Stats: TDEE / Target / BMI ─── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">

        {/* TDEE */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 flex items-center shadow-xl hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mr-4 border border-blue-500/30 shrink-0">
            <FiActivity className="text-blue-400 text-xl" />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium mb-1">TDEE (Nhu cầu cơ bản)</p>
            <p className="text-2xl font-bold text-white tracking-tight">
              {Math.round(tdee)} <span className="text-xs font-medium text-gray-500">kcal</span>
            </p>
          </div>
        </div>

        {/* Target Calories */}
        <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 backdrop-blur-xl rounded-2xl p-6 border border-emerald-500/30 flex items-center shadow-emerald-500/10 shadow-xl hover:-translate-y-1 transition-transform duration-300">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center mr-4 border border-emerald-500/40 shrink-0">
            <FiClock className="text-emerald-400 text-xl" />
          </div>
          <div>
            <p className="text-emerald-400/80 text-xs font-medium mb-1">Mục tiêu AI (±100 kcal)</p>
            <p className="text-2xl font-bold text-emerald-400 tracking-tight">
              {targetCalories} <span className="text-xs font-medium opacity-70">kcal</span>
            </p>
          </div>
        </div>

        {/* BMI */}
        <div className={`backdrop-blur-xl rounded-2xl p-6 border flex items-center shadow-xl hover:-translate-y-1 transition-transform duration-300 ${bmiStyle.card}`}>
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mr-4 border shrink-0 ${bmiStyle.iconWrap}`}>
            <BmiIcon className={`w-5 h-5 ${bmiStyle.icon}`} />
          </div>
          <div>
            <p className="text-gray-400 text-xs font-medium mb-1">Chỉ số BMI</p>
            <div className="flex items-baseline gap-2">
              <p className={`text-2xl font-bold tracking-tight ${bmiStyle.value}`}>{bmiInfo.value}</p>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${bmiStyle.badge}`}>
                {bmiInfo.category}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Macro Distribution Bar ─── */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl">
        <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-4">
          Phân bổ Macro mục tiêu
        </p>

        {/* Progress bar */}
        <div className="flex h-3 rounded-full overflow-hidden gap-px mb-5">
          <div
            className="bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-l-full transition-all duration-700"
            style={{ width: `${macroRatios.protein}%` }}
          />
          <div
            className="bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-700"
            style={{ width: `${macroRatios.carb}%` }}
          />
          <div
            className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-r-full transition-all duration-700"
            style={{ width: `${macroRatios.fat}%` }}
          />
        </div>

        {/* Macro breakdown */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 inline-block" />
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Protein</span>
            </div>
            <p className="text-2xl font-black text-emerald-400">{macroTargets.protein}<span className="text-sm font-medium text-gray-500 ml-1">g</span></p>
            <p className="text-xs text-gray-500 mt-0.5">{macroRatios.protein}% · {Math.round(macroTargets.protein / totalMacroGrams * 100)}% tổng g</p>
          </div>
          <div className="text-center border-x border-white/10">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 inline-block" />
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Carb</span>
            </div>
            <p className="text-2xl font-black text-blue-400">{macroTargets.carb}<span className="text-sm font-medium text-gray-500 ml-1">g</span></p>
            <p className="text-xs text-gray-500 mt-0.5">{macroRatios.carb}% · {Math.round(macroTargets.carb / totalMacroGrams * 100)}% tổng g</p>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1.5 mb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-400 inline-block" />
              <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Fat</span>
            </div>
            <p className="text-2xl font-black text-purple-400">{macroTargets.fat}<span className="text-sm font-medium text-gray-500 ml-1">g</span></p>
            <p className="text-xs text-gray-500 mt-0.5">{macroRatios.fat}% · {Math.round(macroTargets.fat / totalMacroGrams * 100)}% tổng g</p>
          </div>
        </div>
      </div>

      {/* ─── Applied Theme Badge ─── */}
      <div className="flex justify-center">
        <div className="bg-white/10 px-6 py-2 rounded-full border border-white/20 text-emerald-300 flex items-center gap-2 font-medium text-sm">
          <FiCheckCircle />
          Chủ đề AI chọn: <span className="text-white ml-1">{plan.appliedTheme}</span>
        </div>
      </div>

      {/* ─── Meals Grid ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {plan.meals.map((meal, index) => (
          <div key={index} className="bg-white/5 backdrop-blur-xl rounded-3xl p-6 border border-white/10 shadow-2xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col h-full group">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
              <h3 className="text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">Bữa {meal.type}</h3>
              <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-lg text-sm font-bold border border-emerald-500/30">
                {meal.totalCalories} kcal
              </span>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                {meal.dishName}
              </h4>
            </div>

            <div className="flex-1 space-y-3">
              <p className="text-xs text-gray-400 uppercase tracking-widest font-semibold mb-2">Thành phần nguyên liệu</p>
              {meal.ingredients.map((item, idx) => (
                <div key={idx} className="bg-black/30 rounded-2xl md:rounded-xl p-3 flex justify-between items-center border border-white/5 hover:bg-black/40 transition-colors">
                  <p className="font-semibold text-gray-200 flex-1 pr-4">{item.name}</p>
                  <p className="font-bold text-emerald-400 shrink-0">{item.weightGram}g</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ─── Summary Footer ─── */}
      <div className="bg-gradient-to-r from-[#0a1f18] to-[#0d2a21] backdrop-blur-xl rounded-3xl p-8 border border-emerald-500/20 text-center shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -translate-x-1/2 translate-y-1/2" />

        <div className="relative z-10 flex flex-col items-center">
          <p className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 mb-2 flex items-center justify-center gap-2">
            {plan.dailyTotalCalories} <span className="text-2xl mt-4 font-bold text-emerald-400/70">kcal</span>
          </p>
          <p className="text-sm text-gray-500 mb-6">
            P: {macroTargets.protein}g · C: {macroTargets.carb}g · F: {macroTargets.fat}g
          </p>
          <p className="text-sm text-gray-400 italic mb-8 max-w-2xl mx-auto">
            * Thực đơn được Generative AI tối ưu dựa trên mục tiêu giảm cân, hồ sơ cá nhân và phân bổ macro của bạn. Các món ăn này đã được thêm vào lịch sử để tránh AI lặp lại vào ngày mai!
          </p>

          <button
            onClick={onReset}
            className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-300 bg-emerald-600/20 border border-emerald-500/50 rounded-2xl hover:bg-emerald-500 hover:border-emerald-500 hover:shadow-[0_0_30px_rgba(16,185,129,0.3)] overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black" />
            <span className="relative flex items-center gap-2">
              Lên Thực Đơn Ngày Mới <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </div>

    </div>
  )
}
