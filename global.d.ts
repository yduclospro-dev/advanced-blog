export {}

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
                role: string;
            };
        }
    }
}

declare module '*.css' {
  const content: { [className: string]: string };
  export default content;
}