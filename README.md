# Backend Project

## 📖 Description
This backend is built with **NestJS**, **TypeScript**, and **TypeORM**.  
It provides authentication, user management, notifications (email verification), and order management features.  
The architecture follows modular design principles, with clear separation of concerns (Auth, Users, Notifications, Orders, Database).

---

## 💼 Business Logic

### 1. File Upload & Quote
- User uploads a **DXF file** containing the design.
- Backend parses the file and calculates the **bounding box dimensions**.
- User selects:
  - Material type (e.g., steel, aluminum, acrylic).
  - Quantity of parts.
- System generates a **quote**:
  - Price is calculated based on bounding box size, material, and quantity.
  - Quote is shown to the user before order creation.

### 2. Order Creation
- If the user accepts the quote, they proceed to create an **order**.
- User provides:
  - Shipping address (required for fulfillment).
  - Contact details.
- Order is stored with status `pending`.

### 3. Payment
- User pays for the order via integrated payment gateway.
- Backend tracks **payment status**:
  - `pending` → `paid` → `failed`.
- Only **paid orders** move forward to manufacturing.

### 4. Manufacturing Workflow
- Manager accesses the **admin panel**.
- Manager sees all orders with their DXF files and details.
- Manager downloads DXF files and sends them to **laser cutting machines**.
- Manager updates order status:
  - `manufacturing` → `shipped`.

### 5. Shipping & Tracking
- Once fabrication is complete, the order is marked as `shipped`.
- Manager assigns a **tracking number** to the shipment.
- User can view the **order timeline**:
  - Quote accepted.
  - Order created.
  - Payment confirmed.
  - Manufacturing started.
  - Shipped with tracking number.

---

## 📦 Roles & Responsibilities

### Clients
- Upload DXF files.
- Select material and quantity.
- Receive instant quote.
- Create orders, provide shipping address, and pay.
- Track order status and shipment timeline.

### Managers
- Access admin panel to view all orders.
- Download DXF files for production.
- Update order statuses (`manufacturing`, `shipped`).
- Assign tracking numbers for shipments.

---

## 🚀 Flow Summary
1. **DXF Upload → Quote → Order → Payment → Manufacturing → Shipping → Tracking**
2. Clients interact with the frontend to place and track orders.
3. Managers interact with the admin panel to fulfill and update orders.

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


---

## API Updates (2026-02-11)

### Client flow
- `POST /api/v1/orders/preview` -> quote preview (line items, subtotal, shipping, total).
- `POST /api/v1/orders/create` -> creates order from files/materials/quantity + shipping payload.
- `GET /api/v1/orders` -> client cabinet list (own orders).
- `GET /api/v1/orders/:id` -> client order details with status/payment/tracking/timestamps.
- `POST /api/v1/payments/create` -> creates YooKassa payment by `orderId` (price taken from order, not from client payload).

### Manager flow
- `GET /api/v1/orders` -> full order list (supports filters/sorting/pagination, optional `userId` filter).
- `PATCH /api/v1/orders/:id/status` -> updates order lifecycle status.
- `PATCH /api/v1/orders/:id/tracking` -> assigns tracking number and shipment timestamp.
- `PATCH /api/v1/orders/:id/payment-status` -> updates payment state (`pending`, `paid`, `failed`).
- `GET /api/v1/files/:fileId/download` -> downloads DXF file for production.

### Payment callback
- `POST /api/v1/payments/webhook/yookassa` -> YooKassa webhook for automatic payment status synchronization.
- Webhook resolves order by `metadata.orderId` and updates order `paymentStatus` (`paid`/`failed`/`pending`).

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
