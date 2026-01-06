'use client';

import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { JsonEditor } from '@/components/JsonEditor';
import { useTheme } from '@/components/ThemeProvider';
import { XMLParser } from 'fast-xml-parser';

export function XmlToJsonConverter() {
  const { resolvedTheme } = useTheme();
  const [xmlInput, setXmlInput] = useState('');
  const [jsonOutput, setJsonOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleConvert = () => {
    if (!xmlInput.trim()) {
      setError('XML field cannot be empty');
      setJsonOutput('');
      return;
    }

    try {
      const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: '@_',
      });
      const result = parser.parse(xmlInput);
      setJsonOutput(JSON.stringify(result, null, 2));
      setError(null);
    } catch (e) {
      setError(`Invalid XML: ${(e as Error).message}`);
      setJsonOutput('');
    }
  };

  const handleClear = () => {
    setXmlInput('');
    setJsonOutput('');
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* XML Input */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Input XML
          </label>
          <div className="editor-container">
            <Editor
              height="400px"
              language="xml"
              value={xmlInput}
              onChange={(value) => setXmlInput(value || '')}
              theme={resolvedTheme === 'dark' ? 'vs-dark' : 'light'}
              options={{
                minimap: { enabled: false },
                fontSize: 13,
                fontFamily: 'JetBrains Mono, Fira Code, monospace',
                lineNumbers: 'on',
                folding: true,
                automaticLayout: true,
                scrollBeyondLastLine: false,
                wordWrap: 'on',
                tabSize: 2,
                padding: { top: 12, bottom: 12 },
              }}
            />
          </div>
        </div>

        {/* JSON Output */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Output JSON
          </label>
          <div className="editor-container">
            <JsonEditor value={jsonOutput} readOnly height="400px" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="btn btn-primary" onClick={handleConvert}>
          <ArrowRightIcon className="w-4 h-4" />
          Convert to JSON
        </button>
        <button className="btn btn-secondary" onClick={handleClear}>
          Clear
        </button>
      </div>

      {/* Error */}
      {error && (
        <div
          className="p-4 rounded-lg border animate-fade-in"
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.3)',
          }}
        >
          <span className="text-accent-red">{error}</span>
        </div>
      )}
    </div>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
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
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}
