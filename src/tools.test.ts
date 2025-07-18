import { describe, test, expect } from 'vitest';
import { tools } from './tools.js';

describe('Harvest MCP Tools Definition', () => {
  test('should export 17 tools', () => {
    expect(tools).toBeDefined();
    expect(Array.isArray(tools)).toBe(true);
    expect(tools.length).toBe(17);
  });

  test('all tools should have required properties', () => {
    tools.forEach(tool => {
      expect(tool).toHaveProperty('name');
      expect(tool).toHaveProperty('description');
      expect(tool).toHaveProperty('inputSchema');
      
      expect(typeof tool.name).toBe('string');
      expect(typeof tool.description).toBe('string');
      expect(typeof tool.inputSchema).toBe('object');
      
      // Tool name should follow harvest_ prefix convention (except 'about' and 'version')
      if (tool.name !== 'about' && tool.name !== 'version') {
        expect(tool.name).toMatch(/^harvest_/);
      }
    });
  });

  test('should include all expected tool names', () => {
    const toolNames = tools.map(tool => tool.name);
    const expectedToolNames = [
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
      'version',
    ];
    
    expectedToolNames.forEach(expectedName => {
      expect(toolNames).toContain(expectedName);
    });
  });

  test('input schemas should be valid JSON Schema objects', () => {
    tools.forEach(tool => {
      const schema = tool.inputSchema;
      
      // Should have basic JSON Schema properties
      expect(schema).toHaveProperty('type');
      expect(schema.type).toBe('object');
      
      // Should have properties defined (even if empty)
      expect(schema).toHaveProperty('properties');
      expect(typeof schema.properties).toBe('object');
    });
  });

  test('required parameters should be properly defined', () => {
    // Test a few specific tools that have required parameters
    const createTimeEntryTool = tools.find(t => t.name === 'harvest_create_time_entry');
    expect(createTimeEntryTool).toBeDefined();
    expect(createTimeEntryTool?.inputSchema.required).toEqual(['project_id', 'task_id', 'spent_date']);
    
    const updateTimeEntryTool = tools.find(t => t.name === 'harvest_update_time_entry');
    expect(updateTimeEntryTool).toBeDefined();
    expect(updateTimeEntryTool?.inputSchema.required).toEqual(['id']);
    
    const getProjectTool = tools.find(t => t.name === 'harvest_get_project');
    expect(getProjectTool).toBeDefined();
    expect(getProjectTool?.inputSchema.required).toEqual(['id']);
  });

  test('parameter types should be correctly specified', () => {
    const listTimeEntriesTools = tools.find(t => t.name === 'harvest_list_time_entries');
    expect(listTimeEntriesTools).toBeDefined();
    
    const properties = listTimeEntriesTools?.inputSchema.properties as Record<string, any>;
    expect(properties?.user_id?.type).toBe('string');
    expect(properties?.project_id?.type).toBe('string');
    expect(properties?.from?.type).toBe('string');
    expect(properties?.to?.type).toBe('string');
    expect(properties?.page?.type).toBe('number');
    expect(properties?.per_page?.type).toBe('number');
  });
});