# Security Architecture

## Problem

Using Supabase directly in client-side services exposes:

- API keys (even if anon key)
- Direct database access
- Limited server-side validation
- Harder to implement rate limiting
- No request logging/monitoring

## Solution

**Two-Layer Architecture:**

1. **Client Services** (`services/client/`) - Call API routes via fetch
2. **Server Services** (`services/server/`) - Use server-side Supabase client
3. **API Routes** (`app/api/`) - Handle requests, validate, authenticate

## Architecture Flow

```
Client Component
    ↓
Client Service (services/client/)
    ↓ (HTTP Request)
API Route (app/api/)
    ↓
Server Service (services/server/)
    ↓
Supabase Server Client (lib/supabase/server.ts)
    ↓
Supabase Database
```

## Benefits

✅ **Security**

- API keys stay on server
- Server-side validation
- Rate limiting possible
- Request logging

✅ **Control**

- Centralized business logic
- Easier to change database
- Better error handling

✅ **Scalability**

- Can add caching layer
- Can add rate limiting
- Can add request queuing

## Migration Status

- ✅ Auth service - Migrated to API routes
- ⏳ Game service - Needs migration
- ⏳ Room service - Needs migration
- ⏳ Chat service - Needs migration
- ⏳ User service - Needs migration

## Usage

### Client-Side (Components)

```typescript
import { authService } from "@/services/client/auth.service";

// This calls /api/auth/signin
await authService.signIn({ email, password });
```

### Server-Side (API Routes)

```typescript
import { authService } from "@/services/server/auth.service";

// This uses server Supabase client
await authService.signIn({ email, password });
```
