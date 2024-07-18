# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AnyProxy is a Chrome extension built with WXT framework that allows users to redirect network resources using regex-based rules. The extension intercepts web requests and forwards them to different destinations without requiring server-side modifications.

## Development Commands

- `pnpm dev` - Start development server for Chrome
- `pnpm dev:firefox` - Start development server for Firefox  
- `pnpm build` - Build extension for Chrome
- `pnpm build:firefox` - Build extension for Firefox
- `pnpm zip` - Create distributable Chrome zip
- `pnpm zip:firefox` - Create distributable Firefox zip
- `pnpm compile` - Type check with vue-tsc
- `eslint` - Lint code (configured in .eslintrc.cjs)
- `prettier` - Format code (configured in .prettierrc.json)

## Architecture

### Core Framework
- **WXT Framework**: Modern web extension development framework
- **Vue 3 + TypeScript**: Frontend components and logic
- **Vuetify**: Material Design component library
- **Vue Router**: Client-side routing
- **CodeMirror 6**: Advanced code editor for rule configuration

### Extension Structure
```
src/
├── entrypoints/           # Extension entry points
│   ├── background.ts     # Service worker handling rules and messaging
│   ├── content.ts        # Content script for page interaction
│   ├── sidepanel/        # Side panel UI (main interface)
│   └── standalone/       # Standalone page UI
├── components/           # Vue components
│   ├── ApiProxy.vue      # API interception management
│   ├── StaticResource.vue # Static resource proxy management
│   ├── VCodemirror.vue   # CodeMirror wrapper
│   └── ApiRuleDialog.vue # Rule creation/editing dialog
├── utils/               # Utility functions
│   ├── static-resource.ts # Static resource rule handling
│   ├── api-proxy.ts      # API interception utilities
│   └── index.ts         # Common utilities and JSON handling
├── locales/            # i18n translation files
├── type.ts             # TypeScript type definitions
└── enum.ts             # Constants and enums
```

### Key Features
1. **Static Resource Proxying**: Redirect JavaScript, CSS, and other static files using declarativeNetRequest API
2. **API Interception**: Mock API responses with custom JSON data
3. **Dual UI Modes**: Side panel for quick access, standalone page for detailed configuration
4. **Real-time Configuration**: Rules take effect immediately without browser restart

### Data Storage
- Uses Chrome extension storage API (`browser.storage.local`)
- Storage keys defined in `enum.ts`:
  - `STATIC_STORAGE_KEY`: Static proxy rules
  - `API_STORAGE_KEY`: API interception rules  
  - `STATIC_STORAGE_SWITCH_KEY`: Static proxy enabled/disabled
  - `API_STORAGE_SWITCH_KEY`: API interception enabled/disabled

### Extension Permissions
- `declarativeNetRequest`: For static resource redirection
- `background`: Service worker functionality
- `storage`: Local data persistence
- `host_permissions: ["<all_urls>"]`: Access to all websites

## Code Style
- ESLint configuration extends Vue 3 essentials, TypeScript, and Prettier
- Prettier configured with single quotes, no semicolons, 100 character line width
- Import deduplication enforced via eslint-plugin-import

## Build System
- Built on Vite with WXT framework
- TypeScript compilation via vue-tsc
- Source directory: `src/`
- Output directory: `.output/`
- Vuetify plugin integration for Material Design components