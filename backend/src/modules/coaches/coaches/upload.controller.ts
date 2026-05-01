import { Controller, Post, UseGuards, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { PrismaService } from '../../../common/prisma/prisma.service';
import { JwtAuthGuard, RolesGuard, Roles, CurrentUser } from '../../../common/decorators/auth.guard';

@ApiTags('Coaches')
@Controller('coaches/me/video')
export class UploadController {
  constructor(private prisma: PrismaService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('COACH')
  @ApiBearerAuth('JWT')
  @ApiOperation({ summary: 'B-008 — Upload vidéo coach (Cloudinary)' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('video', {
    limits: { fileSize: 100 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
      if (!['video/mp4', 'video/quicktime', 'video/webm'].includes(file.mimetype)) {
        return cb(new BadRequestException('Format non supporté. Utilisez MP4, MOV ou WebM.'), false);
      }
      cb(null, true);
    },
  }))
  async uploadVideo(@CurrentUser('userId') userId: string, @UploadedFile() file: Express.Multer.File) {
    if (!file) throw new BadRequestException('Aucun fichier reçu.');

    // Si Cloudinary est configuré
    if (process.env.CLOUDINARY_URL && !process.env.CLOUDINARY_URL.includes('changeme')) {
      const cloudinary = require('cloudinary').v2;
      const result = await cloudinary.uploader.upload(file.buffer, {
        resource_type: 'video',
        folder: 'elitcoach/coaches',
      });
      const videoUrl = result.secure_url;
      await this.prisma.coachProfile.update({ where: { userId }, data: { videoUrl } });
      return { videoUrl };
    }

    // Mode dev : retourner une URL factice
    const videoUrl = `https://example.com/dev-video-${Date.now()}.mp4`;
    await this.prisma.coachProfile.update({ where: { userId }, data: { videoUrl } });
    return { videoUrl, dev: true };
  }
}
