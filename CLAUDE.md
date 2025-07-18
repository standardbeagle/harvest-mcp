# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
This is a TypeScript-based Model Context Protocol (MCP) server that provides integration with the Harvest API v2 for time tracking. The server acts as a bridge between AI assistants and the Harvest time tracking service, exposing 14 tools for comprehensive time management operations.

## Essential Commands

### Development Workflow
```bash
# Install dependencies (may fail in Claude Code environment)
npm install

# Development with hot reload
npm run dev

# Development with auto-restart
npm run watch

# Build TypeScript to JavaScript
npm run build

# Run compiled version
npm start
```

### Environment Setup
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your Harvest credentials:
# HARVEST_ACCOUNT_ID=your_account_id
# HARVEST_ACCESS_TOKEN=your_access_token
```

## Architecture Overview

### MCP Server Pattern
- **Transport**: Uses stdio transport for communication with MCP clients
- **Tool Registration**: All 14 tools defined in `src/tools.ts` and registered in `src/index.ts`
- **Error Handling**: Comprehensive error handling with proper MCP response format
- **Authentication**: Harvest API authentication via environment variables

### Core Components

#### `src/index.ts` - Main Server
- MCP server initialization with stdio transport
- Environment variable validation (fails fast if missing credentials)
- Tool execution router with switch-case pattern
- Error handling that preserves error context in MCP responses

#### `src/harvest-client.ts` - API Wrapper
- Wraps the `harvest` npm package with typed interfaces
- Centralizes all Harvest API interactions
- Provides clean abstraction over the underlying Harvest client

#### `src/tools.ts` - Tool Definitions
- Defines 14 MCP tools with comprehensive input schemas
- Covers: time entries, projects, tasks, users, clients, reports, assignments
- Each tool has proper TypeScript typing and validation

### TypeScript Configuration
- **Target**: ES2022 with ESNext modules (uses ES module syntax)
- **Strict Mode**: Full strict TypeScript with comprehensive linting
- **Module System**: ES modules (package.json has "type": "module")
- **Build Output**: `dist/` directory with source maps and declarations

## Key Implementation Patterns

### Tool Handler Pattern
Each tool follows this pattern in `src/index.ts`:
```typescript
case 'harvest_tool_name':
  const result = await harvestClient.methodName(args);
  return {
    content: [{ type: 'text', text: JSON.stringify(result, null, 2) }]
  };
```

### Environment Variable Pattern
All sensitive configuration uses environment variables with validation:
```typescript
const accountId = process.env.HARVEST_ACCOUNT_ID;
const accessToken = process.env.HARVEST_ACCESS_TOKEN;

if (!accountId || !accessToken) {
  console.error('Error: Required environment variables missing');
  process.exit(1);
}
```

### Error Handling Pattern
Consistent error handling across all tools:
```typescript
try {
  // Tool execution
} catch (error) {
  return {
    content: [{ type: 'text', text: `Error: ${error.message}` }],
    isError: true,
  };
}
```

## MCP Integration

### Claude Desktop Configuration
After building, add to Claude Desktop config:
```json
{
  "mcpServers": {
    "harvest": {
      "command": "node",
      "args": ["/path/to/harvest-mcp/dist/index.js"],
      "env": {
        "HARVEST_ACCOUNT_ID": "your_account_id",
        "HARVEST_ACCESS_TOKEN": "your_access_token"
      }
    }
  }
}
```

### Binary Execution
The project configures a binary in package.json:
```json
"bin": {
  "harvest-mcp": "./dist/index.js"
}
```

## Available Tools

### Time Entry Operations
- `harvest_list_time_entries` - List with user/project/date filters
- `harvest_create_time_entry` - Create new entries (requires project_id, task_id, spent_date)
- `harvest_update_time_entry` - Update existing entries
- `harvest_delete_time_entry` - Delete entries

### Resource Management
- `harvest_list_projects` / `harvest_get_project` - Project management
- `harvest_list_tasks` - Task listing
- `harvest_get_current_user` / `harvest_list_users` - User management
- `harvest_list_clients` - Client management

### Reporting & Assignments
- `harvest_time_report` - Generate time reports with date ranges
- `harvest_list_project_assignments` - List project assignments
- `harvest_list_task_assignments` - List task assignments for projects

## Development Considerations

### Dependencies Not Installed
The project structure is complete but dependencies are not installed. You may need to:
1. Navigate to the project directory
2. Run `npm install` (may fail in Claude Code environment)
3. Set up environment variables before testing

### ES Module Constraints
- Uses `"type": "module"` in package.json
- All imports must use `.js` extensions for local files
- Environment setup requires modern Node.js (16+)

### Harvest API Integration
- Uses the `harvest` npm package (v0.4.0)
- Requires account ID and access token from Harvest developers page
- All API responses are returned as formatted JSON strings

## Testing and Validation

### Manual Testing
```bash
# Test in development mode
npm run dev

# Test built version
npm run build && npm start
```

### MCP Client Testing
The server can be tested with any MCP client that supports stdio transport. The most common client is Claude Desktop.

## Common Issues

### Missing Dependencies
If `npm install` fails, the project structure is complete and dependencies can be installed manually outside Claude Code environment.

### Environment Variables
The server fails fast if `HARVEST_ACCOUNT_ID` or `HARVEST_ACCESS_TOKEN` are missing. Get these credentials from https://id.getharvest.com/developers.

### Module Resolution
All imports use ES module syntax with `.js` extensions for TypeScript compatibility with ES modules.