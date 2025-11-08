import { Request, Response } from 'express';
import multer from 'multer';
import { ImageUploadService } from '../../Application/services/Image/ImageUploadService';

// Configuration de multer pour stocker les fichiers en mémoire
const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accepter seulement les images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Le fichier doit être une image'));
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limite à 5MB
  },
});

export class ImageController {
  private imageUploadService: ImageUploadService;

  constructor(imageUploadService: ImageUploadService) {
    this.imageUploadService = imageUploadService;
  }

  async uploadImage(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Aucune image fournie' });
        return;
      }

      const imageUrl = await this.imageUploadService.uploadImage(req.file.buffer);

      res.status(200).json({ imageUrl });
    } catch (error) {
      console.error('Error uploading image:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erreur lors de l\'upload de l\'image' 
      });
    }
  }

  async deleteImage(req: Request, res: Response): Promise<void> {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        res.status(400).json({ error: 'URL de l\'image requise' });
        return;
      }

      await this.imageUploadService.deleteImage(imageUrl);

      res.status(200).json({ message: 'Image supprimée avec succès' });
    } catch (error) {
      console.error('Error deleting image:', error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression de l\'image' 
      });
    }
  }
}
