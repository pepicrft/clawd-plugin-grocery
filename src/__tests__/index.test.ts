import { describe, it, expect, vi, beforeEach } from 'vitest';
import plugin from '../index.js';

describe('Grocery Plugin', () => {
  let mockApi: any;
  let registeredCli: any;
  let registeredTool: any;
  let registeredMethods: Map<string, any>;

  beforeEach(() => {
    registeredMethods = new Map();
    
    mockApi = {
      registerCli: vi.fn((fn, options) => {
        registeredCli = { fn, options };
      }),
      registerTool: vi.fn((tool) => {
        registeredTool = tool;
      }),
      registerGatewayMethod: vi.fn((name, handler) => {
        registeredMethods.set(name, handler);
      }),
    };
  });

  describe('Plugin Registration', () => {
    it('should register CLI commands', () => {
      plugin(mockApi);
      
      expect(mockApi.registerCli).toHaveBeenCalled();
      expect(registeredCli.options.commands).toEqual(['grocery']);
    });

    it('should register tool', () => {
      plugin(mockApi);
      
      expect(mockApi.registerTool).toHaveBeenCalled();
      expect(registeredTool.name).toBe('grocery_list');
      expect(registeredTool.input_schema.properties.action.enum).toEqual([
        'list',
        'add',
        'done',
        'remove',
        'clear',
      ]);
    });

    it('should register gateway methods', () => {
      plugin(mockApi);
      
      expect(mockApi.registerGatewayMethod).toHaveBeenCalledTimes(3);
      expect(registeredMethods.has('grocery.list')).toBe(true);
      expect(registeredMethods.has('grocery.add')).toBe(true);
      expect(registeredMethods.has('grocery.done')).toBe(true);
    });
  });

  describe('Tool Handler', () => {
    beforeEach(() => {
      plugin(mockApi);
    });

    it('should validate required fields for add action', async () => {
      const respond = vi.fn();
      
      await registeredTool.handler(
        { action: 'add' },
        { respond }
      );
      
      expect(respond).toHaveBeenCalledWith(
        false,
        expect.objectContaining({
          ok: false,
          error: expect.stringContaining('Item description is required'),
        })
      );
    });

    it('should validate required fields for done action', async () => {
      const respond = vi.fn();
      
      await registeredTool.handler(
        { action: 'done' },
        { respond }
      );
      
      expect(respond).toHaveBeenCalledWith(
        false,
        expect.objectContaining({
          ok: false,
          error: expect.stringContaining('Item ID is required'),
        })
      );
    });

    it('should validate required fields for remove action', async () => {
      const respond = vi.fn();
      
      await registeredTool.handler(
        { action: 'remove' },
        { respond }
      );
      
      expect(respond).toHaveBeenCalledWith(
        false,
        expect.objectContaining({
          ok: false,
          error: expect.stringContaining('Item ID is required'),
        })
      );
    });

    it('should reject unknown actions', async () => {
      const respond = vi.fn();
      
      await registeredTool.handler(
        { action: 'invalid' },
        { respond }
      );
      
      expect(respond).toHaveBeenCalledWith(
        false,
        expect.objectContaining({
          ok: false,
          error: expect.stringContaining('Unknown action'),
        })
      );
    });
  });

  describe('Input Schema', () => {
    beforeEach(() => {
      plugin(mockApi);
    });

    it('should have correct action enum', () => {
      expect(registeredTool.input_schema.properties.action.enum).toEqual([
        'list',
        'add',
        'done',
        'remove',
        'clear',
      ]);
    });

    it('should have item parameter', () => {
      expect(registeredTool.input_schema.properties.item).toBeDefined();
      expect(registeredTool.input_schema.properties.item.type).toBe('string');
    });

    it('should have id parameter', () => {
      expect(registeredTool.input_schema.properties.id).toBeDefined();
      expect(registeredTool.input_schema.properties.id.type).toBe('string');
    });

    it('should require action parameter', () => {
      expect(registeredTool.input_schema.required).toEqual(['action']);
    });
  });
});
