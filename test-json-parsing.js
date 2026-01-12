import plugin from './dist/index.js';

let listCalled = false;
let toolCalled = false;

// Mock API for testing
const mockApi = {
  registerCli: (fn, options) => {
    console.log('✓ CLI registered');
    // Test the list function
    const mockProgram = {
      command: (name) => ({
        description: (desc) => ({
          command: (subCmd) => ({
            description: (subDesc) => ({
              action: (handler) => {
                if (subCmd === 'list') {
                  console.log('\n🧪 Testing list command...');
                  handler();
                  listCalled = true;
                }
                return { command: () => ({ description: () => ({ action: () => {} }) }) };
              }
            })
          })
        })
      })
    };
    fn({ program: mockProgram });
  },
  registerTool: (tool) => {
    console.log('✓ Tool registered:', tool.name);
    toolCalled = true;
  },
  registerGatewayMethod: (name, handler) => {
    console.log('✓ Gateway method:', name);
  }
};

console.log('🧪 Testing clawd-plugin-grocery with JSON parsing...\n');
plugin(mockApi);

if (listCalled && toolCalled) {
  console.log('\n✅ All tests passed!');
} else {
  console.log('\n⚠️ Some tests did not execute');
}
