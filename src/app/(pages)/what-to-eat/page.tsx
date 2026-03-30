'use client'

import React, { useState } from 'react'
import ProfileForm, { UserProfile } from './components/ProfileForm'
import MealPlanResult, { AIMealPlan } from './components/MealPlanResult'
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  getBMIInfo,
  calculateMacroTargets,
  BMIInfo,
  MacroRatios,
  MacroTargetsGram,
} from './utils/calculator'
import { getRecentMeals, addRecentMeals } from './utils/storage'
import { FiLoader, FiAlertTriangle } from 'react-icons/fi'

export default function WhatToEatPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [tdee, setTdee] = useState(0)
  const [targetCalories, setTargetCalories] = useState(0)
  const [mealPlan, setMealPlan] = useState<AIMealPlan | null>(null)
  const [bmiInfo, setBmiInfo] = useState<BMIInfo | null>(null)
  const [macroTargets, setMacroTargets] = useState<MacroTargetsGram | null>(null)
  const [appliedMacroRatios, setAppliedMacroRatios] = useState<MacroRatios | null>(null)

  const handleGeneratePlan = async (profile: UserProfile) => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    setIsLoading(true)
    setErrorMsg('')

    // 1. Tính BMR → TDEE
    const bmr = calculateBMR(profile.gender, profile.weight, profile.height, profile.age)
    const calculatedTdee = calculateTDEE(bmr, profile.activityLevel)

    // 2. Tính target calories theo deficit do người dùng chọn
    const target = calculateTargetCalories(calculatedTdee, profile.deficit)

    // 3. Tính BMI và mục tiêu macro (hoàn toàn trên client, không phụ thuộc AI)
    const bmi = getBMIInfo(profile.weight, profile.height)
    const macros = calculateMacroTargets(target, profile.macroRatios)

    setTdee(calculatedTdee)
    setTargetCalories(target)
    setBmiInfo(bmi)
    setMacroTargets(macros)
    setAppliedMacroRatios(profile.macroRatios)

    // 4. Gọi API AI với blacklist + macroRatios
    const recentMeals = getRecentMeals()

    try {
      const response = await fetch('/api/generate-meal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetCalories: target,
          tier: profile.budgetTier,
          recentMeals,
          macroRatios: profile.macroRatios,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meal plan')
      }

      // Lưu món mới vào blacklist localStorage
      const generatedDishes = data.meals.map((m: { dishName: string }) => m.dishName)
      addRecentMeals(generatedDishes)

      setMealPlan(data)
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : 'Có lỗi xảy ra khi gọi AI. Vui lòng thử lại.'
      console.error(error)
      setErrorMsg(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setMealPlan(null)
    setErrorMsg('')
    setBmiInfo(null)
    setMacroTargets(null)
    setAppliedMacroRatios(null)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const canShowResult = !isLoading && mealPlan && !errorMsg && bmiInfo && macroTargets && appliedMacroRatios

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 animate-in fade-in duration-500">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-7xl !leading-[70px] lg:!leading-[90px] tight font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 mb-6 drop-shadow-sm">
            Ăn gì hôm nay?
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
            Hệ thống AI phân tích BMI, TDEE, phân bổ macro cá nhân hóa và tự động tránh lặp món để thiết kế thực đơn tối ưu mỗi ngày.
          </p>
        </div>

        <div className="mt-8 transition-all duration-500 relative">

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center p-12 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-w-2xl mx-auto animate-in zoom-in-95 duration-500">
              <FiLoader className="text-6xl text-emerald-400 animate-spin mb-6" />
              <h3 className="text-2xl font-bold text-white mb-3">Đang kết nối với AI...</h3>
              <p className="text-gray-400 text-center text-sm">
                Đang phân tích chỉ số BMI, TDEE, phân bổ macro dinh dưỡng và lịch sử ăn uống của bạn...
              </p>
            </div>
          )}

          {/* Error state */}
          {!isLoading && errorMsg && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-3xl p-8 max-w-2xl mx-auto mb-8 text-center animate-in zoom-in-95 duration-500">
              <FiAlertTriangle className="text-4xl text-red-500 mx-auto mb-4" />
              <p className="text-red-400 font-medium text-lg mb-6">{errorMsg}</p>
              <button
                onClick={() => setErrorMsg('')}
                className="px-6 py-3 bg-red-500/20 text-red-300 font-bold rounded-xl hover:bg-red-500/30 transition-colors"
              >
                Nhập Lại Thông Tin
              </button>
            </div>
          )}

          {/* Form */}
          {!isLoading && !mealPlan && !errorMsg && (
            <ProfileForm onSubmit={handleGeneratePlan} />
          )}

          {/* Result */}
          {canShowResult && (
            <MealPlanResult
              tdee={tdee}
              targetCalories={targetCalories}
              plan={mealPlan!}
              bmiInfo={bmiInfo!}
              macroTargets={macroTargets!}
              macroRatios={appliedMacroRatios!}
              onReset={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  )
}
