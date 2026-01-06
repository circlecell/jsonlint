'use client';

import { useState } from 'react';
import { JsonEditor } from '@/components/JsonEditor';
import { stringifyForEmbed, parseJSON } from '@/lib/json-utils';

export function JsonStringifier() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleStringify = () => {
    if (!input.trim()) {
      setOutput('');
      setError('Input field cannot be empty');
      return;
    }

    try {
      const result = stringifyForEmbed(input);
      setOutput(result);
      setError(null);
    } catch (e) {
      setOutput('');
      setError(`Invalid JSON: ${(e as Error).message}`);
    }
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Input */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Input JSON
          </label>
          <div className="editor-container">
            <JsonEditor value={input} onChange={setInput} height="400px" />
          </div>
        </div>

        {/* Output */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Stringified Output
          </label>
          <div className="editor-container">
            <JsonEditor value={output} readOnly height="400px" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="btn btn-primary" onClick={handleStringify}>
          Stringify JSON
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
