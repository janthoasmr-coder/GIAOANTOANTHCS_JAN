
import React, { useEffect, useRef } from 'react';
import { GenerationResult, ProcedureActivity, KnowledgeItem, ExampleExercise } from '../types';

declare const katex: any;

const MathText: React.FC<{ text: string }> = ({ text }) => {
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      let content = text || "";
      // Handle block math $$...$$
      let html = content.replace(/\$\$(.*?)\$\$/gs, (match, formula) => {
        try {
          return `<div class="my-4 flex justify-center w-full overflow-x-auto">${katex.renderToString(formula, { displayMode: true, throwOnError: false })}</div>`;
        } catch (e) { return match; }
      });
      // Handle inline math $...$
      html = html.replace(/\$(.*?)\$/g, (match, formula) => {
        try {
          return katex.renderToString(formula, { displayMode: false, throwOnError: false });
        } catch (e) { return match; }
      });
      containerRef.current.innerHTML = html;
    }
  }, [text]);

  return <span ref={containerRef} className="whitespace-pre-line text-black" />;
};

const ProductRenderer: React.FC<{ product: ProcedureActivity['to_chuc_thuc_hien_2_cot']['san_pham_du_kien'] }> = ({ product }) => {
  return (
    <div className="space-y-4 text-black">
      {product.tom_tat && <div className="font-bold underline italic text-blue-900"><MathText text={product.tom_tat} /></div>}
      
      {product.kien_thuc_moi?.length > 0 && (
        <div className="space-y-2">
          {product.kien_thuc_moi.map((k: KnowledgeItem, idx: number) => (
            <div key={idx} className="bg-blue-50/50 p-2 rounded border-l-4 border-blue-500">
              <span className="font-bold uppercase text-xs text-blue-900">{k.loai}: </span>
              <MathText text={k.noi_dung} />
            </div>
          ))}
        </div>
      )}

      {product.vi_du?.length > 0 && (
        <div className="space-y-3">
          {product.vi_du.map((v: ExampleExercise, idx: number) => (
            <div key={idx} className="border border-dashed border-gray-400 p-2 rounded bg-white">
              <p className="font-bold text-gray-900">Ví dụ {idx + 1}: <MathText text={v.de_bai} /></p>
              <div className="mt-2 text-green-900">
                <span className="italic font-bold">Lời giải:</span>
                <div className="ml-2 mt-1"><MathText text={v.loi_giai_chi_tiet} /></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {product.bai_tap?.length > 0 && (
        <div className="space-y-3">
          {product.bai_tap.map((b: ExampleExercise, idx: number) => (
            <div key={idx} className="border border-indigo-200 p-2 rounded bg-indigo-50/30">
              <p className="font-bold text-indigo-900">Bài tập {idx + 1}: <MathText text={b.de_bai} /></p>
              <div className="mt-2 text-indigo-900">
                <span className="italic font-bold">Lời giải:</span>
                <div className="ml-2 mt-1"><MathText text={b.loi_giai_chi_tiet} /></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const LessonPlanViewer: React.FC<{ data: GenerationResult }> = ({ data }) => {
  const { lesson_plan, digital_competency_map, quality_checklist, giao_an_markdown } = data;
  const docRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => window.print();
  
  const handleDownloadDocx = () => {
    if (!docRef.current) return;
    
    // Create a specialized HTML wrapper that Word understands
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Lesson Plan</title>
      <style>
        body { font-family: 'Times New Roman', serif; font-size: 13pt; }
        table { border-collapse: collapse; width: 100%; }
        td, th { border: 1px solid black; padding: 5px; }
        .uppercase { text-transform: uppercase; }
        .font-bold { font-weight: bold; }
        .text-center { text-align: center; }
        .italic { font-style: italic; }
      </style>
      </head><body>
    `;
    const footer = "</body></html>";
    
    // Convert current document view to HTML for Word
    const html = header + docRef.current.innerHTML + footer;
    
    const blob = new Blob(['\ufeff', html], {
      type: 'application/msword'
    });
    
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Giao_An_5512_${lesson_plan.thong_tin_chung.tieu_de_bai.replace(/\s+/g, '_')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadMD = () => {
    const blob = new Blob([giao_an_markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Giao_An_${lesson_plan.thong_tin_chung.tieu_de_bai.replace(/\s+/g, '_')}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 font-sans no-print-bg">
      {/* Floating Toolbar */}
      <div className="sticky top-20 z-40 bg-white/95 backdrop-blur-md p-4 mb-8 rounded-2xl shadow-2xl border border-blue-200 flex flex-wrap justify-between items-center gap-4 no-print">
        <div>
          <h2 className="text-xl font-black text-blue-900 uppercase">Hồ sơ chuyên môn</h2>
          <div className="flex items-center gap-2 mt-1">
            <span className="px-2 py-0.5 bg-green-600 text-white text-[10px] font-bold rounded uppercase">Chuẩn 5512</span>
            <span className="px-2 py-0.5 bg-blue-600 text-white text-[10px] font-bold rounded uppercase">Chuẩn 3456</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleDownloadMD} className="px-4 py-2 rounded-xl border-2 border-slate-600 text-slate-600 font-bold hover:bg-slate-50 transition-all active:scale-95 flex items-center gap-2 text-sm">
            Tải Markdown
          </button>
          <button onClick={handleDownloadDocx} className="px-4 py-2 rounded-xl border-2 border-blue-600 text-blue-600 font-bold hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2 text-sm">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
            Tải File Word
          </button>
          <button onClick={handlePrint} className="px-5 py-2.5 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 shadow-xl transition-all active:scale-95 flex items-center gap-2 text-sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            In / Xuất PDF
          </button>
        </div>
      </div>

      {/* Document Area */}
      <div ref={docRef} className="bg-white p-[20mm] shadow-2xl lesson-document mx-auto print:p-0 print:shadow-none min-h-[297mm] text-black border border-gray-100">
        {/* Header Admin */}
        <div className="grid grid-cols-2 mb-10 text-[13pt]">
          <div className="text-center">
            {lesson_plan.thong_tin_chung.dong_dau_trang.map((line, i) => (
              <p key={i} className="uppercase font-bold">{line}</p>
            ))}
            <div className="w-24 h-[1px] bg-black mx-auto mt-1"></div>
          </div>
          <div className="text-center">
            <p className="font-bold uppercase leading-tight">CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
            <p className="font-bold leading-tight">Độc lập - Tự do - Hạnh phúc</p>
            <div className="w-32 h-[1px] bg-black mx-auto mt-1"></div>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-10">
          <h1 className="text-[16pt] font-bold uppercase mb-2">KẾ HOẠCH BÀI DẠY</h1>
          <p className="text-[14pt] font-bold uppercase">BÀI: {lesson_plan.thong_tin_chung.tieu_de_bai}</p>
          <p className="text-[13pt] mt-2 italic">{lesson_plan.thong_tin_chung.mon_lop_thoi_luong}</p>
        </div>

        {/* I. Objectives */}
        <div className="mb-8">
          <h2 className="text-[14pt] font-bold uppercase border-b-2 border-black pb-1 mb-3">I. MỤC TIÊU:</h2>
          <div className="ml-4 space-y-4 text-[13pt]">
            <div>
              <h3 className="font-bold">1. Kiến thức:</h3>
              <ul className="list-disc ml-8 text-justify">
                {lesson_plan.muc_tieu.kien_thuc.map((k, i) => <li key={i}><MathText text={k} /></li>)}
              </ul>
            </div>
            <div>
              <h3 className="font-bold">2. Năng lực:</h3>
              <div className="ml-4 space-y-2">
                <p><span className="font-bold underline">Năng lực chung:</span> {lesson_plan.muc_tieu.nang_luc.nang_luc_chung.join('; ')}.</p>
                <p><span className="font-bold underline">Năng lực đặc thù Toán học:</span> {lesson_plan.muc_tieu.nang_luc.nang_luc_dac_thu_toan.join('; ')}.</p>
                <div className="mt-3 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <span className="font-bold text-blue-900 uppercase text-[11pt]">Năng lực số (Tích hợp CV 3456):</span>
                  <ul className="list-disc ml-8 mt-1">
                    {lesson_plan.muc_tieu.nang_luc_so.map((nls, i) => (
                      <li key={i} className="text-justify italic text-[12pt]">
                        <span className="font-bold text-blue-800">{nls.ma}:</span> {nls.mo_ta}
                        <ul className="list-circle ml-6 text-gray-800 text-[11pt] not-italic">
                          {nls.dia_chi_tich_hop.map((d, j) => (
                            <li key={j}>{d.hoat_dong} - Mức độ: {d.muc_do} ({d.minh_chung})</li>
                          ))}
                        </ul>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-bold">3. Phẩm chất:</h3>
              <ul className="list-disc ml-8 text-justify">
                {lesson_plan.muc_tieu.pham_chat.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          </div>
        </div>

        {/* II. Equipment */}
        <div className="mb-8">
          <h2 className="text-[14pt] font-bold uppercase border-b-2 border-black pb-1 mb-3">II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU:</h2>
          <div className="ml-4 text-[13pt]">
            <p><strong>- Giáo viên:</strong> {lesson_plan.thiet_bi.giao_vien.join(', ')}.</p>
            <p><strong>- Học sinh:</strong> {lesson_plan.thiet_bi.hoc_sinh.join(', ')}.</p>
          </div>
        </div>

        {/* III. Procedure */}
        <div className="mb-8">
          <h2 className="text-[14pt] font-bold uppercase border-b-2 border-black pb-1 mb-3">III. TIẾN TRÌNH DẠY HỌC:</h2>
          
          {lesson_plan.tien_trinh.map((section, sIdx) => (
            <div key={sIdx} className="mb-8">
              <h3 className="text-[13pt] font-bold uppercase mb-4 text-slate-900 underline decoration-2 underline-offset-4">{section.ten_phan}</h3>
              {section.cac_hoat_dong.map((act, aIdx) => (
                <div key={aIdx} className="mb-6 ml-2" style={{ pageBreakInside: 'avoid' }}>
                  <h4 className="font-bold text-[12pt] mb-2 bg-slate-100 p-2 border-l-4 border-slate-800">Hoạt động {aIdx + 1}: {act.ten_hoat_dong}</h4>
                  <div className="ml-4 space-y-2 text-[12pt]">
                    <p><strong>a) Mục tiêu:</strong> {act.muc_tieu.join('; ')}.</p>
                    <p><strong>b) Nội dung:</strong> <MathText text={act.noi_dung} /></p>
                    <p><strong>c) Sản phẩm:</strong> <MathText text={act.san_pham} /></p>
                    <div className="mt-4">
                      <p className="font-bold mb-2">d) Tổ chức thực hiện:</p>
                      <table className="w-full border-2 border-black border-collapse text-[12pt]">
                        <thead>
                          <tr className="bg-transparent text-black">
                            <th className="border-2 border-black p-3 w-1/2 uppercase font-black text-center text-[11pt] tracking-tight">HOẠT ĐỘNG CỦA GV VÀ HS</th>
                            <th className="border-2 border-black p-3 w-1/2 uppercase font-black text-center text-[11pt] tracking-tight">SẢN PHẨM DỰ KIẾN</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="text-black">
                            <td className="border-2 border-black p-3 align-top text-justify space-y-5">
                              <div>
                                <p className="font-bold uppercase text-[10.5pt] border-b border-black mb-1 bg-gray-50 p-1">Bước 1: Chuyển giao nhiệm vụ</p>
                                <div className="pl-1 pt-1"><MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_1} /></div>
                              </div>
                              <div>
                                <p className="font-bold uppercase text-[10.5pt] border-b border-black mb-1 bg-gray-50 p-1">Bước 2: Thực hiện nhiệm vụ</p>
                                <div className="pl-1 pt-1"><MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_2} /></div>
                              </div>
                              <div>
                                <p className="font-bold uppercase text-[10.5pt] border-b border-black mb-1 bg-gray-50 p-1">Bước 3: Báo cáo, thảo luận</p>
                                <div className="pl-1 pt-1"><MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_3} /></div>
                              </div>
                              <div>
                                <p className="font-bold uppercase text-[10.5pt] border-b border-black mb-1 bg-gray-50 p-1">Bước 4: Kết luận, nhận định</p>
                                <div className="pl-1 pt-1"><MathText text={act.to_chuc_thuc_hien_2_cot.hoat_dong_gv_hs.buoc_4} /></div>
                              </div>
                            </td>
                            <td className="border-2 border-black p-3 align-top bg-slate-50/20">
                              <ProductRenderer product={act.to_chuc_thuc_hien_2_cot.san_pham_du_kien} />
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 p-3 bg-blue-50/50 rounded-lg text-[11pt] space-y-1 border-l-4 border-blue-600 no-print-break">
                      <p><span className="font-bold italic text-blue-900 underline">Đánh giá thường xuyên:</span> {act.danh_gia_thuong_xuyen.join('; ')}.</p>
                      <p><span className="font-bold italic text-indigo-900 underline">Tích hợp NLS:</span> {act.tich_hop_nls.join('; ')}.</p>
                      <p><span className="font-bold italic text-orange-900 underline">Phương án không thiết bị:</span> {act.phuong_an_khong_thiet_bi}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* IV. Digital Map */}
        <div className="mt-12 pt-6 border-t-2 border-black" style={{ pageBreakInside: 'avoid' }}>
          <h2 className="text-[14pt] font-bold uppercase mb-4">IV. BẢNG ÁNH XẠ NĂNG LỰC SỐ (Tích hợp CV 3456):</h2>
          <table className="w-full border-2 border-black border-collapse text-[11pt]">
            <thead>
              <tr className="bg-transparent text-black">
                <th className="border-2 border-black p-3 text-center uppercase font-bold">Hoạt động giáo dục</th>
                <th className="border-2 border-black p-3 w-28 text-center uppercase font-bold">Mã NLS</th>
                <th className="border-2 border-black p-3 text-center uppercase font-bold">Biểu hiện / Minh chứng</th>
                <th className="border-2 border-black p-3 text-center uppercase font-bold">Công cụ số</th>
              </tr>
            </thead>
            <tbody>
              {digital_competency_map.map((row, i) => (
                <tr key={i}>
                  <td className="border border-black p-3 font-bold text-slate-900">{row.hoat_dong}</td>
                  <td className="border border-black p-3 text-center font-black text-blue-900">{row.ma_nls.join(', ')}</td>
                  <td className="border border-black p-3 text-justify italic">{row.bieu_hien.join('; ')} - <span className="font-bold not-italic">{row.minh_chung.join('; ')}</span></td>
                  <td className="border border-black p-3 text-center font-medium">{row.cong_cu_so?.join(', ') || 'Học liệu số'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* V. Homework */}
        <div className="mt-10" style={{ pageBreakInside: 'avoid' }}>
          <h2 className="text-[14pt] font-bold uppercase border-b-2 border-black pb-1 mb-3">V. HƯỚNG DẪN VỀ NHÀ:</h2>
          <ul className="list-disc ml-8 text-[13pt] space-y-1">
            {lesson_plan.huong_dan_ve_nha.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        {/* Signature */}
        <div className="mt-20 grid grid-cols-2 text-center text-[13pt]" style={{ pageBreakInside: 'avoid' }}>
          <div>
            <p className="font-bold uppercase mb-2">Duyệt của tổ chuyên môn</p>
            <div className="h-28"></div>
            <p className="italic text-gray-400">(Ký và ghi rõ họ tên)</p>
          </div>
          <div className="italic">
            <p>............, ngày .... tháng .... năm 202...</p>
            <p className="font-bold mt-1 uppercase not-italic">Người soạn</p>
            <div className="h-28"></div>
            <p className="font-bold underline uppercase not-italic text-[14pt]">{lesson_plan.thong_tin_chung.dong_dau_trang[2]?.replace('GV: ', '') || '...................'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonPlanViewer;
