import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Advanced Blog API',
      version: '1.0.0',
      description: 'API REST avec authentication, CRUD articles/commentaires, et gestion des utilisateurs',
      contact: {
        name: 'API Support',
        email: 'support@advanced-blog.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development server'
      },
      {
        url: 'https://advanced-blog-4j0k.onrender.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token from /api/users/login'
        },
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refresh_token',
          description: 'Refresh token cookie'
        }
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            result: { type: 'null' },
            statusCode: { type: 'integer' }
          }
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            userName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['USER', 'ADMIN'] }
          }
        },
        Article: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            title: { type: 'string' },
            content: { type: 'string' },
            imageUrl: { type: 'string', nullable: true },
            authorId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Comment: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            content: { type: 'string' },
            articleId: { type: 'string', format: 'uuid' },
            authorId: { type: 'string', format: 'uuid' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    },
    tags: [
      { name: 'Authentication', description: 'Endpoints d\'authentification' },
      { name: 'Users', description: 'Gestion des utilisateurs' },
      { name: 'Articles', description: 'CRUD des articles' },
      { name: 'Comments', description: 'CRUD des commentaires' },
      { name: 'Images', description: 'Upload d\'images' },
      { name: 'Password Reset', description: 'Réinitialisation de mot de passe' }
    ]
  },
  apis: ['./WebApi/routes/*.ts', './WebApi/controllers/*.ts']
};

export const swaggerSpec = swaggerJsdoc(options);
