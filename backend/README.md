# Dog Breeds API 🐕

A RESTful API backend service for exploring dog breeds and managing favorites, built with Node.js, TypeScript, Express, and Redis.

## 📖 Overview

The Dog Breeds API is a backend service that allows users to:

- Fetch all available dog breeds from the [Dog CEO API](https://dog.ceo/dog-api/)
- Get random images for specific dog breeds
- Manage a personal favorites list of dog breeds
- Cache API responses for improved performance

The API features Redis caching, comprehensive Swagger documentation, structured logging, and Docker containerization for both development and production environments.

## 🛠 Technology Stack

- **Runtime**: Node.js 20
- **Language**: TypeScript
- **Framework**: Express.js
- **Cache**: Redis
- **External API**: Dog CEO API
- **Documentation**: Swagger/OpenAPI 3.0
- **Logging**: Winston
- **Containerization**: Docker & Docker Compose
- **Package Manager**: pnpm

## 🏗 Architecture

The project follows Clean Architecture principles with a well-organized folder structure:

```
src/
├── app.ts                    # Express app configuration
├── index.ts                  # Application entry point
├── application/              # Application layer (use cases, DTOs)
│   ├── dtos/
│   └── use-cases/
├── config/                   # Configuration files
│   ├── DependencyContainer.ts
│   ├── logger.ts            # Winston logging setup
│   ├── redis.ts             # Redis connection
│   └── swagger.ts           # API documentation
├── domain/                   # Domain layer (entities, interfaces)
│   ├── entities/
│   └── repositories/
├── infrastructure/           # Infrastructure layer
│   ├── external/            # External API clients
│   └── repositories/        # Repository implementations
├── interface/               # Interface layer (controllers, routes)
│   ├── controllers/
│   └── routes/
├── middleware/              # Express middleware
├── routes/                  # API route definitions
└── services/               # Business logic services
```

### Key Components

- **Services**: Handle business logic and external API interactions
- **Routes**: Define API endpoints with Swagger documentation
- **Config**: Centralized configuration for Redis, logging, and documentation
- **Middleware**: Request logging and error handling
- **Caching**: Redis-based caching for improved performance

## 🚀 Development Environment

### Prerequisites

- **Node.js** 20 or higher
- **pnpm** package manager
- **Redis** (can be run via Docker)

### Local Development Setup

1. **Clone and install dependencies:**

   ```bash
   git clone <repository-url>
   cd backend
   pnpm install
   ```

2. **Start Redis** (if not using Docker):

   ```bash
   # Using Docker
   docker run -d -p 6379:6379 redis:7-alpine
   
   # Or install locally (Ubuntu/Debian)
   sudo apt-get install redis-server
   redis-server
   ```

3. **Environment Variables** (optional):

   ```bash
   # Create .env file
   PORT=3001
   NODE_ENV=development
   REDIS_URL=redis://localhost:6379
   CORS_ORIGIN=*
   ```

4. **Start the development server:**

   ```bash
   pnpm run dev
   ```

   The API will be available at:
   - **API**: <http://localhost:3001>
   - **Health Check**: <http://localhost:3001/health>
   - **API Documentation**: <http://localhost:3001/api/docs>

### Development Scripts

```bash
# Start development server with hot reload
pnpm run dev

# Build the application
pnpm run build

# Start production server
pnpm start

# Type checking
pnpm run type-check

# Linting
pnpm run lint
pnpm run lint:fix

# Code formatting
pnpm run format
pnpm run format:check

# Run all quality checks
pnpm run quality
```

### Using Docker for Development

1. **Start all services:**

   ```bash
   docker-compose up
   ```

   This automatically uses `docker-compose.yml` + `docker-compose.override.yml` for development configuration with:
   - Hot reload via volume mounting
   - Development Dockerfile
   - Redis service

2. **Stop services:**

   ```bash
   docker-compose down
   ```

## 🏭 Production Environment

### Docker Production Deployment

1. **Build and start production containers:**

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. **Production features:**
   - Multi-stage Docker build for optimized image size
   - Production-only dependencies
   - Non-root user for security
   - Health checks enabled
   - Data persistence volumes

### Manual Production Setup

1. **Build the application:**

   ```bash
   pnpm install --frozen-lockfile
   pnpm run build
   ```

2. **Set production environment variables:**

   ```bash
   export NODE_ENV=production
   export PORT=3001
   export REDIS_URL=redis://your-redis-server:6379
   ```

3. **Start the production server:**

   ```bash
   pnpm start
   ```

## 📡 API Endpoints

### Breeds

- `GET /api/breeds` - Get all dog breeds
- `GET /api/breeds/:breed/images` - Get random images for a breed
- `DELETE /api/breeds/cache/clear` - Clear breeds cache

### Favorites

- `GET /api/favorites` - Get all favorite breeds
- `POST /api/favorites` - Add a breed to favorites
- `DELETE /api/favorites/:breed` - Remove a breed from favorites

### Health & Documentation

- `GET /health` - Health check endpoint
- `GET /api/docs` - Swagger UI documentation
- `GET /api/openapi.json` - OpenAPI specification

## 📊 Features

### Caching Strategy

- **Redis Cache**: 5-minute TTL for breed data
- **Cache Management**: Manual cache clearing endpoint
- **Fallback**: Graceful degradation when Redis is unavailable

### Logging

- **Structured Logging**: Winston with multiple log levels
- **Request Logging**: HTTP request/response logging
- **Error Tracking**: Comprehensive error logging
- **Log Files**: Separate files for different log types

### Health Monitoring

- **Health Endpoint**: Returns API status, Redis status, and timestamp
- **Docker Health Checks**: Built-in container health monitoring
- **Graceful Shutdown**: Proper cleanup on process termination

### Data Persistence

- **Favorites Storage**: JSON file-based persistence
- **Volume Mounting**: Docker volumes for data persistence in production

## 🔧 Configuration

### Environment Variables

| Variable      | Default                  | Description             |
| ------------- | ------------------------ | ----------------------- |
| `PORT`        | `3001`                   | Server port             |
| `NODE_ENV`    | `development`            | Environment mode        |
| `REDIS_URL`   | `redis://localhost:6379` | Redis connection string |
| `CORS_ORIGIN` | `*`                      | CORS allowed origins    |
| `HOSTNAME`    | `localhost`              | Server hostname         |

### Redis Configuration

- **Connection**: Automatic connection on startup
- **Health Checks**: Connection status monitoring
- **Reconnection**: Automatic reconnection handling

## 🚨 Error Handling

- **Global Error Handler**: Catches unhandled errors
- **Structured Error Responses**: Consistent error format
- **Environment-aware**: Detailed errors in development, generic in production
- **Logging**: All errors are logged with context

## 📝 Development Notes

- **Code Quality**: ESLint + Prettier configuration
- **Type Safety**: Strict TypeScript configuration
- **Hot Reload**: Development server with automatic restart
- **API Documentation**: Auto-generated Swagger docs from code comments
- **Clean Architecture**: Domain-driven design principles

## 🤝 Contributing

1. Follow the existing code style and architecture
3. Update documentation for API changes
4. Ensure all quality checks pass: `pnpm run quality`

---

Built with ❤️ by LuanComputacao
