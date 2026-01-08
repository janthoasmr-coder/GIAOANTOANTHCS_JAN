
import React, { useState, useEffect } from 'react';
import InputForm from './components/InputForm';
import LessonPlanViewer from './components/LessonPlanViewer';
import { FormInputs, GenerationResult } from './types';
import { generateLessonPlan } from './geminiService';

// Fix: Use the globally available AIStudio type and readonly modifier to avoid declaration conflicts
declare global {
  interface Window {
    readonly aistudio: AIStudio;
  }
}

const App: React.FC = () => {
  const [phase, setPhase] = useState<'SETUP' | 'A' | 'B'>('SETUP');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkApiKey();
  }, []);

  const checkApiKey = async () => {
    try {
      const hasKey = await window.aistudio.hasSelectedApiKey();
      if (hasKey) {
        setPhase('A');
      } else {
        setPhase('SETUP');
      }
    } catch (e) {
      // Nếu API không tồn tại, có thể đang ở môi trường dev khác, mặc định cho qua
      setPhase('A');
    }
  };

  const handleOpenKeyDialog = async () => {
    await window.aistudio.openSelectKey();
    // Sau khi trigger dialog, giả định thành công và chuyển sang màn hình chính
    setPhase('A');
  };

  const handleStartGeneration = async (inputs: FormInputs) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await generateLessonPlan(inputs);
      setResult(data);
      setPhase('B');
      window.scrollTo(0, 0);
    } catch (err: any) {
      console.error("Generation Error:", err);
      setError(err.message);
      if (err.message?.includes("API KEY")) {
        setPhase('SETUP');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (phase === 'SETUP') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 text-center border-t-8 border-blue-600">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-4 uppercase">Cấu hình API Key</h2>
          <p className="text-slate-600 mb-8 leading-relaxed font-medium">
            Model <strong>Gemini 3 Pro</strong> yêu cầu sử dụng API Key từ dự án Google Cloud có kích hoạt thanh toán (Paid Project). 
            Thầy/Cô vui lòng nhấn nút bên dưới để chọn Key.
          </p>
          <button 
            onClick={handleOpenKeyDialog}
            className="w-full py-4 bg-blue-600 text-white font-black rounded-2xl shadow-xl hover:bg-blue-700 transition-all active:scale-95"
          >
            MỞ TRÌNH CHỌN API KEY
          </button>
          <p className="mt-4 text-[10px] text-slate-400">
            Xem hướng dẫn tại: <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" className="underline font-bold text-blue-500">ai.google.dev/gemini-api/docs/billing</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col">
      <nav className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-2xl sticky top-0 z-50 no-print border-b border-blue-400/20">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-2 rounded-xl shadow-inner">
              <svg className="w-8 h-8 text-blue-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-tight leading-none">MathPlan AI</h1>
              <p className="text-[9px] text-blue-200 uppercase font-bold tracking-widest mt-1 opacity-80">Giáo Án Chuẩn 5512 & 3456</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
               onClick={() => setPhase('SETUP')}
               className="text-[10px] font-bold bg-blue-800/50 hover:bg-blue-800 px-3 py-1.5 rounded-lg border border-blue-700 transition-all"
            >
              ⚙ Đổi Key
            </button>
            {phase === 'B' && (
              <button 
                onClick={() => setPhase('A')}
                className="text-xs font-bold bg-white text-blue-900 px-4 py-2 rounded-xl border border-white/20 transition-all active:scale-95"
              >
                Soạn Bài Mới
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        {error && (
          <div className="max-w-4xl mx-auto mb-8 bg-red-50 border-2 border-red-200 text-red-800 px-6 py-4 rounded-2xl shadow-lg flex items-center gap-4 animate-shake" role="alert">
            <div className="bg-red-200 p-2 rounded-full flex-shrink-0">
               <svg className="w-6 h-6 text-red-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            <div className="flex-grow">
              <strong className="font-black text-lg uppercase tracking-tight">Thông báo lỗi: </strong>
              <span className="block text-sm font-bold mt-1">{error}</span>
            </div>
          </div>
        )}

        {phase === 'A' ? (
          <div className="animate-fade-in">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">Soạn giáo án với Gemini 3 Pro</h2>
              <p className="text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
                Hệ thống AI chuyên gia giúp Thầy/Cô thiết kế bài dạy Toán học chất lượng cao, tích hợp năng lực số và LaTeX chuẩn mực.
              </p>
            </div>
            <InputForm onSubmit={handleStartGeneration} isLoading={isLoading} />
          </div>
        ) : (
          result && <LessonPlanViewer data={result} />
        )}
      </main>

      <footer className="bg-white py-8 border-t border-slate-200 mt-auto no-print">
        <div className="container mx-auto px-6 text-center">
          <p className="font-black text-slate-400 text-[10px] uppercase tracking-widest">MathPlan AI v3.5 Pro • Đã khắc phục lỗi hiển thị & API Key</p>
        </div>
      </footer>

      <style>{`
        .animate-fade-in { animation: fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .animate-shake { animation: shake 0.5s linear; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-4px); } 75% { transform: translateX(4px); } }
      `}</style>
    </div>
  );
};

export default App;
