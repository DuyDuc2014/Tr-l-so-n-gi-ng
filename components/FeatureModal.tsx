import React, { useState, useEffect } from 'react';
import { ModalState } from '../types';
import Loader from './Loader';
import { parseMarkdownToHtml } from '../utils/markdownParser';

interface FeatureModalProps {
  modalState: ModalState;
  onClose: () => void;
}

const FeatureModal: React.FC<FeatureModalProps> = ({ modalState, onClose }) => {
  const [copyButtonText, setCopyButtonText] = useState('Sao chép Nội dung');

  useEffect(() => {
    if (!modalState.isOpen) {
      // Reset button text when modal closes
      setTimeout(() => setCopyButtonText('Sao chép Nội dung'), 300);
    }
  }, [modalState.isOpen]);

  const handleCopy = () => {
    if (!modalState.content) return;
    navigator.clipboard.writeText(modalState.content).then(() => {
      setCopyButtonText('Đã sao chép!');
      setTimeout(() => {
        setCopyButtonText('Sao chép Nội dung');
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy content: ', err);
      alert('Không thể sao chép nội dung.');
    });
  };
  
  if (!modalState.isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative mx-auto p-5 border w-full max-w-3xl shadow-lg rounded-xl bg-white dark:bg-gray-800 dark:border-gray-700">
        <div className="mt-3">
          <div className="flex justify-between items-center border-b dark:border-gray-700 pb-3 mb-4">
            <h3 className="text-xl leading-6 font-bold text-gray-900 dark:text-gray-100">{modalState.title}</h3>
            <button onClick={onClose} className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
          </div>
          <div className="relative text-left max-h-[60vh] min-h-[200px] overflow-y-auto p-2 prose-custom">
            {modalState.isLoading && <Loader message="AI đang xử lý yêu cầu..." />}
            {modalState.error && <div className="text-red-500 dark:text-red-400 text-center p-4"><p><strong>Đã xảy ra lỗi!</strong></p><p className="text-sm">{modalState.error}</p></div>}
            {!modalState.isLoading && !modalState.error && <div dangerouslySetInnerHTML={{ __html: parseMarkdownToHtml(modalState.content) }} />}
          </div>
          <div className="items-center px-4 py-3 mt-4 bg-gray-50 dark:bg-gray-700/50 rounded-b-xl">
            <button 
              id="modal-copy-btn" 
              onClick={handleCopy}
              disabled={modalState.isLoading || !!modalState.error}
              className="w-full px-4 py-2 bg-blue-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {copyButtonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureModal;