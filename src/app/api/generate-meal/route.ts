import { NextResponse } from 'next/server'

// Danh sách chủ đề ẩm thực, được mở rộng để tăng đa dạng
const CUISINE_THEMES = [
  'Món Việt truyền thống ít dầu mỡ (canh, luộc, hấp)',
  'Eat Clean kiểu Tây (salad, ức gà, quinoa...)',
  'Ẩm thực Á Đông thanh đạm (Nhật, Hàn, Thái)',
  'Salad và món nướng không dầu',
  'Món chay / Plant-based (đậu phụ, nấm, rau củ)',
  'Thực đơn giàu protein cho người tập gym',
  'Món Địa Trung Hải (cá, olive, rau lá xanh)',
]

// Giới hạn và làm sạch danh sách món ăn gần đây từ client để chống prompt injection
function sanitizeRecentMeals(rawMeals: unknown): string[] {
  if (!Array.isArray(rawMeals)) return []

  return rawMeals
    .filter((item): item is string => typeof item === 'string')
    .map((item) =>
      item
        .replace(/[`"'[\]{}\\]/g, '') // Xoá ký tự nguy hiểm cho prompt
        .trim()
        .slice(0, 60), // Giới hạn độ dài mỗi tên món
    )
    .filter((item) => item.length > 0)
    .slice(0, 15) // Giới hạn số lượng tối đa
}

// Tính calo mục tiêu cho từng bữa dựa theo tỷ lệ chuẩn dinh dưỡng
function getMealCalorieDistribution(totalCalories: number) {
  return {
    breakfast: Math.round(totalCalories * 0.25),
    lunch: Math.round(totalCalories * 0.4),
    dinner: Math.round(totalCalories * 0.35),
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { targetCalories, tier, recentMeals, macroRatios } = body

    // --- Validation ---
    if (!targetCalories || typeof targetCalories !== 'number' || targetCalories < 800 || targetCalories > 4000) {
      return NextResponse.json({ error: 'Giá trị targetCalories không hợp lệ (800–4000 kcal).' }, { status: 400 })
    }

    const validTiers = ['Tiết kiệm', 'Tiêu chuẩn', 'Cao cấp']
    if (!tier || !validTiers.includes(tier)) {
      return NextResponse.json({ error: 'Giá trị tier không hợp lệ.' }, { status: 400 })
    }

    // Validate macroRatios nếu được gửi lên
    const resolvedMacros =
      macroRatios &&
      typeof macroRatios.protein === 'number' &&
      typeof macroRatios.carb === 'number' &&
      typeof macroRatios.fat === 'number' &&
      macroRatios.protein + macroRatios.carb + macroRatios.fat === 100
        ? macroRatios
        : { protein: 30, carb: 40, fat: 30 } // Fallback về mặc định Cân bằng

    const API_KEY = process.env.GEMINI_API_KEY
    if (!API_KEY) {
      return NextResponse.json({ error: 'Hệ thống thiếu cấu hình GEMINI_API_KEY.' }, { status: 500 })
    }

    // --- Chuẩn bị dữ liệu ---
    const selectedTheme = CUISINE_THEMES[Math.floor(Math.random() * CUISINE_THEMES.length)]
    const sanitizedRecentMeals = sanitizeRecentMeals(recentMeals)
    const { breakfast, lunch, dinner } = getMealCalorieDistribution(targetCalories)

    // Tính gram macro mục tiêu (Protein & Carb: 4 kcal/g | Fat: 9 kcal/g)
    const macroGrams = {
      protein: Math.round((targetCalories * (resolvedMacros.protein / 100)) / 4),
      carb: Math.round((targetCalories * (resolvedMacros.carb / 100)) / 4),
      fat: Math.round((targetCalories * (resolvedMacros.fat / 100)) / 9),
    }

    const blacklistSection =
      sanitizedRecentMeals.length > 0
        ? `DANH SÁCH MÓN CẤM (BLACKLIST): Người dùng đã ăn gần đây: [${sanitizedRecentMeals.join(', ')}].
Quy tắc BẮT BUỘC: KHÔNG được đề xuất bất kỳ món nào có tên hoặc nguyên liệu chính giống với danh sách trên. Hãy sáng tạo các món hoàn toàn khác biệt.`
        : 'Không có lịch sử món ăn. Hãy tự do sáng tạo thực đơn đa dạng.'

    // --- System Prompt được tối ưu ---
    const systemPrompt = `Bạn là một chuyên gia dinh dưỡng người Việt Nam. Nhiệm vụ của bạn là thiết kế thực đơn giảm cân 1 ngày gồm 3 bữa: Sáng, Trưa, Tối. Tất cả tên món, nguyên liệu và mô tả PHẢI bằng tiếng Việt.

=== THÔNG SỐ THỰC ĐƠN ===
- Tổng calo mục tiêu: ${targetCalories} kcal/ngày (sai số cho phép ±100 kcal)
- Phân bổ calo theo bữa (BẮT BUỘC tuân thủ):
  + Bữa Sáng: ~${breakfast} kcal (25%)
  + Bữa Trưa: ~${lunch} kcal (40%)
  + Bữa Tối: ~${dinner} kcal (35%)
- Ngân sách / mức độ nguyên liệu: ${tier}
  + "Tiết kiệm": Dùng nguyên liệu dân dã, giá rẻ, dễ mua (trứng, đậu phụ, rau muống, gạo lứt...)
  + "Tiêu chuẩn": Nguyên liệu đa dạng, phổ thông (ức gà, cá, rau đa dạng, ngũ cốc...)
  + "Cao cấp": Nguyên liệu cao cấp khuyến khích (cá hồi, bò Úc, hạt chia, quinoa...)
- Chủ đề ẩm thực hôm nay: ${selectedTheme}

=== PHÂN BỔ MACRO DINH DƯỠNG (BẮT BUỘC cân nhắc khi chọn nguyên liệu) ===
- Protein: ${resolvedMacros.protein}% → mục tiêu ~${macroGrams.protein}g/ngày
- Carbohydrate: ${resolvedMacros.carb}% → mục tiêu ~${macroGrams.carb}g/ngày
- Chất béo lành mạnh: ${resolvedMacros.fat}% → mục tiêu ~${macroGrams.fat}g/ngày
Gợi ý lựa chọn nguyên liệu theo macro: Protein cao → ưu tiên ức gà, cá, trứng, đậu phụ. Ít Carb → giảm cơm/bánh mì, tăng rau xanh và chất béo lành mạnh (bơ, dầu olive, hạt).

=== YÊU CẦU VỀ NGUYÊN LIỆU ===
- Số lượng nguyên liệu mỗi bữa: Sáng 2–3 món, Trưa 3–4 món, Tối 3–4 món
- Mỗi nguyên liệu phải có khối lượng cụ thể (gram) thực tế, phù hợp để nấu tại nhà
- Ưu tiên các món đơn giản, có thể tự nấu tại nhà, không quá phức tạp
- KHÔNG đề xuất món ăn ngoài hàng cao cấp hoặc quá khó chế biến

=== ${blacklistSection} ===

=== ĐỊNH DẠNG OUTPUT (JSON NGHIÊM NGẶT) ===
Chỉ trả về một JSON object hợp lệ theo cấu trúc sau, không kèm bất kỳ văn bản giải thích nào:
{
  "meals": [
    {
      "type": "Sáng",
      "dishName": "Tên món ăn bằng tiếng Việt",
      "ingredients": [
        { "name": "Tên nguyên liệu", "weightGram": 100 }
      ],
      "totalCalories": ${breakfast}
    },
    {
      "type": "Trưa",
      "dishName": "Tên món ăn bằng tiếng Việt",
      "ingredients": [
        { "name": "Tên nguyên liệu", "weightGram": 150 }
      ],
      "totalCalories": ${lunch}
    },
    {
      "type": "Tối",
      "dishName": "Tên món ăn bằng tiếng Việt",
      "ingredients": [
        { "name": "Tên nguyên liệu", "weightGram": 120 }
      ],
      "totalCalories": ${dinner}
    }
  ],
  "dailyTotalCalories": ${targetCalories},
  "appliedTheme": "Tên chủ đề ẩm thực đã áp dụng"
}
Lưu ý: Giá trị "type" chỉ được là một trong ba giá trị: "Sáng", "Trưa", hoặc "Tối".`

    // --- Gọi Gemini API ---
    const model = 'gemini-2.5-flash'
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts: [{ text: 'Hãy thiết kế thực đơn theo đúng thông số và xuất ra JSON.' }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] },
        generationConfig: {
          temperature: 0.75, // Giảm nhẹ để output ổn định hơn, vẫn đủ đa dạng
          responseMimeType: 'application/json',
        },
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = (errorData as { error?: { message?: string } }).error?.message || 'Gemini API từ chối phản hồi.'
      console.error('Gemini API Error:', errorData)
      return NextResponse.json({ error: errorMessage }, { status: response.status })
    }

    const data = await response.json()
    const candidateText = (data as { candidates?: { content?: { parts?: { text?: string }[] } }[] }).candidates?.[0]?.content
      ?.parts?.[0]?.text

    if (!candidateText) {
      return NextResponse.json({ error: 'AI không trả về nội dung hợp lệ.' }, { status: 500 })
    }

    // --- Parse JSON với error handling riêng biệt ---
    try {
      const mealPlan = JSON.parse(candidateText)
      return NextResponse.json(mealPlan, { status: 200 })
    } catch {
      console.error('JSON Parse Error. Raw AI output:', candidateText)
      return NextResponse.json({ error: 'AI trả về dữ liệu không đúng định dạng. Vui lòng thử lại.' }, { status: 502 })
    }
  } catch (error) {
    console.error('API Route Error:', error)
    return NextResponse.json({ error: 'Lỗi máy chủ khi kết nối với AI.' }, { status: 500 })
  }
}
