import axios from 'axios';

// IMPORTANT: If you are using an Android Emulator, 10.0.2.2 is the special
// IP address that points to your computer's localhost.
// If your Laravel backend is running on a different address, change it here.
const API_URL = 'http://10.0.2.2:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session-based auth like Sanctum
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});

export default apiClient;