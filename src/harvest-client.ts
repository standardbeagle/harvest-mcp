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

  // System Information (for about tool)
  getAboutInfo(toolName?: string): string {
    if (!toolName) {
      return `# Harvest MCP Server

A comprehensive Model Context Protocol server for Harvest API v2 integration, providing complete time tracking and project management functionality.

## Overview
This MCP server connects AI assistants (like Claude) to your Harvest account, enabling natural language time tracking, project management, and reporting. It provides 15 specialized tools covering all aspects of time tracking workflow.

## Core Capabilities
- **Time Entry Management**: Create, update, delete, and list time entries with filtering
- **Timer Operations**: Start, stop, and restart timers for active time tracking
- **Project & Task Management**: Access project details, tasks, and assignments
- **User & Client Management**: Manage users and client information
- **Reporting**: Generate detailed time reports with date ranges
- **Assignment Management**: View project and task assignments

## Tool Categories

### Time Tracking Tools (6 tools)
- harvest_list_time_entries, harvest_create_time_entry, harvest_update_time_entry
- harvest_delete_time_entry, harvest_restart_timer, harvest_stop_timer

### Project Management Tools (3 tools)  
- harvest_list_projects, harvest_get_project, harvest_list_tasks

### User Management Tools (3 tools)
- harvest_get_current_user, harvest_list_users, harvest_list_clients

### Reporting & Assignment Tools (3 tools)
- harvest_time_report, harvest_list_project_assignments, harvest_list_task_assignments

## Example Usage Patterns

**Start a work session:**
1. List projects: harvest_list_projects
2. Create time entry: harvest_create_time_entry 
3. Start timer: harvest_restart_timer

**End work session:**
1. Stop timer: harvest_stop_timer
2. Update notes: harvest_update_time_entry

**Generate reports:**
1. Get time report: harvest_time_report with date range
2. Filter by user or project as needed

**For detailed information about any specific tool, use:**
about {"tool": "tool_name"}

## Authentication
Uses Harvest API v2 with personal access tokens. Requires HARVEST_ACCOUNT_ID and HARVEST_ACCESS_TOKEN environment variables.

## Response Format
All tools return JSON data from the Harvest API, formatted for easy consumption by AI assistants.`;
    }

    const toolDetails: Record<string, string> = {
      'harvest_list_time_entries': `# harvest_list_time_entries

Lists time entries with powerful filtering and pagination options.

## Purpose
Retrieve time entries from your Harvest account with optional filters for users, projects, date ranges, and pagination.

## Parameters
- \`user_id\` (string, optional): Filter entries by specific user ID
- \`project_id\` (string, optional): Filter entries by specific project ID  
- \`from\` (string, optional): Start date in YYYY-MM-DD format
- \`to\` (string, optional): End date in YYYY-MM-DD format
- \`page\` (number, optional): Page number for pagination (default: 1)
- \`per_page\` (number, optional): Results per page, max 100 (default: 100)

## Example Usage

**List all time entries:**
\`\`\`json
{"tool": "harvest_list_time_entries"}
\`\`\`

**List entries for last week:**
\`\`\`json
{
  "tool": "harvest_list_time_entries",
  "from": "2024-01-15",
  "to": "2024-01-21"
}
\`\`\`

**List entries for specific project with pagination:**
\`\`\`json
{
  "tool": "harvest_list_time_entries", 
  "project_id": "12345",
  "page": 1,
  "per_page": 25
}
\`\`\`

## Response Format
Returns an object with:
- \`time_entries\`: Array of time entry objects
- \`per_page\`, \`total_pages\`, \`total_entries\`: Pagination info
- \`page\`, \`links\`: Current page and navigation links

Each time entry includes: id, hours, notes, spent_date, project info, task info, user info, timer status (is_running, timer_started_at).`,

      'harvest_create_time_entry': `# harvest_create_time_entry

Creates a new time entry in your Harvest account.

## Purpose  
Create a time entry for tracking work on a specific project and task. Can be created with specific hours or without hours to start a timer.

## Parameters
- \`project_id\` (string, required): The project ID to log time against
- \`task_id\` (string, required): The task ID within the project
- \`spent_date\` (string, required): Date for the entry in YYYY-MM-DD format
- \`hours\` (number, optional): Hours worked (omit to start a timer)
- \`notes\` (string, optional): Notes or description for the time entry

## Example Usage

**Create entry with specific hours:**
\`\`\`json
{
  "tool": "harvest_create_time_entry",
  "project_id": "12345", 
  "task_id": "67890",
  "spent_date": "2024-01-20",
  "hours": 2.5,
  "notes": "Worked on API integration"
}
\`\`\`

**Create entry and start timer (no hours specified):**
\`\`\`json
{
  "tool": "harvest_create_time_entry",
  "project_id": "12345",
  "task_id": "67890", 
  "spent_date": "2024-01-20",
  "notes": "Starting work on feature development"
}
\`\`\`

## Response Format
Returns the created time entry object with:
- \`id\`: Unique time entry ID
- \`hours\`: Hours logged (or 0 if timer started)
- \`is_running\`: Timer status
- \`timer_started_at\`: Timer start time (if applicable)
- \`project\`, \`task\`, \`user\`: Associated objects
- All other time entry properties

## Workflow Tips
- Use harvest_list_projects to find project_id
- Use harvest_list_task_assignments to find valid task_id for the project
- Omit hours parameter to create a running timer entry`,

      'harvest_update_time_entry': `# harvest_update_time_entry

Updates an existing time entry with new information.

## Purpose
Modify any aspect of an existing time entry including hours, notes, project, task, or date.

## Parameters
- \`id\` (string, required): The time entry ID to update
- \`project_id\` (string, optional): Change to different project
- \`task_id\` (string, optional): Change to different task  
- \`spent_date\` (string, optional): Change date (YYYY-MM-DD)
- \`hours\` (number, optional): Update hours worked
- \`notes\` (string, optional): Update notes/description

## Example Usage

**Update hours and notes:**
\`\`\`json
{
  "tool": "harvest_update_time_entry",
  "id": "98765",
  "hours": 3.25,
  "notes": "Completed API integration and testing"
}
\`\`\`

**Move entry to different project/task:**
\`\`\`json
{
  "tool": "harvest_update_time_entry",
  "id": "98765",
  "project_id": "54321",
  "task_id": "09876",
  "notes": "Moved to correct project"
}
\`\`\`

**Change date:**
\`\`\`json
{
  "tool": "harvest_update_time_entry",
  "id": "98765", 
  "spent_date": "2024-01-19"
}
\`\`\`

## Response Format
Returns the updated time entry object with all current values.

## Notes
- Cannot update a running timer's hours (stop timer first)
- Only provide parameters you want to change
- Use harvest_list_time_entries to find entry IDs`,

      'harvest_delete_time_entry': `# harvest_delete_time_entry

Permanently deletes a time entry from your Harvest account.

## Purpose
Remove a time entry that was created in error or is no longer needed.

## Parameters
- \`id\` (string, required): The time entry ID to delete

## Example Usage

**Delete a time entry:**
\`\`\`json
{
  "tool": "harvest_delete_time_entry",
  "id": "98765"
}
\`\`\`

## Response Format
Returns a confirmation message: "Time entry {id} deleted successfully"

## ⚠️ Warning
This action is permanent and cannot be undone. The time entry will be completely removed from your Harvest account.

## Workflow Tips
- Use harvest_list_time_entries to find the entry ID
- Consider using harvest_update_time_entry to modify instead of delete
- Verify the entry ID before deletion`,

      'harvest_restart_timer': `# harvest_restart_timer

Restarts a stopped time entry timer to resume time tracking.

## Purpose
Resume timing on a previously stopped time entry, setting is_running to true and timer_started_at to current time.

## Parameters
- \`id\` (string, required): The time entry ID to restart

## Example Usage

**Restart a stopped timer:**
\`\`\`json
{
  "tool": "harvest_restart_timer",
  "id": "98765"
}
\`\`\`

## Response Format
Returns the updated time entry with:
- \`is_running\`: true
- \`timer_started_at\`: Current timestamp
- \`hours\`: Previous accumulated hours
- All other time entry properties

## Requirements
- Time entry must exist
- Timer must not already be running
- Only one timer can run at a time per user

## Workflow
1. Find stopped entry: harvest_list_time_entries
2. Restart timer: harvest_restart_timer  
3. Work on the task
4. Stop when done: harvest_stop_timer

## Error Conditions
- Entry not found: Invalid ID
- Timer already running: Cannot restart running timer
- Another timer running: Stop other timer first`,

      'harvest_stop_timer': `# harvest_stop_timer

Stops a running time entry timer and calculates total hours.

## Purpose
Stop timing on a running time entry, setting is_running to false and calculating final hours based on elapsed time.

## Parameters  
- \`id\` (string, required): The time entry ID to stop

## Example Usage

**Stop a running timer:**
\`\`\`json
{
  "tool": "harvest_stop_timer",
  "id": "98765"
}
\`\`\`

## Response Format
Returns the updated time entry with:
- \`is_running\`: false
- \`timer_started_at\`: null
- \`hours\`: Calculated total hours including this session
- \`started_time\`, \`ended_time\`: Session boundaries
- All other time entry properties

## Automatic Calculations
- Hours are automatically calculated from timer duration
- Previous hours (if any) are added to new session time
- Time is rounded to your account's time rounding settings

## Workflow
1. Start work: harvest_create_time_entry (without hours) or harvest_restart_timer
2. Work on the task  
3. Stop timing: harvest_stop_timer
4. Optionally update notes: harvest_update_time_entry

## Error Conditions
- Entry not found: Invalid ID
- Timer not running: Cannot stop a stopped timer`,

      'harvest_list_projects': `# harvest_list_projects

Lists all projects in your Harvest account with filtering options.

## Purpose
Retrieve project information for time entry creation, reporting, and project management.

## Parameters
- \`is_active\` (boolean, optional): Filter by active/inactive status
- \`client_id\` (string, optional): Filter by specific client ID
- \`page\` (number, optional): Page number for pagination
- \`per_page\` (number, optional): Results per page, max 100

## Example Usage

**List all active projects:**
\`\`\`json
{
  "tool": "harvest_list_projects",
  "is_active": true
}
\`\`\`

**List projects for specific client:**
\`\`\`json
{
  "tool": "harvest_list_projects", 
  "client_id": "12345",
  "is_active": true
}
\`\`\`

**List all projects with pagination:**
\`\`\`json
{
  "tool": "harvest_list_projects",
  "page": 1,
  "per_page": 25
}
\`\`\`

## Response Format
Returns an object with:
- \`projects\`: Array of project objects
- Pagination information (per_page, total_pages, etc.)

Each project includes: id, name, code, is_active, client info, budget info, hourly rates, created/updated dates.

## Usage in Workflows
- Essential for harvest_create_time_entry (need project_id)
- Use with harvest_list_task_assignments to get valid tasks
- Filter by client or active status to find relevant projects`,

      'harvest_get_project': `# harvest_get_project

Retrieves detailed information about a specific project.

## Purpose
Get comprehensive details about a single project including budget, rates, and client information.

## Parameters
- \`id\` (string, required): The project ID to retrieve

## Example Usage

**Get project details:**
\`\`\`json
{
  "tool": "harvest_get_project",
  "id": "12345"
}
\`\`\`

## Response Format
Returns detailed project object with:
- Basic info: id, name, code, notes
- Status: is_active, is_billable, is_fixed_fee
- Client: full client object
- Budget: budget, budget_by, budget_is_monthly
- Rates: hourly_rate, cost_budget, cost_budget_include_expenses
- Dates: starts_on, ends_on, created_at, updated_at
- Settings: bill_by, fee, over_budget_notification_percentage

## Usage Tips
- Use harvest_list_projects first to find project IDs
- Useful for checking project status before creating time entries
- Contains budget information for project tracking`,

      'harvest_list_tasks': `# harvest_list_tasks

Lists all tasks available in your Harvest account.

## Purpose
Retrieve task information needed for creating time entries and understanding work categories.

## Parameters
- \`is_active\` (boolean, optional): Filter by active/inactive status
- \`page\` (number, optional): Page number for pagination
- \`per_page\` (number, optional): Results per page, max 100

## Example Usage

**List all active tasks:**
\`\`\`json
{
  "tool": "harvest_list_tasks",
  "is_active": true
}
\`\`\`

**List all tasks with pagination:**
\`\`\`json
{
  "tool": "harvest_list_tasks",
  "page": 1,
  "per_page": 50
}
\`\`\`

## Response Format
Returns an object with:
- \`tasks\`: Array of task objects
- Pagination information

Each task includes: id, name, billable_by_default, is_active, is_default, hourly_rate, created_at, updated_at.

## Important Notes
- Tasks are global but must be assigned to projects
- Use harvest_list_task_assignments to see which tasks are available for a specific project
- Not all tasks are valid for all projects`,

      'harvest_get_current_user': `# harvest_get_current_user

Retrieves information about the currently authenticated user.

## Purpose
Get details about your user account, permissions, and settings.

## Parameters
None required.

## Example Usage

**Get current user info:**
\`\`\`json
{
  "tool": "harvest_get_current_user"
}
\`\`\`

## Response Format
Returns user object with:
- Basic info: id, first_name, last_name, email
- Status: is_active, is_admin, is_contractor
- Settings: timezone, has_access_to_all_future_projects
- Rates: default_hourly_rate, cost_rate
- Capacity: weekly_capacity
- Profile: telephone, avatar_url
- Dates: created_at, updated_at

## Usage Tips
- Useful for confirming authentication is working
- Check permissions (is_admin, has_access_to_all_future_projects)
- Get user_id for filtering time entries`,

      'harvest_list_users': `# harvest_list_users

Lists all users in your Harvest account.

## Purpose
Retrieve information about all users for reporting, filtering, and user management.

## Parameters
- \`is_active\` (boolean, optional): Filter by active/inactive status
- \`page\` (number, optional): Page number for pagination
- \`per_page\` (number, optional): Results per page, max 100

## Example Usage

**List all active users:**
\`\`\`json
{
  "tool": "harvest_list_users",
  "is_active": true
}
\`\`\`

**List all users with pagination:**
\`\`\`json
{
  "tool": "harvest_list_users",
  "page": 1,
  "per_page": 25
}
\`\`\`

## Response Format
Returns an object with:
- \`users\`: Array of user objects
- Pagination information

Each user includes same fields as harvest_get_current_user.

## Usage Tips
- Use for filtering time entries by user_id
- Useful for team management and reporting
- Check user roles and permissions`,

      'harvest_list_clients': `# harvest_list_clients

Lists all clients in your Harvest account.

## Purpose
Retrieve client information for project filtering, reporting, and client management.

## Parameters
- \`is_active\` (boolean, optional): Filter by active/inactive status
- \`page\` (number, optional): Page number for pagination
- \`per_page\` (number, optional): Results per page, max 100

## Example Usage

**List all active clients:**
\`\`\`json
{
  "tool": "harvest_list_clients",
  "is_active": true
}
\`\`\`

**List all clients:**
\`\`\`json
{
  "tool": "harvest_list_clients"
}
\`\`\`

## Response Format
Returns an object with:
- \`clients\`: Array of client objects
- Pagination information

Each client includes: id, name, is_active, address, currency, created_at, updated_at.

## Usage Tips  
- Use client_id to filter projects with harvest_list_projects
- Essential for client-based reporting and organization
- Useful for understanding account structure`,

      'harvest_time_report': `# harvest_time_report

Generates detailed time reports for specified date ranges.

## Purpose
Create comprehensive time reports for analysis, billing, and project tracking.

## Parameters
- \`from\` (string, optional): Start date in YYYY-MM-DD format
- \`to\` (string, optional): End date in YYYY-MM-DD format
- \`user_id\` (string, optional): Filter by specific user
- \`project_id\` (string, optional): Filter by specific project
- \`client_id\` (string, optional): Filter by specific client
- \`page\` (number, optional): Page number for pagination
- \`per_page\` (number, optional): Results per page, max 100

## Example Usage

**Monthly report for current month:**
\`\`\`json
{
  "tool": "harvest_time_report",
  "from": "2024-01-01",
  "to": "2024-01-31"
}
\`\`\`

**User-specific report:**
\`\`\`json
{
  "tool": "harvest_time_report",
  "from": "2024-01-15", 
  "to": "2024-01-21",
  "user_id": "12345"
}
\`\`\`

**Project report:**
\`\`\`json
{
  "tool": "harvest_time_report",
  "from": "2024-01-01",
  "to": "2024-01-31",
  "project_id": "67890"
}
\`\`\`

## Response Format
Returns object with:
- \`results\`: Array of time report entries
- Pagination and summary information

Each result includes: user_id, user_name, total_hours, billable_hours, billable_amount, currency info.

## Report Types
- Team time reports (default)
- User-specific reports (with user_id)
- Project-specific reports (with project_id)
- Client-specific reports (with client_id)

## Usage Tips
- Use date ranges for specific periods
- Combine filters for targeted reports
- Results are paginated for large datasets`,

      'harvest_list_project_assignments': `# harvest_list_project_assignments

Lists project assignments for the current user.

## Purpose
See which projects you have access to and can log time against.

## Parameters
- \`page\` (number, optional): Page number for pagination
- \`per_page\` (number, optional): Results per page, max 100

## Example Usage

**List your project assignments:**
\`\`\`json
{
  "tool": "harvest_list_project_assignments"
}
\`\`\`

**With pagination:**
\`\`\`json
{
  "tool": "harvest_list_project_assignments",
  "page": 1,
  "per_page": 25
}
\`\`\`

## Response Format
Returns object with:
- \`project_assignments\`: Array of assignment objects
- Pagination information

Each assignment includes:
- \`id\`: Assignment ID
- \`project\`: Full project object  
- \`client\`: Full client object
- \`hourly_rate\`: Your rate for this project
- \`budget\`: Budget information
- \`is_active\`: Assignment status
- \`created_at\`, \`updated_at\`: Timestamps

## Usage Tips
- Essential for finding valid project_id values for time entries
- Shows your specific hourly rate per project
- Use with harvest_list_task_assignments to get complete assignment info`,

      'harvest_list_task_assignments': `# harvest_list_task_assignments

Lists task assignments for a specific project.

## Purpose
See which tasks are available for time tracking on a specific project.

## Parameters
- \`project_id\` (string, required): The project ID to get task assignments for
- \`page\` (number, optional): Page number for pagination
- \`per_page\` (number, optional): Results per page, max 100

## Example Usage

**List task assignments for a project:**
\`\`\`json
{
  "tool": "harvest_list_task_assignments",
  "project_id": "12345"
}
\`\`\`

**With pagination:**
\`\`\`json
{
  "tool": "harvest_list_task_assignments",
  "project_id": "12345",
  "page": 1,
  "per_page": 50
}
\`\`\`

## Response Format
Returns object with:
- \`task_assignments\`: Array of task assignment objects  
- Pagination information

Each assignment includes:
- \`id\`: Assignment ID
- \`task\`: Full task object with name, rates
- \`is_active\`: Assignment status
- \`billable\`: Whether task is billable
- \`hourly_rate\`: Rate for this task on this project
- \`budget\`: Budget allocation for this task
- \`created_at\`, \`updated_at\`: Timestamps

## Workflow
1. Use harvest_list_project_assignments to find projects
2. Use harvest_list_task_assignments to find valid tasks
3. Use project_id and task_id for harvest_create_time_entry

## Notes
- Only shows tasks that are actually assigned to the project
- Each project-task combination has its own assignment
- Required for getting valid task_id values for time entries`
    };

    return toolDetails[toolName] || `Tool "${toolName}" not found. Available tools: ${Object.keys(toolDetails).join(', ')}`;
  }

  // Version Information
  getVersion(): string {
    return JSON.stringify({
      name: '@standardbeagle/harvest-mcp',
      version: '0.1.0',
      description: 'Model Context Protocol server for Harvest API integration',
      author: 'standardbeagle',
      license: 'MIT',
      repository: 'https://github.com/standardbeagle/harvest-mcp',
      mcpVersion: '2025-06-18',
      harvestApiVersion: 'v2'
    }, null, 2);
  }
}
