import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function analyzeBlueprint(textContent: string, gradeLevel: string = "6"): Promise<any> {
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

  ## Required JSON schema:
  {
    "exam_meta": {
      "title": "string",
      "subject": "English",
      "target_country": "Vietnam",
      "target_school_level": "THCS",
      "duration_minutes": 45,
      "total_points": 10
    },
    "sections": [
      {
        "key": "string",
        "title": "string",
        "points": 2.5,
        "question_groups": [
          {
            "type": "grammar_vocab_mcq",
            "count": 8,
            "question_format": "mcq_4_options | free_text | paragraph"
          }
        ]
      }
    ],
    "knowledge_scope": {
      "grammar_topics": ["string"],
      "vocabulary_topics": ["string"],
      "reading_topics": ["string"],
      "writing_requirements": ["string"]
    },
    "difficulty_profile": {
      "overall": "easy | medium | hard",
      "distribution": {
        "easy": 40,
        "medium": 40,
        "hard": 20
      }
    }
  }

  Exam Text:
  ${textContent}`;

  try {
    console.log(`[AI_ANALYSIS_START] Model: llama-3.3-70b-versatile, Length: ${textContent.length} chars`);
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    const result = JSON.parse(responseText);
    console.log(`[AI_ANALYSIS_SUCCESS] Sections found: ${result.sections?.length}`);
    return result;
  } catch (error) {
    console.error("[GROQ_ERROR]", error);
    throw new Error("Không thể phân tích đề thi bằng Groq AI. Vui lòng kiểm tra API Key.");
  }
}

/**
 * Hàm sinh nội dung đề thi mới dựa trên Blueprint và nội dung tham chiếu
 */
export async function generateExamContent(blueprint: any, referenceContent: string): Promise<any> {
  console.log(`[GENERATING_EXAM_START] Blueprint: ${blueprint.exam_meta?.title}`);
  
  const prompt = `You are an expert English teacher in Vietnam. 
  Your task is to generate a NEW English exam for Grade ${blueprint.exam_meta?.target_school_level === "THCS" ? "6-9" : "X"} based on the provided BLUEPRINT and REFERENCE_EXAM.

  ## Rules for Generation:
  1. DO NOT copy questions from the REFERENCE_EXAM. Generate NEW ones with similar difficulty and educational standards.
  2. Follow the BLUEPRINT structure exactly (Sections, Question Types, Counts, Points).
  3. Knowledge scope: Use the topics defined in the blueprint (Grammar: ${blueprint.knowledge_scope?.grammar_topics?.join(", ")}, Vocabulary: ${blueprint.knowledge_scope?.vocabulary_topics?.join(", ")}).
  4. Language: Instructions in Vietnamese (e.g., "Chọn đáp án đúng..."), content in English.
  
  ## Format Requirement:
  Return ONLY a valid JSON object matching this schema:
  {
    "title": "Exam Title",
    "totalTimeMinutes": 45,
    "sections": [
      {
        "sectionName": "Name (e.g., LANGUAGE FOCUS)",
        "directions": "Instructions in Vietnamese",
        "questions": [
          {
            "questionText": "Question content...",
            "options": ["A", "B", "C", "D"],
            "correctAnswer": "A",
            "explanation": "Brief explanation"
          }
        ]
      }
    ]
  }

  ## Data for Context:
  Blueprint: ${JSON.stringify(blueprint)}
  Reference Exam: ${referenceContent.substring(0, 3000)} // Truncated for token limit

  Generate the JSON now:`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
      response_format: { type: "json_object" },
      temperature: 0.5,
    });

    const responseText = completion.choices[0]?.message?.content || "{}";
    const content = JSON.parse(responseText);
    console.log(`[GENERATING_EXAM_SUCCESS] Sections generated: ${content.sections?.length}`);
    return content;
  } catch (error) {
    console.error("[GROQ_GENERATE_ERROR]", error);
    throw new Error("Không thể sinh nội dung đề thi bằng Groq AI.");
  }
}
