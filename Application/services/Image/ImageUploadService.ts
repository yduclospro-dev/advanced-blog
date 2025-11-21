import cloudinary from '@infra/config/cloudinary';
import type { UploadApiResponse } from 'cloudinary';

export class ImageUploadService {
  async uploadImage(file: Buffer, folder: string = 'articles'): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: folder,
          resource_type: 'image',
          transformation: [
            { width: 1200, height: 630, crop: 'limit' },
            { quality: 'auto' },
            { fetch_format: 'auto' }
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

  private extractPublicId(url: string): string | null {
    try {
      const matches = url.match(/\/v\d+\/(.+)\.\w+$/);
      return matches ? matches[1] : null;
    } catch {
      return null;
    }
  }
}