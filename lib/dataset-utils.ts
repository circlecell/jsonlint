import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Re-export types from the types file (these can be used in client components)
export type { DatasetCategory, DatasetField, DatasetMetadata } from './dataset-types';
export { CATEGORY_CONFIG } from './dataset-types';

import type { DatasetMetadata, DatasetCategory } from './dataset-types';

// Parse dataset metadata from markdown frontmatter
export function parseDatasetMetadata(filePath: string, slug: string): DatasetMetadata | null {
  try {
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    
    return {
      title: data.title || slug,
      description: data.description || '',
      slug,
      category: data.category || 'reference',
      tags: data.tags || [],
      records: data.records || 0,
      fields: data.fields || [],
      fileSize: data.fileSize || 'Unknown',
      lastUpdated: data.lastUpdated || new Date().toISOString().split('T')[0],
      source: data.source,
      license: data.license || 'public-domain',
      jsonPath: `/datasets/${slug}.json`,
      docPath: `/datasets/${slug}`,
    };
  } catch (error) {
    console.error(`Error parsing dataset metadata for ${slug}:`, error);
    return null;
  }
}

// Get all datasets with metadata
export function getAllDatasets(): DatasetMetadata[] {
  const datasetsDirectory = path.join(process.cwd(), 'docs/datasets');
  
  if (!fs.existsSync(datasetsDirectory)) {
    return [];
  }
  
  const files = fs.readdirSync(datasetsDirectory).filter(f => f.endsWith('.md'));
  const datasets: DatasetMetadata[] = [];
  
  for (const file of files) {
    const slug = file.replace('.md', '');
    const filePath = path.join(datasetsDirectory, file);
    const metadata = parseDatasetMetadata(filePath, slug);
    
    if (metadata) {
      datasets.push(metadata);
    }
  }
  
  return datasets;
}

// Filter datasets by category
export function filterDatasetsByCategory(
  datasets: DatasetMetadata[],
  category: DatasetCategory | 'all'
): DatasetMetadata[] {
  if (category === 'all') {
    return datasets;
  }
  return datasets.filter(d => d.category === category);
}

// Search datasets by query
export function searchDatasets(
  datasets: DatasetMetadata[],
  query: string
): DatasetMetadata[] {
  if (!query.trim()) {
    return datasets;
  }
  
  const lowerQuery = query.toLowerCase();
  
  return datasets.filter(d => {
    const searchableText = [
      d.title,
      d.description,
      ...d.tags,
      d.category,
    ].join(' ').toLowerCase();
    
    return searchableText.includes(lowerQuery);
  });
}

// Get first N records from a dataset JSON file
export async function getDatasetSample(jsonPath: string, count: number = 1): Promise<unknown> {
  try {
    const fullPath = path.join(process.cwd(), 'public', jsonPath);
    const content = fs.readFileSync(fullPath, 'utf8');
    const data = JSON.parse(content);
    
    // Handle different data structures
    if (Array.isArray(data)) {
      return data.slice(0, count);
    } else if (typeof data === 'object' && data !== null) {
      // Find the first array property
      for (const key of Object.keys(data)) {
        if (Array.isArray(data[key])) {
          return { [key]: data[key].slice(0, count) };
        }
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Error reading dataset sample from ${jsonPath}:`, error);
    return null;
  }
}
