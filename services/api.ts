import { authService, User } from './auth';

const API_BASE_URL = 'http://0.0.0.0:8080';

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}

export interface ListResponse {
  list_id: string;
  user_id: string;
  list_name: string;
  created_at: string;
  last_updated_at: string;
  version: number;
}

export interface TaskResponse {
  user_id: string;
  list_id: string;
  task_id: string;
  task_name: string;
  reminders: string[];
  isComplete: boolean;
  isPriority: boolean;
  isRecurring: boolean;
  createdAt: string;
  updatedAt: string;
  description?: string;
}

export interface CreateListRequest {
  user_id: string;
  list_name: string;
}

export interface CreateTaskRequest {
  user_id: string;
  list_id: string;
  task_name: string;
  reminders: string[];
  isPriority: boolean;
  isRecurring: boolean;
  list_version: number;
  description?: string;
}

class ApiClient {
  private async getAuthHeaders(): Promise<HeadersInit> {
    const token = await authService.getAccessToken();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers = await this.getAuthHeaders();
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.detail || errorMessage;
      } catch {
        // If we can't parse the error response, use the status text
        errorMessage = response.statusText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    return await response.json();
  }

  // User API methods
  async getCurrentUser(): Promise<User> {
    const userData = await authService.getCurrentUser();
    if (!userData) {
      throw new Error('No user data available');
    }
    return userData;
  }

  async getUserById(userId: string): Promise<User> {
    return this.makeRequest<User>(`/users/${userId}`);
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<User> {
    return this.makeRequest<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  // List API methods
  async createList(request: CreateListRequest): Promise<ListResponse> {
    return this.makeRequest<ListResponse>('/lists/', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getList(listId: string): Promise<ListResponse> {
    return this.makeRequest<ListResponse>(`/lists/${listId}`);
  }

  async getUserLists(userId: string): Promise<ListResponse[]> {
    return this.makeRequest<ListResponse[]>(`/lists/user/${userId}`);
  }

  async updateList(
    listId: string, 
    updates: { list_name?: string }
  ): Promise<ListResponse> {
    return this.makeRequest<ListResponse>(`/lists/${listId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteList(listId: string): Promise<{ message: string; list_id: string }> {
    return this.makeRequest(`/lists/${listId}`, {
      method: 'DELETE',
    });
  }

  async incrementListVersion(listId: string): Promise<ListResponse> {
    return this.makeRequest<ListResponse>(`/lists/${listId}/increment-version`, {
      method: 'PATCH',
    });
  }

  async getListStats(listId: string): Promise<any> {
    return this.makeRequest(`/lists/${listId}/stats`);
  }

  // Task API methods
  async createTask(request: CreateTaskRequest): Promise<TaskResponse> {
    return this.makeRequest<TaskResponse>('/tasks/', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async getTask(taskId: string): Promise<TaskResponse> {
    return this.makeRequest<TaskResponse>(`/tasks/${taskId}`);
  }

  async getListTasks(listId: string): Promise<TaskResponse[]> {
    return this.makeRequest<TaskResponse[]>(`/tasks/list/${listId}/current`);
  }

  async getListTasksForVersion(
    listId: string, 
    version: number
  ): Promise<TaskResponse[][]> {
    return this.makeRequest<TaskResponse[][]>(
      `/tasks/list/${listId}/version/${version}`
    );
  }

  async updateTask(
    taskId: string,
    updates: {
      task_name?: string;
      description?: string;
      reminders?: string[];
      isPriority?: boolean;
      isRecurring?: boolean;
      isComplete?: boolean;
    }
  ): Promise<TaskResponse> {
    return this.makeRequest<TaskResponse>(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteTask(taskId: string): Promise<void> {
    return this.makeRequest(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async toggleTaskComplete(taskId: string): Promise<TaskResponse> {
    return this.makeRequest<TaskResponse>(`/tasks/toggle-complete/${taskId}`, {
      method: 'PATCH',
    });
  }

  async toggleTaskPriority(taskId: string): Promise<TaskResponse> {
    return this.makeRequest<TaskResponse>(`/tasks/toggle-priority/${taskId}`, {
      method: 'PATCH',
    });
  }

  async toggleTaskRecurring(taskId: string): Promise<TaskResponse> {
    return this.makeRequest<TaskResponse>(`/tasks/toggle-recurring/${taskId}`, {
      method: 'PATCH',
    });
  }

  async clearList(listId: string): Promise<TaskResponse[]> {
    return this.makeRequest<TaskResponse[]>(`/tasks/clear-list/${listId}`, {
      method: 'PATCH',
    });
  }

  async rolloverList(listId: string): Promise<TaskResponse[]> {
    return this.makeRequest<TaskResponse[]>(`/tasks/rollover-list/${listId}`, {
      method: 'POST',
    });
  }

  // Shared list methods
  async getSharedList(
    shareToken: string, 
    requesterId: string
  ): Promise<ListResponse[]> {
    return this.makeRequest<ListResponse[]>(
      `/lists/shared/${shareToken}/user/${requesterId}`
    );
  }
}

export const apiClient = new ApiClient();