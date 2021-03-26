import express from "express";
import path from "path"
import multer from "multer";
import { UploadHandler } from "./handlers";
import { FilesRepository } from "./repositories/file_repository";


const app = express();
const upload = multer();


app.get('/', function (req: any, res: any) {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

app.post('/', upload.fields([{ name: 'inFiles', maxCount: 100 }, { name: 'outFiles', maxCount: 100 }]), async function (req: any, res: any, err: any) {
    const response = await (new UploadHandler(req).handle());
    res.statusCode = response.statusCode;
    if (res.statusCode == 201) {
        res.setHeader("Location", req.url + "/" + response.redirectLocation)
    }
    res.end(response.body);
});

app.get('/test', function (req: any, res: any) {
    const { Storage } = require('@google-cloud/storage');
    const storage = new Storage();
    const myBucket = storage.bucket('problems-test-cases');

    const file = myBucket.file('5646488461901824/input/1.in');
    file.createReadStream()
        .on('error', function (err:any) { })
        .on('response', function (response:any) {
            // Server connected and responded with the specified status and headers.
        })
        .on('data', function(data:any){ console.log(data.toString()); })
        .on('end', function () {
            // The file is fully downloaded.
            res.end("Totu bine");
        })
});

app.listen(8080);