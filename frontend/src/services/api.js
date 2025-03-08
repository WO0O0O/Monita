import axios from 'axios';

// Create an axios instance with default config
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for debugging
api.interceptors.request.use(config => {
  console.log('API Request:', config.method.toUpperCase(), config.url, config.data);
  return config;
});

/**
 * Get all websites
 * @returns {Promise<Array>} List of websites
 */
export const getWebsites = async () => {
  try {
    const response = await api.get('/websites');
    return response.data;
  } catch (error) {
    console.error('Error fetching websites:', error);
    throw error;
  }
};

/**
 * Get a specific website by ID
 * @param {number} id Website ID
 * @returns {Promise<Object>} Website object
 */
export const getWebsite = async (id) => {
  try {
    const response = await api.get(`/websites/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching website ${id}:`, error);
    throw error;
  }
};

/**
 * Create a new website
 * @param {Object} websiteData Website data
 * @returns {Promise<Object>} Created website
 */
export const createWebsite = async (websiteData) => {
  try {
    console.log('Creating website with data:', websiteData);
    const response = await api.post('/websites', websiteData);
    console.log('Create website response:', response);
    return response.data;
  } catch (error) {
    console.error('Error creating website:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      config: error.config
    });
    throw error;
  }
};

/**
 * Update a website
 * @param {number} id Website ID
 * @param {Object} websiteData Website data to update
 * @returns {Promise<Object>} Updated website
 */
export const updateWebsite = async (id, websiteData) => {
  try {
    const response = await api.put(`/websites/${id}`, websiteData);
    return response.data;
  } catch (error) {
    console.error(`Error updating website ${id}:`, error);
    throw error;
  }
};

/**
 * Delete a website
 * @param {number} id Website ID
 * @returns {Promise<void>}
 */
export const deleteWebsite = async (id) => {
  try {
    await api.delete(`/websites/${id}`);
  } catch (error) {
    console.error(`Error deleting website ${id}:`, error);
    throw error;
  }
};

/**
 * Get the status and recent checks for a website
 * @param {number} id Website ID
 * @returns {Promise<Object>} Status information
 */
export const getWebsiteStatus = async (id) => {
  try {
    const response = await api.get(`/websites/${id}/status`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching status for website ${id}:`, error);
    throw error;
  }
};

/**
 * Get check history for a website with pagination
 * @param {number} id Website ID
 * @param {number} page Page number
 * @param {number} perPage Items per page
 * @returns {Promise<Object>} Paginated check history
 */
export const getWebsiteChecks = async (id, page = 1, perPage = 20) => {
  try {
    const response = await api.get(`/websites/${id}/checks`, {
      params: { page, per_page: perPage }
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching checks for website ${id}:`, error);
    throw error;
  }
};

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await api.get('/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export default api;
