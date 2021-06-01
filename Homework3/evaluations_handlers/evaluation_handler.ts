import { EvaluationRepository } from "../repositories/evaluation_repository";
import { UserSubmissionsRepository } from "../repositories/user_submissions_repository";

import { BadRequest, HttpActionResult, NotFound, Ok, ServerError } from "../action_results";

import { UserSubmissions } from "./userSubmissions";
import { Evaluation } from "./evaluation";

export class EvaluationHandler {
    private readonly evaluationRepository: EvaluationRepository;
    private readonly userSubmissionsRepository: UserSubmissionsRepository;

    constructor() {
        this.evaluationRepository = new EvaluationRepository();
        this.userSubmissionsRepository = new UserSubmissionsRepository();
    }

    async getEvaluation(id: string): Promise<HttpActionResult> {
        try {
            const result = await this.evaluationRepository.getEvaluationById(parseInt(id));
            return new Ok(JSON.stringify(result));
        } catch (error) {
            console.log(error);
            return new ServerError(JSON.stringify({response: "Could not get the evaluations!"}));
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
            return { response: new ServerError("Could not get the evaluations!"), cursor: undefined };
        }
    }

    async getUserEvaluations(email: string, page: string, pageSize: string): Promise<{ response: HttpActionResult }> {
        try {
            let pageSizeInt: number;
            let pageInt: number;        
            try {
                pageSizeInt = parseInt(pageSize);
                pageInt = parseInt(page);
            } catch (e) {
                return {
                    response: new BadRequest("Invalid page or page size query params!")
                };
            }

            let userSubmissionsObj: UserSubmissions | null = await this.userSubmissionsRepository.getUserSubmissions(email);
            if (!userSubmissionsObj) {
                return {
                    response: new NotFound("Invalid user email!")
                };
            }

            let reversedSubmissionsIds = userSubmissionsObj.submissions.reverse();
            let startIndex = (pageInt - 1) * pageSizeInt;
            let endIndex = (pageInt) * pageSizeInt;
            let returnedSubmissionsIds: string[] = [];
            for (let i = startIndex; i < endIndex && i < reversedSubmissionsIds.length; ++i) {
                returnedSubmissionsIds.push(reversedSubmissionsIds[i]);
            }

            let evaluations: Evaluation[] = await this.evaluationRepository.getEvaluations(returnedSubmissionsIds);
            return {
                response: new Ok(JSON.stringify(evaluations))
            };
        }
        catch (e) {
            console.log(e);
            return { response: new ServerError("Could not get the evaluations!") };
        }
    }
}
