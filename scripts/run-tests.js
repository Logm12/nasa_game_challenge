const { execSync } = require('child_process');
const fs = require('fs');
const os = require('os');
const path = require('path');

const outDir = fs.mkdtempSync(path.join(os.tmpdir(), 'nasa-i18n-test-'));
try {
  execSync(
    `"./node_modules/.bin/tsc" --outDir "${outDir}" --module commonjs --target es2018 --esModuleInterop --skipLibCheck tests/i18n.test.ts tests/performance-quality.test.ts tests/protection-baseline.test.ts tests/save-security.test.ts tests/mission-rules.test.ts tests/mission-run-manager.test.ts tests/mission-integration.test.ts`,
    { stdio: 'inherit' }
  );
  execSync(`node "${path.join(outDir, 'tests', 'i18n.test.js')}"`, { stdio: 'inherit' });
  execSync(`node "${path.join(outDir, 'tests', 'performance-quality.test.js')}"`, { stdio: 'inherit' });
  execSync(`node "${path.join(outDir, 'tests', 'protection-baseline.test.js')}"`, { stdio: 'inherit' });
  execSync(`node "${path.join(outDir, 'tests', 'save-security.test.js')}"`, { stdio: 'inherit' });
  execSync(`node "${path.join(outDir, 'tests', 'mission-rules.test.js')}"`, { stdio: 'inherit' });
  execSync(`node "${path.join(outDir, 'tests', 'mission-run-manager.test.js')}"`, { stdio: 'inherit' });
  execSync(`node "${path.join(outDir, 'tests', 'mission-integration.test.js')}"`, { stdio: 'inherit' });
} finally {
  fs.rmSync(outDir, { recursive: true, force: true });
}
