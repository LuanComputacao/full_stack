# Dog Breeds Explorer - Full Stack Application 🐕

A modern full-stack web application that allows users to explore dog breeds, view images, and manage their favorite breeds. Built with Vue.js 3 (frontend) and Node.js with TypeScript (backend), featuring a responsive design and comprehensive API documentation.

## 🌟 Features

### Frontend (Vue.js 3)

- **Browse Dog Breeds**: Comprehensive list of dog breeds and sub-breeds
- **Interactive Image Gallery**: Responsive carousel with high-quality breed images
- **Favorites Management**: Add/remove breeds from personal favorites list
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live synchronization with backend API
- **Modern UI**: Built with Tailwind CSS for a clean, modern interface
- **Error Handling**: Graceful error handling with retry mechanisms
- **Accessibility**: ARIA labels and keyboard navigation support

### Backend (Node.js + TypeScript)

- **RESTful API**: Clean API design following REST principles
- **Dog CEO API Integration**: Fetches breed data from external Dog CEO API
- **Redis Caching**: Improved performance with intelligent caching
- **Swagger Documentation**: Interactive API documentation
- **Structured Logging**: Comprehensive logging with Winston
- **Docker Support**: Full containerization for development and production
- **Health Checks**: Monitoring endpoints for service health
- **Error Handling**: Robust error handling and validation

## 🛠 Technology Stack

### Frontend

- **Framework**: Vue.js 3 with Composition API
- **Language**: TypeScript
- **State Management**: Pinia
- **Styling**: Tailwind CSS
- **Routing**: Vue Router
- **Icons**: Heroicons
- **Build Tool**: Vite
- **Testing**: Vitest + Playwright

### Backend

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Cache**: Redis
- **External API**: Dog CEO API
- **Documentation**: Swagger/OpenAPI 3.0
- **Logging**: Winston
- **Containerization**: Docker & Docker Compose
- **Package Manager**: pnpm

## 🏗 Project Structure

```text
full_stack/
├── app/                      # Frontend Vue.js application
│   ├── src/
│   │   ├── components/       # Reusable Vue components
│   │   ├── views/           # Page components
│   │   ├── stores/          # Pinia state management
│   │   ├── services/        # API service layer
│   │   └── router/          # Vue Router configuration
│   ├── public/              # Static assets
│   └── package.json
├── backend/                  # Backend Node.js API
│   ├── src/
│   │   ├── application/     # Use cases and DTOs
│   │   ├── config/          # Configuration files
│   │   ├── domain/          # Entities and interfaces
│   │   ├── infrastructure/  # External services
│   │   ├── interface/       # Controllers and routes
│   │   ├── routes/          # API routes
│   │   └── services/        # Business logic
│   ├── docker-compose.yml   # Docker configuration
│   └── package.json
└── README.md                # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v20.19.0 or >=22.12.0)
- pnpm package manager
- Docker and Docker Compose (optional, for containerized setup)

### Option 1: Local Development Setup

#### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pnpm install

# Start Redis (required for caching)
docker run -d --name dog-breeds-redis -p 6379:6379 redis:7-alpine

# Start the backend server
pnpm run dev
```

The backend will be available at `http://localhost:3001`

#### 2. Frontend Setup

```bash
# Navigate to frontend directory (open a new terminal)
cd app

# Install dependencies
pnpm install

# Start the development server
pnpm run dev
```

The frontend will be available at `http://localhost:5173`

### Option 2: Docker Setup

#### Backend with Docker

```bash
# Navigate to backend directory
cd backend

# Start all services (backend + Redis)
docker-compose up -d

# View logs
docker-compose logs -f
```

#### Frontend (still needs local setup)

```bash
# Navigate to frontend directory
cd app

# Install dependencies and start
pnpm install
pnpm run dev
```

## 📖 API Documentation

Once the backend is running, you can access the interactive Swagger documentation at:

- **Swagger UI**: `http://localhost:3001/api/docs`
- **OpenAPI JSON**: `http://localhost:3001/api/openapi.json`

### Available Endpoints

- `GET /health` - Health check
- `GET /api/breeds` - Get all dog breeds
- `GET /api/breeds/:breed/images` - Get images for a specific breed
- `GET /api/favorites` - Get favorite breeds
- `POST /api/favorites` - Add a breed to favorites
- `DELETE /api/favorites/:breed` - Remove a breed from favorites
- `DELETE /api/breeds/cache/clear` - Clear breed cache

## 🧪 Testing

### Frontend Testing

```bash
cd app

# Run unit tests
pnpm run test:unit

# Run end-to-end tests
pnpm run test:e2e
```

### Backend Testing

```bash
cd backend

# Run type checking
pnpm run type-check

# Run linting
pnpm run lint

# Run formatting check
pnpm run format:check

# Run all quality checks
pnpm run quality
```

## 🔧 Development Scripts

### Frontend (app/)

```bash
pnpm run dev          # Start development server
pnpm run build        # Build for production
pnpm run preview      # Preview production build
pnpm run test:unit    # Run unit tests
pnpm run test:e2e     # Run e2e tests
pnpm run lint         # Lint and fix code
pnpm run format       # Format code
```

### Backend (backend/)

```bash
pnpm run dev          # Start development server
pnpm run build        # Build TypeScript
pnpm run start        # Start production server
pnpm run type-check   # Check TypeScript types
pnpm run lint         # Lint code
pnpm run format       # Format code
pnpm run quality      # Run all quality checks
```

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild and start
docker-compose up --build -d

# Production setup
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## 🌐 Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend/` directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# Redis Configuration
REDIS_URL=redis://localhost:6379

# CORS Configuration
CORS_ORIGIN=http://localhost:5173

# External API
DOG_API_BASE_URL=https://dog.ceo/api
```

### Frontend Environment

The frontend is configured to connect to the backend at `http://localhost:3001` by default. This can be modified in `app/src/services/api.ts`.

## 🚀 Production Deployment

### Backend Deployment

1. Build the application:

   ```bash
   cd backend
   pnpm run build
   ```

2. Use the production Docker setup:

   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

### Frontend Deployment

1. Build the application:

   ```bash
   cd app
   pnpm run build
   ```

2. Deploy the `dist/` folder to your preferred hosting service (Vercel, Netlify, etc.)

3. Update the API base URL in production build to point to your backend server.

## ⚠️ Known Issues and Assumptions

### Known Issues

1. **CORS Configuration**: The backend is currently configured to allow all origins (`*`) in development. This should be restricted in production.

2. **Error Handling**: Some edge cases in image loading might not be handled gracefully.

3. **Cache Invalidation**: Redis cache doesn't have automatic invalidation - manual cache clearing may be needed.

### Assumptions

1. **External API Dependency**: The application relies on the Dog CEO API (`https://dog.ceo/api/`) being available and stable.

2. **Redis Availability**: The backend requires Redis for caching. Without Redis, the application will still work but with reduced performance.

3. **Modern Browser Support**: The frontend is built with modern web standards and may not work on very old browsers.

4. **Network Connectivity**: The application assumes stable internet connectivity for API calls and image loading.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is part of a technical assessment and is for demonstration purposes only.

## 🆘 Support

If you encounter any issues:

1. Check the logs: `docker-compose logs -f` (for Docker setup)
2. Verify all services are running: `http://localhost:3001/health`
3. Ensure Redis is accessible
4. Check that the Dog CEO API is available

---

**Built with ❤️ using Vue.js 3, Node.js, TypeScript, and modern web technologies.**
