# Admin Management Dashboard

## Overview

The Admin Management Dashboard provides comprehensive control over the trading platform's game mechanics, user outcomes, and system configuration. This document explains the features and how to use them.

## Features

### 1. Global Trading Mode
**Location**: Admin Control Panel

Set the global trading outcome mode that applies to all users:
- **All Win**: All users automatically win their trades
- **All Lose**: All users automatically lose their trades
- **Random**: Outcomes are determined by win probability percentage

### 2. Win Probability
**Location**: Admin Control Panel

Configure the percentage chance for users to win trades in random mode:
- Range: 0-100%
- Visual probability bar for easy reference
- Used only when Global Mode is set to "Random"

### 3. User Overrides
**Location**: Admin Control Panel

Force specific users to win or lose their next trades:
- Override individual user outcomes
- Optional expiration time for automatic removal
- Active overrides list showing all current overrides
- Remove overrides at any time

### 4. Bet Configuration
**Location**: Admin Control Panel

Configure profit and loss percentages for different bet timeframes:
- 30 seconds: Default 25% profit, 18% loss
- 60 seconds: Default 18% profit, 15% loss
- 120 seconds: Default 15% profit, 12% loss

Edit these values to adjust game economics.

### 5. Platform Statistics
**Location**: Admin Management page top section

Real-time statistics displaying:
- **Users**: Total count, admin count, regular users
- **Portfolios**: Total number, total value, total invested, total P&L
- **Transactions**: Total count, total volume, total fees

Refresh button updates statistics on demand.

## Configuration

### Environment Variables

The admin management system uses the following environment variables:

```env
NEXT_PUBLIC_ADMIN_API_BASE_URL=http://localhost:5000/api/admin
```

This should point to your backend's admin API endpoint.

## API Integration

The admin dashboard communicates with the backend through:

1. **Direct API Calls** (Development): Calls backend admin endpoints directly
2. **Local Proxy** (Production): Uses `/api/admin/proxy` to avoid CORS issues

### Supported Admin Endpoints

- `POST /mode` - Set global trading mode
- `POST /win-probability` - Set win probability percentage
- `POST /user-override` - Force user outcomes
- `POST /bet-config` - Update bet configuration
- `GET /settings` - Retrieve current settings
- `GET /stats` - Retrieve platform statistics
- `POST /reset` - Reset all data (use with caution)

## Accessing the Admin Dashboard

1. Log in to the application (any credentials work in demo mode)
2. Navigate to the sidebar menu
3. Click on "Admin Control" under the admin section
4. You'll see all management controls on one page

## Usage Examples

### Setting Global Mode to "All Win"

1. Click the "All Win" button in the Global Trading Mode card
2. You'll see a success message
3. All user trades will now result in wins

### Setting Win Probability to 75%

1. In the Win Probability card, enter `75` in the input field
2. Click "Apply"
3. You'll see the probability bar update to 75%

### Forcing a User to Lose

1. In the User Overrides section, enter the user ID
2. Select "Force Lose" from the dropdown
3. Optionally set an expiration time
4. Click "Add Override"
5. The user's next trade will result in a loss

### Updating Bet Configuration

1. Click on a timeframe button (30s, 60s, or 120s)
2. Adjust the profit and loss percentages
3. Click "Update Configuration"

## Best Practices

1. **Test Settings**: Use user overrides to test specific scenarios before deploying global changes
2. **Monitor Statistics**: Regularly refresh statistics to monitor platform health
3. **Document Changes**: Keep track of when and why settings were changed
4. **Backup Configs**: Note your current configuration values before making major changes
5. **Use Expiration Times**: Set expiration times for user overrides to prevent permanent changes

## Troubleshooting

### Backend Connection Issues

If you see "Backend unavailable" errors:
1. Verify your backend server is running
2. Check that `NEXT_PUBLIC_ADMIN_API_BASE_URL` points to the correct URL
3. Ensure the admin token has proper authorization

### Proxy Errors

If the local proxy returns errors:
1. Check that the `/api/admin/proxy` route is accessible
2. Verify your authentication token is valid
3. Ensure the backend endpoint exists and is correct

### Statistics Not Updating

1. Click the "Refresh" button to manually update
2. Check browser console for API errors
3. Verify backend connectivity

## Security Notes

1. All admin operations require a valid authentication token
2. Token is transmitted via Authorization header (Bearer token)
3. Backend validates all requests before making changes
4. User overrides expire after the specified time
5. Reset operation requires explicit confirmation

## Architecture

### Frontend Components

- `GlobalModeControl.tsx` - Global mode selection
- `WinProbabilityControl.tsx` - Probability configuration
- `UserOverrideManager.tsx` - User override management
- `BetConfigManager.tsx` - Bet configuration
- `AdminStatistics.tsx` - Platform statistics display

### API Hook

- `useAdminApi()` - Generic API request handler
- `useAdminMethods()` - Specific admin API methods

### Backend Proxy

- `/api/admin/proxy` - Next.js proxy for CORS handling

## Support

For issues or questions, check the debug console logs (`[v0]` prefixed messages) for detailed error information.
