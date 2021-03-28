import express from "express";
import path from "path"
import multer from "multer";
import { ProblemHandler, UploadHandler } from "./upload_handlers";
import { EvaluationHandler } from "./evaluations_handlers/evaluation_handler";

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

app.get(/\/evaluations\/[\w]+$/, async function (req: any, res: any) {
    const baseURL: string = 'http://' + req.headers.host + '/';
    const id = new URL(req.url ? req.url : "", baseURL).pathname.split('/')[2];
    const result = await new EvaluationHandler().getEvaluation(id);
    res.statusCode = result.statusCode;
    res.end(result.body);
});

app.get('/evaluations', async function (req: any, res: any) {
    const resultObject = await new EvaluationHandler().getAllEvaluations(req.header("Cursor"), req.query.page);
    const result = resultObject.response;
    res.statusCode = result.statusCode;
    if (res.statusCode == 200 && resultObject.cursor !== undefined) {
        res.setHeader("Cursor", resultObject.cursor);
    }
    res.end(result.body);
});



app.listen(8080);