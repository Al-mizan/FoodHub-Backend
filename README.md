# Khabo API

RESTful backend service for Khabo — a food marketplace platform. Handles meals, providers, carts, orders, reviews, and user management.

## Architecture

```
Request → Route → Controller → Service → Prisma ORM → PostgreSQL
```

Each feature is organized as a module with its own route, controller, and service files. Controllers handle HTTP concerns (request parsing, response formatting), services contain business logic, and Prisma manages all database operations.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Language:** TypeScript
- **ORM:** Prisma (with PostgreSQL adapter)
- **Database:** PostgreSQL
- **Auth:** Better Auth
- **Email:** Nodemailer
- **Package Manager:** pnpm

## Key Features

- Meals CRUD with filtering, pagination, and sorting
- Provider/restaurant profile management
- Persistent cart with multi-provider support
- Order lifecycle (pending → preparing → on the way → delivered)
- Category management with slug-based lookups
- Review and rating system
- Role-based access control (Customer, Provider, Admin)
- Global error handling with consistent response format

## Project Structure

```
src/
├── server.ts                   # Entry point
├── app.ts                      # Express app setup, middleware, routes
├── config/
│   └── env.ts                  # Environment variable exports
├── lib/
│   ├── auth.ts                 # Better Auth configuration
│   └── prisma.ts               # Prisma client instance
├── middleware/
│   ├── auth.ts                 # Auth guard middleware
│   ├── globalErrorHandler.ts   # Centralized error handler
│   ├── logger.ts               # Request logging
│   └── notFoundRoute.ts        # 404 handler
├── modules/
│   ├── meals/                  # Meal management
│   ├── providers/              # Provider profiles
│   ├── carts/                  # Shopping cart
│   ├── orders/                 # Order processing
│   ├── categories/             # Food categories
│   ├── users/                  # User operations
│   ├── admin/                  # Admin operations
│   └── reviews/                # Meal reviews
├── helper/                     # Utility functions
├── constants/                  # App constants (roles, etc.)
├── types/                      # TypeScript type definitions
└── scripts/
    └── seedAdmin.ts            # Admin user seeding script
```

## API Routes

| Route              | Description              |
| ------------------ | ------------------------ |
| `GET /`            | Health check             |
| `/api/auth/*`      | Authentication (Better Auth) |
| `/api/users`       | User operations          |
| `/api/providers`   | Provider profiles        |
| `/api/categories`  | Food categories          |
| `/api/meals`       | Meal management          |
| `/api/carts`       | Cart operations          |
| `/api/orders`      | Order management         |
| `/api/reviews`     | Review system            |
| `/api/admin`       | Admin operations         |

## Database

Prisma schema is modularized across multiple files in `prisma/schema/`:

- `auth.prisma` — User, Session, Account, Verification
- `meals.prisma` — Meals, DietaryType enum
- `orders.prisma` — Orders, OrderItems, OrderStatus, PaymentStatus
- `carts.prisma` — Carts, CartItems, CartStatus
- `categories.prisma` — Categories
- `providerProfiles.prisma` — ProviderProfiles
- `reviews.prisma` — Reviews
- `coupons.prisma` — Coupons

### Prisma Commands

```bash
# Generate Prisma client
pnpm prisma generate

# Create and apply migrations
pnpm prisma migrate dev --name <migration_name>

# Apply migrations in production
pnpm prisma migrate deploy

# Open Prisma Studio (visual database browser)
pnpm prisma studio
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env

# Generate Prisma client
pnpm prisma generate

# Run migrations
pnpm prisma migrate dev

# Seed admin user
pnpm seed:admin

# Start development server
pnpm dev
```

## Environment Variables

| Variable               | Description                          |
| ---------------------- | ------------------------------------ |
| `DATABASE_URL`         | PostgreSQL connection string         |
| `PORT`                 | Server port                          |
| `APP_URL`              | Frontend URL (for CORS)              |
| `BETTER_AUTH_URL`      | Auth service base URL                |
| `GOOGLE_CLIENT_ID`     | Google OAuth client ID               |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret           |
| `SMTP_HOST`            | Email SMTP host                      |
| `SMTP_PORT`            | Email SMTP port                      |
| `SMTP_USER`            | Email SMTP username                  |
| `SMTP_PASS`            | Email SMTP password                  |

## Error Handling

All errors pass through a global error handler that returns consistent JSON responses. Validation errors, auth failures, and unexpected exceptions are all caught and formatted uniformly. The API never leaks stack traces in production.

## Deployment

The backend is structured for serverless deployment. Prisma is configured with the `@prisma/adapter-pg` driver adapter for connection pooling compatibility. Run `prisma generate` and `prisma migrate deploy` as part of build step.
