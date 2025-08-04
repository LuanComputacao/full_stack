# Docker Compose Strategy

This project now uses Docker Compose override files for different environments:

## File Structure

- `docker-compose.yml` - Base configuration shared between all environments
- `docker-compose.override.yml` - Development environment (used by default)
- `docker-compose.prod.yml` - Production environment

## Usage

### Development (default)

```bash
# This will automatically use docker-compose.yml + docker-compose.override.yml
docker-compose up

# Or explicitly
docker-compose -f docker-compose.yml -f docker-compose.override.yml up
```

### Production

```bash
# Use the production override file
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

# Or with detached mode
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

## Environment Variables

- `PORT` - Port to expose the backend service (default: 3001)

## Key Differences

### Development Environment

- Uses `Dockerfile.dev` for hot reload capabilities
- Mounts source code as volumes for live updates
- Uses `data_dev` directory for data persistence
- Faster healthcheck start period (20s)
- Node modules cache volume for faster builds

### Production Environment

- Uses production `Dockerfile`
- Mounts only data directory for persistence
- Longer healthcheck start period (40s)
- Optimized for stability and performance
