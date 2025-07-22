# Campus Cliq Development Plan

## Project Overview
Campus Cliq is a university social app that blends club management with social media features. Currently implementing web-first approach, with future React Native migration planned.

## Current Architecture
- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + Express + PostgreSQL + Knex.js
- **Authentication**: JWT with httpOnly cookies + memory storage for access tokens
- **Security**: Comprehensive input validation, sanitization, RBAC

## Security Implementation Status ✅
All major security vulnerabilities have been addressed:

### Authentication & Authorization ✅
- JWT authentication with httpOnly cookies implemented
- Role-based access control (student → clubAdmin → superAdmin)
- Protected routes using React Router nested routing
- Auth middleware with proper token verification
- Password hash exclusion from req.user object

### Input Validation & Sanitization ✅
- React Hook Form + Zod validation patterns
- DOMPurify for XSS prevention
- Express-validator for backend validation
- Proper error handling and validation feedback

### Security Middleware ✅
- Helmet for security headers
- CORS with credential support
- Rate limiting (100 requests/15min)
- Express error handling with proper middleware ordering

## Current Backend Status
### Completed Files ✅
- `/backend/src/server.js` - Main server with security middleware
- `/backend/src/config/database.js` - PostgreSQL connection with Knex
- `/backend/src/middleware/auth.js` - JWT auth + role-based access
- `/backend/src/middleware/errorHandler.js` - Error handling middleware
- `/backend/src/routes/posts.js` - Posts API with DRY principle applied

### Missing Backend Files ❌
- `/backend/src/routes/auth.js` - Login/register/logout endpoints
- `/backend/src/routes/users.js` - User management endpoints
- `/backend/src/routes/clubs.js` - Club management endpoints
- `/backend/src/routes/messages.js` - Direct messaging endpoints
- `/backend/src/migrations/` - Database schema migrations
- `/backend/src/seeds/` - Sample data for development

## Database Schema Needed
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  major VARCHAR(255),
  year INTEGER,
  role VARCHAR(50) DEFAULT 'student',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Clubs table
CREATE TABLE clubs (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  admin_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Posts table
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  author_id INTEGER REFERENCES users(id),
  club_id INTEGER REFERENCES clubs(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  sender_id INTEGER REFERENCES users(id),
  recipient_id INTEGER REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  read_at TIMESTAMP
);

-- Club members table
CREATE TABLE club_members (
  id SERIAL PRIMARY KEY,
  club_id INTEGER REFERENCES clubs(id),
  user_id INTEGER REFERENCES users(id),
  role VARCHAR(50) DEFAULT 'member',
  joined_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(club_id, user_id)
);
```

## Critical Issues to Fix (High Priority)
1. **Post creation failing** - Backend API routes not connected to frontend
2. **Search functionality broken** - No backend search endpoints
3. **Direct messaging missing** - Core feature not implemented

## Key Technical Patterns Established

### Form Validation Pattern
```javascript
// Use superRefine for conditional validation
const schema = z.object({
  role: z.enum(['student', 'clubAdmin']),
  clubName: z.string().optional()
}).superRefine((data, ctx) => {
  if (data.role === 'clubAdmin' && !data.clubName?.trim()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Club name is required for club admin role',
      path: ['clubName']
    });
  }
});
```

### Role Hierarchy Pattern
```javascript
// Separate functions for different role checks
const hasRole = (userRole, requiredRole) => {
  const hierarchy = { student: 0, clubAdmin: 1, superAdmin: 2 };
  return hierarchy[userRole] >= hierarchy[requiredRole];
};

const isAdmin = (userRole) => userRole === 'superAdmin';
const isClubAdmin = (userRole) => userRole === 'clubAdmin';
```

### Logout Pattern with Finally Block
```javascript
const logout = async () => {
  try {
    await api.post('/auth/logout');
  } catch (error) {
    console.error('Logout API call failed:', error);
  } finally {
    // Always clear local state regardless of API success/failure
    setUser(null);
    setAccessToken(null);
  }
};
```

### Database Query DRY Pattern
```javascript
// Reusable query function to eliminate duplication
const getCompletePostQuery = (postId = null) => {
  const query = db('posts')
    .select('posts.*', 'users.name as author_name', /* ... */)
    .leftJoin('users', 'posts.author_id', 'users.id');
  
  return postId ? query.where('posts.id', postId).first() : query.orderBy('posts.created_at', 'desc');
};
```

## Environment Configuration
```bash
# Backend .env
DATABASE_URL=postgresql://username:password@localhost:5432/campus_cliq
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:8080
NODE_ENV=development
PORT=3001
```

## Technical Fixes Applied

### WSL Environment Issues ✅
- Fixed npm/Node.js version conflicts in WSL
- Removed problematic lovable-tagger dependency
- Downgraded Vite from 7.x to 5.4.1 for compatibility

### React Context Issues ✅
- Simplified AuthContext to prevent blank screens
- Removed complex useEffect that caused render issues
- Implemented static dev mode initialization

### Express Middleware Ordering ✅
```javascript
// Correct order: routes → 404 handler → error handler
app.use('/api/posts', authMiddleware, postRoutes);
app.use('*', (req, res, next) => {
  const error = new Error('Endpoint not found');
  error.status = 404;
  next(error); // Pass to error handler, don't respond directly
});
app.use(errorHandler); // Must be last
```

## Next Steps Priority Order

### Immediate (High Priority)
1. Create database migrations for all tables
2. Build auth.js route (login/register/logout)
3. Build users.js route (profile management)
4. Connect frontend to real API endpoints
5. Fix post creation and search functionality

### Medium Priority
1. Build clubs.js route (club management)
2. Build messages.js route (direct messaging)
3. Add club-specific messaging/channels
4. Implement user discovery features

### Future Enhancements
1. Real-time messaging with WebSockets
2. File upload for images/documents
3. Advanced search and filtering
4. React Native mobile app migration
5. University SSO integration

## Code Quality Standards
- Follow DRY principle - no duplicate database queries
- Exclude sensitive data (password_hash) from API responses
- Use single DATABASE_URL for configuration consistency
- Implement proper error handling with try/catch/finally
- Apply input validation on both frontend and backend
- Use TypeScript interfaces for type safety

## Testing Strategy
- Backend: Test API endpoints with proper auth
- Frontend: Test protected routes and form validation
- Integration: Test auth flow and data persistence
- Security: Test for XSS, injection, and auth bypass

## Current Working Features ✅
- User authentication (login/logout)
- Role-based access control
- Protected routes
- Input validation and sanitization
- Security middleware
- Error handling

## Broken Features ❌
- Post creation (frontend calls non-existent backend)
- Search functionality (no backend implementation)
- Direct messaging (not implemented)
- Club management (backend routes missing)

This plan represents the complete state of Campus Cliq development with all security implementations, technical fixes, and architectural decisions made during previous sessions.