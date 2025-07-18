import Harvest from 'harvest';

export interface HarvestConfig {
  accountId: string;
  accessToken: string;
  userAgent?: string;
}

export class HarvestClient {
  private client: any;

  constructor(config: HarvestConfig) {
    this.client = new Harvest({
      subdomain: 'api',
      userAgent: config.userAgent || 'Harvest MCP Server (harvest-mcp)',
      concurrency: 1,
      auth: {
        accessToken: config.accessToken,
        accountId: config.accountId
      }
    });
  }

  // Time Entries
  async getTimeEntries(options?: any) {
    return await this.client.timeEntries.list(options);
  }

  async getTimeEntry(id: string) {
    return await this.client.timeEntries.get(id);
  }

  async createTimeEntry(data: any) {
    return await this.client.timeEntries.create(data);
  }

  async updateTimeEntry(id: string, data: any) {
    return await this.client.timeEntries.update(id, data);
  }

  async deleteTimeEntry(id: string) {
    return await this.client.timeEntries.delete(id);
  }

  // Projects
  async getProjects(options?: any) {
    return await this.client.projects.list(options);
  }

  async getProject(id: string) {
    return await this.client.projects.get(id);
  }

  // Tasks
  async getTasks(options?: any) {
    return await this.client.tasks.list(options);
  }

  async getTask(id: string) {
    return await this.client.tasks.get(id);
  }

  // Users
  async getUsers(options?: any) {
    return await this.client.users.list(options);
  }

  async getUser(id: string) {
    return await this.client.users.get(id);
  }

  async getCurrentUser() {
    return await this.client.users.me();
  }

  // Clients
  async getClients(options?: any) {
    return await this.client.clients.list(options);
  }

  async getClient(id: string) {
    return await this.client.clients.get(id);
  }

  // Reports
  async getTimeReport(options?: any) {
    return await this.client.reports.time(options);
  }

  async getExpenseReport(options?: any) {
    return await this.client.reports.expenses(options);
  }

  // Project Assignments
  async getProjectAssignments(options?: any) {
    return await this.client.userAssignments.list(options);
  }

  // Task Assignments
  async getTaskAssignments(projectId: string, options?: any) {
    return await this.client.taskAssignments.list(projectId, options);
  }
}
