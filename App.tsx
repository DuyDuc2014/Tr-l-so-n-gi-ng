import React, { useState, useCallback, useEffect } from 'react';
import ControlPanel from './components/ControlPanel';
import OutputPanel from './components/OutputPanel';
import FeatureModal from './components/FeatureModal';
import ThemeSwitcher from './components/ThemeSwitcher';
import { geminiService } from './services/geminiService';
import { Mode, AppStatus, LessonData, ModalState } from './types';
import { downloadAsDocx } from './utils/docxGenerator';

function App() {
  const [mode, setMode] = useState<Mode>('auto');
  const [status, setStatus] = useState<AppStatus>('idle');
  const [lessonContent, setLessonContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lessonData, setLessonData] = useState<LessonData>({
    subject: '',
    grade: '',
    topic: '',
    objectives: '',
    duration: '',
    studentProfile: '',
    extraRequirements: '',
  });
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    title: '',
    content: '',
    isLoading: false,
    error: null,
  });
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    return (localStorage.getItem('theme') as 'light' | 'dark') || 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove(theme === 'light' ? 'dark' : 'light');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  const handleGenerate = useCallback(async () => {
    // Validation is now handled inside ControlPanel by disabling the button
    setStatus('loading');
    setErrorMessage(null);
    setLessonContent('');
    try {
      const content = await geminiService.generateLessonPlan(lessonData, mode);
      setLessonContent(content);
      setStatus('success');
    } catch (error) {
      console.error('Error generating lesson plan:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An unknown error occurred.');
      setStatus('error');
    }
  }, [lessonData, mode]);
  
  const callGeminiForFeature = useCallback(async (
    featureFn: (content: string) => Promise<string>,
    title: string
  ) => {
    if (!lessonContent) return;
    
    setModalState({ isOpen: true, title, isLoading: true, content: '', error: null });
    
    try {
      const result = await featureFn(lessonContent);
      setModalState(prev => ({ ...prev, isLoading: false, content: result }));
    } catch (error) {
      console.error(`Error with feature "${title}":`, error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred.';
      setModalState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
    }
  }, [lessonContent]);

  const handleSuggestActivities = useCallback(() => {
    callGeminiForFeature(geminiService.suggestActivities, "✨ Gợi ý Hoạt động Sáng tạo");
  }, [callGeminiForFeature]);

  const handleGenerateQuestions = useCallback(() => {
    callGeminiForFeature(geminiService.generateQuestions, "✨ Bộ Câu hỏi Ôn tập");
  }, [callGeminiForFeature]);

  const handleSuggestTeachingMethods = useCallback(() => {
    callGeminiForFeature(geminiService.suggestTeachingMethods, "💡 Gợi ý Phương pháp Dạy học Tích cực");
  }, [callGeminiForFeature]);

  const handleDownloadDocx = useCallback(() => {
    if (lessonContent) {
      downloadAsDocx(lessonContent, lessonData);
    }
  }, [lessonContent, lessonData]);

  const closeModal = () => {
    setModalState(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="relative text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-blue-600 dark:text-blue-400">Trợ lý Soạn Bài giảng AI</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Tạo giáo án nhanh chóng và hiệu quả với sức mạnh của Gemini AI. Sản phẩm là ý tưởng của thầy Lê Trần Vũ</p>
        <ThemeSwitcher theme={theme} toggleTheme={toggleTheme} />
      </header>
      <main className="flex flex-col md:flex-row gap-8">
        <ControlPanel
          mode={mode}
          setMode={setMode}
          lessonData={lessonData}
          setLessonData={setLessonData}
          onGenerate={handleGenerate}
          isLoading={status === 'loading'}
        />
        <OutputPanel
          status={status}
          lessonContent={lessonContent}
          errorMessage={errorMessage}
          onSuggestActivities={handleSuggestActivities}
          onGenerateQuestions={handleGenerateQuestions}
          onSuggestTeachingMethods={handleSuggestTeachingMethods}
          onDownloadDocx={handleDownloadDocx}
        />
      </main>
      <FeatureModal modalState={modalState} onClose={closeModal} />
    </div>
  );
}

export default App;