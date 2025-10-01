import * as docx from 'docx';
import { LessonData } from '../types';

/**
 * A helper function to process inline markdown (bold, italic, strikethrough, code, and LaTeX)
 * and convert it into an array of TextRun objects for the docx library.
 */
const createTextRuns = (text: string): docx.TextRun[] => {
  if (!text) return [];

  // Split by formatting markers, keeping the markers.
  const segments = text.split(/(\*\*.*?\*\*|\*.*?\*|~~.*?~~|`.*?`|\${1,2}.*?\${1,2})/g).filter(Boolean);

  return segments.map(segment => {
    if (segment.startsWith('**') && segment.endsWith('**')) {
      return new docx.TextRun({ text: segment.slice(2, -2), bold: true });
    }
    if (segment.startsWith('*') && segment.endsWith('*')) {
      return new docx.TextRun({ text: segment.slice(1, -1), italic: true });
    }
    if (segment.startsWith('~~') && segment.endsWith('~~')) {
      return new docx.TextRun({ text: segment.slice(2, -2), strike: true });
    }
    if (segment.startsWith('`') && segment.endsWith('`')) {
      return new docx.TextRun({
        text: segment.slice(1, -1),
        font: { name: 'Courier New' },
        shading: {
          type: docx.ShadingType.CLEAR,
          fill: 'F1F1F1', // Light gray background
        },
      });
    }
    if ((segment.startsWith('$$') && segment.endsWith('$$')) || (segment.startsWith('$') && segment.endsWith('$'))) {
        const formula = segment.startsWith('$$') ? segment.slice(2, -2) : segment.slice(1, -1);
        return new docx.TextRun({
            text: formula, // Just the formula text
            font: { name: 'Cambria Math' },
            color: '2E7D32', // Green to indicate it's a formula
            italic: true,
        });
    }
    return new docx.TextRun(segment); // Regular text
  });
};

/**
 * Main function to generate and download a .docx file from markdown content.
 */
export const downloadAsDocx = (markdown: string, lessonData: LessonData) => {
  if (!markdown || !window.saveAs) return;

  const children: docx.Paragraph[] = [];
  const lines = markdown.split('\n');

  for (const line of lines) {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      children.push(new docx.Paragraph("")); // Add empty paragraph for spacing
      continue;
    }
    
    if (/^(\*|-|_){3,}\s*$/.test(trimmedLine)) {
      children.push(new docx.Paragraph({
        border: { bottom: { color: "auto", space: 1, value: "single", size: 6 } },
      }));
      continue;
    }

    let paragraphOptions: docx.IParagraphOptions = {};
    let textContent = trimmedLine;

    if (trimmedLine.startsWith('#### ')) {
        paragraphOptions.heading = docx.HeadingLevel.HEADING_4;
        textContent = trimmedLine.substring(5);
    } else if (trimmedLine.startsWith('### ')) {
      paragraphOptions.heading = docx.HeadingLevel.HEADING_3;
      textContent = trimmedLine.substring(4);
    } else if (trimmedLine.startsWith('## ')) {
      paragraphOptions.heading = docx.HeadingLevel.HEADING_2;
      textContent = trimmedLine.substring(3);
    } else if (trimmedLine.startsWith('# ')) {
      paragraphOptions.heading = docx.HeadingLevel.HEADING_1;
      textContent = trimmedLine.substring(2);
    } else if (trimmedLine.match(/^(\*|-)\s/)) {
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
      const level = Math.floor(indent / 2);
      paragraphOptions.bullet = { level: level };
      textContent = trimmedLine.substring(trimmedLine.indexOf(' ') + 1);
    } else if (trimmedLine.match(/^\d+\.\s/)) {
      const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
      const level = Math.floor(indent / 2);
      paragraphOptions.numbering = { reference: 'default-numbering', level: level };
      textContent = trimmedLine.substring(trimmedLine.indexOf('.') + 1).trim();
    }
    
    children.push(new docx.Paragraph({
      ...paragraphOptions,
      children: createTextRuns(textContent),
    }));
  }

  const doc = new docx.Document({
    numbering: {
      config: [
        {
          reference: 'default-numbering',
          levels: [
            { level: 0, format: 'decimal', text: '%1.', alignment: docx.AlignmentType.START },
            { level: 1, format: 'lowerLetter', text: '%2)', alignment: docx.AlignmentType.START },
            { level: 2, format: 'lowerRoman', text: '%3.', alignment: docx.AlignmentType.START },
          ],
        },
      ],
    },
    sections: [{
      properties: {},
      children: children,
    }],
  });
  
  const filename = lessonData.topic.trim().replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'giao_an';

  docx.Packer.toBlob(doc).then(blob => {
    window.saveAs!(blob, `${filename}.docx`);
  });
};