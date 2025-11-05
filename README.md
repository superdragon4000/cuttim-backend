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