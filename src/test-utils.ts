import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export interface MCPTestClient {
  client: Client;
  cleanup: () => Promise<void>;
}

/**
 * Creates an MCP client connected to our Harvest MCP server for testing
 */
export async function createMCPTestClient(): Promise<MCPTestClient> {
  // Create MCP client with stdio transport that will spawn our server
  const transport = new StdioClientTransport({
    command: 'tsx',
    args: ['src/index.ts'],
    env: process.env as Record<string, string>,
    stderr: 'pipe', // Pipe stderr so we can handle it
  });

  const client = new Client({
    name: 'harvest-mcp-test-client',
    version: '1.0.0',
  }, {
    capabilities: {},
  });

  // Handle stderr from the server process
  const stderrStream = transport.stderr;
  if (stderrStream) {
    stderrStream.on('data', (data) => {
      const output = data.toString();
      // Only log actual errors, not the "running on stdio" message
      if (!output.includes('running on stdio')) {
        console.error('MCP Server stderr:', output);
      }
    });
  }

  // Connect the client (this will start the server process)
  await client.connect(transport);

  // Wait a bit for the server to be ready
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    client,
    cleanup: async () => {
      try {
        await client.close();
      } catch (error) {
        console.warn('Error closing MCP client:', error);
      }
    },
  };
}

/**
 * Helper function to call an MCP tool and return parsed result
 */
export async function callMCPTool(client: Client, toolName: string, args: Record<string, any> = {}) {
  const response = await client.callTool({ name: toolName, arguments: args });
  
  // Type assertion to handle the response properly
  const typedResponse = response as any;
  
  if (typedResponse.isError) {
    const errorText = typedResponse.content && typedResponse.content.length > 0 && typedResponse.content[0].text 
      ? typedResponse.content[0].text 
      : 'Unknown error';
    throw new Error(`MCP tool error: ${errorText}`);
  }
  
  const textContent = typedResponse.content && typedResponse.content.length > 0 && typedResponse.content[0].text
    ? typedResponse.content[0].text
    : null;
    
  if (!textContent) {
    throw new Error('No text content in MCP response');
  }
  
  try {
    return JSON.parse(textContent);
  } catch (error) {
    // If it's not JSON, return the raw text
    return textContent;
  }
}