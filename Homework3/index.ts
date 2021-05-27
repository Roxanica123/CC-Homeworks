import express from "express";
import cors from "cors";
import multer from "multer";
import {
  ProblemHandler,
  PROBLEM_STATUS,
  UploadHandler,
} from "./upload_handlers";
import { EvaluationHandler } from "./evaluations_handlers/evaluation_handler";
import { BadRequest } from "./action_results";

const app = express();
const upload = multer();
app.use(express.json());
app.use(cors());

function setCorsOrigin(res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Request-Method", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Max-Age", 3600);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With"
  );
  return res;
}

app.post(
  "/upload",
  upload.fields([
    { name: "inFiles", maxCount: 100 },
    { name: "outFiles", maxCount: 100 },
  ]),
  async function (req: any, res: any, err: any) {
    res = setCorsOrigin(res);
    const response = await new UploadHandler(req).handle();
    res.statusCode = response.statusCode;
    if (res.statusCode == 201) {
      res.setHeader("Location", req.url + "/" + response.redirectLocation);
    }
    res.end(response.body);
  }
);

app.get("/problems", async function (req: any, res: any) {
  res = setCorsOrigin(res);
  const result = await new ProblemHandler().getAllProblems(
    PROBLEM_STATUS.ACCEPTED
  );
  res.statusCode = result.statusCode;
  res.end(result.body);
});

app.get("/pending", async function (req: any, res: any) {
  res = setCorsOrigin(res);
  const result = await new ProblemHandler().getAllProblems(
    PROBLEM_STATUS.PENDING
  );
  res.statusCode = result.statusCode;
  res.end(result.body);
});

app.patch(/\/pending\/[\w]+$/, async function (req: any, res: any) {
  res = setCorsOrigin(res);
  const baseURL: string = "http://" + req.headers.host + "/";
  const id = new URL(req.url ? req.url : "", baseURL).pathname.split("/")[2];
  let verdict: { approved: boolean };
  try {
    verdict = req.body;
  } catch {
    const result = new BadRequest("");
    res.statusCode = result.statusCode;
    res.end(result.body);
  }
  const result = await new ProblemHandler().approveProblem(req.body, id);
  res.statusCode = result.statusCode;
  res.end(result.body);
});

app.get(/\/problems\/[\w]+$/, async function (req: any, res: any) {
  res = setCorsOrigin(res);
  const baseURL: string = "http://" + req.headers.host + "/";
  const id = new URL(req.url ? req.url : "", baseURL).pathname.split("/")[2];
  const result = await new ProblemHandler().getProblem(id);
  res.statusCode = result.statusCode;
  res.end(result.body);
});

app.get(/\/evaluations\/[\w]+$/, async function (req: any, res: any) {
  res = setCorsOrigin(res);
  const baseURL: string = "http://" + req.headers.host + "/";
  const id = new URL(req.url ? req.url : "", baseURL).pathname.split("/")[2];
  const result = await new EvaluationHandler().getEvaluation(id);
  res.statusCode = result.statusCode;
  res.end(result.body);
});

app.get("/evaluations", async function (req: any, res: any) {
  res = setCorsOrigin(res);
  const resultObject = await new EvaluationHandler().getAllEvaluations(
    req.header("Cursor"),
    req.query.page
  );
  const result = resultObject.response;
  res.statusCode = result.statusCode;
  if (res.statusCode == 200 && resultObject.cursor !== undefined) {
    res.setHeader("Cursor", resultObject.cursor);
  }
  res.end(result.body);
});

app.listen(8080);
