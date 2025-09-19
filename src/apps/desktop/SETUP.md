# MFE Turbo Desktop App Setup

This guide will help you set up and run the Electron desktop application for MFE Turbo.

## Prerequisites

- Node.js 18+
- pnpm (package manager)
- The host app should be properly configured

## Installation

1. Install dependencies from the project root:
   ```bash
   pnpm install
   ```

## Development

### Option 1: Integrated Development (Recommended)

Run both the host app and desktop app together:

```bash
# From project root
pnpm desktop:dev
```

This will:

1. Check if the host app is running on localhost:3000
2. Start the host app if not running
3. Wait for the host app to be ready
4. Launch the Electron app

### Option 2: Manual Development

If you prefer to manage processes separately:

1. Start the host app:

   ```bash
   # From project root
   cd src/apps/host
   pnpm run dev
   ```

2. In another terminal, start the desktop app:
   ```bash
   # From project root
   cd src/apps/desktop
   pnpm run dev:electron
   ```

## Building

### Development Build

Build the desktop app for testing (unpacked):

```bash
# From project root
pnpm desktop:pack

# Or from desktop directory
cd src/apps/desktop
pnpm run pack
```

### Production Build

Create distributable packages:

```bash
# From project root
pnpm desktop:dist

# Or from desktop directory
cd src/apps/desktop
pnpm run dist
```

### Platform-Specific Builds

```bash
# macOS
pnpm run dist:mac

# Windows
pnpm run dist:win

# Linux
pnpm run dist:linux
```

## Project Structure

```
src/apps/desktop/
├── src/
│   ├── main/
│   │   └── main.ts          # Main Electron process
│   └── preload/
│       └── preload.ts       # Preload script for secure IPC
├── scripts/
│   ├── dev.js               # Development coordination script
│   └── build.js             # Build coordination script
├── assets/
│   ├── icon.png             # App icon (placeholder)
│   ├── icon.icns            # macOS icon (placeholder)
│   └── icon.ico             # Windows icon (placeholder)
├── package.json             # Desktop app dependencies & scripts
├── tsconfig.json            # TypeScript configuration
├── tsconfig.main.json       # Main process TypeScript config
├── electron-builder.config.js # Electron Builder configuration
└── README.md                # Documentation
```

## Configuration

### Icons

Replace the placeholder icon files in `assets/` with your actual app icons:

- `icon.png` - 512x512px PNG for Linux and base icon
- `icon.icns` - macOS icon bundle
- `icon.ico` - Windows icon

### App Information

Update the following in `electron-builder.config.js`:

- `appId` - Unique application identifier
- `productName` - Display name of your app
- `publish.owner` - Your GitHub username
- `publish.repo` - Your repository name

### Window Settings

Modify window properties in `src/main/main.ts`:

- Window dimensions
- Minimum size constraints
- Icon path
- Dev tools behavior

## How It Works

### Development Mode

- Loads the host app from `http://localhost:3000`
- Enables DevTools automatically
- Hot reloading via the host app's dev server

### Production Mode

- Loads the host app from bundled files
- Host app files are copied during the build process
- Self-contained executable with all dependencies

### Security

- Context isolation enabled
- Node integration disabled
- Secure IPC communication via preload script
- External links open in default browser

## Troubleshooting

### Host App Not Starting

- Ensure the host app builds successfully
- Check if port 3000 is available
- Verify host app dependencies are installed

### Build Failures

- Run `pnpm run clean` to clear build artifacts
- Ensure host app is built before desktop app
- Check that all dependencies are installed

### Icon Issues

- Ensure icon files are in the correct format
- Icons should be high resolution (512x512px minimum)
- Use proper file extensions (.png, .icns, .ico)

## Scripts Reference

| Command          | Description                       |
| ---------------- | --------------------------------- |
| `pnpm run dev`   | Start development environment     |
| `pnpm run build` | Build both host and desktop apps  |
| `pnpm run pack`  | Create unpacked development build |
| `pnpm run dist`  | Create distributable packages     |
| `pnpm run clean` | Clean build artifacts             |

## Next Steps

1. Replace placeholder icons with your app icons
2. Update app metadata in configuration files
3. Set up code signing for distribution
4. Configure auto-updater with your update server
5. Add any custom IPC handlers for app-specific features
