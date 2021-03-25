export class Problem {
    private title: string;
    private description: string;
    private restrictions: string;
    private example: string;
    constructor(requestBody: any) {
        this.title = requestBody.title ?? null;
        this.description = requestBody.description ?? null;
        this.restrictions = requestBody.restrictions ?? null;
        this.example = requestBody.example ?? null;
    }
}
