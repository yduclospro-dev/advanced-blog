import cloudinary from '@infra/config/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

export class ImageUploadService {
  /**
   * Upload une image vers Cloudinary
   * @param file - Le buffer de l'image à uploader
   * @param folder - Le dossier Cloudinary où stocker l'image (optionnel)
   * @returns L'URL sécurisée de l'image uploadée
   */
  async uploadImage(file: Buffer, folder: string = 'articles'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 630, crop: 'limit' }, // Limite la taille
            { quality: 'auto' }, // Optimise automatiquement
            { fetch_format: 'auto' }, // Format optimal (WebP si supporté)
          ],
        },
        (error: Error | undefined, result: UploadApiResponse | undefined) => {
          if (error || !result) {
            reject(error || new Error('Upload failed'));
          } else {
            resolve(result.secure_url);
          }
        }
      );

      uploadStream.end(file);
    });
  }

  /**
   * Supprime une image de Cloudinary à partir de son URL
   * @param imageUrl - L'URL de l'image à supprimer
   */
  async deleteImage(imageUrl: string): Promise<void> {
    try {
      const publicId = this.extractPublicId(imageUrl);
      if (publicId) {
        await cloudinary.uploader.destroy(publicId);
      }
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }

  /**
   * Extrait le public_id d'une URL Cloudinary
   * @param url - L'URL Cloudinary
   * @returns Le public_id ou null si non trouvé
   */
  private extractPublicId(url: string): string | null {
    try {
      const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
      return matches ? matches[1] : null;
    } catch {
      return null;
    }
  }
}
