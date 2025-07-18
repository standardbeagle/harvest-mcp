#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { CallToolRequestSchema, ListToolsRequestSchema } from '@modelcontextprotocol/sdk/types.js';
import { HarvestClient } from './harvest-client.js';
import { tools } from './tools.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Validate environment variables
const accountId = process.env.HARVEST_ACCOUNT_ID;
const accessToken = process.env.HARVEST_ACCESS_TOKEN;

if (!accountId || !accessToken) {
  console.error('Error: HARVEST_ACCOUNT_ID and HARVEST_ACCESS_TOKEN must be set in environment variables');
  process.exit(1);
}

// Initialize Harvest client
const harvestClient = new HarvestClient({
  accountId,
  accessToken
});

// Create MCP server
const server = new Server(
  {
    name: process.env.MCP_SERVER_NAME || 'harvest-mcp',
    version: process.env.MCP_SERVER_VERSION || '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: tools,
  };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      // Time Entry Tools
      case 'harvest_list_time_entries':
        const timeEntries = await harvestClient.getTimeEntries(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(timeEntries, null, 2),
            },
          ],
        };

      case 'harvest_create_time_entry':
        const newTimeEntry = await harvestClient.createTimeEntry(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(newTimeEntry, null, 2),
            },
          ],
        };

      case 'harvest_update_time_entry':
        const { id, ...updateData } = args;
        const updatedTimeEntry = await harvestClient.updateTimeEntry(id, updateData);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(updatedTimeEntry, null, 2),
            },
          ],
        };

      case 'harvest_delete_time_entry':
        await harvestClient.deleteTimeEntry(args.id);
        return {
          content: [
            {
              type: 'text',
              text: `Time entry ${args.id} deleted successfully`,
            },
          ],
        };

      // Project Tools
      case 'harvest_list_projects':
        const projects = await harvestClient.getProjects(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(projects, null, 2),
            },
          ],
        };

      case 'harvest_get_project':
        const project = await harvestClient.getProject(args.id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(project, null, 2),
            },
          ],
        };

      // Task Tools
      case 'harvest_list_tasks':
        const tasks = await harvestClient.getTasks(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tasks, null, 2),
            },
          ],
        };

      // User Tools
      case 'harvest_get_current_user':
        const currentUser = await harvestClient.getCurrentUser();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(currentUser, null, 2),
            },
          ],
        };

      case 'harvest_list_users':
        const users = await harvestClient.getUsers(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(users, null, 2),
            },
          ],
        };

      // Client Tools
      case 'harvest_list_clients':
        const clients = await harvestClient.getClients(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(clients, null, 2),
            },
          ],
        };

      // Report Tools
      case 'harvest_time_report':
        const timeReport = await harvestClient.getTimeReport(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(timeReport, null, 2),
            },
          ],
        };

      // Assignment Tools
      case 'harvest_list_project_assignments':
        const projectAssignments = await harvestClient.getProjectAssignments(args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(projectAssignments, null, 2),
            },
          ],
        };

      case 'harvest_list_task_assignments':
        const taskAssignments = await harvestClient.getTaskAssignments(args.project_id, args);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(taskAssignments, null, 2),
            },
          ],
        };

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : String(error)}`,
        },
      ],
      isError: true,
    };
  }
});

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Harvest MCP server running on stdio');
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
