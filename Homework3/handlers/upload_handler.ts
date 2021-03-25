
import { BadRequest, Created, EmptyBody, HttpActionResult, Ok } from "../action_results";
import { FilesHandler } from "./files_handler";
import { ProblemHandler } from "./problem_handler";

export class UploadHandler {
    private readonly filesHandler: FilesHandler;
    private readonly problemsHandler: ProblemHandler;
    constructor(request: any) {
        this.filesHandler = new FilesHandler(request.files)
        this.problemsHandler = new ProblemHandler(request.body)
    }

    handle(): HttpActionResult {
        if (!this.filesHandler.areFilesValid())
            return new BadRequest("Invalid test files!");
        if (!this.problemsHandler.areFieldsValid())
            return new BadRequest("Invalid problem fields!")
        return new Created(EmptyBody, "");
    }
}