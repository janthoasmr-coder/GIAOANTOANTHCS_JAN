
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Chỉ chấp nhận phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt, config } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  try {
    // Ưu tiên API_KEY từ hệ thống hoặc GEMINI_API_KEY từ Vercel Env
    const apiKey = process.env.API_KEY || process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      throw new Error("API Key is not configured in environment variables.");
    }

    // Luôn khởi tạo instance mới ngay trước khi sử dụng để đảm bảo lấy cấu hình mới nhất
    const ai = new GoogleGenAI({ apiKey });
    
    // Sử dụng model 'gemini-3-flash-preview' cho các tác vụ văn bản thông thường
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: config
    });

    // Trả về kết quả văn bản bằng cách truy cập thuộc tính .text (không phải phương thức .text())
    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: "Lỗi hệ thống khi gọi Gemini API", 
      details: error.message 
    });
  }
}
