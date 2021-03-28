import { MulterFile, TestFilesList } from ".";
import { FilesRepository } from "../repositories";

export class FilesHandler {
    private readonly inFiles: MulterFile[];
    private readonly outFiles: MulterFile[];
    private readonly filesRepository: FilesRepository;

    constructor(filesContainer: TestFilesList) {
        this.inFiles = filesContainer.inFiles;
        this.outFiles = filesContainer.outFiles;
        this.filesRepository = new FilesRepository();
    }

    areFilesValid(): boolean {
        if (this.outFiles.length != this.inFiles.length || this.inFiles.length == 0 || this.duplicateFilesExist())
            return false;
        this.inFiles.forEach(file => {
            const correspondingOutFile = this.outFiles
                .find(file => this.getFileNameWithoutExtension(file.originalname) == this.getFileNameWithoutExtension(file.originalname))
            if (correspondingOutFile === undefined)
                return false;
        });
        return true;
    }

    getFileNameWithoutExtension(fileName: string): string {
        return fileName.split('.')[0];
    }

    duplicateFilesExist(): boolean {
        const set = new Set(this.inFiles.map(file => this.getFileNameWithoutExtension(file.originalname)))
        return !(set.size == this.inFiles.length)
    }

    async saveTestFiles(problemId: string) {
        const inputPath = problemId + "/input/";
        const outputPath = problemId + "/output/";
        await Promise.all(this.inFiles.map(file => this.filesRepository.saveFile(file, inputPath)));
        await Promise.all(this.outFiles.map(file => this.filesRepository.saveFile(file, outputPath)));
    }
}