const API_BASE_URL = 'http://localhost:5000/api';

class ApiClient {
  async request(endpoint, options = {}) {
    const config = {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    let response;
    try {
      response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    } catch (networkErr) {
      throw new Error('Unable to connect to the CalcStrike server. Please ensure the backend is running.');
    }

    let data;
    try {
      data = await response.json();
    } catch (parseErr) {
      if (!response.ok) {
        throw new Error(`Server returned HTTP ${response.status}`);
      }
      return {};
    }

    if (!response.ok) {
      const errorMsg = data.error || (data.errors && data.errors[0]?.msg) || 'An error occurred';
      throw new Error(errorMsg);
    }

    return data;
  }

  get(endpoint) {
    return this.request(endpoint, { method: 'GET' });
  }

  post(endpoint, body) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(body || {}),
    });
  }
}

export default new ApiClient();
