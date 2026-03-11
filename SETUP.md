# Setup Instructions

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Up Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your database URL and NextAuth secrets
   - Add Google OAuth credentials (optional)

3. **Set Up Database**
   ```bash
   npx prisma db push
   npm run db:seed
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## Database Setup

### PostgreSQL

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE unistayconnect;
   ```

2. Update `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/unistayconnect?schema=public"
   ```

3. Push schema:
   ```bash
   npx prisma db push
   ```

## Authentication Setup

### NextAuth Secret

Generate a random secret:
```bash
openssl rand -base64 32
```

Add to `.env`:
```
NEXTAUTH_SECRET="your-generated-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Google OAuth (Optional)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add to `.env`:
   ```
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

## Default Login Credentials

After seeding:
- **Admin**: admin@unistayconnect.com / admin123
- **Student**: student1@unistayconnect.com / student123
- **Landlord**: landlord1@unistayconnect.com / landlord123

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Check DATABASE_URL format
- Verify database exists

### NextAuth Issues
- Ensure NEXTAUTH_SECRET is set
- Check NEXTAUTH_URL matches your app URL
- Clear browser cookies if session issues persist

### Prisma Issues
- Run `npx prisma generate` after schema changes
- Use `npx prisma studio` to inspect database

