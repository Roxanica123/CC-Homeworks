import { ProblemData } from ".";
import { HttpActionResult, Ok, ServerError } from "../action_results";
import { ProblemRepository } from "../repositories";
import { ProblemSnippet } from ".";

export class ProblemHandler {
    private readonly problem: ProblemData;
    private readonly problemRepository: ProblemRepository;
    constructor(requestBody: any = {}) {
        this.problem = new ProblemData(requestBody);
        this.problemRepository = new ProblemRepository();
    }

    areFieldsValid(): boolean {
        const invalidFields = Object.values(this.problem).find(value => value == null || value == "");
        return invalidFields === undefined;
    }

    async saveProblem(): Promise<string | undefined> {
        try {
            const id: string | undefined = await this.problemRepository.saveProblem(this.problem);
            return id;
        } catch (error) {
            console.log(error)
            return undefined;
        }
    }
    async getAllProblems(): Promise<HttpActionResult> {
        try {
            const problems: ProblemSnippet[] = (await this.problemRepository.getAllProblems()).map(task => {
                return {
                    description: task.description.substr(0, 100),
                    title: task.title,
                    id: task[this.problemRepository.getDatastoreKeySymbol()].id
                }
            })
            return new Ok(JSON.stringify(problems));
        }
        catch (e) {
            console.log(e);
            return new ServerError("Could not get the problems!");
        }
    }
    async getProblem(id: string): Promise<HttpActionResult> {
        try {
            const result = await this.problemRepository.getProblemById(parseInt(id));
            return new Ok(JSON.stringify({
                description: result.description,
                restrictions: result.restrictions,
                example: result.example,
                title: result.title,
                id: id
            }));
        } catch (error) {
            console.log(error);
            return new ServerError("Could not get the problem!");
        }
    }
}