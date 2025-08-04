import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Dog Breeds API',
      version: '1.0.0',
      description: 'A simple REST API for exploring dog breeds and managing favorites',
      contact: {
        name: 'LuanComputacao',
      },
    },
    servers: [
      {
        url: 'http://localhost:3001',
        description: 'Development server',
      },
    ],
    components: {
      schemas: {
        Breed: {
          type: 'string',
          example: 'bulldog',
        },
        FavoriteRequest: {
          type: 'object',
          required: ['breed'],
          properties: {
            breed: {
              type: 'string',
              description: 'The breed name to add to favorites',
              example: 'bulldog',
            },
          },
        },
        FavoriteResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Breed added to favorites',
            },
            breed: {
              type: 'string',
              example: 'bulldog',
            },
          },
        },
        FavoritesList: {
          type: 'object',
          properties: {
            favorites: {
              type: 'array',
              items: {
                type: 'string',
              },
              example: ['bulldog', 'retriever', 'husky'],
            },
            count: {
              type: 'integer',
              example: 3,
            },
          },
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Error description',
            },
            message: {
              type: 'string',
              example: 'Detailed error message',
            },
          },
        },
        HealthCheck: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              example: 'OK',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              example: '2025-07-30T10:30:00.000Z',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJSDoc(options);

export { specs, swaggerUi };
