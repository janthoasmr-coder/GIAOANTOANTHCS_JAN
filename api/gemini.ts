
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

    const ai = new GoogleGenAI({ apiKey });
    
    // Gọi Gemini 2.5 Flash với prompt và config được gửi từ frontend
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: config
    });

    // Trả về kết quả theo đúng định dạng yêu cầu
    return res.status(200).json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return res.status(500).json({ 
      error: "Lỗi hệ thống khi gọi Gemini API", 
      details: error.message 
    });
  }
}
