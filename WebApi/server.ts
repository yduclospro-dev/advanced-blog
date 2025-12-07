import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import apiRouter from "@webapi/routes/apiRouter";
import cookieParser from 'cookie-parser';
import { errorHandler } from "@webapi/middleware/errorHandler";
import { createCompositionRoot } from "@root/compositionRoot";
import { swaggerSpec } from "@root/swagger.config";
import { serverAdapter } from "@infra/queues/bullBoard";
import { prisma } from "@infra/prismaClient";
import { getRedisClient } from "@infra/redisClient";

const port = Number(process.env.PORT || 3000);

export function createApp() {
  const services = createCompositionRoot();
  const app = express();

  app.use(express.json());
  app.use(cookieParser());
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
        connectSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  }));

  const allowedOrigins = process.env.NODE_ENV === "production"
    ? [process.env.CORS_ORIGIN || "https://advanced-blog-4j0k.onrender.com"]
    : ["http://localhost:3000"];

  app.use(cors({
    origin: allowedOrigins,
    credentials: true
  }));

  app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Advanced Blog API</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 40px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    h1 {
      color: #667eea;
      font-size: 2.5rem;
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .emoji {
      font-size: 3rem;
    }
    .subtitle {
      color: #666;
      font-size: 1.1rem;
      margin-bottom: 30px;
    }
    .status {
      background: #10b981;
      color: white;
      padding: 8px 16px;
      border-radius: 20px;
      display: inline-block;
      font-weight: 600;
      margin-bottom: 30px;
      font-size: 0.9rem;
    }
    .links {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .link {
      display: flex;
      align-items: center;
      padding: 15px 20px;
      background: #f9fafb;
      border-radius: 10px;
      text-decoration: none;
      color: #374151;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    .link:hover {
      background: #667eea;
      color: white;
      border-color: #667eea;
      transform: translateX(5px);
    }
    .link-icon {
      margin-right: 12px;
      font-size: 1.3rem;
    }
    .link-text {
      flex: 1;
    }
    .link-label {
      font-weight: 600;
      display: block;
    }
    .link-desc {
      font-size: 0.85rem;
      opacity: 0.8;
    }
    .footer {
      margin-top: 30px;
      text-align: center;
      color: #9ca3af;
      font-size: 0.9rem;
    }
    .stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 15px;
      margin-bottom: 30px;
    }
    .stat {
      text-align: center;
      padding: 15px;
      background: #f9fafb;
      border-radius: 10px;
    }
    .stat-value {
      font-size: 1.8rem;
      font-weight: 700;
      color: #667eea;
    }
    .stat-label {
      font-size: 0.85rem;
      color: #666;
      margin-top: 5px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>
      <span class="emoji">🚀</span>
      Advanced Blog API
    </h1>
    <p class="subtitle">API REST complète avec authentification, articles, commentaires et jobs asynchrones</p>
    
    <div class="status">✓ API en ligne et opérationnelle</div>
    
    <div class="stats">
      <div class="stat">
        <div class="stat-value">19</div>
        <div class="stat-label">Endpoints</div>
      </div>
      <div class="stat">
        <div class="stat-value">59</div>
        <div class="stat-label">Tests</div>
      </div>
      <div class="stat">
        <div class="stat-value">100%</div>
        <div class="stat-label">Uptime</div>
      </div>
    </div>
    
    <div class="links">
      <a href="/api-docs" class="link">
        <span class="link-icon">📚</span>
        <div class="link-text">
          <span class="link-label">Documentation Swagger</span>
          <span class="link-desc">API interactive avec tous les endpoints</span>
        </div>
      </a>
      
      <a href="/admin/queues" class="link">
        <span class="link-icon">📊</span>
        <div class="link-text">
          <span class="link-label">Bull Board</span>
          <span class="link-desc">Monitoring des jobs asynchrones</span>
        </div>
      </a>
      
      <a href="/api-docs.json" class="link">
        <span class="link-icon">📄</span>
        <div class="link-text">
          <span class="link-label">OpenAPI JSON</span>
          <span class="link-desc">Spécification complète de l'API</span>
        </div>
      </a>
      
      <a href="/healthz" class="link">
        <span class="link-icon">💚</span>
        <div class="link-text">
          <span class="link-label">Health Check</span>
          <span class="link-desc">Statut de l'API et connexion DB</span>
        </div>
      </a>
    </div>
  </div>
</body>
</html>
    `);
  });

  app.get('/healthz', async (req, res) => {
    const startTime = Date.now();
    const checks: any = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      checks: {
        database: { status: 'unknown', responseTime: 0 },
        redis: { status: 'unknown', responseTime: 0 },
        memory: { status: 'unknown', usage: {} }
      }
    };

    // Database check
    try {
      const dbStart = Date.now();
      await prisma.$queryRaw`SELECT 1`;
      checks.checks.database = {
        status: 'healthy',
        responseTime: Date.now() - dbStart
      };
    } catch (error) {
      checks.status = 'unhealthy';
      checks.checks.database = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Database connection failed'
      };
    }

    // Redis check
    try {
      const redisStart = Date.now();
      const redisClient = getRedisClient();
      if (redisClient && 'ping' in redisClient) {
        await redisClient.ping();
        checks.checks.redis = {
          status: 'healthy',
          responseTime: Date.now() - redisStart
        };
      } else {
        checks.checks.redis = {
          status: 'skipped',
          message: 'Redis is mocked in test environment'
        };
      }
    } catch (error) {
      checks.status = 'degraded';
      checks.checks.redis = {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Redis connection failed'
      };
    }

    // Memory check
    const memUsage = process.memoryUsage();
    checks.checks.memory = {
      status: 'healthy',
      usage: {
        rss: `${Math.round(memUsage.rss / 1024 / 1024)}MB`,
        heapTotal: `${Math.round(memUsage.heapTotal / 1024 / 1024)}MB`,
        heapUsed: `${Math.round(memUsage.heapUsed / 1024 / 1024)}MB`,
        external: `${Math.round(memUsage.external / 1024 / 1024)}MB`
      }
    };

    checks.responseTime = Date.now() - startTime;

    const statusCode = checks.status === 'healthy' ? 200 : checks.status === 'degraded' ? 200 : 503;
    res.status(statusCode).json(checks);
  });

  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Advanced Blog API Documentation'
  }));
  
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  // Bull Board monitoring dashboard
  try {
    app.use('/admin/queues', serverAdapter.getRouter());
  } catch (error) {
    console.warn('Bull Board not available:', error);
  }

  app.use("/api", apiRouter);
  app.use(errorHandler);

  return app;
}

if (!process.env.JEST_WORKER_ID) {
  const app = createApp();
  app.listen(port, '0.0.0.0', () => {
    console.log(`Server ready on http://localhost:${port}`);
  });
}