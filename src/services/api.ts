
import axios from "axios";

// Configure base API URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// Create an axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and token refresh
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // If unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // This would be a refresh token call in a real app
        const refreshToken = localStorage.getItem("refresh-token");
        
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }
        
        // Call refresh token endpoint
        const response = await axios.post(`${API_BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });
        
        // Save new tokens
        const { token } = response.data;
        localStorage.setItem("auth-token", token);
        
        // Update authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry the original request
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh fails, log out user
        localStorage.removeItem("auth-token");
        localStorage.removeItem("refresh-token");
        
        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    // Extract the error message from the response or use a default message
    const errorMessage = error.response?.data?.message || error.message || "An error occurred";
    
    // Create a new error with the message and reject the promise
    return Promise.reject(new Error(errorMessage));
  }
);

// Auth service
export const authService = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  register: async (userData: any) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Events service
export const eventsService = {
  getAllEvents: async () => {
    const response = await api.get("/events");
    return response.data;
  },
  
  getEventById: async (id: string) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },
  
  registerForEvent: async (eventId: string, registrationData: any) => {
    const response = await api.post(`/events/${eventId}/register`, registrationData);
    return response.data;
  },
};

// User service
export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get("/users/profile");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  updateProfile: async (profileData: any) => {
    try {
      const response = await api.put("/users/profile", profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getUserEvents: async () => {
    try {
      const response = await api.get("/users/events");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  
  getUserTeams: async () => {
    try {
      const response = await api.get("/users/teams");
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};

// Councils service
export const councilsService = {
  getAllCouncils: async () => {
    const response = await api.get("/councils");
    return response.data;
  },
  
  getCouncilById: async (id: string) => {
    const response = await api.get(`/councils/${id}`);
    return response.data;
  },
  
  applyToCouncil: async (councilId: string, applicationData: any) => {
    const response = await api.post(`/councils/${councilId}/apply`, applicationData);
    return response.data;
  },
};

// Gallery service
export const galleryService = {
  getAllPhotos: async () => {
    const response = await api.get("/gallery");
    return response.data;
  },
  
  getPhotosByCategory: async (category: string) => {
    const response = await api.get(`/gallery/category/${category}`);
    return response.data;
  },
  
  getPhotosByEvent: async (eventId: string) => {
    const response = await api.get(`/gallery/event/${eventId}`);
    return response.data;
  },
};

// Teams service
export const teamsService = {
  createTeam: async (teamData: any) => {
    const response = await api.post("/teams", teamData);
    return response.data;
  },
  
  getTeamById: async (teamId: string) => {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  },
  
  updateTeam: async (teamId: string, teamData: any) => {
    const response = await api.put(`/teams/${teamId}`, teamData);
    return response.data;
  },
  
  inviteToTeam: async (teamId: string, inviteData: any) => {
    const response = await api.post(`/teams/${teamId}/invite`, inviteData);
    return response.data;
  },
  
  respondToInvite: async (inviteId: string, responseStatus: string) => {
    try {
      const apiResponse = await api.post(`/teams/invite/${inviteId}/respond`, { response: responseStatus });
      return apiResponse.data;
    } catch (error) {
      throw error;
    }
  },
};

export default api;
