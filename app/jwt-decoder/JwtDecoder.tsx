'use client';

import { useState, useCallback } from 'react';

export function JwtDecoder() {
  const [input, setInput] = useState('');
  const [header, setHeader] = useState('');
  const [payload, setPayload] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [isExpired, setIsExpired] = useState<boolean | null>(null);
  const [expDate, setExpDate] = useState<Date | null>(null);

  const decodeJwt = useCallback((token: string) => {
    setError('');
    setHeader('');
    setPayload('');
    setSignature('');
    setIsExpired(null);
    setExpDate(null);

    if (!token.trim()) return;

    try {
      const parts = token.trim().split('.');
      if (parts.length !== 3) {
        setError('Invalid JWT format. Expected 3 parts separated by dots.');
        return;
      }

      // Decode header
      try {
        const headerJson = JSON.parse(atob(parts[0].replace(/-/g, '+').replace(/_/g, '/')));
        setHeader(JSON.stringify(headerJson, null, 2));
      } catch {
        setError('Failed to decode header. Invalid Base64 encoding.');
        return;
      }

      // Decode payload
      try {
        const payloadJson = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
        setPayload(JSON.stringify(payloadJson, null, 2));

        // Check expiration
        if (payloadJson.exp) {
          const exp = new Date(payloadJson.exp * 1000);
          setExpDate(exp);
          setIsExpired(exp < new Date());
        }
      } catch {
        setError('Failed to decode payload. Invalid Base64 encoding.');
        return;
      }

      // Signature (just show as-is, can't decode)
      setSignature(parts[2]);
    } catch (e) {
      setError('Failed to decode JWT: ' + (e instanceof Error ? e.message : 'Unknown error'));
    }
  }, []);

  const handleInputChange = (value: string) => {
    setInput(value);
    decodeJwt(value);
  };

  const loadSample = () => {
    const sampleJwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiZW1haWwiOiJqb2huQGV4YW1wbGUuY29tIiwiaWF0IjoxNTE2MjM5MDIyLCJleHAiOjE5MTYyNDI2MjIsInJvbGUiOiJhZG1pbiJ9.POstGetfAytaZS82wHcjoTyoqhMyxXiWdR7Nn7A29Ec';
    handleInputChange(sampleJwt);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-6">
      {/* Input */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
            JWT Token
          </label>
          <button
            onClick={loadSample}
            className="text-xs px-2 py-1 rounded hover:bg-[var(--bg-tertiary)]"
            style={{ color: 'var(--accent-blue)' }}
          >
            Load Sample
          </button>
        </div>
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          placeholder="Paste your JWT token here (e.g., eyJhbGciOiJIUzI1NiIs...)"
          className="w-full h-32 p-4 rounded-lg font-mono text-sm resize-none"
          style={{
            background: 'var(--bg-secondary)',
            border: `1px solid ${error ? 'var(--accent-red)' : header ? 'var(--accent-green)' : 'var(--border-primary)'}`,
            color: 'var(--text-primary)',
          }}
        />
        {error && (
          <p className="mt-2 text-sm" style={{ color: 'var(--accent-red)' }}>
            {error}
          </p>
        )}
      </div>

      {/* Status Bar */}
      {input.trim() && !error && (
        <div
          className="flex flex-wrap gap-4 p-4 rounded-lg"
          style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
        >
          <div className="flex items-center gap-2" style={{ color: 'var(--accent-green)' }}>
            <CheckIcon className="w-4 h-4" />
            <span className="text-sm">Valid Structure</span>
          </div>
          {isExpired !== null && (
            <div
              className="flex items-center gap-2"
              style={{ color: isExpired ? 'var(--accent-red)' : 'var(--accent-green)' }}
            >
              {isExpired ? <XIcon className="w-4 h-4" /> : <CheckIcon className="w-4 h-4" />}
              <span className="text-sm">
                {isExpired ? 'Expired' : 'Not Expired'}
                {expDate && ` (${expDate.toLocaleString()})`}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Decoded Sections */}
      {(header || payload) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                Header
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-red)', color: 'white' }}>
                  ALGORITHM
                </span>
              </label>
              <button
                onClick={() => copyToClipboard(header)}
                className="text-xs px-2 py-1 rounded hover:bg-[var(--bg-tertiary)]"
                style={{ color: 'var(--text-muted)' }}
              >
                Copy
              </button>
            </div>
            <pre
              className="p-4 rounded-lg overflow-auto text-sm font-mono h-48"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
              }}
            >
              {header}
            </pre>
          </div>

          {/* Payload */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                Payload
                <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-purple)', color: 'white' }}>
                  DATA
                </span>
              </label>
              <button
                onClick={() => copyToClipboard(payload)}
                className="text-xs px-2 py-1 rounded hover:bg-[var(--bg-tertiary)]"
                style={{ color: 'var(--text-muted)' }}
              >
                Copy
              </button>
            </div>
            <pre
              className="p-4 rounded-lg overflow-auto text-sm font-mono h-48"
              style={{
                background: 'var(--bg-tertiary)',
                color: 'var(--text-primary)',
              }}
            >
              {payload}
            </pre>
          </div>
        </div>
      )}

      {/* Signature */}
      {signature && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              Signature
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--accent-blue)', color: 'white' }}>
                VERIFY
              </span>
            </label>
          </div>
          <div
            className="p-4 rounded-lg font-mono text-sm break-all"
            style={{
              background: 'var(--bg-tertiary)',
              color: 'var(--text-muted)',
            }}
          >
            {signature}
          </div>
          <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
            This tool decodes JWTs but does not verify signatures. Never trust unverified tokens in production.
          </p>
        </div>
      )}
    </div>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}
