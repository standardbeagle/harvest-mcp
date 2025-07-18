import { describe, test, expect, beforeAll, afterAll } from 'vitest';
import { createMCPTestClient, callMCPTool, type MCPTestClient } from './test-utils.js';

describe('Harvest MCP Server - Read-Only Integration Tests', () => {
  let mcpClient: MCPTestClient;

  beforeAll(async () => {
    mcpClient = await createMCPTestClient();
  });

  afterAll(async () => {
    if (mcpClient) {
      await mcpClient.cleanup();
    }
  });

  describe('MCP Server Setup', () => {
    test('should list all available tools', async () => {
      const tools = await mcpClient.client.listTools();
      
      expect(tools.tools).toBeDefined();
      expect(tools.tools.length).toBe(17);
      
      // Verify all expected tools are present
      const toolNames = tools.tools.map(tool => tool.name);
      const expectedTools = [
        'harvest_list_time_entries',
        'harvest_create_time_entry',
        'harvest_update_time_entry',
        'harvest_delete_time_entry',
        'harvest_list_projects',
        'harvest_get_project',
        'harvest_list_tasks',
        'harvest_get_current_user',
        'harvest_list_users',
        'harvest_list_clients',
        'harvest_time_report',
        'harvest_list_project_assignments',
        'harvest_list_task_assignments',
        'harvest_restart_timer',
        'harvest_stop_timer',
        'about',
        'version'
      ];
      
      expectedTools.forEach(toolName => {
        expect(toolNames).toContain(toolName);
      });
    });
  });

  describe('User Management (Read-Only)', () => {
    test('should get current user information', async () => {
      const user = await callMCPTool(mcpClient.client, 'harvest_get_current_user');
      
      expect(user).toBeDefined();
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('first_name');
      expect(user).toHaveProperty('last_name');
      expect(user).toHaveProperty('email');
      expect(typeof user.id).toBe('number');
      expect(typeof user.email).toBe('string');
    });

    test('should list all users in account', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_users');
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('users');
      expect(Array.isArray(response.users)).toBe(true);
      
      if (response.users.length > 0) {
        const user = response.users[0];
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('first_name');
        expect(user).toHaveProperty('last_name');
        expect(user).toHaveProperty('email');
      }
    });

    test('should filter active users only', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_users', { 
        is_active: true 
      });
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('users');
      
      // All returned users should be active
      response.users.forEach((user: any) => {
        expect(user.is_active).toBe(true);
      });
    });
  });

  describe('Project Management (Read-Only)', () => {
    let testProjectId: number;

    test('should list all projects', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_projects');
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('projects');
      expect(Array.isArray(response.projects)).toBe(true);
      
      if (response.projects.length > 0) {
        const project = response.projects[0];
        testProjectId = project.id;
        
        expect(project).toHaveProperty('id');
        expect(project).toHaveProperty('name');
        expect(project).toHaveProperty('client');
        expect(typeof project.id).toBe('number');
        expect(typeof project.name).toBe('string');
      }
    });

    test('should get specific project details', async () => {
      if (!testProjectId) {
        // Get a project ID first
        const projectsResponse = await callMCPTool(mcpClient.client, 'harvest_list_projects');
        if (projectsResponse.projects.length === 0) {
          console.warn('No projects found in Harvest account - skipping project detail test');
          return;
        }
        testProjectId = projectsResponse.projects[0].id;
      }
      
      const project = await callMCPTool(mcpClient.client, 'harvest_get_project', { 
        id: testProjectId.toString() 
      });
      
      expect(project).toBeDefined();
      expect(project.id).toBe(testProjectId);
      expect(project).toHaveProperty('name');
      expect(project).toHaveProperty('client');
      expect(project).toHaveProperty('is_active');
    });

    test('should filter active projects only', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_projects', { 
        is_active: true 
      });
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('projects');
      
      // All returned projects should be active
      response.projects.forEach((project: any) => {
        expect(project.is_active).toBe(true);
      });
    });
  });

  describe('Task Management (Read-Only)', () => {
    test('should list all tasks', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_tasks');
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('tasks');
      expect(Array.isArray(response.tasks)).toBe(true);
      
      if (response.tasks.length > 0) {
        const task = response.tasks[0];
        expect(task).toHaveProperty('id');
        expect(task).toHaveProperty('name');
        expect(typeof task.id).toBe('number');
        expect(typeof task.name).toBe('string');
      }
    });

    test('should filter active tasks only', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_tasks', { 
        is_active: true 
      });
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('tasks');
      
      // All returned tasks should be active
      response.tasks.forEach((task: any) => {
        expect(task.is_active).toBe(true);
      });
    });
  });

  describe('Client Management (Read-Only)', () => {
    test('should list all clients', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_clients');
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('clients');
      expect(Array.isArray(response.clients)).toBe(true);
      
      if (response.clients.length > 0) {
        const client = response.clients[0];
        expect(client).toHaveProperty('id');
        expect(client).toHaveProperty('name');
        expect(typeof client.id).toBe('number');
        expect(typeof client.name).toBe('string');
      }
    });

    test('should filter active clients only', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_clients', { 
        is_active: true 
      });
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('clients');
      
      // All returned clients should be active
      response.clients.forEach((client: any) => {
        expect(client.is_active).toBe(true);
      });
    });
  });

  describe('Time Entry Management (Read-Only)', () => {
    test('should list time entries', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_time_entries');
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('time_entries');
      expect(Array.isArray(response.time_entries)).toBe(true);
      
      if (response.time_entries.length > 0) {
        const timeEntry = response.time_entries[0];
        expect(timeEntry).toHaveProperty('id');
        expect(timeEntry).toHaveProperty('hours');
        expect(timeEntry).toHaveProperty('spent_date');
        expect(timeEntry).toHaveProperty('project');
        expect(timeEntry).toHaveProperty('task');
        expect(typeof timeEntry.id).toBe('number');
        expect(typeof timeEntry.hours).toBe('number');
      }
    });

    test('should filter time entries by date range', async () => {
      const today = new Date();
      const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      
      const response = await callMCPTool(mcpClient.client, 'harvest_list_time_entries', {
        from: lastWeek.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0]
      });
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('time_entries');
      expect(Array.isArray(response.time_entries)).toBe(true);
      
      // The API should return time_entries array (may be empty for the date range)
      // This tests that the date filtering parameters are accepted by the API
      if (response.time_entries.length > 0) {
        console.log(`Found ${response.time_entries.length} time entries in date range`);
        // Check that the first entry has a valid date format
        const entry = response.time_entries[0];
        expect(entry).toHaveProperty('spent_date');
        expect(typeof entry.spent_date).toBe('string');
      }
    });

    test('should handle pagination parameters', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_time_entries', {
        page: 1,
        per_page: 5
      });
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('time_entries');
      expect(Array.isArray(response.time_entries)).toBe(true);
      
      // Should return at most 5 entries
      expect(response.time_entries.length).toBeLessThanOrEqual(5);
    });
  });

  describe('Assignment Management (Read-Only)', () => {
    test('should list project assignments for current user', async () => {
      const response = await callMCPTool(mcpClient.client, 'harvest_list_project_assignments');
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('project_assignments');
      expect(Array.isArray(response.project_assignments)).toBe(true);
      
      if (response.project_assignments.length > 0) {
        const assignment = response.project_assignments[0];
        expect(assignment).toHaveProperty('id');
        expect(assignment).toHaveProperty('project');
        expect(assignment).toHaveProperty('client');
        expect(typeof assignment.id).toBe('number');
      }
    });

    test('should list task assignments for a project', async () => {
      // First get a project ID
      const projectsResponse = await callMCPTool(mcpClient.client, 'harvest_list_projects');
      
      if (projectsResponse.projects.length === 0) {
        console.warn('No projects found - skipping task assignments test');
        return;
      }
      
      const projectId = projectsResponse.projects[0].id;
      const response = await callMCPTool(mcpClient.client, 'harvest_list_task_assignments', {
        project_id: projectId.toString()
      });
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('task_assignments');
      expect(Array.isArray(response.task_assignments)).toBe(true);
      
      if (response.task_assignments.length > 0) {
        const assignment = response.task_assignments[0];
        expect(assignment).toHaveProperty('id');
        expect(assignment).toHaveProperty('task');
        expect(typeof assignment.id).toBe('number');
      }
    });
  });

  describe('Reporting (Read-Only)', () => {
    test('should generate time report for date range', async () => {
      const today = new Date();
      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const response = await callMCPTool(mcpClient.client, 'harvest_time_report', {
        from: lastMonth.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0]
      });
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('results');
      expect(Array.isArray(response.results)).toBe(true);
      
      if (response.results.length > 0) {
        const entry = response.results[0];
        // The team time report has different structure - verify core fields exist
        expect(entry).toHaveProperty('user_id');
        expect(typeof entry.user_id).toBe('number');
        // Time reports successfully returned data
        console.log('Time report entry structure:', Object.keys(entry));
      }
    });

    test('should handle time report pagination', async () => {
      const today = new Date();
      const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      
      const response = await callMCPTool(mcpClient.client, 'harvest_time_report', {
        from: lastMonth.toISOString().split('T')[0],
        to: today.toISOString().split('T')[0],
        page: 1,
        per_page: 10
      });
      
      expect(response).toBeDefined();
      expect(response).toHaveProperty('results');
      expect(Array.isArray(response.results)).toBe(true);
      
      // Should return at most 10 entries
      expect(response.results.length).toBeLessThanOrEqual(10);
    });
  });

  describe('About Tool', () => {
    test('should return general MCP server information when called without parameters', async () => {
      const response = await callMCPTool(mcpClient.client, 'about');
      
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(response).toContain('Harvest MCP Server');
      expect(response).toContain('Model Context Protocol');
      expect(response).toContain('15 specialized tools');
      expect(response).toContain('Time Entry Management');
    });

    test('should return specific tool information when tool parameter is provided', async () => {
      const response = await callMCPTool(mcpClient.client, 'about', { 
        tool: 'harvest_create_time_entry' 
      });
      
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(response).toContain('harvest_create_time_entry');
      expect(response).toContain('Creates a new time entry');
      expect(response).toContain('project_id');
      expect(response).toContain('task_id');
      expect(response).toContain('Example Usage');
    });

    test('should handle unknown tool name gracefully', async () => {
      const response = await callMCPTool(mcpClient.client, 'about', { 
        tool: 'unknown_tool' 
      });
      
      expect(response).toBeDefined();
      expect(typeof response).toBe('string');
      expect(response).toContain('Tool "unknown_tool" not found');
      expect(response).toContain('Available tools:');
    });
  });

  describe('Version Tool', () => {
    test('should return version information', async () => {
      const response = await callMCPTool(mcpClient.client, 'version');
      
      expect(response).toBeDefined();
      expect(typeof response).toBe('object');
      
      // Response is already parsed as JSON object by callMCPTool
      expect(response).toHaveProperty('name', 'harvest-mcp');
      expect(response).toHaveProperty('version', '1.0.0');
      expect(response).toHaveProperty('description');
      expect(response).toHaveProperty('mcpVersion', '2025-06-18');
      expect(response).toHaveProperty('harvestApiVersion', 'v2');
    });
  });

  describe('Error Handling', () => {
    test('should handle invalid project ID gracefully', async () => {
      await expect(
        callMCPTool(mcpClient.client, 'harvest_get_project', { id: '99999999' })
      ).rejects.toThrow();
    });

    test('should handle invalid date format gracefully', async () => {
      await expect(
        callMCPTool(mcpClient.client, 'harvest_list_time_entries', { 
          from: 'invalid-date',
          to: '2024-01-01'
        })
      ).rejects.toThrow();
    });

    test('should handle unknown tool name gracefully', async () => {
      const response = await mcpClient.client.callTool({ name: 'harvest_unknown_tool', arguments: {} });
      const typedResponse = response as any;
      
      expect(typedResponse.isError).toBe(true);
      expect(typedResponse.content?.[0]?.text).toContain('Unknown tool');
    });
  });
});