'use client';

import { useRef, useCallback, useEffect, useState } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import type { Monaco } from '@monaco-editor/react';
import { useTheme } from './ThemeProvider';
import copy from 'copy-to-clipboard';

// Supported languages that have Shiki highlighting
type SupportedLanguage = 
  | 'json' 
  | 'javascript' 
  | 'typescript' 
  | 'python' 
  | 'java' 
  | 'go' 
  | 'csharp' 
  | 'bash' 
  | 'xml' 
  | 'yaml' 
  | 'sql' 
  | 'html' 
  | 'css'
  | 'swift'
  | 'kotlin'
  | 'php'
  | 'rust'
  | 'plaintext';

interface JsonEditorProps {
  value: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
  height?: string;
  errorLine?: number | null;
  className?: string;
  onDrop?: (content: string) => void;
  language?: SupportedLanguage;
}

// Track if Shiki has been initialized for Monaco
let shikiInitialized = false;
let shikiInitPromise: Promise<void> | null = null;

async function initializeShikiForMonaco(monaco: Monaco): Promise<void> {
  if (shikiInitialized) return;
  
  if (shikiInitPromise) {
    await shikiInitPromise;
    return;
  }

  shikiInitPromise = (async () => {
    try {
      // Dynamic imports to avoid SSR issues
      const [{ getHighlighter }, { shikiToMonaco }] = await Promise.all([
        import('@/lib/shiki'),
        import('@shikijs/monaco')
      ]);
      
      const highlighter = await getHighlighter();
      
      // Register languages with Monaco
      const languages = [
        'json', 'javascript', 'typescript', 'python', 'java', 'go', 
        'csharp', 'bash', 'xml', 'yaml', 'sql', 'html', 'css',
        'swift', 'kotlin', 'php', 'rust', 'plaintext'
      ];
      languages.forEach(lang => {
        monaco.languages.register({ id: lang });
      });
      
      // Apply Shiki highlighting to Monaco
      shikiToMonaco(highlighter, monaco);
      
      shikiInitialized = true;
    } catch (error) {
      console.error('Failed to initialize Shiki for Monaco:', error);
      shikiInitPromise = null;
    }
  })();

  await shikiInitPromise;
}

