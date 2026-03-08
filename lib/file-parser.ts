/// <reference types="node" />
const pdf = require("pdf-parse")
import mammoth from "mammoth"

export async function extractTextFromFile(buffer: Buffer, filename: string, mimeType: string) {
  if (filename.endsWith('.pdf') || mimeType === 'application/pdf') {
    const data = await pdf(buffer)
    return data.text
  } else if (filename.endsWith('.docx') || mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || mimeType === 'application/msword') {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  } else {
    throw new Error("Định dạng file không được hỗ trợ. Chỉ hỗ trợ PDF và DOCX.")
  }
}
