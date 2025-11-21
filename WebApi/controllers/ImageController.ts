import { Request, Response, NextFunction } from 'express';
import { sendApiResponse } from '@webapi/utils/response';
import multer from 'multer';
import { ImageUploadService } from '@app/services/Image/ImageUploadService';
import { BadRequestError } from '@domain/errors';

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
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

      sendApiResponse(res, {
        success: true,
        message: 'Image uploadée',
        result: { imageUrl }
      });
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

      sendApiResponse(res, {
        success: true,
        message: 'Image supprimée avec succès',
        result: null
      });
    } catch (error) {
      next(error);
    }
  }
}