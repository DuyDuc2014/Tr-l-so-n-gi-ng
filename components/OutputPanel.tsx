import React, { useState, useEffect, useRef } from 'react';
import { AppStatus } from '../types';
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

const OutputPanel: React.FC<OutputPanelProps> = ({ status, lessonContent, errorMessage, onSuggestActivities, onGenerateQuestions, onSuggestTeachingMethods, onDownloadDocx }) => {
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

  const isActionable = status === 'success';

  return (
    <div className="w-full md:w-2/3 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg relative min-h-[400px]">
      <div className="flex flex-wrap justify-between items-center border-b dark:border-gray-600 pb-2 mb-4 gap-4">
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
      <div className="relative h-[calc(100vh-250px)] overflow-y-auto">
        {status === 'loading' && <Loader />}
        {status === 'idle' && <Placeholder />}
        {status === 'success' && <div ref={contentRef} className="prose-custom" dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(lessonContent) }} />}
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