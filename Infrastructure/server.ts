import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware pour parser le JSON
app.use(express.json());

// Route de vérification de statut
app.get('/status', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Status endpoint available at: http://localhost:${PORT}/status`);
});

export default app;