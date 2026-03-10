import { PDFParse } from "pdf-parse"
import { getData as getPdfWorkerData } from "pdf-parse/worker"
import mammoth from "mammoth"

let isPdfWorkerConfigured = false

function ensurePdfWorkerConfigured() {
  if (isPdfWorkerConfigured) {
    return
  }

  PDFParse.setWorker(getPdfWorkerData())
  isPdfWorkerConfigured = true
}

export async function extractTextFromFile(buffer: Buffer, filename: string, mimeType: string) {
  if (filename.endsWith(".pdf") || mimeType === "application/pdf") {
    ensurePdfWorkerConfigured()

    const parser = new PDFParse({ data: new Uint8Array(buffer) })

    try {
      const result = await parser.getText()
      return result.text || ""
    } catch (error) {
      console.error("[PDF_PARSE_ERROR]", error)
      const message = error instanceof Error ? error.message : "Unknown PDF parse error"
      throw new Error(`Loi khi doc file PDF: ${message}`)
    } finally {
      await parser.destroy().catch(() => undefined)
    }
  }

  if (
    filename.endsWith(".docx") ||
    mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    mimeType === "application/msword"
  ) {
    const result = await mammoth.extractRawText({ buffer })
    return result.value
  }

  throw new Error("Dinh dang file khong duoc ho tro. Chi ho tro PDF va DOCX.")
}
