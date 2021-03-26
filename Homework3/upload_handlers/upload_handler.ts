
import { BadRequest, Created, HttpActionResult, ServerError } from "../action_results";
import { FilesHandler, ProblemHandler } from ".";


export class UploadHandler {
    private readonly filesHandler: FilesHandler;
    private readonly problemsHandler: ProblemHandler;
    constructor(request: any) {
        this.filesHandler = new FilesHandler(request.files)
        this.problemsHandler = new ProblemHandler(request.body)
    }

    async handle(): Promise<HttpActionResult> {
        try {
            if (!this.filesHandler.areFilesValid())
                return new BadRequest("Invalid test files!");
            if (!this.problemsHandler.areFieldsValid())
                return new BadRequest("Invalid problem fields!");
        } catch (error) {
            return new BadRequest("Invalid form fields!");
        }

        const problemId = await this.problemsHandler.saveProblem();
        if (problemId === undefined)
            return new ServerError("Could not save the problem :(.");
        try {
            await this.filesHandler.saveTestFiles(problemId);
        } catch (error) {
            return new ServerError("Could not save the test cases :(")
        }
        return new Created("Problem saved!", "");
    }
}