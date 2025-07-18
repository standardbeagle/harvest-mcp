import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  // Time Entry Tools
  {
    name: 'harvest_list_time_entries',
    description: 'List time entries with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'Filter by user ID' },
        project_id: { type: 'string', description: 'Filter by project ID' },
        from: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        to: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        page: { type: 'number', description: 'Page number' },
        per_page: { type: 'number', description: 'Results per page (max 100)' }
      }
    }
  },
  {
    name: 'harvest_create_time_entry',
    description: 'Create a new time entry',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project ID' },
        task_id: { type: 'string', description: 'Task ID' },
        spent_date: { type: 'string', description: 'Date of the entry (YYYY-MM-DD)' },
        hours: { type: 'number', description: 'Hours worked' },
        notes: { type: 'string', description: 'Notes for the time entry' }
      },
      required: ['project_id', 'task_id', 'spent_date']
    }
  },
  {
    name: 'harvest_update_time_entry',
    description: 'Update an existing time entry',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Time entry ID' },
        project_id: { type: 'string', description: 'Project ID' },
        task_id: { type: 'string', description: 'Task ID' },
        spent_date: { type: 'string', description: 'Date of the entry (YYYY-MM-DD)' },
        hours: { type: 'number', description: 'Hours worked' },
        notes: { type: 'string', description: 'Notes for the time entry' }
      },
      required: ['id']
    }
  },
  {
    name: 'harvest_delete_time_entry',
    description: 'Delete a time entry',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Time entry ID to delete' }
      },
      required: ['id']
    }
  },

  // Project Tools
  {
    name: 'harvest_list_projects',
    description: 'List all projects',
    inputSchema: {
      type: 'object',
      properties: {
        is_active: { type: 'boolean', description: 'Filter by active status' },
        client_id: { type: 'string', description: 'Filter by client ID' },
        page: { type: 'number', description: 'Page number' },
        per_page: { type: 'number', description: 'Results per page (max 100)' }
      }
    }
  },
  {
    name: 'harvest_get_project',
    description: 'Get details of a specific project',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Project ID' }
      },
      required: ['id']
    }
  },

  // Task Tools
  {
    name: 'harvest_list_tasks',
    description: 'List all tasks',
    inputSchema: {
      type: 'object',
      properties: {
        is_active: { type: 'boolean', description: 'Filter by active status' },
        page: { type: 'number', description: 'Page number' },
        per_page: { type: 'number', description: 'Results per page (max 100)' }
      }
    }
  },

  // User Tools
  {
    name: 'harvest_get_current_user',
    description: 'Get information about the authenticated user',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'harvest_list_users',
    description: 'List all users in the account',
    inputSchema: {
      type: 'object',
      properties: {
        is_active: { type: 'boolean', description: 'Filter by active status' },
        page: { type: 'number', description: 'Page number' },
        per_page: { type: 'number', description: 'Results per page (max 100)' }
      }
    }
  },

  // Client Tools
  {
    name: 'harvest_list_clients',
    description: 'List all clients',
    inputSchema: {
      type: 'object',
      properties: {
        is_active: { type: 'boolean', description: 'Filter by active status' },
        page: { type: 'number', description: 'Page number' },
        per_page: { type: 'number', description: 'Results per page (max 100)' }
      }
    }
  },

  // Report Tools
  {
    name: 'harvest_time_report',
    description: 'Get time report for a date range',
    inputSchema: {
      type: 'object',
      properties: {
        from: { type: 'string', description: 'Start date (YYYY-MM-DD)' },
        to: { type: 'string', description: 'End date (YYYY-MM-DD)' },
        user_id: { type: 'string', description: 'Filter by user ID' },
        project_id: { type: 'string', description: 'Filter by project ID' },
        client_id: { type: 'string', description: 'Filter by client ID' }
      },
      required: ['from', 'to']
    }
  },

  // Assignment Tools
  {
    name: 'harvest_list_project_assignments',
    description: 'List project assignments for the current user',
    inputSchema: {
      type: 'object',
      properties: {
        page: { type: 'number', description: 'Page number' },
        per_page: { type: 'number', description: 'Results per page (max 100)' }
      }
    }
  },
  {
    name: 'harvest_list_task_assignments',
    description: 'List task assignments for a project',
    inputSchema: {
      type: 'object',
      properties: {
        project_id: { type: 'string', description: 'Project ID' },
        is_active: { type: 'boolean', description: 'Filter by active status' },
        page: { type: 'number', description: 'Page number' },
        per_page: { type: 'number', description: 'Results per page (max 100)' }
      },
      required: ['project_id']
    }
  }
];
