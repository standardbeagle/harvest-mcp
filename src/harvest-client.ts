export interface HarvestConfig {
  accountId: string;
  accessToken: string;
  userAgent?: string;
}

export class HarvestClient {
  private accountId: string;
  private accessToken: string;
  private userAgent: string;
  private baseUrl = 'https://api.harvestapp.com/v2';

  constructor(config: HarvestConfig) {
    this.accountId = config.accountId;
    this.accessToken = config.accessToken;
    this.userAgent = config.userAgent || 'Harvest MCP Server (harvest-mcp)';
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.accessToken}`,
        'Harvest-Account-ID': this.accountId,
        'User-Agent': this.userAgent,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `Harvest API error: ${response.status} ${response.statusText}`;
      
      try {
        const errorBody = await response.json() as any;
        if (errorBody.message) {
          errorMessage += ` - ${errorBody.message}`;
        }
      } catch {
        // If we can't parse the error response, use the basic error message
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  private buildQueryString(params?: Record<string, any>): string {
    if (!params) return '';
    
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  // Time Entries
  async getTimeEntries(options?: any) {
    const queryString = this.buildQueryString(options);
    return this.makeRequest(`/time_entries${queryString}`);
  }

  async getTimeEntry(id: string) {
    return this.makeRequest(`/time_entries/${id}`);
  }

  async createTimeEntry(data: any) {
    return this.makeRequest('/time_entries', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTimeEntry(id: string, data: any) {
    return this.makeRequest(`/time_entries/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteTimeEntry(id: string) {
    return this.makeRequest(`/time_entries/${id}`, {
      method: 'DELETE',
    });
  }

  // Timer Operations
  async restartTimer(id: string) {
    return this.makeRequest(`/time_entries/${id}/restart`, {
      method: 'PATCH',
    });
  }

  async stopTimer(id: string) {
    return this.makeRequest(`/time_entries/${id}/stop`, {
      method: 'PATCH',
    });
  }

  // Projects
  async getProjects(options?: any) {
    const queryString = this.buildQueryString(options);
    return this.makeRequest(`/projects${queryString}`);
  }

  async getProject(id: string) {
    return this.makeRequest(`/projects/${id}`);
  }

  // Tasks
  async getTasks(options?: any) {
    const queryString = this.buildQueryString(options);
    return this.makeRequest(`/tasks${queryString}`);
  }

  async getTask(id: string) {
    return this.makeRequest(`/tasks/${id}`);
  }

  // Users
  async getUsers(options?: any) {
    const queryString = this.buildQueryString(options);
    return this.makeRequest(`/users${queryString}`);
  }

  async getUser(id: string) {
    return this.makeRequest(`/users/${id}`);
  }

  async getCurrentUser() {
    return this.makeRequest('/users/me');
  }

  // Clients
  async getClients(options?: any) {
    const queryString = this.buildQueryString(options);
    return this.makeRequest(`/clients${queryString}`);
  }

  async getClient(id: string) {
    return this.makeRequest(`/clients/${id}`);
  }

  // Reports  
  async getTimeReport(options?: any) {
    const queryString = this.buildQueryString(options);
    return this.makeRequest(`/reports/time/team${queryString}`);
  }

  // Project Assignments
  async getProjectAssignments(options?: any) {
    const queryString = this.buildQueryString(options);
    return this.makeRequest(`/users/me/project_assignments${queryString}`);
  }

  // Task Assignments
  async getTaskAssignments(projectId: string, options?: any) {
    const queryString = this.buildQueryString(options);
    return this.makeRequest(`/projects/${projectId}/task_assignments${queryString}`);
  }
}
