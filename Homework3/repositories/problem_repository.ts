import { Datastore } from '@google-cloud/datastore';
import { Problem } from '../handlers';


export class ProblemRepository {
    private readonly datastore;
    private readonly kind = "Problem";
    constructor() {
        this.datastore = new Datastore();
    }
    async saveProblem(problem:Problem) {
        const poblemKey = this.datastore.key(this.kind);
        const problemToInsert = {
          key: poblemKey,
          data: problem,
        };
        await this.datastore.save(problemToInsert);
        console.log(problemToInsert.key.id);
        return problemToInsert.key.id;
    }
}