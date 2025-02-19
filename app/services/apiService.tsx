const BASE_URL = 'http://192.168.8.152:5001';

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

class ApiService {
  /**
   * Makes a GET request to the given endpoint.
   * @param endpoint - The API endpoint (e.g., '/users').
   * @returns A promise that resolves to the response data.
   */
  static async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`);
      if (!response.ok) {
        const errorData = await response.json();
        console.log(response);
        throw new Error(`Error ${response.status}: ${errorData.message || response.statusText}`);
      }
      return response.json();
    } catch (error: any) {
      console.log(`GET request failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Makes a POST request to the given endpoint.
   * @param endpoint - The API endpoint (e.g., '/users').
   * @param payload - The data to send in the body of the request.
   * @returns A promise that resolves to the response data.
   */

  static async post<T>(endpoint: string, payload: object): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
      });
  
      const responseData = await response.json(); 
  
      console.log('Response:', responseData);
  
      if (!response.ok) {
        console.log('Error Data:', responseData);
        throw new Error(`${responseData.error}`);
      }
  
      return responseData;
    } catch (error: any) {
      console.log(`POST request failed: ${error}`);
      return Promise.reject({ error });
    }
  }
  
}

export default ApiService;