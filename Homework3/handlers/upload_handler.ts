
import { BadRequest, Created, EmptyBody, HttpActionResult, Ok, ServerError } from "../action_results";
import { FilesHandler } from "./files_handler";
import { ProblemHandler } from "./problem_handler";

export class UploadHandler {
    private readonly filesHandler: FilesHandler;
    private readonly problemsHandler: ProblemHandler;
    constructor(request: any) {
        this.filesHandler = new FilesHandler(request.files)
        this.problemsHandler = new ProblemHandler(request.body)
    }

    async handle(): Promise<HttpActionResult> {
        if (!this.filesHandler.areFilesValid())
            return new BadRequest("Invalid test files!");
        if (!this.problemsHandler.areFieldsValid())
            return new BadRequest("Invalid problem fields!")
        const problemId = await this.problemsHandler.saveProblem();
        if (problemId === undefined)
            return new ServerError("Could not save the problem :(.");

        return new Created(EmptyBody, "");
    }
}