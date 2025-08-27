# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

"Taskable" is an iOS React Native todo/task management app built with Expo Router. This project is a migration of a Next.js web app called "CarpeDoEm" to a native iOS experience, maintaining integration with an existing FastAPI backend.

## Development Commands

### Essential Commands
- `npm install` - Install dependencies
- `npx expo start` - Start development server with Metro bundler
- `npm run android` - Launch on Android emulator
- `npm run ios` - Launch on iOS simulator
- `npm run web` - Launch web version
- `npm run lint` - Run ESLint for code quality checks
- `npm run reset-project` - Move starter code to app-example directory for fresh start

### Platform-Specific Development
- Use iOS Simulator for primary development and testing
- The project supports universal apps (iOS, Android, Web) but iOS is the primary target
- Use Expo Go app for quick testing on physical devices

## Architecture Overview

### File-Based Routing (Expo Router)
- **app/_layout.tsx**: Root layout with navigation theme provider and font loading
- **app/(tabs)/_layout.tsx**: Tab-based navigation layout with iOS-specific styling
- **app/(tabs)/index.tsx**: Home tab screen
- **app/(tabs)/explore.tsx**: Explore tab screen
- **app/+not-found.tsx**: 404 error screen

### Component Structure
- **components/**: Reusable UI components with iOS-native patterns
- **components/ui/**: Platform-specific UI components with iOS/universal variants
- **constants/Colors.ts**: Theme color definitions for light/dark modes
- **hooks/**: Custom React hooks for color scheme and theme management

### Key Technical Patterns
- Uses Expo Router for navigation with typed routes enabled
- Implements iOS Human Interface Guidelines through native-like components
- Supports automatic dark/light mode switching
- Uses haptic feedback for native iOS experience
- Platform-specific code separation (`.ios.tsx` vs `.tsx` files)

## Backend Integration

### API Configuration
- **Base URL**: `http://0.0.0.0:8080`
- **Authentication**: Google OAuth with JWT tokens
- **Documentation**: See `backend-api-docs.md` for complete API reference

### Core API Endpoints
- **Auth**: `/auth/google` - Google OAuth authentication
- **Users**: `/users/` - User management (CRUD operations)
- **Lists**: `/lists/` - Todo list management with versioning and sharing
- **Tasks**: `/tasks/` - Task CRUD operations with priority, recurring, and completion toggles

### API Features to Implement
- Real-time task synchronization
- Offline capability with local storage
- List sharing with tokens
- Task versioning and rollover functionality
- Background sync for task updates

## Migration Context

This project represents Phase 1 of migrating "CarpeDoEm" from Next.js to React Native:

### Current Migration Status
- ✅ Basic Expo Router setup with tab navigation
- ✅ iOS-native component foundations
- ⏳ Authentication system (Google OAuth) - **Next Priority**
- ⏳ Core task management UI
- ⏳ Backend API integration
- ⏳ Offline sync capabilities

### Migration Strategy
1. **Authentication System**: Implement Google Sign-In with iOS Keychain storage
2. **Dashboard Layout**: Transform three-panel web layout to iOS tab/stack navigation
3. **Task Management**: Native iOS task creation, editing, and completion flows
4. **Advanced Features**: List sharing, push notifications, and iOS-specific enhancements

## Development Guidelines

### Component Patterns
- Use ThemedText and ThemedView for consistent theming
- Implement platform-specific components when needed (.ios.tsx extensions)
- Follow iOS Human Interface Guidelines for native feel
- Use haptic feedback for user interactions

### Styling Approach
- TypeScript with strict mode enabled
- ESLint with Expo configuration
- Color scheme detection and automatic theme switching
- Safe area handling for iOS devices

### Testing Strategy
- Test on iOS Simulator primarily
- Verify functionality on physical iOS devices
- Ensure proper theme switching behavior
- Test navigation flows and deep linking

## Important Files to Reference
- `roadmap.md`: Detailed migration strategy and component-specific prompts
- `backend-api-docs.md`: Complete FastAPI backend documentation
- `app.json`: Expo configuration with iOS-specific settings