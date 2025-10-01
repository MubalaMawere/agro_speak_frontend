// API Error handling utilities

export const handleApiError = (error, response = null) => {
  console.error('API Error:', error);

  if (!response) {
    // Network error
    if (error.message === 'Network request failed') {
      return 'Unable to connect to server. Please check your internet connection.';
    }
    return 'Network error. Please try again.';
  }

  // HTTP error responses
  switch (response.status) {
    case 400:
      return 'Invalid request. Please check your input.';
    case 401:
      return 'Invalid email or password.';
    case 403:
      return 'Access denied.';
    case 404:
      return 'Service not found. Please try again later.';
    case 500:
      return 'Server error. Please try again later.';
    default:
      return 'Something went wrong. Please try again.';
  }
};

export const isNetworkError = (error) => {
  return error.message === 'Network request failed' || 
         error.message === 'fetch failed' ||
         error.code === 'NETWORK_ERROR';
};