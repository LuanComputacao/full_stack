#!/bin/bash

# Docker Management Script for Dog Breeds Backend
# Usage: ./docker.sh [command]

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_color() {
    printf "${!1}%s${NC}\n" "$2"
}

# Show usage
show_usage() {
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  build        Build production image"
    echo "  up           Start development containers (with hot-reload)"
    echo "  down         Stop development containers"
    echo "  logs         Show development logs (follow mode)"
    echo "  status       Show status of all containers"
    echo "  shell        Access development container shell"
    echo "  restart      Restart development containers"
    echo "  clean        Remove ALL containers, volumes and images"
    echo ""
    echo "Examples:"
    echo "  $0 up        # Start development environment"
    echo "  $0 logs      # Watch live logs"
    echo "  $0 shell     # Debug inside container"
    echo "  $0 clean     # Clean everything (with confirmation)"
    echo ""
    echo "Note: This script is optimized for development workflow."
    echo "For production deployment, use docker-compose.yml directly."
    echo ""
}

# Check if Docker is running
check_docker() {
    if ! docker info > /dev/null 2>&1; then
        print_color "RED" "Docker is not running. Please start Docker and try again."
        exit 1
    fi
}

# Main script
main() {
    check_docker
    
    case "$1" in
        "build")
            print_color "BLUE" "Building production image..."
            docker compose build
            print_color "GREEN" "Build complete!"
            ;;
        "up")
            print_color "BLUE" "Starting development containers..."
            docker compose -f docker-compose.dev.yml up -d
            print_color "GREEN" "Development containers started!"
            print_color "YELLOW" "API available at: http://localhost:3001 (with hot-reload)"
            ;;
        "down")
            print_color "BLUE" "Stopping development containers..."
            docker compose -f docker-compose.dev.yml down
            print_color "GREEN" "Development containers stopped!"
            ;;
        "logs")
            print_color "BLUE" "Showing development logs..."
            docker compose -f docker-compose.dev.yml logs -f backend-dev
            ;;
        "clean")
            print_color "YELLOW" "This will remove ALL containers, volumes and images. Continue? [y/N]"
            read -r response
            if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
                print_color "BLUE" "Cleaning up..."
                docker compose down -v --rmi all 2>/dev/null || true
                docker compose -f docker-compose.dev.yml down -v --rmi all 2>/dev/null || true
                print_color "GREEN" "Cleanup complete!"
            else
                print_color "YELLOW" "Cleanup cancelled."
            fi
            ;;
        "status")
            print_color "BLUE" "Container status:"
            echo "=== Production ==="
            docker compose ps 2>/dev/null || echo "No production containers"
            echo ""
            echo "=== Development ==="
            docker compose -f docker-compose.dev.yml ps 2>/dev/null || echo "No development containers"
            ;;
        "shell")
            print_color "BLUE" "Accessing development container shell..."
            docker compose -f docker-compose.dev.yml exec backend-dev sh
            ;;
        "restart")
            print_color "BLUE" "Restarting development containers..."
            docker compose -f docker-compose.dev.yml restart
            print_color "GREEN" "Development containers restarted!"
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        "")
            show_usage
            ;;
        *)
            print_color "RED" "Unknown command: $1"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

main "$@"
