/**
 * Detect if input contains JSONC features (comments, trailing commas)
 */
function detectJSONCFeatures(input: string): {
  hasComments: boolean;
  hasTrailingCommas: boolean;
} {
  // Check for single-line comments (// ...)
  const hasSingleLineComments = /\/\/[^\n]*/.test(input);
  // Check for multi-line comments (/* ... */)
  const hasMultiLineComments = /\/\*[\s\S]*?\*\//.test(input);
  // Check for trailing commas before } or ]
  const hasTrailingCommas = /,\s*[}\]]/.test(input);

  return {
    hasComments: hasSingleLineComments || hasMultiLineComments,
    hasTrailingCommas,
  };
}

/**
 * Detect common JSON mistakes
 */
function detectCommonMistakes(input: string): string | null {
  // Check for uppercase TRUE, FALSE, NULL (case-insensitive but not lowercase)
  if (/:\s*(TRUE|True)\b/.test(input)) {
    return 'Found "TRUE" or "True" - JSON booleans must be lowercase: true';
  }
  if (/:\s*(FALSE|False)\b/.test(input)) {
    return 'Found "FALSE" or "False" - JSON booleans must be lowercase: false';
  }
  if (/:\s*(NULL|Null)\b/.test(input)) {
    return 'Found "NULL" or "Null" - JSON null must be lowercase: null';
  }
  // Check for single quotes
  if (/'[^']*'\s*:/.test(input) || /:\s*'[^']*'/.test(input)) {
    return 'JSON requires double quotes (") not single quotes (\') for strings and keys.';
  }
  // Check for unquoted keys (simple check)
  if (/{\s*[a-zA-Z_][a-zA-Z0-9_]*\s*:/.test(input) && !/{\s*"/.test(input)) {
    return 'JSON keys must be wrapped in double quotes: {"key": value}';
  }
  return null;
}

/**
 * Detect duplicate keys in JSON (valid per spec but usually a mistake)
 * Returns array of duplicate key names found
 */
function detectDuplicateKeys(input: string): string[] {
  const duplicates: string[] = [];
  
  try {
    // Track keys per object using a stack of Sets
    // Each time we enter an object {, push a new Set
    // Each time we exit an object }, pop the Set
    const objectKeyStack: Set<string>[] = [];
    let inString = false;
    let escapeNext = false;
    let currentKey = '';
    let collectingKey = false;
    let expectingColon = false;
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      
      if (escapeNext) {
        if (collectingKey) currentKey += char;
        escapeNext = false;
        continue;
      }
      
      if (char === '\\' && inString) {
        escapeNext = true;
        if (collectingKey) currentKey += char;
        continue;
      }
      
      if (char === '"') {
        if (!inString) {
          // Starting a string - might be a key
          inString = true;
          if (objectKeyStack.length > 0 && !expectingColon) {
            collectingKey = true;
            currentKey = '';
          }
        } else {
          // Ending a string
          inString = false;
          if (collectingKey) {
            collectingKey = false;
            expectingColon = true;
          }
        }
        continue;
      }
      
      if (inString) {
        if (collectingKey) currentKey += char;
        continue;
      }
      
      // Outside of strings
      if (char === ':' && expectingColon) {
        // This confirms the string we collected was a key
        expectingColon = false;
        if (objectKeyStack.length > 0) {
          const currentObjectKeys = objectKeyStack[objectKeyStack.length - 1];
          if (currentObjectKeys.has(currentKey)) {
            if (!duplicates.includes(currentKey)) {
              duplicates.push(currentKey);
            }
          }
          currentObjectKeys.add(currentKey);
        }
        currentKey = '';
      } else if (char === '{') {
        // Entering a new object
        objectKeyStack.push(new Set<string>());
        expectingColon = false;
      } else if (char === '}') {
        // Exiting an object
        objectKeyStack.pop();
        expectingColon = false;
      } else if (char === '[' || char === ']' || char === ',') {
        // Array boundaries or comma - reset key expectation
        expectingColon = false;
      }
    }
    
  } catch {
    // If detection fails, just return empty array
  }
  
  return duplicates;
}

/**
 * Parse and validate JSON, returning detailed error info
 */
export function parseJSON(input: string): {
  valid: boolean;
  data?: unknown;
  error?: string;
  line?: number;
  column?: number;
  hint?: string;
  warning?: string;
} {
  if (!input.trim()) {
    return { valid: false, error: 'Input is empty' };
  }

  try {
    const data = JSON.parse(input);
    
    // Check for duplicate keys (valid JSON but usually a mistake)
    const duplicateKeys = detectDuplicateKeys(input);
    let warning: string | undefined;
    if (duplicateKeys.length > 0) {
      warning = `Duplicate key${duplicateKeys.length > 1 ? 's' : ''} found: "${duplicateKeys.join('", "')}". The last value will be used.`;
    }
    
    return { valid: true, data, warning };
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

    // Detect JSONC features and common mistakes, provide helpful hints
    const jsoncFeatures = detectJSONCFeatures(input);
    const commonMistake = detectCommonMistakes(input);
    let hint: string | undefined;

    if (jsoncFeatures.hasComments && jsoncFeatures.hasTrailingCommas) {
      hint = 'Your JSON contains comments and trailing commas (JSONC format). Use "Try Fix" to remove them, or use our JSONC to JSON tool.';
    } else if (jsoncFeatures.hasComments) {
      hint = 'Your JSON contains comments which are not allowed in standard JSON. Use "Try Fix" to remove them, or use our JSONC to JSON tool.';
    } else if (jsoncFeatures.hasTrailingCommas) {
      hint = 'Your JSON contains trailing commas which are not allowed in standard JSON. Use "Try Fix" to remove them.';
    } else if (commonMistake) {
      hint = commonMistake;
    }

    return {
      valid: false,
      error: error.message,
      line,
      column,
      hint,
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
