#!/usr/bin/env node

const { spawn } = require('child_process')
const { execSync } = require('child_process')
const path = require('path')

const HOST_PORT = 3000
const HOST_URL = `http://localhost:${HOST_PORT}`

// Function to check if host is running
async function checkHostRunning() {
  try {
    const { default: fetch } = await import('node-fetch')
    const response = await fetch(HOST_URL)
    return response.ok
  } catch (error) {
    return false
  }
}

// Function to wait for host to be available
async function waitForHost(maxAttempts = 30, interval = 2000) {
  console.log('🔍 Checking if host app is running...')
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    if (await checkHostRunning()) {
      console.log('✅ Host app is running!')
      return true
    }
    
    console.log(`⏳ Waiting for host app... (${attempt}/${maxAttempts})`)
    await new Promise(resolve => setTimeout(resolve, interval))
  }
  
  return false
}

// Function to start host app
function startHostApp() {
  console.log('🚀 Starting host app...')
  const hostProcess = spawn('pnpm', ['run', 'dev'], {
    cwd: path.join(__dirname, '../../host'),
    stdio: 'inherit',
    shell: true
  })
  
  return hostProcess
}

// Function to build main process
function buildMainProcess() {
  console.log('🔨 Building main process...')
  try {
    execSync('pnpm run build:main', {
      cwd: path.join(__dirname, '..'),
      stdio: 'inherit'
    })
    console.log('✅ Main process built successfully!')
  } catch (error) {
    console.error('❌ Failed to build main process:', error.message)
    process.exit(1)
  }
}

// Function to start electron
function startElectron() {
  console.log('⚡ Starting Electron app...')
  const electronProcess = spawn('electron', ['.'], {
    cwd: path.join(__dirname, '..'),
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'development'
    }
  })
  
  return electronProcess
}

// Main function
async function main() {
  console.log('🎯 Starting MFE Turbo Desktop Development...\n')
  
  let hostProcess = null
  let electronProcess = null
  
  // Check if host is already running
  const hostRunning = await checkHostRunning()
  
  if (!hostRunning) {
    // Start host app
    hostProcess = startHostApp()
    
    // Wait for host to be available
    const hostReady = await waitForHost()
    
    if (!hostReady) {
      console.error('❌ Host app failed to start within timeout period')
      if (hostProcess) {
        hostProcess.kill()
      }
      process.exit(1)
    }
  } else {
    console.log('✅ Host app is already running!')
  }
  
  // Build main process
  buildMainProcess()
  
  // Start Electron
  electronProcess = startElectron()
  
  // Handle process cleanup
  const cleanup = () => {
    console.log('\n🛑 Shutting down...')
    
    if (electronProcess) {
      electronProcess.kill()
    }
    
    if (hostProcess) {
      hostProcess.kill()
    }
    
    process.exit(0)
  }
  
  // Handle various exit signals
  process.on('SIGINT', cleanup)
  process.on('SIGTERM', cleanup)
  process.on('exit', cleanup)
  
  // Handle electron process exit
  if (electronProcess) {
    electronProcess.on('exit', (code) => {
      console.log(`\n⚡ Electron process exited with code ${code}`)
      cleanup()
    })
  }
  
  // Handle host process exit (if we started it)
  if (hostProcess) {
    hostProcess.on('exit', (code) => {
      console.log(`\n🚀 Host process exited with code ${code}`)
      cleanup()
    })
  }
}

// Install node-fetch if not available
try {
  require.resolve('node-fetch')
} catch (e) {
  console.log('📦 Installing node-fetch...')
  execSync('npm install node-fetch', { cwd: __dirname })
}

// Run main function
main().catch((error) => {
  console.error('❌ Error starting development environment:', error)
  process.exit(1)
})
