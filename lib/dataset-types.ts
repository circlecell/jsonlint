// Dataset categories
export type DatasetCategory = 
  | 'api-mocks'
  | 'geographic'
  | 'reference'
  | 'configuration'
  | 'testing';

export const CATEGORY_CONFIG: Record<DatasetCategory, { label: string; color: string; icon: string }> = {
  'api-mocks': { label: 'API Mocks', color: 'var(--accent-green)', icon: 'users' },
  'geographic': { label: 'Geographic', color: 'var(--accent-blue)', icon: 'globe' },
  'reference': { label: 'Reference', color: 'var(--accent-purple)', icon: 'book' },
  'configuration': { label: 'Configuration', color: 'var(--accent-amber)', icon: 'settings' },
  'testing': { label: 'Testing', color: 'var(--accent-red)', icon: 'flask' },
};

// Field definition for dataset schema
export interface DatasetField {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description?: string;
}

// Enhanced dataset metadata
export interface DatasetMetadata {
  // Basic info
  title: string;
  description: string;
  slug: string;
  
  // Categorization
  category: DatasetCategory;
  tags: string[];
  
  // Data info
  records: number;
  fields: DatasetField[];
  fileSize: string;
  
  // Meta
  lastUpdated: string;
  source?: string;
  license: 'public-domain' | 'cc0' | 'cc-by' | 'mit' | 'other';
  
  // Paths
  jsonPath: string;
  docPath: string;
}
