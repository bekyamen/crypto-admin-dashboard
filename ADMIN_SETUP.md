# Admin Dashboard Setup Guide

## Quick Start

### 1. Environment Configuration

Make sure your `.env.local` file includes:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
NEXT_PUBLIC_ADMIN_API_BASE_URL=http://localhost:5000/api/admin
```

Adjust the URLs if your backend is hosted elsewhere.

### 2. Backend Requirements

Your backend should implement the following admin endpoints:

#### GET /api/admin/settings
Returns current admin settings and user overrides.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Admin settings retrieved successfully",
  "data": {
    "globalMode": "random",
    "winProbability": 70,
    "userOverridesCount": 2,
    "userOverrides": [
      {
        "userId": "user123",
        "forceOutcome": "win",
        "expiresAt": "2026-02-05T10:00:00Z"
      }
    ]
  }
}
```

#### GET /api/admin/stats
Returns platform statistics.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "message": "Admin statistics retrieved successfully",
  "data": {
    "users": {
      "total": 10,
      "admins": 1,
      "regularUsers": 9
    },
    "portfolios": {
      "total": 5,
      "totalValue": 50000,
      "totalInvested": 50000,
      "totalPnL": 0
    },
    "transactions": {
      "total": 25,
      "totalVolume": 50000,
      "totalFees": 500
    },
    "timestamp": "2026-02-04T10:09:09.352Z"
  }
}
```

#### POST /api/admin/mode
Set global trading mode.

**Request:**
```json
{
  "mode": "win"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Global mode set to win",
  "data": {
    "mode": "win",
    "timestamp": "2026-02-04T09:55:05.601Z"
  }
}
```

#### POST /api/admin/win-probability
Set win probability.

**Request:**
```json
{
  "percentage": 70
}
```

**Response:**
```json
{
  "success": true,
  "message": "Win probability set to 70%",
  "data": {
    "winProbability": 70,
    "timestamp": "2026-02-04T13:55:58.602Z"
  }
}
```

#### POST /api/admin/user-override
Set or remove user override.

**Request (Set Override):**
```json
{
  "userId": "user123",
  "forceOutcome": "win",
  "expiresAt": "2026-02-04T12:00:00Z"
}
```

**Request (Remove Override):**
```json
{
  "userId": "user123",
  "forceOutcome": null
}
```

**Response:**
```json
{
  "success": true,
  "message": "User user123 override removed",
  "data": {
    "userId": "user123",
    "forceOutcome": null,
    "timestamp": "2026-02-04T09:59:42.427Z"
  }
}
```

#### POST /api/admin/bet-config
Update bet configuration.

**Request:**
```json
{
  "expirationTime": 60,
  "profitPercent": 25,
  "lossPercent": 18
}
```

**Response:**
```json
{
  "success": true,
  "message": "Bet config updated for 60s expiration",
  "data": {
    "expirationTime": 60,
    "profitPercent": 25,
    "lossPercent": 18,
    "timestamp": "2026-02-04T10:02:41.033Z"
  }
}
```

### 3. Accessing the Admin Dashboard

1. Navigate to your application
2. Log in with any credentials (demo mode)
3. Click "Admin Control" in the sidebar
4. You should see all admin management controls

### 4. Testing the Connection

To verify your backend is connected:

1. In the Admin Control page, look for the "Platform Statistics" section
2. Click the "Refresh" button
3. If statistics load, the connection is working
4. Check browser console for `[v0]` logs showing the API requests

### 5. Troubleshooting Connection Issues

#### 404 Errors on Admin Endpoints

- Verify backend has implemented the correct endpoints
- Check that the endpoint URLs match exactly
- Ensure authorization token is valid

#### CORS Errors

- The system automatically uses a local proxy (`/api/admin/proxy`) to avoid CORS
- If you still see CORS errors, verify the proxy route is available

#### 503 Backend Unavailable

- Check that your backend server is running
- Verify the `NEXT_PUBLIC_ADMIN_API_BASE_URL` is correct
- Test connectivity with: `curl -H "Authorization: Bearer <token>" http://localhost:5000/api/admin/settings`

### 6. Production Deployment

Before deploying to production:

1. Update `NEXT_PUBLIC_ADMIN_API_BASE_URL` to your production backend URL
2. Ensure authentication tokens are securely generated and validated
3. Test all admin functions in a staging environment
4. Review security policies for admin operations
5. Set up logging for all admin actions
6. Consider implementing rate limiting on admin endpoints

### 7. Security Recommendations

1. **Token Security**: Never expose admin tokens in logs or to unauthorized users
2. **Operation Logging**: Log all admin operations with timestamps and user info
3. **Input Validation**: Validate all inputs (probability 0-100, valid user IDs, etc.)
4. **Rate Limiting**: Limit admin API requests to prevent abuse
5. **Admin Only**: Ensure only admin users can access admin endpoints
6. **Audit Trail**: Keep an audit log of all admin changes

### 8. Common Tasks

#### Changing Game Outcome

1. Go to Admin Control
2. Click "All Win" for all trades to win
3. Click "All Lose" for all trades to lose
4. Click "Random" to use probability-based outcomes

#### Fixing a User's Trade

1. Go to Admin Control
2. In "User Overrides" section, enter the user ID
3. Select the desired outcome (Win/Lose)
4. Click "Add Override"
5. The user's next trade will have the forced outcome

#### Adjusting Bet Economics

1. Go to Admin Control
2. In "Bet Configuration" section, select a timeframe
3. Adjust profit and loss percentages
4. Click "Update Configuration"

## Support & Debugging

Enable debug logging by looking for `[v0]` prefixed messages in your browser console to troubleshoot issues.

All API requests and responses are logged with `[v0]` prefix for easy debugging.
