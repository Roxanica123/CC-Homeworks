export class ProblemData {
    public readonly title: string;
    public readonly description: string;
    public readonly restrictions: string;
    public readonly example: string;
    public readonly file: string;
    constructor(requestBody: any) {
        this.title = requestBody.title ?? null;
        this.description = requestBody.description ?? null;
        this.restrictions = requestBody.restrictions ?? null;
        this.example = requestBody.example ?? null;
        this.file = requestBody.file ?? null;
    }
}
