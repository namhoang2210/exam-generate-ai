# Kế hoạch phát triển: Hệ thống sinh đề thi Tiếng Anh bằng AI

## 1. Tổng quan dự án
- **Mục tiêu**: Hỗ trợ giáo viên (khối THCS: 6, 7, 8, 9) tạo ra các đề thi Tiếng Anh mới với cấu trúc, độ khó và phổ điểm tương đương từ một đề thi mẫu (PDF/DOCX) tải lên.
- **Đối tượng sử dụng**: Giáo viên Tiếng Anh cấp 2.
- **Công nghệ cốt lõi**:
  - **Framework**: Next.js (App Router, TypeScript).
  - **UI**: Tailwind CSS, Shadcn UI.
  - **Database & Auth**: Supabase (PostgreSQL, Supabase Auth).
  - **Background Jobs**: Upstash QStash (Xử lý hàng đợi chống timeout khi call AI).
  - **AI Model**: Google Gemini API (`gemini-2.5-flash-lite`).

---

## 2. Kiến trúc hệ thống (System Architecture)

Hệ thống được thiết kế tối giản nhưng đảm bảo hiệu năng và trải nghiệm người dùng (DX/UX) tốt thông qua kiến trúc hướng sự kiện (Event-driven) cho các tiến trình nặng:

1. **Client (Trình duyệt)**: Giao diện web được build bằng React/Next.js. Upload file trực tiếp lên Supabase Storage để tiết kiệm băng thông server.
2. **Next.js Server**:
   - Xử lý xác thực (Auth via Supabase).
   - Server Actions để lưu metadata và trigger blueprint analysis.
   - API Routes nhận Webhook từ QStash.
3. **QStash (Queue)**: Nhận payload tạo đề từ Next.js Server và gọi webhook ngược lại một API nội bộ với timeout cao để tiến hành gọi Gemini API (bước generate rất tốn thời gian).
4. **Gemini API**:
   - Chức năng 1: Rút trích cấu trúc (Blueprint Extraction) từ text thô.
   - Chức năng 2: Sinh đề thi mới (Generate Exam) từ Blueprint.
5. **Supabase (DB + Storage + Realtime)**:
   - Lưu trữ file gốc.
   - Lưu trữ Blueprint, lịch sử đề thi tạo ra.
   - Realtime update status về cho Client.

---

## 3. Database Schema (Supabase PostgreSQL)

```sql
-- Table: profiles
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    full_name TEXT,
    school_name TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: exams (Lưu thông tin đề upload)
CREATE TABLE exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID REFERENCES profiles(id) NOT NULL,
    title TEXT NOT NULL,
    original_file_path TEXT, -- Đường dẫn trên bucket Supabase
    grade_level INTEGER CHECK (grade_level IN (6, 7, 8, 9)),
    status TEXT DEFAULT 'uploaded', -- uploaded, analyzing, analyzed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: exam_blueprints (Phân tích cấu trúc từ đề gốc)
CREATE TABLE exam_blueprints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id UUID REFERENCES exams(id) ON DELETE CASCADE,
    structure_data JSONB NOT NULL, -- Format cấu trúc, số lượng câu, phổ điểm
    difficulty_metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table: generated_exams (Lưu đề thi mới do AI sinh ra)
CREATE TABLE generated_exams (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    blueprint_id UUID REFERENCES exam_blueprints(id) ON DELETE CASCADE,
    content_json JSONB, -- Nội dung đề mới
    export_url TEXT, -- Link file Word/PDF sau khi in
    status TEXT DEFAULT 'pending', -- pending, processing, completed, failed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 4. Workflows & API Flow

### 4.1. Luồng phân tích cấu trúc (Analyze Blueprint)
*Vì `gemini-2.5-flash-lite` rất nhanh nên bước này có thể chờ synchronous, hoặc tách queue nếu file dài.*
1. **User** upload file PDF/Docx lên `Supabase Storage`.
2. **Client** gọi Server Action `analyzeExamAction(file_url, grade_level)`.
3. **Server** đọc file text (dùng `pdf-parse` hoặc api xử lý tài liệu), gửi prompt cho Gemini phân tích ra JSON Blueprint.
4. **Server** lưu JSON vào bảng `exam_blueprints` và trả về Client.
5. **Client** hiển thị form cho user review Blueprint.

### 4.2. Luồng Sinh đề tương tự (Generate Similar Exam)
*Do việc sinh đề có thể cần nhiều context và mất trên 10-30s, Vercel dễ bị timeout (nếu dùng Hobby account là 10s).*
1. **User** ấn Submit Blueprint.
2. **Server Action** tạo record `generated_exams` (status=`pending`), publish message vào `QStash`.
3. **QStash** gọi vào Webhook Route `/api/webhook/generate-exam` (cấu hình background route hoặc timeout cao).
4. **API Route** kết nối Gemini với Prompt yêu cầu sinh đề Tiếng Anh với chuẩn kiến thức khối (6,7,8,9), format y hệt Blueprint.
5. Khi Gemini trả kết quả, cập nhật status=`completed` và lưu `content_json` vào Supabase.
6. **Client** lắng nghe (Supabase Realtime) và tự động nhận kết quả khi `status` chuyển thành `completed`.

---

## 5. Security & Performance Checklist
**Security**:
- **RLS (Row Level Security)** trên Supabase: Chỉ giáo viên tạo đề mới được xem/sửa đề của mình.
- QStash Webhook phải verify Signature để tránh public request giả mạo.

**Performance**:
- Tách luồng sinh đề qua Queue (QStash) bảo vệ Server khỏi nghẽn (bottleneck) và dính HTTP timeout.
- Sử dụng Structural Prompting (định dạng Schema đầu ra) ép Gemini trả về chuẩn JSON (`response_mime_type: "application/json"`) để serialize thẳng vào Database.

---

## 6. Prompting Strategy
_Ví dụ Prompt sinh Blueprint (Cần tối ưu thêm)_
> "Act as a Vietnamese Secondary School English Teacher. Analyze the following exam content. Extract the exam structure into JSON including: sections (Listening, Reading, Writing, etc.), question counts per section, question format (Multiple choice, gap fill), overall difficulty, and standard score distribution for Grade {grade_level}."

_Ví dụ Prompt sinh Đề Mới_
> "Generate a new English exam for Vietnamese Grade {grade_level} students. Strictly follow this JSON blueprint. Keep the format, sections, and difficulty explicitly matched. Return the exam in the matching JSON schema."
