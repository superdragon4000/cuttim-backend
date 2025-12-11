# Backend Project

## 📖 Description
This backend is built with **NestJS**, **TypeScript**, and **TypeORM**.  
It provides authentication, user management, notifications (email verification), and order management features.  
The architecture follows modular design principles, with clear separation of concerns (Auth, Users, Notifications, Orders, Database).

---

## 💼 Business Logic

### Authentication & Users
- **JWT-based authentication** with role guards (`client`, `manager`, `admin`).
- **Email verification flow**:
  - User registers → receives verification email with token.
  - Token validation with TTL (24h).
  - User marked as verified after successful confirmation.
- **Role-based access control** for protected endpoints.

### Notifications
- **NotificationModule** abstracts communication channels (email, SMS, push).
- Current implementation: **SendGrid provider** for email.
- Extensible design: new providers can be added without changing business logic.

### Orders (planned features)
- ❌ **Quote/Preview endpoint**: allow users to preview pricing before confirming an order.
- ❌ **Shipping address capture**: collect and validate addresses for fulfillment.
- ❌ **Payment status tracking**: integrate with payment gateway to mark orders as `pending`, `paid`, `failed`.
- ❌ **Manager order status updates**: managers can update order lifecycle (`fabricated`, `shipped`).
- ❌ **Tracking number assignment**: link shipment tracking numbers to orders.
- ❌ **Order timeline/tracking view**: users can see order history and shipment dates.

---

## ⚙️ Technical Decisions
- **NestJS**: modular architecture, dependency injection, decorators for guards and roles.
- **TypeORM**: database migrations, seeds, schema management.
- **PostgreSQL**: relational database with strong consistency guarantees.
- **Swagger**: auto-generated API documentation with `@ApiOperation` and `@ApiResponse`.
- **Guards**: `JwtAuthGuard` and `RolesGuard` secure endpoints.
- **Notifications**: provider pattern (currently SendGrid, extensible to Mailgun/SES).
- **Error handling**: RESTful semantics (`409 Conflict`, `400 Bad Request`, `429 Too Many Requests`).
- **Rate limiting**: planned for verification email endpoint to prevent abuse.
- **CI/CD**: ready for integration with Docker and pipelines.

---

## 🚀 Roadmap
- [ ] Quote/preview endpoint  
- [ ] Shipping address capture  
- [ ] Payment status tracking  
- [ ] Manager order status updates  
- [ ] Tracking number assignment  
- [ ] Order timeline/tracking view  

---

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Migrations

```bash
# To create migrations use:
$ npm run migration:create src/database/migration/<MigrationName>

# To generate migrations use:
$ npm run migration:generate src/database/migration/<MigrationName>

# To run migrations use:
$ npm run migration:run
```

## Seeds

```bash
#To run seeds use:
$ npm run seed:run
```

## Drop Schemas

```bash
# To drop schemas use:
$ npm run schema:drop
```