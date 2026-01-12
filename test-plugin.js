import plugin from './dist/index.js';

// Mock API for testing
const mockApi = {
  registerCli: (fn, options) => {
    console.log('✓ CLI registered with commands:', options.commands);
  },
  registerTool: (tool) => {
    console.log('✓ Tool registered:', tool.name);
    console.log('  Actions:', tool.input_schema.properties.action.enum);
  },
  registerGatewayMethod: (name, handler) => {
    console.log('✓ Gateway method registered:', name);
  }
};

// Test the plugin
console.log('🧪 Testing clawd-plugin-grocery...\n');
plugin(mockApi);
console.log('\n✅ Plugin loaded successfully!');
