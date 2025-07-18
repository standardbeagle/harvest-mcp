# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2025-01-18

### Changed
- **NPX Compatibility**: Fixed binary configuration for proper npx usage with scoped packages
- **Package Optimization**: Reduced package size by excluding test files from distribution
- **MCP-TUI Support**: Verified compatibility with mcp-tui via npx command

### Fixed
- **Windows Compatibility**: Added fetch polyfill using node-fetch for Node.js environments without native fetch support
- **Cross-Platform Support**: Resolved "fetch not defined" errors on Windows and older Node.js versions

### Technical Improvements
- Simplified binary configuration from named binary to default binary path
- Removed debug logging from production code
- Optimized file inclusion for npm package distribution
- Added node-fetch dependency for backwards compatibility with Node.js < 18

## [0.1.0] - 2025-01-18

### Added
- **NPM Package**: Published as `@standardbeagle/harvest-mcp` for easy installation via `npx -y @standardbeagle/harvest-mcp`
- Initial release of Harvest MCP Server
- Complete Harvest API v2 integration with 15 specialized tools
- Time entry management (create, update, delete, list)
- Timer operations (start, stop, restart)
- Project and task management
- User and client management
- Comprehensive reporting functionality
- Assignment management (project and task assignments)
- CLI help functionality with `--help` and `--help <toolname>` flags
- CLI version information with `--version` flag
- Self-documenting `about` tool with detailed usage examples
- `version` tool for programmatic access to version information
- Comprehensive test suite with unit and integration tests
- TypeScript support with strict type checking
- Model Context Protocol (MCP) v2025-06-18 compliance

### Technical Features
- Fetch-based API client with centralized authentication and error handling
- Stdio transport for MCP communication
- Environment-based configuration
- Comprehensive error handling and validation
- Production-ready logging and monitoring
- 97% test coverage with 25 integration tests

### Documentation
- Complete tool documentation with usage examples
- Self-documenting help system
- TypeScript type definitions
- Integration examples and workflow patterns