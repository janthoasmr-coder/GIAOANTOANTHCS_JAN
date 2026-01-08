
import { GoogleGenAI, Type } from "@google/genai";
import { FormInputs, GenerationResult } from "./types";

const SCHEMA = {
  type: Type.OBJECT,
  required: [
    "form_inputs",
    "lesson_plan",
    "digital_competency_map",
    "quality_checklist",
    "giao_an_markdown"
  ],
  properties: {
    form_inputs: {
      type: Type.OBJECT,
      required: ["ten_bai_day", "khoi_lop", "so_tiet", "ghi_chu"],
      properties: {
        ten_bai_day: { type: Type.STRING },
        khoi_lop: { type: Type.INTEGER },
        so_tiet: { type: Type.INTEGER },
        ghi_chu: { type: Type.STRING }
      }
    },
    lesson_plan: {
      type: Type.OBJECT,
      required: ["thong_tin_chung", "muc_tieu", "thiet_bi", "tien_trinh", "huong_dan_ve_nha"],
      properties: {
        thong_tin_chung: {
          type: Type.OBJECT,
          required: ["dong_dau_trang", "tieu_de_bai", "mon_lop_thoi_luong"],
          properties: {
            dong_dau_trang: { type: Type.ARRAY, items: { type: Type.STRING } },
            tieu_de_bai: { type: Type.STRING },
            mon_lop_thoi_luong: { type: Type.STRING }
          }
        },
        muc_tieu: {
          type: Type.OBJECT,
          required: ["kien_thuc", "nang_luc", "nang_luc_so", "pham_chat"],
          properties: {
            kien_thuc: { type: Type.ARRAY, items: { type: Type.STRING } },
            nang_luc: {
              type: Type.OBJECT,
              required: ["nang_luc_chung", "nang_luc_dac_thu_toan"],
              properties: {
                nang_luc_chung: { type: Type.ARRAY, items: { type: Type.STRING } },
                nang_luc_dac_thu_toan: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            nang_luc_so: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["ma", "mo_ta", "dia_chi_tich_hop"],
                properties: {
                  ma: { type: Type.STRING },
                  mo_ta: { type: Type.STRING },
                  dia_chi_tich_hop: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      required: ["hoat_dong", "muc_do", "minh_chung"],
                      properties: {
                        hoat_dong: { type: Type.STRING },
                        muc_do: { type: Type.STRING },
                        minh_chung: { type: Type.STRING }
                      }
                    }
                  }
                }
              }
            },
            pham_chat: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        thiet_bi: {
          type: Type.OBJECT,
          required: ["giao_vien", "hoc_sinh"],
          properties: {
            giao_vien: { type: Type.ARRAY, items: { type: Type.STRING } },
            hoc_sinh: { type: Type.ARRAY, items: { type: Type.STRING } }
          }
        },
        tien_trinh: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            required: ["ten_phan", "loai_phan", "cac_hoat_dong"],
            properties: {
              ten_phan: { type: Type.STRING },
              loai_phan: { type: Type.STRING },
              cac_hoat_dong: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  required: ["ten_hoat_dong", "muc_tieu", "noi_dung", "san_pham", "to_chuc_thuc_hien_2_cot"],
                  properties: {
                    ten_hoat_dong: { type: Type.STRING },
                    muc_tieu: { type: Type.ARRAY, items: { type: Type.STRING } },
                    noi_dung: { type: Type.STRING },
                    san_pham: { type: Type.STRING },
                    to_chuc_thuc_hien_2_cot: {
                      type: Type.OBJECT,
                      required: ["hoat_dong_gv_hs", "san_pham_du_kien"],
                      properties: {
                        hoat_dong_gv_hs: {
                          type: Type.OBJECT,
                          required: ["buoc_1", "buoc_2", "buoc_3", "buoc_4"],
                          properties: {
                            buoc_1: { type: Type.STRING },
                            buoc_2: { type: Type.STRING },
                            buoc_3: { type: Type.STRING },
                            buoc_4: { type: Type.STRING }
                          }
                        },
                        san_pham_du_kien: {
                          type: Type.OBJECT,
                          required: ["tom_tat", "kien_thuc_moi", "vi_du", "bai_tap"],
                          properties: {
                            tom_tat: { type: Type.STRING },
                            kien_thuc_moi: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { loai: { type: Type.STRING }, noi_dung: { type: Type.STRING } } } },
                            vi_du: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { de_bai: { type: Type.STRING }, loi_giai_chi_tiet: { type: Type.STRING } } } },
                            bai_tap: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { de_bai: { type: Type.STRING }, loi_giai_chi_tiet: { type: Type.STRING } } } }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        huong_dan_ve_nha: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    digital_competency_map: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        required: ["hoat_dong", "ma_nls", "bieu_hien", "minh_chung"],
        properties: {
          hoat_dong: { type: Type.STRING },
          ma_nls: { type: Type.ARRAY, items: { type: Type.STRING } },
          bieu_hien: { type: Type.ARRAY, items: { type: Type.STRING } },
          cong_cu_so: { type: Type.ARRAY, items: { type: Type.STRING }, nullable: true },
          minh_chung: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    quality_checklist: {
      type: Type.OBJECT,
      properties: {
        dung_bo_cuc_mau: { type: Type.BOOLEAN },
        co_danh_gia_thuong_xuyen: { type: Type.BOOLEAN },
        co_dia_chi_nls: { type: Type.BOOLEAN }
      }
    },
    giao_an_markdown: { type: Type.STRING }
  }
};

const SYSTEM_INSTRUCTION = `Bạn là Chatbot chuyên gia soạn "Kế hoạch bài dạy (giáo án)" môn Toán THCS theo Công văn 5512/BGDĐT và tích hợp Năng lực số (CV 3456).

QUY TẮC TOÁN HỌC (CỰC KỲ QUAN TRỌNG):
- Sử dụng LaTeX chuẩn cho TẤT CẢ công thức.
- Biểu thức trong dòng (inline) bọc bởi dấu $: ví dụ $x = \frac{-b}{2a}$.
- Biểu thức khối (block) bọc bởi dấu $$: ví dụ $$\\Delta = b^2 - 4ac$$.
- TUYỆT ĐỐI không dùng ký tự Unicode cho toán học (ví dụ: dùng $x^2$ thay vì x²; dùng $\sqrt{a}$ thay vì √a).

QUY TẮC MÃ NĂNG LỰC SỐ (NLS):
- Mã NLS phải có định dạng: [STT].[STT].TC1[Ký tự] (cho lớp 6-7) hoặc [STT].[STT].TC2[Ký tự] (cho lớp 8-9).
- Ví dụ lớp 6, 7: 3.1.TC1a, 4.2.TC1b.
- Ví dụ lớp 8, 9: 5.2.TC2b, 1.3.TC2a.

QUY TẮC HÀNH CHÍNH:
- KHÔNG điền tên trường, tên giáo viên, tên tổ. Tuyệt đối không tự bịa tên.
- Sử dụng "...................." cho các thông tin này.`;

export const generateLessonPlan = async (inputs: FormInputs): Promise<GenerationResult> => {
  // Fix: Strictly obtain API key from process.env.API_KEY as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Hãy soạn giáo án cực kỳ chi tiết cho bài học môn Toán:
  - Tên bài: "${inputs.ten_bai_day}"
  - Khối lớp: ${inputs.khoi_lop}
  - Số tiết: ${inputs.so_tiet} tiết
  - Ghi chú: ${inputs.ghi_chu || "Không có"}
  
  Yêu cầu: Mã năng lực số phải đúng định dạng X.Y.TC[1/2]z. Trình bày lời giải toán bằng LaTeX chuẩn.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: SCHEMA,
        temperature: 0.2,
        thinkingConfig: { thinkingBudget: 32768 }
      },
    });

    // Fix: Access response.text property directly
    const text = response.text;
    if (!text) throw new Error("Không nhận được phản hồi từ AI. Hãy thử kiểm tra API Key.");
    
    const result = JSON.parse(text) as GenerationResult;
    result.form_inputs = inputs; 
    return result;
  } catch (error: any) {
    if (error.message?.includes("entity was not found") || error.message?.includes("API Key")) {
      throw new Error("LỖI API KEY: Thầy/Cô cần chọn lại API Key (Project trả phí) để sử dụng model Pro.");
    }
    console.error("Gemini Error:", error);
    throw new Error(error.message || "Lỗi khi soạn thảo giáo án.");
  }
};
