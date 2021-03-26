import express from "express";
import path from "path"
import multer from "multer";
import { ProblemHandler, UploadHandler } from "./upload_handlers";

const app = express();
const upload = multer();

app.get('/', function (req: any, res: any) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.get('/upload', function (req: any, res: any) {
    res.sendFile(path.join(__dirname + '/static/index.html'));
});

app.post('/upload', upload.fields([{ name: 'inFiles', maxCount: 100 }, { name: 'outFiles', maxCount: 100 }]), async function (req: any, res: any, err: any) {
    const response = await (new UploadHandler(req).handle());
    res.statusCode = response.statusCode;
    if (res.statusCode == 201) {
        res.setHeader("Location", req.url + "/" + response.redirectLocation)
    }
    res.end(response.body);
});

app.get('/problems', async function (req: any, res: any) {
    const result = await new ProblemHandler().getAllProblems();
    res.statusCode = result.statusCode;
    res.end(result.body);
});

app.get(/\/problems\/[\w]+$/, async function (req: any, res: any) {
    const baseURL: string = 'http://' + req.headers.host + '/';
    const id = new URL(req.url ? req.url : "", baseURL).pathname.split('/')[2];
    const result = await new ProblemHandler().getProblem(id);
    res.statusCode = result.statusCode;
    res.end(result.body);
});

app.get('/upload/formstyle', function (req: any, res: any) {
    res.sendFile(path.join(__dirname + '/static/index.css'));
});


app.listen(8080);