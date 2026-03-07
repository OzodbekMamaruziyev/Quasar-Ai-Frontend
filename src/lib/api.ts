// API Configuration
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  timestamp: string;
}

export interface ApiError {
  success: false;
  statusCode: number;
  message: string;
  errors?: Array<{ field: string; message: string }>;
  timestamp: string;
}

// API Client
class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_URL;
  }

  private getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('accessToken');
    }
    return null;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    signal?: AbortSignal
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    const token = this.getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        signal,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        throw error;
      }
      console.error('API Error:', error);
      throw error;
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' }, signal);
  }

  async post<T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    }, signal);
  }

  async patch<T>(endpoint: string, body: unknown, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(body),
    }, signal);
  }

  async delete<T>(endpoint: string, signal?: AbortSignal): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' }, signal);
  }
}


export const api = new ApiClient();

// Auth API
export const authApi = {
  signup: (data: { name: string; email: string; password: string }) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/signup', data),
  
  login: (data: { email: string; password: string }) =>
    api.post<{ user: User; accessToken: string; refreshToken: string }>('/auth/login', data),
  
  logout: (refreshToken: string) =>
    api.post('/auth/logout', { refreshToken }),
  
  refresh: (refreshToken: string) =>
    api.post<{ accessToken: string; refreshToken: string }>('/auth/refresh', { refreshToken }),
};

// Users API
export const usersApi = {
  getMe: () => api.get<User>('/users/me'),
  updateMe: (data: Partial<User>) => api.patch<User>('/users/me', data),
  getUsage: () => api.get<{
    totalGenerations: number;
    monthlyGenerations: number;
    totalTokensUsed: number;
    dailyStats: Array<{ date: string; generations: number; tokensUsed: number }>;
  }>('/users/me/usage'),
  getCredits: () => api.get<{ credits: number; plan: string; unlimited: boolean }>('/users/me/credits'),
  deleteAccount: () => api.delete('/users/me'),
  uploadAvatar: (formData: FormData) => {
    const token = localStorage.getItem('accessToken');
    return fetch(`${API_URL}/users/avatar`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    }).then(res => res.json());
  },
};

// Projects API
export const projectsApi = {
  getAll: (params?: { status?: string; search?: string; page?: number; limit?: number }) => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    const query = queryParams.toString();
    return api.get<{ data: Project[]; meta: { total: number; page: number; limit: number; totalPages: number } }>(`/projects${query ? `?${query}` : ''}`);
  },
  
  getById: (id: string) => api.get<Project & { chatMessages: ChatMessage[] }>(`/projects/${id}`),
  
  create: (data: CreateProjectData) => api.post<Project>('/projects', data),
  
  update: (id: string, data: Partial<Project>) => api.patch<Project>(`/projects/${id}`, data),
  
  delete: (id: string) => api.delete(`/projects/${id}`),
  
  archive: (id: string) => api.patch<{ message: string; data: Project }>(`/projects/${id}/archive`, {}),
};

// AI API
export const aiApi = {
  generate: (data: { prompt: string; projectId?: string; model?: string }, signal?: AbortSignal) =>
    api.post<{ 
      project: any;
      tokensUsed: number;
      model: string;
      provider: string;
      creditsLeft: number | null;
    }>('/ai/generate', data, signal),
  
  generateStream: (data: { prompt: string; projectId?: string; model?: string }, onChunk: (chunk: { content: string; tokensUsed?: number }) => void) => {
    const token = localStorage.getItem('accessToken');
    return fetch(`${API_URL}/ai/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }).then(async (response) => {
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      
      if (!reader) throw new Error('No response body');
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n').filter(line => line.trim() !== '');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') return;
            try {
              const parsed = JSON.parse(data);
              if (parsed.error) throw new Error(parsed.error);
              onChunk(parsed);
            } catch (e) {
              // Ignore incomplete chunks
            }
          }
        }
      }
    });
  },
  
  chat: (data: { message: string; projectId?: string; model?: string }, signal?: AbortSignal) =>
    api.post<{ message: string; tokensUsed: number; provider: string; timestamp: string }>('/ai/chat', data, signal),
  
  chatWithProject: (projectId: string, data: { message: string; model?: string }, signal?: AbortSignal) =>
    api.post<{ message: string; timestamp: string }>(`/ai/chat/${projectId}`, data, signal),

  
  getHistory: () =>
    api.get<Array<{
      id: string;
      type: string;
      prompt: string;
      result?: string;
      tokensUsed?: number;
      projectId?: string;
      projectName?: string;
      createdAt: string;
    }>>('/ai/history'),

  deleteHistory: (id: string) =>
    api.post(`/ai/history/${id}/delete`, {}),
};

// Billing API
export const billingApi = {
  getPlans: () => api.get<Plan[]>('/billing/plans'),
  
  createCheckoutSession: (planId: string) =>
    api.post<{ url: string }>('/billing/create-checkout-session', { planId }),
  
  getInvoices: () => api.get<Invoice[]>('/billing/invoices'),
  
  cancelSubscription: () => api.post<{ success: boolean; message: string }>('/billing/cancel', {}),
};

// Files API
export const filesApi = {
  downloadZip: async (projectId: string) => {
    const token = localStorage.getItem('accessToken');
    const url = `${API_URL}/files/download/${projectId}`;
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Download failed');
      }
      
      // Get the blob and create a download link
      const blob = await response.blob();
      const contentDisposition = response.headers.get('Content-Disposition');
      let filename = 'project.zip';
      
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch) {
          filename = filenameMatch[1];
        }
      }
      
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Download error:', error);
      throw error;
    }
  },
  
  getProjectFiles: (projectId: string) =>
    api.get<{
      project: Project;
      files: Array<{
        generationId: string;
        files: Array<{ path: string; content: string }>;
        createdAt: string;
      }>;
    }>(`/files/project/${projectId}`),
};

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  username: string;
  bio?: string;
  avatar?: string;
  plan: 'FREE' | 'PRO' | 'TEAM';
  timezone: string;
  language: string;
  theme: string;
  createdAt: string;
  _count?: { projects: number };
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'ACTIVE' | 'DRAFT' | 'PUBLISHED' | 'ARCHIVED';
  screens: number;
  gradient?: string;
  tags: string[];
  totalAiGenerations: number;
  code?: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  codeBlock?: string;
  timestamp: string;
  projectId?: string;
}

export interface CreateProjectData {
  name: string;
  description?: string;
  gradient?: string;
  tags?: string[];
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  popular: boolean;
  features: Array<{ text: string; included: boolean }>;
}

export interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: 'paid' | 'pending' | 'failed';
  plan: string;
}
