import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
export class FileUploadController {
	constructor(private readonly fileUploadService: FileUploadService) {}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file')) // 'file' debe coincidir con el nombre en FormData
	async uploadFile(@UploadedFile() file: Express.Multer.File) {
	}
}
