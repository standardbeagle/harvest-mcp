# Harvest MCP Server

A Model Context Protocol (MCP) server that provides integration with the [Harvest API v2](https://help.getharvest.com/api-v2/).

## Features

This MCP server provides tools for interacting with Harvest time tracking data:

### Time Entry Management
- List time entries with filters
- Create new time entries
- Update existing time entries
- Delete time entries

### Project & Task Management
- List and view projects
- List available tasks

### User & Client Management
- Get current user information
- List all users
- List all clients

### Reporting
- Generate time reports for date ranges

### Assignments
- List project assignments
- List task assignments for projects

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd harvest-mcp

# Install dependencies
npm install

# Build the project
npm run build
```

## Configuration

1. Copy the environment template:
```bash
cp .env.example .env
```

2. Edit `.env` and add your Harvest credentials:
```
HARVEST_ACCOUNT_ID=your_account_id
HARVEST_ACCESS_TOKEN=your_access_token
```

To get your Harvest credentials:
- Log in to your Harvest account
- Go to [Developers](https://id.getharvest.com/developers)
- Create a new personal access token
- Note your Account ID

## Development

```bash
# Run in development mode with hot reload
npm run dev

# Build the project
npm run build

# Run the built server
npm start
```

## Testing

The project includes comprehensive tests to verify integration with the Harvest API:

```bash
# Run unit tests
npm test

# Run unit tests in watch mode
npm run test:watch

# Run integration tests (requires valid .env setup)
npm run test:integration
```

### Integration Tests

The integration tests connect to your actual Harvest account and perform read-only operations to verify the MCP server works correctly. These tests:

- Connect to the MCP server via stdio transport
- Test all 14 available tools
- Verify proper data structure responses
- Test error handling for invalid inputs
- Use actual Harvest API data (read-only operations only)

**Requirements for integration tests:**
- Valid `.env` file with `HARVEST_ACCOUNT_ID` and `HARVEST_ACCESS_TOKEN`
- Active Harvest account with some data (projects, time entries, etc.)
- Network access to Harvest API

## Using with Claude Desktop

Add the following to your Claude Desktop configuration file:

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

## Available Tools

| Tool | Description |
|------|-------------|
| `harvest_list_time_entries` | List time entries with optional filters |
| `harvest_create_time_entry` | Create a new time entry |
| `harvest_update_time_entry` | Update an existing time entry |
| `harvest_delete_time_entry` | Delete a time entry |
| `harvest_restart_timer` | Restart a stopped time entry timer |
| `harvest_stop_timer` | Stop a running time entry timer |
| `harvest_list_projects` | List all projects |
| `harvest_get_project` | Get details of a specific project |
| `harvest_list_tasks` | List all tasks |
| `harvest_get_current_user` | Get information about the authenticated user |
| `harvest_list_users` | List all users in the account |
| `harvest_list_clients` | List all clients |
| `harvest_time_report` | Get time report for a date range |
| `harvest_list_project_assignments` | List project assignments for the current user |
| `harvest_list_task_assignments` | List task assignments for a project |

## Tool Parameters

### Time Entry Tools

**harvest_list_time_entries**
- `user_id` (string): Filter by user ID
- `project_id` (string): Filter by project ID
- `from` (string): Start date (YYYY-MM-DD)
- `to` (string): End date (YYYY-MM-DD)
- `page` (number): Page number
- `per_page` (number): Results per page (max 100)

**harvest_create_time_entry**
- `project_id` (string, required): Project ID
- `task_id` (string, required): Task ID
- `spent_date` (string, required): Date of the entry (YYYY-MM-DD)
- `hours` (number): Hours worked
- `notes` (string): Notes for the time entry

## License

MIT
