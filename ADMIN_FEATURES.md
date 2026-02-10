# Admin Management Dashboard - Complete Feature List

## Overview

A comprehensive professional admin dashboard for managing cryptocurrency trading platform game mechanics, user outcomes, and system configuration. All features integrate with your backend API endpoints.

## ✅ Implemented Features

### 1. Global Trading Mode Control
- **Three modes**: All Win, All Lose, Random
- **Visual indicators**: Active mode highlighting
- **Real-time updates**: Instant application of mode changes
- **Component**: `GlobalModeControl`

### 2. Win Probability Management
- **Range**: 0-100%
- **Visual probability bar**: Real-time visualization of selected probability
- **Validation**: Input validation for valid percentage values
- **Component**: `WinProbabilityControl`

### 3. User Override System
- **Force outcomes**: Win or lose for specific users
- **Optional expiration**: Set time-based auto-removal of overrides
- **Active overrides list**: See all current user overrides
- **Management**: Add, view, and remove overrides
- **Component**: `UserOverrideManager`

### 4. Bet Configuration Manager
- **Multiple timeframes**: 30s, 60s, 120s betting periods
- **Configurable rates**: Adjust profit and loss percentages
- **Easy switching**: Quick buttons to select timeframes
- **Real-time updates**: Changes apply immediately
- **Component**: `BetConfigManager`

### 5. Platform Statistics Dashboard
- **User metrics**: Total users, admins, regular users
- **Portfolio metrics**: Total value, invested amount, P&L
- **Transaction metrics**: Total count, volume, fees
- **Refresh button**: On-demand statistics update
- **Auto-fetch**: Loads statistics on page load
- **Component**: `AdminStatistics`

### 6. Danger Zone
- **Reset all data**: Complete system data reset with confirmation
- **Confirmation required**: Must type "RESET_ALL_DATA" to confirm
- **Safety checks**: Prevents accidental resets
- **Component**: `DangerZone`

## 🏗️ Architecture

### API Integration
- **Base URL**: Configured via `NEXT_PUBLIC_ADMIN_API_BASE_URL`
- **Proxy system**: Uses `/api/admin/proxy` for CORS avoidance
- **Fallback**: Direct API calls if proxy unavailable
- **Authorization**: Bearer token authentication

### Custom Hooks
- **`useAdminApi()`**: Generic API request handler
  - Handles GET/POST requests
  - Token-based authentication
  - Error handling and state management
  
- **`useAdminMethods()`**: Specific admin API methods
  - Wraps common admin operations
  - Type-safe method calls
  - Consistent error handling

### Backend Proxy
- **Route**: `/api/admin/proxy`
- **Methods**: GET and POST
- **Purpose**: Bypass CORS restrictions
- **Security**: Requires valid authorization token

## 📁 File Structure

```
/components/admin/
├── global-mode-control.tsx       # Global mode selection
├── win-probability-control.tsx   # Probability configuration
├── user-override-manager.tsx     # User override management
├── bet-config-manager.tsx        # Bet configuration
├── admin-statistics.tsx          # Platform statistics
└── danger-zone.tsx               # Data reset zone

/app/api/admin/
└── proxy/route.ts                # CORS proxy for admin API

/app/dashboard/admin/
└── management/page.tsx           # Main admin management page

/lib/
├── use-admin-api.ts              # Admin API hooks
└── use-admin-methods.ts          # (included in use-admin-api.ts)

/.env.local
└── NEXT_PUBLIC_ADMIN_API_BASE_URL  # Admin API configuration
```

## 🔌 API Endpoints

All endpoints require authentication with `Authorization: Bearer <token>`

### GET /api/admin/settings
Retrieve current admin settings and user overrides.
- Returns: globalMode, winProbability, userOverridesCount, userOverrides[]

### GET /api/admin/stats
Retrieve platform statistics.
- Returns: users, portfolios, transactions metrics

### POST /api/admin/mode
Set global trading mode (win/lose/random).
- Body: `{ mode: "win" | "lose" | "random" }`

### POST /api/admin/win-probability
Set win probability percentage (0-100).
- Body: `{ percentage: number }`

### POST /api/admin/user-override
Force user outcome or remove override.
- Body: `{ userId: string, forceOutcome: "win" | "lose" | null, expiresAt?: string }`

### POST /api/admin/bet-config
Update bet configuration for a timeframe.
- Body: `{ expirationTime: number, profitPercent: number, lossPercent: number }`

### POST /api/admin/reset
Reset all platform data.
- Body: `{ confirmation: "RESET_ALL_DATA" }`

## 🎨 UI Components

All components use:
- **Styling**: Tailwind CSS with slate/blue color scheme
- **Icons**: Lucide React
- **Cards**: shadcn/ui Card component
- **Buttons**: shadcn/ui Button component
- **Responsive**: Mobile-friendly grid layouts
- **Dark theme**: Professional slate background with blue accents

## 🔐 Security Features

1. **Token-based authentication**: All requests include Authorization header
2. **Confirmation dialogs**: Destructive operations require confirmation
3. **Input validation**: Type checking and range validation
4. **Proxy layer**: Prevents direct backend exposure
5. **Expiration times**: User overrides can auto-expire
6. **Logging**: All operations logged with `[v0]` prefix

## 📊 State Management

- **Component state**: React hooks for local state
- **Token management**: Via AuthProvider context
- **Real-time updates**: Manual refresh with refresh button
- **Optimistic updates**: UI updates after successful API calls

## ⚠️ Error Handling

- **Validation errors**: Form validation before API calls
- **Network errors**: Caught and displayed to user
- **API errors**: Backend error messages displayed
- **Fallback UI**: Graceful degradation if backend unavailable
- **Console logging**: Debug logs with `[v0]` prefix

## 🚀 Getting Started

1. **Set environment variables** in `.env.local`:
   ```
   NEXT_PUBLIC_ADMIN_API_BASE_URL=http://localhost:5000/api/admin
   ```

2. **Start your backend server** with admin API endpoints

3. **Navigate** to Admin Management page from dashboard sidebar

4. **Test connection** by clicking "Refresh" in Platform Statistics

## 📝 Documentation Files

- `ADMIN_MANAGEMENT.md` - Detailed feature documentation
- `ADMIN_SETUP.md` - Setup and configuration guide
- `ADMIN_FEATURES.md` - This file (feature overview)

## ✨ Key Highlights

✅ **Professional design** - Modern dark theme with intuitive controls  
✅ **Real-time updates** - Instant UI feedback for all operations  
✅ **Error handling** - Comprehensive error messages and logging  
✅ **Type-safe** - TypeScript for reliability  
✅ **Proxy system** - Handles CORS automatically  
✅ **Security** - Token-based auth with confirmation dialogs  
✅ **Responsive** - Works on desktop and tablet  
✅ **Extensible** - Easy to add new admin controls  

## 🔄 Data Flow

```
Admin Dashboard
    ↓
React Components (with hooks)
    ↓
useAdminMethods() → useAdminApi()
    ↓
/api/admin/proxy (Next.js Route)
    ↓
Backend API
    ↓
Response → Update UI → Show success/error message
```

## 🎯 Use Cases

1. **Control game outcomes** - Set all users to win/lose for testing
2. **Adjust probabilities** - Change win chances dynamically
3. **Fix user trades** - Force specific outcomes for specific users
4. **Tune economics** - Adjust profit/loss percentages
5. **Monitor platform** - View real-time statistics
6. **Reset system** - Clear all data for fresh start

---

**Version**: 1.0.0  
**Last Updated**: 2026-02-04  
**Status**: Production Ready ✅
