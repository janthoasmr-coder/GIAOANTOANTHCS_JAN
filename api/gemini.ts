
// File này đã được vô hiệu hóa theo yêu cầu. 
// Toàn bộ logic soạn giáo án đã được chuyển về geminiService.ts (Frontend) 
// để tối ưu hóa việc sử dụng SDK trực tiếp và Gemini 3 Pro.
export default async function handler(req: any, res: any) {
  return res.status(410).json({ error: "API endpoint đã được gỡ bỏ. Vui lòng sử dụng logic ở Frontend." });
}
