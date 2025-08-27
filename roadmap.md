# CarpeDoEm iOS Migration Prompt Template

## Initial Migration Request

```
I'm migrating my Next.js 15 todo/task management app "CarpeDoEm" to React Native for iOS. 

**Current App Overview:**
- Next.js 15 with App Router, TypeScript, Tailwind CSS v4
- Google OAuth authentication via Passport.js  
- FastAPI backend integration (http://0.0.0.0:8080)
- Three-panel dashboard layout: sidebar navigation, task list center, task details right
- Features: task completion, inline editing, markdown descriptions, list sharing, priority filtering

**Migration Goals:**
1. Create native iOS app maintaining core functionality
2. Implement iOS-native navigation patterns and UI components
3. Preserve real-time backend API integration
4. Adapt three-panel layout for mobile-first design
5. Maintain Google OAuth authentication flow

**Technical Requirements:**
- React Native with TypeScript
- iOS-specific styling following Human Interface Guidelines
- Maintain API integration with existing FastAPI backend
- Support for markdown rendering in task descriptions
- Implement proper iOS safe area handling

Please start with [SPECIFIC COMPONENT/FEATURE] and provide:
1. Complete React Native component code
2. iOS-specific styling recommendations
3. Required library installations and setup
4. Navigation structure for iOS
5. Any necessary configuration changes

**BREAKPOINT DOCUMENTATION REQUIRED:**
After each component/feature migration, document:
- What was changed from Next.js version
- iOS-specific adaptations made
- Any technical debt or limitations introduced
- Next recommended migration step
```

## Component-Specific Migration Prompts

### 1. Authentication Migration
```
**MIGRATION BREAKPOINT 1: Authentication System**

Convert the Google OAuth authentication system from Next.js to React Native.

Current implementation uses:
- Passport.js with Google OAuth
- Express sessions for session management
- API routes in `src/app/api/auth/`

For React Native iOS, implement:
1. React Native Google Sign-In integration
2. Secure token storage using iOS Keychain
3. API authentication headers for FastAPI backend
4. Login/logout flow with proper iOS navigation

Provide complete code for:
- Authentication service/hook
- Login screen component
- Token management utilities
- API client with auth headers

**Document changes from web version and iOS-specific considerations.**
```

### 2. Dashboard Layout Migration
```
**MIGRATION BREAKPOINT 2: Dashboard Layout**

Convert the three-panel DashboardClient layout to iOS-native design.

Current web layout:
- Left sidebar: Navigation and user profile
- Center: Task list view with inline editing  
- Right sidebar: Task details panel
- Uses react-resizable-panels for responsive design

For iOS, create:
1. Tab-based navigation for main sections
2. Stack navigation for task details
3. Modal presentation for task editing
4. Swipe gestures for task actions
5. iOS-native list components

Transform the current DashboardClient.tsx component structure to:
- Main tab navigator with Lists, Tasks, Profile tabs
- Task list screen with pull-to-refresh
- Task detail modal/screen
- Proper iOS navigation hierarchy

**Document how the panel-based layout maps to iOS navigation patterns.**
```

### 3. Task Management Migration
```
**MIGRATION BREAKPOINT 3: Task Management Components**

Migrate task CRUD operations and inline editing to iOS-native components.

Current features to convert:
- Inline task name editing
- Task completion toggling
- Priority and recurring flag management
- Markdown description editing and rendering
- Real-time API synchronization

For iOS implementation:
1. Native iOS form inputs with proper keyboard handling
2. Swipe actions for quick task operations
3. iOS-native markdown editor/viewer
4. Haptic feedback for task completion
5. Optimistic UI updates with error handling

Include complete code for:
- Task list component with swipe actions
- Task editing modal/screen
- Markdown editor component for iOS
- API integration hooks

**Document differences in user interaction patterns between web and iOS.**
```

### 4. Backend Integration Migration
```
**MIGRATION BREAKPOINT 4: API Integration**

Adapt the FastAPI backend integration for React Native environment.

Current API client features:
- TypeScript API functions in `src/lib/`
- Complete CRUD operations for tasks, lists, users
- Error handling and response typing
- Session-based authentication

For React Native:
1. Adapt API client for React Native networking
2. Implement proper error handling and retry logic
3. Add offline capability with AsyncStorage
4. Background sync for task updates
5. Network state awareness

Convert these API modules:
- `src/lib/tasks.ts`
- `src/lib/lists.ts` 
- `src/lib/users.ts`

**Document any API changes needed and offline/sync strategy differences.**
```

### 5. List Sharing Migration
```
**MIGRATION BREAKPOINT 5: List Sharing Features**

Migrate collaborative list sharing functionality to iOS.

Current web features:
- Shareable list tokens
- List visibility controls
- Collaborative task management
- Real-time updates

For iOS implementation:
1. Native iOS sharing sheet integration
2. Deep linking for shared list access
3. Push notifications for shared list updates
4. iOS-native permission/sharing UI components

Include:
- Share sheet integration code
- Deep link handling setup
- Push notification configuration
- Collaborative UI components

**Document iOS-specific sharing capabilities and limitations versus web version.**
```

## Progressive Migration Strategy

### Phase 1: Core Structure (Breakpoints 1-2)
- Authentication system
- Basic navigation structure
- Main dashboard layout

### Phase 2: Task Management (Breakpoint 3)
- Task CRUD operations
- List management
- Basic iOS interactions

### Phase 3: Advanced Features (Breakpoints 4-5)
- Full API integration
- Offline capabilities
- Sharing functionality

### Phase 4: iOS Enhancement
- Push notifications
- Widgets
- iOS-specific optimizations

## Breakpoint Documentation Template

After each migration phase, provide:

```markdown
## BREAKPOINT [N]: [FEATURE NAME] - COMPLETION SUMMARY

### Changes Made:
- [List key changes from Next.js version]

### iOS Adaptations:
- [iOS-specific patterns implemented]
- [Native components used]
- [Navigation changes]

### Technical Debt/Limitations:
- [Any compromises made]
- [Features temporarily removed]
- [Performance considerations]

### API/Backend Changes Required:
- [Any backend modifications needed]

### Next Steps:
- [Recommended next component to migrate]
- [Dependencies for next phase]

### Testing Notes:
- [iOS-specific testing requirements]
- [Key user flows to validate]
```

## Usage Instructions

1. **Start with Authentication**: Begin with Breakpoint 1 to establish the foundation
2. **Progress Sequentially**: Each breakpoint builds on the previous one
3. **Document Everything**: Use the breakpoint template after each phase
4. **Test Incrementally**: Validate each breakpoint before moving forward
5. **Adapt as Needed**: Modify prompts based on what you discover during migration

This structured approach ensures you maintain functionality while properly adapting to iOS patterns and documenting the journey for future reference.