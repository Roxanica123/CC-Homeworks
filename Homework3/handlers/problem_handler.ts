import { Problem } from ".";
import { ProblemRepository } from "../repositories";

export class ProblemHandler {
    private readonly problem: Problem;
    private readonly problemRepository: ProblemRepository;
    constructor(requestBody: any) {
        this.problem = new Problem(requestBody);
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
}