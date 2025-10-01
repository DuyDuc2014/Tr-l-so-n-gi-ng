
export type Mode = 'auto' | 'advanced';

export type AppStatus = 'idle' | 'loading' | 'success' | 'error';

export interface LessonData {
  subject: string;
  grade: string;
  topic: string;
  objectives: string;
  duration: string;
  studentProfile: string;
  extraRequirements: string;
}

export interface ModalState {
  isOpen: boolean;
  title: string;
  content: string;
  isLoading: boolean;
  error: string | null;
}

export interface DisplaySettings {
  fontFamily: string;
  fontSize: number; // in pixels
  fontColor: string; // hex color, empty string for default
}

declare global {
  interface Window {
    renderMathInElement?: (element: HTMLElement, options: object) => void;
    saveAs?: (blob: Blob, filename: string) => void;
    jspdf: any;
    html2canvas: any;
  }
}