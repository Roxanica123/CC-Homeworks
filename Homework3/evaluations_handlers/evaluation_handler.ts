import { BadRequest, HttpActionResult, Ok, ServerError } from "../action_results";
import { EvaluationRepository } from "../repositories/evaluation_repository";

export class EvaluationHandler {
    private readonly evaluationRepository: EvaluationRepository;
    constructor() {
        this.evaluationRepository = new EvaluationRepository();
    }

    async getEvaluation(id: string): Promise<HttpActionResult> {
        try {
            const result = await this.evaluationRepository.getEvaluationById(parseInt(id));
            return new Ok(JSON.stringify(result));
        } catch (error) {
            console.log(error);
            return new ServerError("Could not get the problem!");
        }
    }

    async getAllEvaluations(cursor: string, pageSize: string): Promise<{ response: HttpActionResult, cursor: string | undefined }> {
        try {
            let pageSizeNumber: number;
            try {
                pageSizeNumber = parseInt(pageSize);
            } catch (error) {
                return { response: new BadRequest("Wrong page size!"), cursor: undefined };
            }
            const problems = await this.evaluationRepository.getAllEvaluations(cursor, pageSizeNumber);
            return { response: new Ok(JSON.stringify(problems.entities)), cursor: problems.endCursor };
        }
        catch (e) {
            console.log(e);
            return { response: new ServerError("Could not get the problems!"), cursor: undefined };
        }
    }
}