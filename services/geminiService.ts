import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT } from '../constants';
import { LessonData, Mode } from '../types';

if (!process.env.API_KEY) {
  console.warn("API_KEY environment variable not set. App will not function correctly.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const generateLessonPlan = async (data: LessonData, mode: Mode): Promise<string> => {
  let userQuery = `Hãy tạo một giáo án chi tiết cho:\n- Môn học: ${data.subject}\n- Lớp: ${data.grade}\n- Chủ đề/Tên bài học: ${data.topic}`;

  if (mode === 'advanced') {
    userQuery += `\nVới các tùy chọn nâng cao sau:\n- Mục tiêu bài học: ${data.objectives || 'Tự động xác định'}\n- Thời lượng dự kiến: ${data.duration || 'Tự động phân bổ'}\n- Đặc điểm học sinh: ${data.studentProfile || 'Lớp học bình thường'}\n- Yêu cầu/Gợi ý khác: ${data.extraRequirements || 'Không có'}`;
  }

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [{ text: userQuery }] }],
    tools: [{ googleSearch: {} }],
    systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
  });

  const text = response.text;
  if (text) {
    return text;
  } else {
    throw new Error("Không nhận được nội dung hợp lệ từ AI. Vui lòng thử lại.");
  }
};

const suggestActivities = async (lessonContent: string): Promise<string> => {
  const prompt = `Dựa trên giáo án sau đây, hãy đề xuất 3 hoạt động dạy học sáng tạo, hấp dẫn và có tính tương tác cao. Mô tả chi tiết cách thức tổ chức mỗi hoạt động và mục tiêu sư phạm của nó.\n\n---GIÁO ÁN---\n${lessonContent}`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [{ text: prompt }] }],
  });
  
  const text = response.text;
  if (text) {
    return text;
  } else {
    throw new Error("Không thể tạo gợi ý hoạt động. Vui lòng thử lại.");
  }
};

const generateQuestions = async (lessonContent: string): Promise<string> => {
  const prompt = `Dựa vào nội dung của giáo án sau, hãy tạo một bộ câu hỏi ôn tập bao gồm:\n- 5 câu hỏi trắc nghiệm (multiple choice) với 4 đáp án (A, B, C, D) và chỉ rõ đáp án đúng.\n- 3 câu hỏi tự luận để kiểm tra khả năng tư duy và vận dụng của học sinh.\nCung cấp câu trả lời/gợi ý trả lời cho tất cả các câu hỏi.\n\n---GIÁO ÁN---\n${lessonContent}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [{ text: prompt }] }],
  });

  const text = response.text;
  if (text) {
    return text;
  } else {
    throw new Error("Không thể tạo câu hỏi. Vui lòng thử lại.");
  }
};

const suggestTeachingMethods = async (lessonContent: string): Promise<string> => {
  const prompt = `Dựa trên giáo án đã cho, hãy phân tích từng hoạt động (Mở đầu, Hình thành kiến thức, Luyện tập, Vận dụng) và đề xuất các phương pháp dạy học tích cực phù hợp cho mỗi hoạt động đó.

Yêu cầu:
1.  Với mỗi hoạt động trong giáo án, gợi ý 1-2 phương pháp/kỹ thuật dạy học tích cực (ví dụ: KWL, mảnh ghép, khăn trải bàn, sơ đồ tư duy, dạy học dự án, think-pair-share, v.v.).
2.  Giải thích ngắn gọn tại sao phương pháp/kỹ thuật đó lại hiệu quả cho mục tiêu và nội dung của hoạt động cụ thể đó.
3.  Trình bày rõ ràng theo từng hoạt động.

---GIÁO ÁN---
${lessonContent}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: [{ parts: [{ text: prompt }] }],
  });

  const text = response.text;
  if (text) {
    return text;
  } else {
    throw new Error("Không thể tạo gợi ý phương pháp dạy học. Vui lòng thử lại.");
  }
};


export const geminiService = {
  generateLessonPlan,
  suggestActivities,
  generateQuestions,
  suggestTeachingMethods,
};