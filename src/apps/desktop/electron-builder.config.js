/**
 * @type {import('electron-builder').Configuration}
 * @see https://www.electron.build/configuration/configuration
 */
const config = {
  appId: 'com.example.mfe-turbo-desktop',
  productName: 'MFE Turbo Desktop',
  directories: {
    output: 'build',
    buildResources: 'assets'
  },
  files: [
    'dist/**/*',
    'node_modules/**/*',
    'package.json'
  ],
  extraFiles: [
    {
      from: '../host/dist',
      to: 'host/dist',
      filter: ['**/*']
    }
  ],
  mac: {
    category: 'public.app-category.productivity',
    target: [
      {
        target: 'dmg',
        arch: ['x64', 'arm64']
      },
      {
        target: 'zip',
        arch: ['x64', 'arm64']
      }
    ],
    icon: 'assets/icon.icns'
  },
  win: {
    target: [
      {
        target: 'nsis',
        arch: ['x64', 'ia32']
      },
      {
        target: 'portable',
        arch: ['x64', 'ia32']
      }
    ],
    icon: 'assets/icon.ico'
  },
  linux: {
    target: [
      {
        target: 'AppImage',
        arch: ['x64']
      },
      {
        target: 'deb',
        arch: ['x64']
      },
      {
        target: 'rpm',
        arch: ['x64']
      }
    ],
    icon: 'assets/icon.png',
    category: 'Development'
  },
  nsis: {
    oneClick: false,
    allowToChangeInstallationDirectory: true,
    createDesktopShortcut: true,
    createStartMenuShortcut: true
  },
  publish: {
    provider: 'github',
    owner: 'your-github-username',
    repo: 'mfe-turbo'
  }
}

module.exports = config
