# Desktop App

This is an Electron application that wraps the host app for desktop distribution.

## Features

- **Development Mode**: Loads the host app from `http://localhost:3000`
- **Production Mode**: Loads the built host app from local files
- **Auto Updates**: Configured with electron-updater
- **Cross Platform**: Builds for macOS, Windows, and Linux
- **Single Instance**: Prevents multiple instances of the app

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
4. Build the Electron main process
5. Launch the Electron app

### Option 2: Manual Development

If you prefer to manage processes separately:

1. Start the host app development server:

   ```bash
   cd ../host
   pnpm run dev
   ```

2. In a separate terminal, start the desktop app:
   ```bash
   pnpm run dev:electron
   ```

The desktop app will automatically wait for the host app to be available before launching.

## Building

### Build for current platform

```bash
npm run dist
```

### Build for specific platforms

```bash
npm run dist:mac    # macOS
npm run dist:win    # Windows
npm run dist:linux  # Linux
```

### Development build (unpacked)

```bash
npm run pack
```

## Project Structure

- `src/main/main.ts` - Main Electron process
- `src/preload/preload.ts` - Preload script for secure IPC
- `assets/` - App icons and resources
- `dist/` - Compiled TypeScript output
- `build/` - Final packaged applications

## Configuration

The app is configured via:

- `package.json` - Electron Builder configuration
- `tsconfig.json` - TypeScript configuration
- `tsconfig.main.json` - Main process specific TypeScript config

## Environment Variables

- `NODE_ENV=development` - Loads from localhost:3000
- `NODE_ENV=production` - Loads from built files

## Security

- Context isolation enabled
- Node integration disabled
- Remote module disabled
- Preload script for secure IPC communication

## Updates

The app includes auto-update functionality using electron-updater. Configure your update server in the main process.
