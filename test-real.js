import { execSync } from 'child_process';

console.log('🧪 Testing mise exec fallback...\n');

const cmd = `mise exec -- dstask next +grocery 2>/dev/null || dstask next +grocery`;

try {
  const result = execSync(cmd, {
    encoding: 'utf-8',
    shell: '/bin/bash'
  });
  
  console.log('✅ Command executed successfully');
  console.log('Raw output:');
  console.log(result);
  
  // Parse JSON
  const lines = result.split('\n');
  const jsonLine = lines.find(line => line.trim().startsWith('['));
  
  if (jsonLine) {
    const items = JSON.parse(jsonLine);
    console.log('\n✅ JSON parsed successfully:');
    console.log(`Found ${items.length} item(s)`);
    items.forEach(item => {
      console.log(`  - ${item.id}. ${item.summary} [${item.priority}]`);
    });
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
