# FDB - Favorite Dog Breeds App 🐕

A modern, responsive Vue.js application that allows users to explore different dog breeds, view their images, and manage their favorite breeds. Built with Vue 3, TypeScript, Tailwind CSS, and Pinia for state management.

## 🌟 Features

- **Browse Dog Breeds**: Explore a comprehensive list of dog breeds and sub-breeds
- **Interactive Image Gallery**: View high-quality breed images with a responsive carousel
- **Favorites Management**: Add/remove breeds from your favorites list
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Updates**: Live synchronization with backend API
- **Error Handling**: Graceful error handling with retry mechanisms
- **Accessibility**: ARIA labels and keyboard navigation support
- **Lazy Loading**: Optimized image loading for better performance

## 🚀 Quick Start

### Prerequisites

- Node.js (v20.19.0 or >=22.12.0)
- pnpm package manager
- Backend API running on `http://localhost:3001`

### Development Environment

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd app
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Start the development server**

   ```bash
   pnpm run dev
   ```

4. **Open your browser**

   ```url
   http://localhost:5173
   ```

### Production Environment

1. **Build the application**

   ```bash
   pnpm run build
   ```

2. **Preview the production build**

   ```bash
   pnpm run preview
   ```

3. **Deploy**
   - The built files will be in the `dist/` directory
   - Deploy to your preferred hosting service (Vercel, Netlify, AWS, etc.)

## 🏗️ Architecture

### Frontend Stack

- **Vue 3** - Progressive JavaScript framework with Composition API
- **TypeScript** - Type-safe JavaScript development
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Pinia** - Vue store library for state management
- **Vue Router** - Official router for Vue.js
- **Heroicons** - Beautiful hand-crafted SVG icons

### Project Structure

```text
src/
├── components/           # Reusable Vue components
│   ├── breeds/          # Breed-specific components
│   │   ├── BreedCard.vue    # Individual breed card
│   │   ├── BreedModal.vue   # Breed detail modal
│   │   └── BreedsList.vue   # Breeds grid layout
│   └── common/          # Common/shared components
│       └── ImageCarousel.vue # Image carousel component
├── router/              # Vue Router configuration
│   └── index.ts
├── services/            # API service layer
│   └── api.ts          # HTTP client and API calls
├── stores/              # Pinia state management
│   ├── breeds.ts       # Breeds data store
│   ├── favorites.ts    # Favorites management store
│   └── breedImages.ts  # Image caching store
├── views/               # Page components
│   ├── HomeView.vue    # Main breeds listing page
│   ├── FavoritesView.vue # Favorites page
│   └── AboutView.vue   # About page
├── __tests__/           # Test files
│   ├── components/     # Component tests
│   ├── stores/         # Store tests
│   └── services/       # Service tests
├── App.vue             # Root component
├── main.ts             # Application entry point
└── style.css           # Global styles
```

### State Management (Pinia Stores)

1. **Breeds Store** (`stores/breeds.ts`)
   - Manages dog breeds data
   - Handles API calls to fetch breeds
   - Implements caching with cooldown mechanism

2. **Favorites Store** (`stores/favorites.ts`)
   - Manages user's favorite breeds
   - Synchronizes with backend API
   - Handles add/remove operations

3. **Breed Images Store** (`stores/breedImages.ts`)
   - Caches breed images for performance
   - Manages loading states
   - Handles image error states

### API Integration

The application communicates with a backend API running on `http://localhost:3001/api` with the following endpoints:

- `GET /breeds` - Fetch all available breeds
- `GET /breeds/{breed}/images` - Fetch images for a specific breed
- `GET /favorites` - Fetch user's favorite breeds
- `POST /favorites` - Add a breed to favorites
- `DELETE /favorites/{breed}` - Remove a breed from favorites

### Component Architecture

#### Key Components

1. **BreedCard** - Displays individual breed information with:
   - Lazy-loaded breed image
   - Favorite toggle button
   - Detail view trigger

2. **BreedModal** - Shows detailed breed information with:
   - Image carousel with multiple breed photos
   - Autoplay functionality
   - Favorite management

3. **ImageCarousel** - Reusable carousel component featuring:
   - Navigation arrows and dots
   - Keyboard navigation (arrow keys)
   - Autoplay with customizable intervals
   - Loading and error states

4. **BreedsList** - Grid layout for breed cards with:
   - Responsive design
   - Loading states
   - Error handling with retry functionality

## 🧪 Testing

### Test Architecture

The project includes comprehensive testing using:

- **Vitest** - Fast unit testing framework
- **Vue Test Utils** - Vue.js testing utilities
- **Playwright** - End-to-end testing

### Running Tests

```bash
# Run all unit tests
pnpm run test:unit

# Run specific test categories
pnpm run test:unit -- components/
pnpm run test:unit -- stores/
pnpm run test:unit -- services/

# Run end-to-end tests
pnpm run test:e2e

# Run tests in watch mode
pnpm run test:unit --watch
```

### Test Coverage

- Component unit tests with mocked dependencies
- Store integration tests
- API service tests
- End-to-end user flow tests

## 🔧 Development Tools

### Code Quality

- **ESLint** - Code linting with Vue and TypeScript rules
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

```bash
# Lint code
pnpm run lint

# Format code
pnpm run format

# Type checking
pnpm run type-check
```

### Build Tools

- **Vite** - Fast build tool with HMR
- **Vue DevTools** - Vue.js debugging extension
- **Tailwind CSS** - Utility-first styling

## 🌐 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Requires ES2020+ support

## 📱 Responsive Design

The application is fully responsive with breakpoints:

- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+
- Large Desktop: 1280px+

## 🔒 Error Handling

- API error handling with user-friendly messages
- Image loading fallbacks
- Network error recovery
- Graceful degradation for missing data

## 🚀 Performance Optimizations

- Lazy loading of images
- Component code splitting
- API response caching
- Optimized bundle size with tree shaking
- Intersection Observer for viewport-based loading

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Run the test suite
6. Submit a pull request

## 📄 License

This project is part of a technical assessment for Alvorada's full-stack developer position.

---

Made with ❤️ using Vue 3, TypeScript, and Tailwind CSS
