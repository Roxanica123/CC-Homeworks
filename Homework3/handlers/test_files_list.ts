export type MulterFile = Express.Multer.File;

export interface TestFilesList{
    inFiles: MulterFile[];
    outFiles: MulterFile[];
}