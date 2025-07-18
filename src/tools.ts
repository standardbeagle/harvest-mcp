import { Tool } from '@modelcontextprotocol/sdk/types.js';

export const tools: Tool[] = [
  // Time Entry Tools
  {
    name: 'harvest_list_time_entries',
    description: 'List time entries with optional filters. Use about {"tool": "harvest_list_time_entries"} for detailed usage examples.',
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
    description: 'Create a new time entry. Use about {"tool": "harvest_create_time_entry"} for detailed parameters and examples.',
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
    description: 'Update an existing time entry. Use about {"tool": "harvest_update_time_entry"} for detailed parameters and examples.',
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
    description: 'Delete a time entry. Use about {"tool": "harvest_delete_time_entry"} for detailed usage and warnings.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Time entry ID to delete' }
      },
      required: ['id']
    }
  },
  {
    name: 'harvest_restart_timer',
    description: 'Restart a stopped time entry timer. Use about {"tool": "harvest_restart_timer"} for detailed workflow and examples.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Time entry ID' }
      },
      required: ['id']
    }
  },
  {
    name: 'harvest_stop_timer',
    description: 'Stop a running time entry timer. Use about {"tool": "harvest_stop_timer"} for detailed workflow and examples.',
    inputSchema: {
      type: 'object',
      properties: {
        id: { type: 'string', description: 'Time entry ID' }
      },
      required: ['id']
    }
  },
  {
    name: 'about',
    description: 'Get detailed information about the Harvest MCP server and its tools. Call about without parameters for general info, or with {"tool": "tool_name"} for specific tool documentation.',
    inputSchema: {
      type: 'object',
      properties: {
        tool: { type: 'string', description: 'Optional: specific tool name to get detailed information about' }
      }
    }
  },
  {
    name: 'version',
    description: 'Get version information about the Harvest MCP server.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },

  // Project Tools
  {
    name: 'harvest_list_projects',
    description: 'List all projects with filtering options. Use about {"tool": "harvest_list_projects"} for detailed parameters and examples.',
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
    description: 'Get details of a specific project. Use about {"tool": "harvest_get_project"} for detailed usage examples.',
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
    description: 'List all tasks with filtering options. Use about {"tool": "harvest_list_tasks"} for detailed parameters and examples.',
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
    description: 'Get information about the authenticated user. Use about {"tool": "harvest_get_current_user"} for detailed response format.',
    inputSchema: {
      type: 'object',
      properties: {}
    }
  },
  {
    name: 'harvest_list_users',
    description: 'List all users in the account with filtering. Use about {"tool": "harvest_list_users"} for detailed parameters and examples.',
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
    description: 'List all clients with filtering options. Use about {"tool": "harvest_list_clients"} for detailed parameters and examples.',
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
    description: 'Generate detailed time reports for date ranges. Use about {"tool": "harvest_time_report"} for filtering options and examples.',
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
    description: 'List project assignments for the current user. Use about {"tool": "harvest_list_project_assignments"} for detailed usage.',
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
    description: 'List task assignments for a project. Use about {"tool": "harvest_list_task_assignments"} for detailed workflow and examples.',
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
