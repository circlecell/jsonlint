'use client';

import { useState } from 'react';
import { JsonEditor } from '@/components/JsonEditor';
import { parseJSON } from '@/lib/json-utils';
import Ajv, { ErrorObject } from 'ajv';

const exampleSchema = `{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "name": { "type": "string" },
    "age": { "type": "integer", "minimum": 0 },
    "email": { "type": "string" }
  },
  "required": ["name", "email"]
}`;

const exampleData = `{
  "name": "John Doe",
  "age": 30,
  "email": "john@example.com"
}`;

export function JsonSchemaValidator() {
  const [schemaInput, setSchemaInput] = useState(exampleSchema);
  const [dataInput, setDataInput] = useState(exampleData);
  const [result, setResult] = useState<{
    valid: boolean;
    errors?: ErrorObject[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleValidate = () => {
    // Parse schema
    const schemaResult = parseJSON(schemaInput);
    if (!schemaResult.valid) {
      setError(`Invalid schema JSON: ${schemaResult.error}`);
      setResult(null);
      return;
    }

    // Parse data
    const dataResult = parseJSON(dataInput);
    if (!dataResult.valid) {
      setError(`Invalid data JSON: ${dataResult.error}`);
      setResult(null);
      return;
    }

    try {
      const ajv = new Ajv({ allErrors: true });
      const validate = ajv.compile(schemaResult.data as object);
      const valid = validate(dataResult.data);

      setResult({
        valid: valid as boolean,
        errors: validate.errors || undefined,
      });
      setError(null);
    } catch (e) {
      setError(`Schema error: ${(e as Error).message}`);
      setResult(null);
    }
  };

  const handleClear = () => {
    setSchemaInput('');
    setDataInput('');
    setResult(null);
    setError(null);
  };

  const handleLoadExample = () => {
    setSchemaInput(exampleSchema);
    setDataInput(exampleData);
    setResult(null);
    setError(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Schema Input */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            JSON Schema
          </label>
          <div className="editor-container">
            <JsonEditor
              value={schemaInput}
              onChange={setSchemaInput}
              height="350px"
            />
          </div>
        </div>

        {/* Data Input */}
        <div>
          <label
            className="block text-sm font-medium mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            JSON Data
          </label>
          <div className="editor-container">
            <JsonEditor
              value={dataInput}
              onChange={setDataInput}
              height="350px"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-3">
        <button className="btn btn-primary" onClick={handleValidate}>
          <ShieldIcon className="w-4 h-4" />
          Validate
        </button>
        <button className="btn btn-secondary" onClick={handleLoadExample}>
          Load Example
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

      {/* Result */}
      {result && (
        <div
          className={`p-4 rounded-lg border animate-fade-in`}
          style={{
            background: result.valid
              ? 'rgba(16, 185, 129, 0.1)'
              : 'rgba(239, 68, 68, 0.1)',
            borderColor: result.valid
              ? 'rgba(16, 185, 129, 0.3)'
              : 'rgba(239, 68, 68, 0.3)',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            {result.valid ? (
              <>
                <CheckCircleIcon className="w-5 h-5 text-accent-green" />
                <span className="font-medium text-accent-green">
                  Valid! Data matches the schema.
                </span>
              </>
            ) : (
              <>
                <XCircleIcon className="w-5 h-5 text-accent-red" />
                <span className="font-medium text-accent-red">
                  Invalid! {result.errors?.length} error(s) found.
                </span>
              </>
            )}
          </div>

          {result.errors && result.errors.length > 0 && (
            <ul className="mt-3 space-y-2">
              {result.errors.map((err, index) => (
                <li
                  key={index}
                  className="text-sm p-2 rounded"
                  style={{ background: 'var(--bg-tertiary)' }}
                >
                  <code className="text-accent-amber">
                    {err.instancePath || '/'}
                  </code>
                  <span
                    className="ml-2"
                    style={{ color: 'var(--text-secondary)' }}
                  >
                    {err.message}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
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
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
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
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}
