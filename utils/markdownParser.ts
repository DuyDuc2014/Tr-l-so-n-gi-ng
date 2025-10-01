/**
 * A simple markdown parser to convert lesson content to HTML.
 * Handles headings, bold, italics, strikethrough, horizontal rules, code blocks, and nested lists.
 */
export const parseMarkdownToHtml = (markdown: string): string => {
  if (!markdown) return "";

  const lines = markdown.split('\n');
  let html = '';
  let listStack: ('ul' | 'ol')[] = [];
  let inCodeBlock = false;

  const processInline = (text: string) => {
    return text
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/~~(.*?)~~/g, '<s>$1</s>') // Strikethrough
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/__(.*?)__/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/_(.*?)_/g, '<em>$1</em>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-200 dark:bg-gray-700 text-red-600 dark:text-red-400 px-1 py-0.5 rounded">$1</code>');
  };

  for (const line of lines) {
    if (line.trim().startsWith('```')) {
      if (inCodeBlock) {
        html += '</code></pre>';
        inCodeBlock = false;
      } else {
        html += '<pre class="bg-gray-800 dark:bg-black/50 text-white p-4 my-2 rounded-md overflow-x-auto"><code class="font-mono text-sm">';
        inCodeBlock = true;
      }
      continue;
    }

    if (inCodeBlock) {
      html += line.replace(/</g, '&lt;').replace(/>/g, '&gt;') + '\n';
      continue;
    }

    const indent = line.match(/^(\s*)/)?.[1].length ?? 0;
    const listLevel = Math.floor(indent / 2); // Assuming 2 spaces for indentation
    const trimmedLine = line.trim();
    
    // Close lists if indentation decreases
    while (listStack.length > listLevel) {
        html += `</${listStack.pop()}>`;
    }

    // Process different line types
    if (/^(\*|-|_){3,}\s*$/.test(trimmedLine)) { // Horizontal Rule
        while (listStack.length > 0) {
            html += `</${listStack.pop()}>`;
        }
        html += '<hr class="my-4 border-gray-300 dark:border-gray-600"/>';
    } else if (trimmedLine.startsWith('# ')) {
      html += `<h1>${processInline(trimmedLine.substring(2))}</h1>`;
    } else if (trimmedLine.startsWith('## ')) {
      html += `<h2>${processInline(trimmedLine.substring(3))}</h2>`;
    } else if (trimmedLine.startsWith('### ')) {
      html += `<h3>${processInline(trimmedLine.substring(4))}</h3>`;
    } else if (trimmedLine.match(/^\d+\.\s/)) { // Ordered list
      if (listStack.length < listLevel + 1 || listStack[listStack.length-1] !== 'ol') {
        if(listStack.length > 0 && listStack[listStack.length-1] === 'ul') html += `</${listStack.pop()}>`;
        html += '<ol>';
        listStack.push('ol');
      }
      html += `<li>${processInline(trimmedLine.substring(trimmedLine.indexOf(' ') + 1))}</li>`;
    } else if (trimmedLine.match(/^[-*]\s/)) { // Unordered list
      if (listStack.length < listLevel + 1 || listStack[listStack.length-1] !== 'ul') {
        if(listStack.length > 0 && listStack[listStack.length-1] === 'ol') html += `</${listStack.pop()}>`;
        html += '<ul>';
        listStack.push('ul');
      }
      html += `<li>${processInline(trimmedLine.substring(trimmedLine.indexOf(' ') + 1))}</li>`;
    } else if (trimmedLine.length > 0) {
       // Not a list item, close all open lists
       while (listStack.length > 0) {
        html += `</${listStack.pop()}>`;
      }
      html += `<p>${processInline(trimmedLine)}</p>`;
    }
  }

  // Close any remaining lists
  while (listStack.length > 0) {
    html += `</${listStack.pop()}>`;
  }

  return html;
};