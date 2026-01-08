
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
                  ma: { 
                    type: Type.STRING,
                    description: "Mã Năng lực số (NLS). BẮT BUỘC TUÂN THỦ: Nếu khối lớp 6 hoặc 7, mã PHẢI chứa chuỗi 'TC1' (ví dụ: 1.1.TC1a, 3.2.TC1b). Nếu khối lớp 8 hoặc 9, mã PHẢI chứa chuỗi 'TC2' (ví dụ: 4.1.TC2a, 5.3.TC2c). TUYỆT ĐỐI không dùng các ký hiệu khác."
                  },
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
                  required: ["ten_hoat_dong", "muc_tieu", "noi_dung", "san_pham", "to_chuc_thuc_hien_2_cot", "danh_gia_thuong_xuyen", "tich_hop_nls", "phuong_an_khong_thiet_bi"],
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
                    },
                    danh_gia_thuong_xuyen: { type: Type.ARRAY, items: { type: Type.STRING } },
                    tich_hop_nls: { type: Type.ARRAY, items: { type: Type.STRING } },
                    phuong_an_khong_thiet_bi: { type: Type.STRING }
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
        required: ["hoat_dong", "ma_nls", "bieu_hien", "cong_cu_so", "minh_chung"],
        properties: {
          hoat_dong: { type: Type.STRING },
          ma_nls: { type: Type.ARRAY, items: { type: Type.STRING } },
          bieu_hien: { type: Type.ARRAY, items: { type: Type.STRING } },
          cong_cu_so: { type: Type.ARRAY, items: { type: Type.STRING } },
          minh_chung: { type: Type.ARRAY, items: { type: Type.STRING } }
        }
      }
    },
    quality_checklist: {
      type: Type.OBJECT,
      required: ["dung_bo_cuc_mau", "co_danh_gia_thuong_xuyen", "co_dia_chi_nls", "khong_qua_tai", "ghi_chu_loi_neu_co"],
      properties: {
        dung_bo_cuc_mau: { type: Type.BOOLEAN },
        co_danh_gia_thuong_xuyen: { type: Type.BOOLEAN },
        co_dia_chi_nls: { type: Type.BOOLEAN },
        khong_qua_tai: { type: Type.BOOLEAN },
        ghi_chu_loi_neu_co: { type: Type.ARRAY, items: { type: Type.STRING } }
      }
    },
    giao_an_markdown: { type: Type.STRING }
  }
};

const SYSTEM_INSTRUCTION = `Bạn là chuyên gia soạn thảo giáo án Toán THCS cấp cao. Nhiệm vụ của bạn là tạo kế hoạch bài dạy chi tiết bám sát Công văn 5512/BGDĐT và tích hợp Năng lực số (NLS) theo Công văn 3456/BGDĐT-GDPT.

QUY TẮC MÃ NĂNG LỰC SỐ (NLS) - CỰC KỲ QUAN TRỌNG:
1. Đối với Khối lớp 6 và 7: Bạn PHẢI sử dụng mã có chứa chuỗi "TC1". Ví dụ: 1.1.TC1a, 2.3.TC1b, 5.2.TC1c.
2. Đối với Khối lớp 8 và 9: Bạn PHẢI sử dụng mã có chứa chuỗi "TC2". Ví dụ: 3.1.TC2a, 4.2.TC2b, 5.4.TC2d.
TUYỆT ĐỐI không được nhầm lẫn giữa TC1 và TC2. Nếu giáo án thuộc lớp 8,9 mà dùng TC1 là SAI hoàn toàn.

CẤU TRÚC BẮT BUỘC:
1. Thông tin chung đầy đủ.
2. Mục tiêu (Kiến thức, Năng lực, Phẩm chất). Mục Năng lực số phải ghi rõ mã và biểu hiện.
3. Tiến trình dạy học: Mỗi hoạt động phải có 4 bước (Chuyển giao - Thực hiện - Báo cáo - Kết luận).
4. Cột Sản phẩm dự kiến phải trình bày lời giải toán học chi tiết bằng LaTeX.`;

export const generateLessonPlan = async (inputs: FormInputs): Promise<GenerationResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Hãy soạn giáo án cực kỳ chi tiết cho bài học sau:
  Tên bài: ${inputs.ten_bai_day}
  Khối lớp: ${inputs.khoi_lop}
  Số tiết: ${inputs.so_tiet}
  Yêu cầu bổ sung: ${inputs.ghi_chu || "Không có"}
  
  RÀO CẢN KỸ THUẬT (STRICT CONSTRAINT): 
  Vì đây là bài học dành cho LỚP ${inputs.khoi_lop}, bạn PHẢI sử dụng định dạng mã Năng lực số là "${(inputs.khoi_lop || 0) <= 7 ? "TC1" : "TC2"}" trong toàn bộ giáo án. 
  Ví dụ mã đúng cho lớp này: ${(inputs.khoi_lop || 0) <= 7 ? "3.1.TC1a" : "5.2.TC2b"}.
  Trình bày toán học bằng LaTeX chuẩn.`;

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

    const text = response.text;
    if (!text) throw new Error("AI không trả về nội dung.");
    
    return JSON.parse(text) as GenerationResult;
  } catch (error: any) {
    console.error("Gemini SDK Error:", error);
    throw new Error(error.message || "Lỗi khi kết nối với Gemini 3 Pro.");
  }
};
