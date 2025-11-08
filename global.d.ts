export {}

import { UserRole } from '@prisma/client';

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DATABASE_URL: string
            JWT_SECRET: string
            NODE_ENV: 'development' | 'production' | 'test'
            PORT?: string
            NEXT_PUBLIC_API_URL?: string
        }
    }

    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                role: UserRole;
            };
        }
    }
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}