export function JsonEditor({
  value,
  onChange,
  readOnly = false,
  height = '500px',
  errorLine,
  className = '',
  onDrop,
  language = 'json',
}: JsonEditorProps) {
  const { resolvedTheme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<Monaco | null>(null);
  const decorationsRef = useRef<editor.IEditorDecorationsCollection | null>(null);
  const [isShikiReady, setIsShikiReady] = useState(shikiInitialized);

  // Initialize Shiki when Monaco is ready
  useEffect(() => {
    if (monacoRef.current && !isShikiReady) {
      initializeShikiForMonaco(monacoRef.current).then(() => {
        setIsShikiReady(true);
      });
    }
  }, [isShikiReady]);

  const handleMount: OnMount = useCallback(async (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    
    // Initialize Shiki highlighting
    await initializeShikiForMonaco(monaco);
    setIsShikiReady(true);
    
    // Set up error highlighting
    if (errorLine !== null && errorLine !== undefined) {
      highlightError(editor, errorLine);
    }
  }, [errorLine]);

  const handleChange: OnChange = useCallback((value) => {
    onChange?.(value || '');
  }, [onChange]);

  const highlightError = useCallback((editor: editor.IStandaloneCodeEditor, line: number) => {
    if (decorationsRef.current) {
      decorationsRef.current.clear();
    }
    
    decorationsRef.current = editor.createDecorationsCollection([
      {
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: 'error-line-highlight',
          linesDecorationsClassName: 'error-line-gutter',
        },
      },
    ]);
  }, []);

  // Update error highlighting when errorLine changes
  useEffect(() => {
    if (editorRef.current && errorLine !== null && errorLine !== undefined) {
      highlightError(editorRef.current, errorLine);
    } else if (decorationsRef.current) {
      decorationsRef.current.clear();
    }
  }, [errorLine, highlightError]);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && (file.type === 'application/json' || file.name.endsWith('.json'))) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const content = event.target?.result as string;
        onDrop?.(content);
      };
      reader.readAsText(file);
    }
  }, [onDrop]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Determine theme - use Shiki theme if ready, otherwise fallback
  const editorTheme = isShikiReady
    ? (resolvedTheme === 'dark' ? 'jsonlint-dark' : 'jsonlint-light')
    : (resolvedTheme === 'dark' ? 'vs-dark' : 'light');

  return (
    <div 
      className={`relative ${className}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <Editor
        height={height}
        language={language}
        value={value}
        onChange={handleChange}
        onMount={handleMount}
        theme={editorTheme}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: 'JetBrains Mono, Fira Code, monospace',
          lineNumbers: 'on',
          folding: true,
          foldingHighlight: true,
          bracketPairColorization: { enabled: true },
          formatOnPaste: false,
          formatOnType: false,
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          tabSize: 2,
          renderLineHighlight: 'none',
          renderLineHighlightOnlyWhenFocus: false,
          cursorBlinking: 'smooth',
          smoothScrolling: true,
          padding: { top: 8, bottom: 8 },
          lineNumbersMinChars: 3,
          // IME support for Chinese (Bopomofo/Zhuyin), Japanese, Korean input methods
          // Disable features that can interfere with IME composition
          quickSuggestions: false,
          suggestOnTriggerCharacters: false,
          acceptSuggestionOnCommitCharacter: false,
          wordBasedSuggestions: 'off',
          // Allow unicode characters without highlighting them as suspicious
          unicodeHighlight: {
            ambiguousCharacters: false,
            invisibleCharacters: false,
          },
        }}
        beforeMount={(monaco) => {
          // Define fallback themes in case Shiki hasn't loaded yet
          // These will be replaced by Shiki themes once initialized
          monaco.editor.defineTheme('jsonlint-dark', {
            base: 'vs-dark',
            inherit: true,
            rules: [
              { token: 'string.key.json', foreground: '10b981' },
              { token: 'string.value.json', foreground: '3b82f6' },
              { token: 'number', foreground: 'f59e0b' },
              { token: 'keyword', foreground: '8b5cf6' },
            ],
            colors: {
              'editor.background': '#1a1d23',
              'editor.lineHighlightBackground': '#22262e',
              'editorLineNumber.foreground': '#4b5563',
              'editorLineNumber.activeForeground': '#9ca3af',
              'editor.selectionBackground': '#3b82f640',
              'editorGutter.background': '#1a1d23',
            },
          });
          
          monaco.editor.defineTheme('jsonlint-light', {
            base: 'vs',
            inherit: true,
            rules: [
              { token: 'string.key.json', foreground: '047857' },
              { token: 'string.value.json', foreground: '2563eb' },
              { token: 'number', foreground: 'd97706' },
              { token: 'keyword', foreground: '7c3aed' },
            ],
            colors: {
              'editor.background': '#ffffff',
              'editor.lineHighlightBackground': '#f8fafc',
              'editorLineNumber.foreground': '#94a3b8',
              'editorLineNumber.activeForeground': '#475569',
              'editor.selectionBackground': '#3b82f630',
              'editorGutter.background': '#f8fafc',
            },
          });
        }}
      />
      
      {/* Copy button */}
      <CopyButton text={value} className="absolute top-1.5 right-1.5 opacity-60 hover:opacity-100" />
      
      {/* Drop zone overlay */}
      {onDrop && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          {/* Shown during drag */}
        </div>
      )}
      
      <style jsx global>{`
        .error-line-highlight {
          background-color: rgba(239, 68, 68, 0.2) !important;
        }
        .error-line-gutter {
          background-color: #ef4444;
          width: 4px !important;
          margin-left: 3px;
        }
      `}</style>
    </div>
  );
}

function CopyButton({ text, className }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={`btn-secondary p-2 z-10 ${className}`}
      title="Copy to clipboard"
    >
      {copied ? (
        <CheckIcon className="w-4 h-4 text-accent-green" />
      ) : (
        <CopyIcon className="w-4 h-4" />
      )}
    </button>
  );
}

function CopyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
