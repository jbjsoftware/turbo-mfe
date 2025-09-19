#!/usr/bin/env node

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log('🏗️  Building MFE Turbo Desktop App...\n')

const hostPath = path.join(__dirname, '../../host')
const desktopPath = path.join(__dirname, '..')

// Step 1: Build the host app
console.log('1️⃣  Building host app...')
try {
  execSync('pnpm run build', {
    cwd: hostPath,
    stdio: 'inherit'
  })
  console.log('✅ Host app built successfully!\n')
} catch (error) {
  console.error('❌ Failed to build host app:', error.message)
  process.exit(1)
}

// Step 2: Verify host build exists
const hostDistPath = path.join(hostPath, 'dist')
if (!fs.existsSync(hostDistPath)) {
  console.error('❌ Host app dist directory not found!')
  process.exit(1)
}

console.log('2️⃣  Building desktop app main process...')
try {
  execSync('npm run build:main', {
    cwd: desktopPath,
    stdio: 'inherit'
  })
  console.log('✅ Desktop app main process built successfully!\n')
} catch (error) {
  console.error('❌ Failed to build desktop app main process:', error.message)
  process.exit(1)
}

console.log('🎉 Build completed successfully!')
console.log('\n📦 You can now run:')
console.log('  npm run pack   - Create unpacked app')
console.log('  npm run dist   - Create distributable packages')
