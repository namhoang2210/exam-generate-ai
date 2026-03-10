import { GoogleGenerativeAI, SchemaType as Type, Schema } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const blueprintSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    exam_meta: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING, description: "Tên đề thi trích xuất (VD: Đề thi học kì 1 Tiếng Anh 6)" },
        subject: { type: Type.STRING, description: "Mặc định là English" },
        target_country: { type: Type.STRING, description: "Mặc định là Vietnam" },
        target_school_level: { type: Type.STRING, description: "Mặc định là THCS" },
        duration_minutes: { type: Type.INTEGER, description: "Thời gian làm bài (phút)" },
        total_points: { type: Type.NUMBER, description: "Tổng điểm (thường là 10)" },
      },
      required: ["title", "subject", "duration_minutes", "total_points"]
    },
    sections: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          key: { type: Type.STRING, description: "Ký hiệu phần (VD: section_1)" },
          title: { type: Type.STRING, description: "Tiêu đề phần (VD: Language Focus)" },
          points: { type: Type.NUMBER, description: "Tổng điểm phần này" },
          question_groups: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                type: {
                  type: Type.STRING,
                  description: "pronunciation | stress | grammar_vocab_mcq | error_identification | dialogue_ordering | cloze_test | reading_comprehension | sentence_transformation | paragraph_writing"
                },
                count: { type: Type.INTEGER, description: "Số lượng câu hỏi" },
                question_format: { type: Type.STRING, description: "mcq_4_options | free_text | paragraph" }
              }
            }
          }
        }
      }
    },
    knowledge_scope: {
      type: Type.OBJECT,
      properties: {
        grammar_topics: { type: Type.ARRAY, items: { type: Type.STRING } },
        vocabulary_topics: { type: Type.ARRAY, items: { type: Type.STRING } },
        reading_topics: { type: Type.ARRAY, items: { type: Type.STRING } },
        writing_requirements: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    difficulty_profile: {
      type: Type.OBJECT,
      properties: {
        overall: { type: Type.STRING, description: "easy | medium | hard" },
        distribution: {
          type: Type.OBJECT,
          properties: {
            easy: { type: Type.NUMBER },
            medium: { type: Type.NUMBER },
            hard: { type: Type.NUMBER }
          }
        }
      }
    }
  },
  required: ["exam_meta", "sections", "knowledge_scope", "difficulty_profile"]
};

export async function analyzeBlueprint(textContent: string, gradeLevel: string = "6"): Promise<any> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: blueprintSchema,
      temperature: 0.2,
    },
  });

  const prompt = `You are an expert exam structure analyst specializing in Vietnamese secondary school (THCS) English exams for Grades 6–9.
  Analyze the following exam text and return a structured JSON blueprint.

  ## Context
  - Target: Vietnamese THCS English exams (NOT IELTS, TOEFL, or international exams)
  - Typical sections: Language Focus, Reading, Writing
  - Allowed question types: pronunciation, stress, grammar_vocab_mcq, error_identification, dialogue_ordering, cloze_test, reading_comprehension, sentence_transformation, paragraph_writing

  ## Rules
  - Return ONLY valid JSON.
  - Ensure section point totals and question counts match the exam structure.
  - Use ONLY the allowed question types listed above.
  - If information is missing, estimate based on typical Vietnamese THCS exams.
  - duration_minutes defaults to 45 for regular tests, 60 for midterm/final exams.
  - total_points defaults to 10 (Vietnamese grading scale).

  Exam Text:
  ${textContent}`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    return JSON.parse(responseText);
  } catch (error) {
    console.error("[GEMINI_ERROR]", error);
    throw new Error("Không thể phân tích đề thi bằng AI. Vui lòng thử lại.");
  }
}
