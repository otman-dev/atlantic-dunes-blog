'use client';

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  const [activeView, setActiveView] = useState<'split' | 'edit' | 'preview'>('split');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper functions for markdown formatting
  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end);
    
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length + after.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 10);
  };

  const formatBold = () => insertMarkdown('**', '**');
  const formatItalic = () => insertMarkdown('*', '*');
  const formatCode = () => insertMarkdown('`', '`');
  const formatLink = () => insertMarkdown('[', '](url)');
  const formatHeading = (level: number) => insertMarkdown('#'.repeat(level) + ' ');
  const formatList = () => insertMarkdown('- ');
  const formatNumberedList = () => insertMarkdown('1. ');
  const formatQuote = () => insertMarkdown('> ');
  const formatCodeBlock = () => insertMarkdown('\n```\n', '\n```\n');

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${Math.max(400, textarea.scrollHeight)}px`;
    }
  }, [value]);

  const ToolbarButton = ({ onClick, icon, title, shortcut }: {
    onClick: () => void;
    icon: React.ReactNode;
    title: string;
    shortcut?: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors duration-200 flex items-center gap-1"
      title={`${title}${shortcut ? ` (${shortcut})` : ''}`}
    >
      {icon}
      {shortcut && <span className="text-xs text-gray-400">{shortcut}</span>}
    </button>
  );

  return (
    <div className={`border border-gray-300 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 flex-wrap">
            <ToolbarButton
              onClick={() => formatHeading(1)}
              icon={<span className="font-bold text-xl">H1</span>}
              title="Heading 1"
              shortcut="# "
            />
            <ToolbarButton
              onClick={() => formatHeading(2)}
              icon={<span className="font-bold text-lg">H2</span>}
              title="Heading 2"
              shortcut="## "
            />
            <ToolbarButton
              onClick={() => formatHeading(3)}
              icon={<span className="font-bold">H3</span>}
              title="Heading 3"
              shortcut="### "
            />
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            <ToolbarButton
              onClick={formatBold}
              icon={<span className="font-bold">B</span>}
              title="Bold"
              shortcut="**text**"
            />
            <ToolbarButton
              onClick={formatItalic}
              icon={<span className="italic">I</span>}
              title="Italic"
              shortcut="*text*"
            />
            <ToolbarButton
              onClick={formatCode}
              icon={<span className="font-mono bg-gray-200 px-1 rounded">Code</span>}
              title="Inline Code"
              shortcut="`code`"
            />
            
            <div className="w-px h-6 bg-gray-300 mx-2" />
            
            <ToolbarButton
              onClick={formatLink}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
              }
              title="Link"
              shortcut="[text](url)"
            />
            <ToolbarButton
              onClick={formatList}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              }
              title="Bullet List"
              shortcut="- item"
            />
            <ToolbarButton
              onClick={formatNumberedList}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4V2a1 1 0 00-1-1H4a1 1 0 00-1 1v2M7 4h10M7 4v16M7 20H17M7 20v2a1 1 0 001 1h2a1 1 0 001-1v-2M7 20H4a1 1 0 01-1-1v-2a1 1 0 011-1h3" />
                </svg>
              }
              title="Numbered List"
              shortcut="1. item"
            />
            <ToolbarButton
              onClick={formatQuote}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                </svg>
              }
              title="Quote"
              shortcut="> quote"
            />
            <ToolbarButton
              onClick={formatCodeBlock}
              icon={
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              }
              title="Code Block"
              shortcut="``` code ```"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center bg-white rounded-md border border-gray-200 p-1">
            <button
              type="button"
              onClick={() => setActiveView('edit')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                activeView === 'edit' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setActiveView('split')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                activeView === 'split' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Split
            </button>
            <button
              type="button"
              onClick={() => setActiveView('preview')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                activeView === 'preview' ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div className="flex" style={{ minHeight: '400px' }}>
        {/* Editor Pane */}
        {(activeView === 'edit' || activeView === 'split') && (
          <div className={`${activeView === 'split' ? 'w-1/2 border-r border-gray-200' : 'w-full'}`}>
            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder || 'Start writing your post in Markdown...'}
              className="w-full h-full p-4 resize-none focus:outline-none font-mono text-sm leading-relaxed"
              style={{ minHeight: '400px' }}
            />
          </div>
        )}

        {/* Preview Pane */}
        {(activeView === 'preview' || activeView === 'split') && (
          <div className={`${activeView === 'split' ? 'w-1/2' : 'w-full'} bg-white overflow-y-auto`}>
            <div className="p-4">
              {value ? (
                <div className="prose prose-lg max-w-none">
                  <ReactMarkdown>{value}</ReactMarkdown>
                </div>
              ) : (
                <div className="text-gray-400 italic">
                  Start typing to see the preview...
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Markdown Help */}
      <div className="bg-gray-50 border-t border-gray-200 px-4 py-2">
        <details className="group">
          <summary className="text-sm text-gray-600 cursor-pointer hover:text-gray-900 flex items-center gap-2">
            <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Markdown Help
          </summary>
          <div className="mt-2 text-xs text-gray-500 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <div className="font-medium">Headings:</div>
              <div># H1, ## H2, ### H3</div>
            </div>
            <div>
              <div className="font-medium">Emphasis:</div>
              <div>**bold**, *italic*</div>
            </div>
            <div>
              <div className="font-medium">Lists:</div>
              <div>- bullets, 1. numbered</div>
            </div>
            <div>
              <div className="font-medium">Links:</div>
              <div>[text](url)</div>
            </div>
          </div>
        </details>
      </div>
    </div>
  );
}
