# Harvest MCP Server - Project Reference

## Project Location
`/home/beagle/work/harvest-mcp`

## Current Status
TypeScript MCP server project created with all core files. Dependencies need to be installed.

## Project Structure
```
/home/beagle/work/harvest-mcp/
├── src/
│   ├── index.ts          # Main MCP server (stdio transport)
│   ├── harvest-client.ts # Harvest API wrapper
│   └── tools.ts          # 14 MCP tool definitions
├── package.json          # Dependencies configured
├── tsconfig.json         # TypeScript config (ES2022, ESNext modules)
├── .env.example          # Environment template
├── README.md             # User documentation
├── .gitignore           
└── nodemon.json         
```

## Dependencies (not yet installed)
- `@modelcontextprotocol/sdk` ^1.16.0
- `harvest` ^0.4.0
- `dotenv` ^16.4.5
- Dev: `typescript`, `tsx`, `nodemon`, `@types/node`

## Required Environment Variables
```bash
HARVEST_ACCOUNT_ID=your_account_id
HARVEST_ACCESS_TOKEN=your_access_token
```

Get these from: https://id.getharvest.com/developers

## Next Commands to Run
```bash
# 1. Navigate to project
cd /home/beagle/work/harvest-mcp

# 2. Install dependencies
npm install

# 3. Set up environment
cp .env.example .env
# Edit .env with your Harvest credentials

# 4. Test in development
npm run dev

# 5. Build for production
npm run build

# 6. Run built version
npm start
```

## Available NPM Scripts
- `npm run build` - Compile TypeScript to dist/
- `npm run dev` - Run with tsx (hot reload)
- `npm run watch` - Run with nodemon
- `npm start` - Run compiled version

## MCP Tools Implemented (14 total)
- **Time Entries**: list, create, update, delete
- **Projects**: list, get details
- **Tasks**: list all
- **Users**: get current, list all
- **Clients**: list all
- **Reports**: time reports with date ranges
- **Assignments**: project assignments, task assignments

## Claude Desktop Configuration
Add to Claude Desktop config after building:
```json
{
  "mcpServers": {
    "harvest": {
      "command": "node",
      "args": ["/home/beagle/work/harvest-mcp/dist/index.js"],
      "env": {
        "HARVEST_ACCOUNT_ID": "your_account_id",
        "HARVEST_ACCESS_TOKEN": "your_access_token"
      }
    }
  }
}
```

## Known Issues
- npm install may fail in Claude Code environment
- May need to manually install dependencies outside Claude

## Key Implementation Notes
- Uses ES modules (type: "module" in package.json)
- Strict TypeScript configuration
- All Harvest API methods wrapped in harvest-client.ts
- Error handling implemented in main server
- Uses stdio transport for MCP communication
