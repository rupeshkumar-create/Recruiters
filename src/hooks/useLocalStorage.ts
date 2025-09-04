'use client';

import { useState, useEffect } from 'react';
import { Tool, csvTools, initializeLocalStorage, getToolsFromStorage, saveToolsToStorage } from '../lib/data';

export function useLocalStorageTools() {
  const [tools, setTools] = useState<Tool[]>(csvTools);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Initialize local storage and load tools on client side
    initializeLocalStorage();
    const storedTools = getToolsFromStorage();
    setTools(storedTools);
    setIsLoaded(true);
  }, []);

  const updateTools = (newTools: Tool[]) => {
    setTools(newTools);
    saveToolsToStorage(newTools);
  };

  const addTool = (tool: Omit<Tool, 'id'>) => {
    const newTool: Tool = {
      ...tool,
      id: Date.now().toString()
    };
    const updatedTools = [...tools, newTool];
    updateTools(updatedTools);
    return newTool;
  };

  const updateTool = (id: string, updates: Partial<Tool>) => {
    const toolIndex = tools.findIndex(tool => tool.id === id);
    if (toolIndex === -1) return null;

    const updatedTool = { ...tools[toolIndex], ...updates, id };
    const updatedTools = [...tools];
    updatedTools[toolIndex] = updatedTool;
    updateTools(updatedTools);
    return updatedTool;
  };

  const deleteTool = (id: string) => {
    const filteredTools = tools.filter(tool => tool.id !== id);
    if (filteredTools.length === tools.length) return false;
    updateTools(filteredTools);
    return true;
  };

  const resetToDefault = () => {
    updateTools(csvTools);
  };

  return {
    tools,
    isLoaded,
    addTool,
    updateTool,
    deleteTool,
    resetToDefault,
    updateTools
  };
}