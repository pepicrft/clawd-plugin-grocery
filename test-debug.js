import { execSync } from 'child_process';

const cmd = `mise exec -- dstask next +grocery 2>/dev/null || dstask next +grocery`;

try {
  const result = execSync(cmd, {
    encoding: 'utf-8',
    shell: '/bin/bash'
  });
  
  const lines = result.split('\n');
  console.log('Total lines:', lines.length);
  
  const jsonLine = lines.find(line => line.trim().startsWith('['));
  console.log('JSON line found:', !!jsonLine);
  
  if (jsonLine) {
    console.log('JSON line length:', jsonLine.length);
    console.log('First 50 chars:', jsonLine.substring(0, 50));
    console.log('Last 50 chars:', jsonLine.substring(jsonLine.length - 50));
    
    // Try to find where the array ends
    const fullJson = [];
    let started = false;
    for (const line of lines) {
      if (line.trim().startsWith('[')) {
        started = true;
      }
      if (started) {
        fullJson.push(line);
        if (line.trim() === ']') {
          break;
        }
      }
    }
    
    const completeJson = fullJson.join('\n');
    console.log('\nComplete JSON:');
    console.log(completeJson);
    
    const items = JSON.parse(completeJson);
    console.log('\n✅ Parsed:', items.length, 'items');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
}
