// import axios from 'axios';

// // IMPORTANT: If you are using an Android Emulator, 10.0.2.2 is the special
// // IP address that points to your computer's localhost.
// // If your Laravel backend is running on a different address, change it here.
// const API_URL = 'http://10.0.2.2:8000/api';

// const apiClient = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // Important for session-based auth like Sanctum
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   }
// });

// export default apiClient;

import axios from 'axios';

// This is the URL for your live production API
const API_URL = 'https://api.dekush.in/api';

const apiClient = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Important for session-based auth like Sanctum
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  }
});
// This part automatically adds the auth token to every request if it exists
apiClient.interceptors.request.use(async (config) => {
    // You might need to get the token from AsyncStorage here if you have issues
    // but the AuthContext usually handles setting the header on login.
    return config;
});

export default apiClient;