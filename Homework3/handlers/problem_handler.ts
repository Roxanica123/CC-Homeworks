import { Problem } from ".";

export class ProblemHandler {
    private readonly problem: Problem;
    constructor(requestBody: any) {
        this.problem = new Problem(requestBody);
    }

    areFieldsValid(): boolean {
        const invalidFields = Object.values(this.problem).find(value => value == null || value == "");
        return invalidFields === undefined;
    }
}