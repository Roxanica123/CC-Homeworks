import express from "express";
import path from "path"
import multer from "multer";
import { UploadHandler } from "./handlers";


const app = express();
const upload = multer();


app.get('/', function (req: any, res: any) {
    res.sendFile(path.join(__dirname + '/../index.html'));
});

app.post('/', upload.fields([{ name: 'inFiles', maxCount: 100 }, { name: 'outFiles', maxCount: 100 }]), function (req: any, res: any, err: any) {
    const response = new UploadHandler(req).handle();
    res.statusCode = response.statusCode;
    if (res.statusCode == 201) {
        res.setHeader("Location", req.url + "/" + response.redirectLocation)
    }
    res.end(response.body);
});
app.listen(8080);