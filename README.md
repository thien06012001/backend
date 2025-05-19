# Backend Application

## Overview

This is the backend for your web application, built with:

- **Express.js** for handling HTTP routes and middleware
- **TypeScript** for type-safe development
- **Sequelize ORM** with MySQL for relational database management
- **Mongoose** for MongoDB interaction
- **Swagger** for auto-generated API documentation
- **Winston** for logging
- **Dotenv** for environment variable handling

## Getting Started

### Prerequisites

- Node.js (v20 or higher)
- MySQL and/or MongoDB
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/thien06012001/backend.git
cd backend
```

2. Install dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.development` file in the root directory with the following content (example):

```env
MYSQL_DB_NAME=your_mysql_db_name
MYSQL_DB_USER=your_mysql_username
MYSQL_DB_PASSWORD=your_mysql_password
MYSQL_DB_HOST=localhost
MYSQL_DB_PORT=3306

MONGO_DB_URI=mongodb://localhost:27017/your-db
SECRET_KEY=your_secret_key
PORT=5000
```

### Development

To run the development server with automatic restarts:

```bash
npm run dev
```

### Production

To build and start the app in production:

```bash
npm run build
npm start
```

## Database

- Sync database models:

```bash
npm run sync:db
```

- Seed the database:

```bash
npm run seed:db
```

## Linting & Formatting

Run ESLint:

```bash
npm run lint
```

Fix lint issues:

```bash
npm run lint:fix
```

## API Documentation

Swagger documentation is available once the server is running at:

```
http://localhost:<PORT>/api-docs
```

## License

This project does not yet specify a license. Please add a `LICENSE` file as appropriate.
