import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import * as path from 'path';
import { diskStorage } from 'multer';

@Injectable()
export class ImageService {
  async uploadImage(image: Express.Multer.File): Promise<string> {
    // 이미지 업로드 후 처리할 로직 작성
    const imageUrl = `/uploads/${image.filename}`; // 이미지 URL
    return imageUrl;
  }
}
