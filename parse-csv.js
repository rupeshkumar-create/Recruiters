const fs = require('fs');
const path = require('path');

// Read the CSV file
const csvPath = path.join(__dirname, 'tools-data.csv');
const csvContent = fs.readFileSync(csvPath, 'utf8');

// Parse CSV content
const lines = csvContent.trim().split('\n');
const headers = lines[0].split(',');

// Parse each line into a tool object
const tools = [];
for (let i = 1; i < lines.length; i++) {
  const line = lines[i];
  if (!line.trim()) continue;
  
  // Split by comma but handle commas within quotes
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  values.push(current.trim()); // Add the last value
  
  if (values.length >= 8) {
    const tool = {
      id: i.toString(),
      name: values[0] || '',
      url: values[1] || '',
      tagline: values[2] || '',
      content: values[3] || '',
      categories: values[4] || '',
      logo: values[5] || '',
      slug: values[6] || '',
      featured: values[7] === 'TRUE'
    };
    tools.push(tool);
  }
}

console.log(`Parsed ${tools.length} tools from CSV`);

// Generate the data.ts content
const dataContent = `export interface Tool {
  id: string;
  name: string;
  url: string;
  tagline: string;
  content: string;
  categories: string;
  logo: string;
  slug: string;
  featured: boolean;
}

// Local storage key
const TOOLS_STORAGE_KEY = 'ai_staffing_tools';

// All ${tools.length} tools from CSV data
const csvTools: Tool[] = ${JSON.stringify(tools, null, 2)};

// Function to load tools from local storage or use CSV data as fallback
export function loadToolsFromStorage(): Tool[] {
  if (typeof window === 'undefined') {
    return csvTools; // Return CSV data for SSR
  }

  try {
    const storedTools = localStorage.getItem(TOOLS_STORAGE_KEY);
    if (storedTools) {
      const parsedTools = JSON.parse(storedTools);
      // Validate that stored data has the expected structure
      if (Array.isArray(parsedTools) && parsedTools.length > 0) {
        return parsedTools;
      }
    }
  } catch (error) {
    console.error('Error loading tools from localStorage:', error);
  }

  // If no valid data in localStorage, save CSV data and return it
  saveToolsToStorage(csvTools);
  return csvTools;
}

// Function to save tools to local storage
export function saveToolsToStorage(tools: Tool[]): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(TOOLS_STORAGE_KEY, JSON.stringify(tools));
  } catch (error) {
    console.error('Error saving tools to localStorage:', error);
  }
}

// Function to clear tools from local storage
export function clearToolsFromStorage(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(TOOLS_STORAGE_KEY);
  } catch (error) {
    console.error('Error clearing tools from localStorage:', error);
  }
}

// Load tools (will use localStorage or fallback to CSV data)
export const mockTools = loadToolsFromStorage();

// Extract unique categories from tools
export const categories = Array.from(
  new Set(mockTools.map(tool => tool.categories).filter(Boolean))
).sort();

// Helper function to get tool by ID
export function getToolById(id: string): Tool | undefined {
  return mockTools.find(tool => tool.id === id);
}

// Helper function to get tools by category
export function getToolsByCategory(category: string): Tool[] {
  return mockTools.filter(tool => 
    tool.categories.toLowerCase().includes(category.toLowerCase())
  );
}

// Function to refresh tools data (reload from CSV)
export function refreshToolsData(): Tool[] {
  saveToolsToStorage(csvTools);
  return csvTools;
}

// Function to add a new tool
export function addTool(tool: Omit<Tool, 'id'>): Tool {
  const newTool: Tool = {
    ...tool,
    id: Date.now().toString()
  };
  
  const currentTools = loadToolsFromStorage();
  const updatedTools = [...currentTools, newTool];
  saveToolsToStorage(updatedTools);
  
  return newTool;
}

// Function to update a tool
export function updateTool(id: string, updates: Partial<Tool>): Tool | null {
  const currentTools = loadToolsFromStorage();
  const toolIndex = currentTools.findIndex(tool => tool.id === id);
  
  if (toolIndex === -1) return null;
  
  const updatedTool = { ...currentTools[toolIndex], ...updates, id };
  currentTools[toolIndex] = updatedTool;
  saveToolsToStorage(currentTools);
  
  return updatedTool;
}

// Function to delete a tool
export function deleteTool(id: string): boolean {
  const currentTools = loadToolsFromStorage();
  const filteredTools = currentTools.filter(tool => tool.id !== id);
  
  if (filteredTools.length === currentTools.length) return false;
  
  saveToolsToStorage(filteredTools);
  return true;
}`;

// Write the updated data.ts file
const dataPath = path.join(__dirname, 'src', 'lib', 'data.ts');
fs.writeFileSync(dataPath, dataContent);

console.log(`Generated data.ts with ${tools.length} tools and local storage functionality`);
console.log('Categories found:', [...new Set(tools.map(t => t.categories).filter(Boolean))].sort());