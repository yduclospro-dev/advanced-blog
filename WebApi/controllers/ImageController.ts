import { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { ImageUploadService } from '../../Application/services/Image/ImageUploadService';
import { BadRequestError } from '../../Domain/errors/index.ts';

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

  async uploadImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new BadRequestError('Aucune image fournie');
      }

      const imageUrl = await this.imageUploadService.uploadImage(req.file.buffer);

      res.status(200).json({ imageUrl });
    } catch (error) {
      next(error);
    }
  }

  async deleteImage(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { imageUrl } = req.body;

      if (!imageUrl) {
        throw new BadRequestError('URL de l\'image requise');
      }

      await this.imageUploadService.deleteImage(imageUrl);

      res.status(200).json({ message: 'Image supprimée avec succès' });
    } catch (error) {
      next(error);
    }
  }
}
