import { GoogleGenAI, Type, Schema } from "@google/genai"

export const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY })

export const blueprintSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    difficultyLevel: { type: Type.STRING, description: "Mức độ chung: Dễ, Trung Bình, Khó..." },
    targetGrade: { type: Type.INTEGER, description: "Khối 6,7,8,9" },
    examPurpose: { type: Type.STRING, description: "Đề chuẩn, Giữa kỳ, Học kỳ,..." },
    totalQuestions: { type: Type.INTEGER },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          sectionName: { type: Type.STRING },
          questionType: { type: Type.STRING, description: "Trắc nghiệm, Tự luận, Chọn từ,..." },
          questionCount: { type: Type.INTEGER },
          totalPoints: { type: Type.NUMBER },
          sampleQuestionFormat: { type: Type.STRING, description: "Mẫu câu hỏi ví dụ" }
        },
      },
    },
  },
}

export const analyzeBlueprint = async (examText: string, gradeLevel: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-lite",
    contents: `Hãy phân tích nội dung đề thi học sinh khối ${gradeLevel} trung học cơ sở sau đây và trích xuất cấu trúc đề thi thành Blueprint JSON với các thông số định dạng y hệt Schema được cấp.\n\nNội dung đề thi:\n${examText}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: blueprintSchema,
      temperature: 0.1,
    },
  })
  
  try {
    return JSON.parse(response.text || "{}")
  } catch (e) {
    throw new Error("Gemini trả về chuỗi JSON không hợp lệ.")
  }
}
