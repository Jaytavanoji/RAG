const BASE_URL = 'http://127.0.0.1:8000';

export const apiRequest = async (endpoint, method = 'GET', body = null, isFormData = false) => {
  const token = localStorage.getItem('token');
  
  const headers = {};
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const config = {
    method,
    headers,
  };

  if (body) {
    config.body = isFormData ? body : JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    
    let json;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      json = await response.json();
    } else {
      if (!response.ok) {
        throw new Error(`Server error: ${response.status} ${response.statusText}`);
      }
      throw new Error('Invalid response from server');
    }
    
    if (!response.ok) {
      throw new Error(json.detail || json.message || `Request failed with status ${response.status}`);
    }

    // Standardized unwrapping: if the backend returned {status, data}, return the data
    if (json.status === 'success') {
      return json.data || json.message || json;
    }

    return json;
  } catch (error) {
    console.error('API Request Error:', error);
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      throw new Error('Unable to connect to server. Please ensure the backend is running.');
    }
    if (error.message.includes('CORS') || error.message.includes('blocked')) {
      throw new Error('Connection blocked by CORS policy. Please check server configuration.');
    }
    throw error;
  }
};

export default BASE_URL;
