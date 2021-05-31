export enum PROBLEM_STATUS {
    ACCEPTED = 1,
    PENDING = 2,
    REJECTED = 3
}

export class ProblemData {
    public readonly title: string;
    public readonly description: string;
    public readonly restrictions: string;
    public readonly example: string;
    public readonly file: string;
    public readonly status: string;
    public readonly indications: string;
    public readonly solution: string;
    constructor(requestBody: any) {
        this.title = requestBody.title ?? null;
        this.description = requestBody.description ?? null;
        this.restrictions = requestBody.restrictions ?? null;
        this.example = requestBody.example ?? null;
        this.file = requestBody.file ?? null;
        this.status = requestBody.status ?? PROBLEM_STATUS.PENDING;
        this.indications = requestBody.indications ?? null;
        this.solution = requestBody.solution ?? null;
    }
}

