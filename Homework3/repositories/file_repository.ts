import { Storage } from '@google-cloud/storage';
import { MulterFile, Problem } from '../handlers';


export class FilesRepository {
    private readonly storage;
    private readonly bucket;
    private readonly bucketName = "problems-test-cases";
    constructor() {
        this.storage = new Storage();
        this.bucket = this.storage.bucket(this.bucketName);
    }
    async saveFile(multerFile: MulterFile, saveLocation: string) {
        const file = this.bucket.file(saveLocation + multerFile.originalname);
        await file.save(multerFile.buffer);
    }
}