/**
 * Parse and validate JSON, returning detailed error info
 */
export function parseJSON(input: string): {
  valid: boolean;
  data?: unknown;
  error?: string;
  line?: number;
  column?: number;
} {
  if (!input.trim()) {
    return { valid: false, error: 'Input is empty' };
  }

  try {
    const data = JSON.parse(input);
    return { valid: true, data };
  } catch (e) {
    const error = e as SyntaxError;
    const match = error.message.match(/at position (\d+)/);
    let line = 1;
    let column = 1;

    if (match) {
      const position = parseInt(match[1], 10);
      const lines = input.substring(0, position).split('\n');
      line = lines.length;
      column = lines[lines.length - 1].length + 1;
    }

    return {
      valid: false,
      error: error.message,
      line,
      column,
    };
  }
}

/**
 * Format JSON with proper indentation
 */
export function formatJSON(input: string, indent: number = 2): string {
  const result = parseJSON(input);
  if (!result.valid) {
    throw new Error(result.error);
  }
  return JSON.stringify(result.data, null, indent);
}

/**
 * Minify JSON (remove whitespace)
 */
export function minifyJSON(input: string): string {
  const result = parseJSON(input);
  if (!result.valid) {
    throw new Error(result.error);
  }
  return JSON.stringify(result.data);
}

/**
 * Stringify value for embedding in string
 */
export function stringifyForEmbed(input: string): string {
  const result = parseJSON(input);
  if (!result.valid) {
    throw new Error(result.error);
  }
  const standard = JSON.stringify(result.data);
  const escaped = standard.replace(/"/g, '\\"');
  return `"${escaped}"`;
}

/**
 * Detect if JSON is minified or formatted
 */
export function detectFormat(input: string): 'minified' | 'formatted' | 'unknown' {
  const trimmed = input.trim();
  if (!trimmed) return 'unknown';
  
  // Count newlines - minified has very few
  const newlineCount = (trimmed.match(/\n/g) || []).length;
  const charCount = trimmed.length;
  
  if (newlineCount === 0 || charCount / newlineCount > 100) {
    return 'minified';
  }
  return 'formatted';
}

/**
 * Get JSON stats
 */
export function getJSONStats(input: string): {
  size: number;
  sizeFormatted: string;
  keys: number;
  depth: number;
  arrays: number;
  objects: number;
} {
  const result = parseJSON(input);
  if (!result.valid) {
    return {
      size: input.length,
      sizeFormatted: formatBytes(input.length),
      keys: 0,
      depth: 0,
      arrays: 0,
      objects: 0,
    };
  }

  let keys = 0;
  let maxDepth = 0;
  let arrays = 0;
  let objects = 0;

  function traverse(obj: unknown, depth: number = 0) {
    maxDepth = Math.max(maxDepth, depth);

    if (Array.isArray(obj)) {
      arrays++;
      obj.forEach((item) => traverse(item, depth + 1));
    } else if (obj !== null && typeof obj === 'object') {
      objects++;
      const entries = Object.entries(obj);
      keys += entries.length;
      entries.forEach(([, value]) => traverse(value, depth + 1));
    }
  }

  traverse(result.data);

  return {
    size: input.length,
    sizeFormatted: formatBytes(input.length),
    keys,
    depth: maxDepth,
    arrays,
    objects,
  };
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Sort JSON keys alphabetically
 */
export function sortJSONKeys(input: string): string {
  const result = parseJSON(input);
  if (!result.valid) {
    throw new Error(result.error);
  }

  function sortKeys(obj: unknown): unknown {
    if (Array.isArray(obj)) {
      return obj.map(sortKeys);
    } else if (obj !== null && typeof obj === 'object') {
      const sorted: Record<string, unknown> = {};
      Object.keys(obj as Record<string, unknown>)
        .sort()
        .forEach((key) => {
          sorted[key] = sortKeys((obj as Record<string, unknown>)[key]);
        });
      return sorted;
    }
    return obj;
  }

  return JSON.stringify(sortKeys(result.data), null, 2);
}

/**
 * Fix common JSON issues
 */
export function tryFixJSON(input: string): string {
  let fixed = input;

  // Remove trailing commas before } or ]
  fixed = fixed.replace(/,(\s*[}\]])/g, '$1');

  // Replace single quotes with double quotes for keys and string values
  // This is a simple approach and might not work for all cases
  fixed = fixed.replace(/'([^']+)'/g, '"$1"');

  // Try to parse
  const result = parseJSON(fixed);
  if (result.valid) {
    return JSON.stringify(result.data, null, 2);
  }

  return fixed;
}
