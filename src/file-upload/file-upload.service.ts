import { Injectable } from '@nestjs/common';

@Injectable()
export class FileUploadService {
	private storageBucket;

	async uploadFile(fileBuffer: Buffer, contentType: string): Promise<string> {
		const fileName = `uploads/${Date.now()}.file`;
		const file = this.storageBucket.file(fileName);

		await file.save(fileBuffer, {
			metadata: { contentType },
		});

		return `https://storage.googleapis.com/${this.storageBucket.name}/${fileName}`;
	}
}
