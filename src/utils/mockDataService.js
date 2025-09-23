
// src/utils/mockDataService.js

const MOCK_DATA_PREFIX = 'mock_';

// Helper to get data from localStorage
const getMockData = (key) => {
  const data = localStorage.getItem(MOCK_DATA_PREFIX + key);
  return data ? JSON.parse(data) : [];
};

// Helper to set data to localStorage
const setMockData = (key, data) => {
  localStorage.setItem(MOCK_DATA_PREFIX + key, JSON.stringify(data));
};

// Generic CRUD operations
export const mockDataService = {
  // Read all items
  getAll: async (entityName) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    return { success: true, data: getMockData(entityName) };
  },

  // Read a single item by ID
  getById: async (entityName, id) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    const data = getMockData(entityName);
    const item = data.find(item => item.id === id);
    if (item) {
      return { success: true, data: item };
    }
    return { success: false, message: `${entityName} with id ${id} not found.` };
  },

  // Create a new item
  create: async (entityName, newItem) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    const data = getMockData(entityName);
    const id = Date.now(); // Simple ID generation
    const itemToSave = { ...newItem, id };
    data.push(itemToSave);
    setMockData(entityName, data);
    return { success: true, data: itemToSave };
  },

  // Update an existing item
  update: async (entityName, id, updatedItem) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    let data = getMockData(entityName);
    const index = data.findIndex(item => item.id === id);
    if (index !== -1) {
      data[index] = { ...data[index], ...updatedItem, id }; // Ensure ID remains
      setMockData(entityName, data);
      return { success: true, data: data[index] };
    }
    return { success: false, message: `${entityName} with id ${id} not found.` };
  },

  // Delete an item
  remove: async (entityName, id) => {
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate API delay
    let data = getMockData(entityName);
    const initialLength = data.length;
    data = data.filter(item => item.id !== id);
    setMockData(entityName, data);
    if (data.length < initialLength) {
      return { success: true, message: `${entityName} with id ${id} deleted.` };
    }
    return { success: false, message: `${entityName} with id ${id} not found.` };
  },

  // Initialize mock data for an entity (if not already present)
  initialize: (entityName, initialData) => {
    if (!localStorage.getItem(MOCK_DATA_PREFIX + entityName)) {
      setMockData(entityName, initialData);
    }
  }
};
