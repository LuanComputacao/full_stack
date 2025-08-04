# Technical Assessment – Dog Breeds Explorer

Build a full stack application using Node.js with TypeScript (backend) and Vue 3 (frontend) that integrates with the public Dog CEO API. The application should allow users to:

1. Browse dog breeds
2. Mark breeds as favorites
3. View images of selected breeds
4. Persist favorite breeds via your own backend

## Requirements

### Backend (Node.js + TypeScript)

Create a simple REST API that includes the following endpoints:

1. Get all dog breeds
    - GET /api/breeds
    - Fetches from https://dog.ceo/api/breeds/list/all
    - Returns a simplified array: ["bulldog", "retriever", "husky", ...]
2. Get images for a breed
    - GET /api/breeds/:breed/images
    - Fetches from https://dog.ceo/api/breed/:breed/images/random/3
    - Returns an array of 3 image URLs
3. Add favorite breed
    - POST /api/favorites
    - Request body: { "breed": "bulldog" }
    - Saves the breed to a local store (can be in-memory or persisted in a JSON file)
4. Get favorite breeds
    - GET /api/favorites
    - Returns a list of favorite breeds
5. Remove favorite breed
    - DELETE /api/favorites/:breed
    - Removes the breed from the list of favorites

### Frontend (Vue 3)

Build a frontend using Vue 3 that communicates with your backend. It should include:
1. Home page
    Lists all available dog breeds (fetched from your backend)
2. Breed detail page or modal
  Displays 3 images for a selected breed
3. Favorites
  Ability to mark/unmark breeds as favorites
  A dedicated section or tab to view and manage favorite breeds
4. UX considerations
  Handle loading and error states
  Visually indicate which breeds are favorites

### Optional Enhancements (Nice to Have)

If time permits, you may also:
1. Add Docker support
2. Add unit or integration tests
3. Use Tailwind or other CSS frameworks for styling
4. Add caching of API results in the backend
5. Add CI/CD (e.g., GitHub Actions)
6. Deploy the project (e.g., Vercel, Render, Netlify)

## Submission Guidelines	

Please submit a link to a public Git repository containing:
- Your complete code (backend and frontend)
- A README file with:
- Setup instructions
- How to run the application
- Any known issues or assumptions