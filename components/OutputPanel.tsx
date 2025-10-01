
import React, { useState, useEffect, useRef } from 'react';
import { AppStatus, DisplaySettings } from '../types';
import Loader from './Loader';
import { parseMarkdownToHtml } from '../utils/markdownParser';

interface OutputPanelProps {
  status: AppStatus;
  lessonContent: string;
  errorMessage: string | null;
  onSuggestActivities: () => void;
  onGenerateQuestions: () => void;
  onSuggestTeachingMethods: () => void;
  onDownloadDocx: () => void;
  displaySettings: DisplaySettings;
  setDisplaySettings: React.Dispatch<React.SetStateAction<DisplaySettings>>;
  theme: 'light' | 'dark';
}

const Placeholder: React.FC = () => (
  <div className="text-gray-400 dark:text-gray-500 flex flex-col items-center justify-center h-full text-center">
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
    <p>Nội dung giáo án sẽ xuất hiện ở đây.</p>
    <p className="text-sm">Hãy điền thông tin và nhấn "Tạo Giáo án".</p>
  </div>
);

const FONT_OPTIONS = [
    { name: 'Mặc định (Be Vietnam Pro)', value: "'Be Vietnam Pro', sans-serif" },
    { name: 'Arial', value: 'Arial, sans-serif' },
    { name: 'Times New Roman', value: 'Times New Roman, serif' },
    { name: 'Courier New', value: 'Courier New, monospace' },
];
  
const MIN_FONT_SIZE = 10;
const MAX_FONT_SIZE = 30;

const OutputPanel: React.FC<OutputPanelProps> = ({ status, lessonContent, errorMessage, onSuggestActivities, onGenerateQuestions, onSuggestTeachingMethods, onDownloadDocx, displaySettings, setDisplaySettings, theme }) => {
  const [copyButtonText, setCopyButtonText] = useState('Sao chép vào Gamma');
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (status === 'success' && contentRef.current) {
      if (window.renderMathInElement) {
        window.renderMathInElement(contentRef.current, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false },
            { left: '\\[', right: '\\]', display: true }
          ],
          throwOnError: false
        });
      }
    }
  }, [status, lessonContent]);
  
  const handleCopy = () => {
    if (!lessonContent) return;
    navigator.clipboard.writeText(lessonContent).then(() => {
        setCopyButtonText('Đã sao chép!');
        setTimeout(() => {
            setCopyButtonText('Sao chép vào Gamma');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
        alert('Không thể sao chép nội dung.');
    });
  };

  const handleFontFamilyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDisplaySettings(prev => ({ ...prev, fontFamily: e.target.value }));
  };

  const handleFontSizeChange = (amount: number) => {
    setDisplaySettings(prev => ({
      ...prev,
      fontSize: Math.max(MIN_FONT_SIZE, Math.min(MAX_FONT_SIZE, prev.fontSize + amount)),
    }));
  };
  
  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setDisplaySettings(prev => ({ ...prev, fontColor: e.target.value }));
  };

  const resetColor = () => {
    setDisplaySettings(prev => ({ ...prev, fontColor: '' }));
  };

  const isActionable = status === 'success';

  const contentStyle: React.CSSProperties = {
    fontFamily: displaySettings.fontFamily,
    fontSize: `${displaySettings.fontSize}px`,
  };
  if (displaySettings.fontColor) {
      contentStyle.color = displaySettings.fontColor;
  }

  const colorPickerDefault = theme === 'dark' ? '#FFFFFF' : '#000000';

  return (
    <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative min-h-[400px]">
      <div className="flex flex-wrap justify-between items-center border-b dark:border-gray-600 pb-2 mb-2 gap-4">
        <h2 className="text-xl font-semibold">Nội dung Giáo án</h2>
        <div className="flex flex-wrap gap-2">
          <button onClick={onSuggestActivities} disabled={!isActionable} className="inline-flex items-center bg-purple-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Gợi ý Hoạt động
          </button>
          <button onClick={onSuggestTeachingMethods} disabled={!isActionable} className="inline-flex items-center bg-teal-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
            </svg>
            Gợi ý PPDH
          </button>
          <button onClick={onGenerateQuestions} disabled={!isActionable} className="inline-flex items-center bg-indigo-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tạo Câu hỏi
          </button>
          <button onClick={onDownloadDocx} disabled={!isActionable} className="inline-flex items-center bg-sky-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-sky-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mr-1.5">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v4.59L7.3 9.24a.75.75 0 00-1.1 1.02l3.25 3.5a.75.75 0 001.1 0l3.25-3.5a.75.75 0 10-1.1-1.02l-1.95 2.1V6.75z" clipRule="evenodd" />
            </svg>
            Tải về (.docx)
          </button>
          <button onClick={handleCopy} disabled={!isActionable} className="bg-green-500 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors">
            {copyButtonText}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 py-2 mb-2 border-b dark:border-gray-700">
        <div className="flex items-center gap-2">
            <label htmlFor="font-family" className="text-sm font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">Phông chữ:</label>
            <select id="font-family" value={displaySettings.fontFamily} onChange={handleFontFamilyChange} className="block w-full text-sm rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 py-1 pl-2 pr-8">
                {FONT_OPTIONS.map(font => (
                    <option key={font.value} value={font.value}>{font.name}</option>
                ))}
            </select>
        </div>
        
        <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Cỡ chữ:</label>
            <button onClick={() => handleFontSizeChange(-1)} disabled={displaySettings.fontSize <= MIN_FONT_SIZE} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
            </button>
            <span className="text-sm w-6 text-center">{displaySettings.fontSize}px</span>
            <button onClick={() => handleFontSizeChange(1)} disabled={displaySettings.fontSize >= MAX_FONT_SIZE} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" /></svg>
            </button>
        </div>

        <div className="flex items-center gap-2">
            <label htmlFor="font-color" className="text-sm font-medium text-gray-700 dark:text-gray-300">Màu chữ:</label>
            <input type="color" id="font-color" value={displaySettings.fontColor || colorPickerDefault} onChange={handleColorChange} className="w-7 h-7 p-0.5 border border-gray-300 dark:border-gray-600 rounded cursor-pointer" />
             <button onClick={resetColor} title="Reset màu" className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 110 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
      </div>
      <div className="relative h-[calc(100vh-320px)] overflow-y-auto">
        {status === 'loading' && <Loader />}
        {status === 'idle' && <Placeholder />}
        {status === 'success' && <div ref={contentRef} style={contentStyle} className="prose-custom" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(lessonContent) }} />}
        {status === 'error' && (
           <div className="flex flex-col items-center justify-center h-full text-center p-4">
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-300 dark:border-red-500/30 text-red-900 dark:text-red-300 p-6 rounded-lg shadow-xl w-full max-w-md">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-12 w-12 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="ml-4 text-left">
                  <h3 className="font-bold text-xl">Đã xảy ra lỗi!</h3>
                  <p className="text-md mt-2">{errorMessage}</p>
                  <p className="text-sm mt-4 text-red-700 dark:text-red-400">Vui lòng thử lại sau.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
