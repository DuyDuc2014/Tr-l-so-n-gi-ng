import React, { useState, useEffect } from 'react';
import { LessonData, Mode } from '../types';

interface ControlPanelProps {
  mode: Mode;
  setMode: (mode: Mode) => void;
  lessonData: LessonData;
  setLessonData: React.Dispatch<React.SetStateAction<LessonData>>;
  onGenerate: () => void;
  isLoading: boolean;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ mode, setMode, lessonData, setLessonData, onGenerate, isLoading }) => {
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});
  const [isFormValid, setIsFormValid] = useState(false);

  // Effect to validate form whenever lessonData or mode changes
  useEffect(() => {
    const newErrors: { [key: string]: string | null } = {};

    const validateField = (id: keyof LessonData, value: string): string | null => {
      if (['subject', 'grade', 'topic'].includes(id) && !value.trim()) {
        return 'Trường này là bắt buộc.';
      }

      if (value.trim()) { // Only validate format if field is not empty
        switch (id) {
          case 'grade':
            const gradeRegex = /^(lớp|khối)?\s*\d{1,2}$/i;
            if (!gradeRegex.test(value)) {
              return 'Định dạng hợp lệ: "Lớp 10", "Khối 12", hoặc "10"';
            }
            break;
          case 'duration':
            const durationRegex = /^\d+\s*(tiết|phút)s?$/i;
            if (!durationRegex.test(value)) {
              return 'Định dạng hợp lệ: "90 phút" hoặc "2 tiết"';
            }
            break;
        }
      }
      return null;
    };

    // Populate errors for each field
    newErrors.subject = validateField('subject', lessonData.subject);
    newErrors.grade = validateField('grade', lessonData.grade);
    newErrors.topic = validateField('topic', lessonData.topic);
    newErrors.duration = validateField('duration', lessonData.duration);
    
    setErrors(newErrors);

    // Determine overall form validity
    const requiredFieldsFilled = lessonData.subject.trim() && lessonData.grade.trim() && lessonData.topic.trim();
    const hasFormatErrors = !!newErrors.grade || !!newErrors.duration;
    
    setIsFormValid(requiredFieldsFilled && !hasFormatErrors);

  }, [lessonData, mode]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setLessonData(prev => ({ ...prev, [id]: value }));
  };
  
  return (
    <div className="w-full md:w-1/3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold mb-4 border-b dark:border-gray-600 pb-2">Thông tin bài giảng</h2>
      
      <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-500/30 rounded-lg text-sm text-blue-800 dark:text-blue-300 flex items-start">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
        </svg>
        <span>
          <strong>Nâng cấp mới:</strong> AI đã được huấn luyện chuyên sâu theo <strong>Công văn 5512</strong> và Chương trình GDPT 2018 để tạo giáo án chuẩn Bộ Giáo dục.
        </span>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Chế độ:</label>
        <div className="flex space-x-4">
          <button 
            onClick={() => setMode('auto')} 
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${mode === 'auto' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          >
            Tạo Tự động
          </button>
          <button 
            onClick={() => setMode('advanced')} 
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${mode === 'advanced' ? 'bg-blue-600 text-white shadow-sm' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200'}`}
          >
            Tùy chọn Nâng cao
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Môn học</label>
           <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v11.494m-10-11.494H12a2 2 0 012 2v11.494a2 2 0 01-2 2H2a2 2 0 01-2-2V8.253a2 2 0 012-2z" />
                </svg>
            </div>
            <input type="text" id="subject" value={lessonData.subject} onChange={handleInputChange} className={`block w-full rounded-md pl-10 focus:ring-1 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.subject ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'}`} placeholder="Ngữ văn" />
          </div>
          {errors.subject && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.subject}</p>}
        </div>
        <div>
          <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Lớp</label>
           <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.663l.001.109m-1.282-2.106a5.12 5.12 0 01-5.118-5.117 5.12 5.12 0 015.118-5.117 5.12 5.12 0 015.118 5.117 5.12 5.12 0 01-5.118 5.117z" />
                </svg>
            </div>
            <input type="text" id="grade" value={lessonData.grade} onChange={handleInputChange} className={`block w-full rounded-md pl-10 focus:ring-1 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.grade ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'}`} placeholder="Lớp 10" />
          </div>
          {errors.grade && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.grade}</p>}
        </div>
        <div>
          <label htmlFor="topic" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Chủ đề / Tên bài học</label>
           <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-start pl-3 pt-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            </div>
            <textarea id="topic" rows={3} value={lessonData.topic} onChange={handleInputChange} className={`block w-full rounded-md pl-10 focus:ring-1 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.topic ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'}`} placeholder="Phân tích truyện ngắn 'Chí Phèo' của Nam Cao"></textarea>
          </div>
           {errors.topic && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.topic}</p>}
        </div>
        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Thời lượng dự kiến</label>
           <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <input type="text" id="duration" value={lessonData.duration} onChange={handleInputChange} className={`block w-full rounded-md pl-10 focus:ring-1 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${errors.duration ? 'border-red-500 focus:border-red-500 focus:ring-red-500 dark:border-red-500' : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'}`} placeholder="2 tiết (90 phút)" />
          </div>
          {errors.duration && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.duration}</p>}
        </div>
      </div>

      <div className={`mt-6 pt-4 border-t dark:border-gray-600 space-y-4 transition-all duration-300 ${mode === 'advanced' ? 'opacity-100' : 'opacity-0 invisible h-0 overflow-hidden'}`}>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Tùy chọn nâng cao</h3>
        <div>
          <label htmlFor="objectives" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mục tiêu bài học (nếu có)</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-start pl-3 pt-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
                </svg>
            </div>
            <textarea id="objectives" rows={3} value={lessonData.objectives} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Về kiến thức, Về năng lực, Về phẩm chất..."></textarea>
          </div>
        </div>
        <div>
          <label htmlFor="studentProfile" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Đặc điểm học sinh</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5 text-gray-400">
                    <path fillRule="evenodd" d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" clipRule="evenodd" />
                </svg>
            </div>
            <input type="text" id="studentProfile" value={lessonData.studentProfile} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Lớp học có nhiều học sinh khá giỏi" />
          </div>
        </div>
        <div>
          <label htmlFor="extraRequirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Yêu cầu/Gợi ý khác</label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-start pl-3 pt-3">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 w-5 text-gray-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-1.002 1.13-1.13l1.838-.46a1.125 1.125 0 011.33.918l.385 1.926c.386.194.74.42 1.068.68l1.6-.799a1.125 1.125 0 011.423.499l.918 1.59a1.125 1.125 0 01-.2 1.488l-1.354 1.016c.022.217.034.437.034.66s-.012.443-.034.66l1.354 1.016a1.125 1.125 0 01.2 1.488l-.918 1.59a1.125 1.125 0 01-1.423.499l-1.6-.799a6.223 6.223 0 01-1.068.68l-.385 1.926a1.125 1.125 0 01-1.33.918l-1.838-.46a1.125 1.125 0 01-1.13-1.13l-.46-1.838a6.223 6.223 0 01-.68-1.068l-.799 1.6a1.125 1.125 0 01-1.488.2l-1.59-.918a1.125 1.125 0 01-.499-1.423l.8-1.6a6.223 6.223 0 01-.68-1.068l-1.838-.46a1.125 1.125 0 01-1.13-1.13l-.46-1.838a6.223 6.223 0 01.68-1.068l-.8-1.6a1.125 1.125 0 01.5-1.423l1.59-.918a1.125 1.125 0 011.488.2l.799 1.6c.386-.194.74-.42 1.068-.68l1.838-.46z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                </svg>
            </div>
            <textarea id="extraRequirements" rows={3} value={lessonData.extraRequirements} onChange={handleInputChange} className="block w-full rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white pl-10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500" placeholder="Tập trung vào các hoạt động nhóm, sử dụng phương pháp dạy học dự án"></textarea>
          </div>
        </div>
      </div>
      
      <button 
        id="generate-btn" 
        onClick={onGenerate}
        disabled={isLoading || !isFormValid}
        className="mt-6 w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
      >
        {isLoading ? 'Đang xử lý...' : 'Tạo Giáo án'}
      </button>
    </div>
  );
};

export default ControlPanel;