import { ProblemData } from ".";
import { HttpActionResult, NoContent, Ok, ServerError } from "../action_results";
import { ProblemRepository } from "../repositories";
import { ProblemSnippet } from ".";
import { PROBLEM_STATUS } from "./problem-data";

export class ProblemHandler {
    private readonly problem: ProblemData;
    private readonly problemRepository: ProblemRepository;
    constructor(requestBody: any = {}) {
        this.problem = new ProblemData(requestBody);
        this.problemRepository = new ProblemRepository();
    }

    areFieldsValid(): boolean {
        const invalidFields = Object.values(this.problem).find(value => value == null || value == "");
        return invalidFields === undefined
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
    async getAllProblems(status:PROBLEM_STATUS): Promise<HttpActionResult> {
        try {
            const problems: ProblemSnippet[] = (await this.problemRepository.getAllProblems(status)).map(task => {
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

    async approveProblem(verdict: {approved: boolean}, id:any): Promise<HttpActionResult>{
        try {
            const status = verdict.approved === true? PROBLEM_STATUS.ACCEPTED:PROBLEM_STATUS.REJECTED;
            const result = await this.problemRepository.changeStatus(status, parseInt(id));
            return new NoContent();
        } catch (error) {
            console.log(error);
            return new ServerError("Could not update the problem status :(");
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
                file: result.file,
                id: id
            }));
        } catch (error) {
            console.log(error);
            return new ServerError("Could not get the problem!");
        }
    }
    async getProblemIndications(id:string): Promise<HttpActionResult>{
        try {
            const result = await this.problemRepository.getProblemById(parseInt(id));
            return new Ok(JSON.stringify({
                indications: result.indications,
                id: id,
                title: result.title
            }));
        } catch (error) {
            console.log(error);
            return new ServerError("Could not get the problem's indications!");
        }   
    }
    async getProblemSolution(id:string): Promise<HttpActionResult>{
        try {
            const result = await this.problemRepository.getProblemById(parseInt(id));
            return new Ok(JSON.stringify({
                solution: result.solution,
                id: id,
                title: result.title
            }));
        } catch (error) {
            console.log(error);
            return new ServerError("Could not get the problem's solution!");
        }   
    }
}