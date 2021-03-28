import { Datastore } from '@google-cloud/datastore';
import { Evaluation } from '../evaluations_handlers/evaluation';


export class EvaluationRepository {
    private readonly datastore;
    private readonly kind = "Evaluation";
    constructor() {
        this.datastore = new Datastore();
    }

    getDatastoreKeySymbol() {
        return this.datastore.KEY;
    }

    async getAllEvaluations(cursor: any, pageSize: number): Promise<{ entities: Evaluation[], endCursor: string | undefined }> {
        let query = this.datastore
            .createQuery(this.kind)
            .order('submissionDateTime', {
                descending: true,
            })
            .limit(pageSize)

        if (cursor) {
            query = query.start(cursor);
        }
        const results = await this.datastore.runQuery(query);
        const entities = results[0];
        const info = results[1];
        let endCursor = undefined;
        if (info.moreResults !== Datastore.NO_MORE_RESULTS)
            endCursor = info.endCursor;
        return {
            entities: entities.map(item => {
                let copy: Evaluation = item;
                copy.id = item[this.getDatastoreKeySymbol()].id; return copy;
            }),
            endCursor: endCursor
        }
    }
    async getEvaluationById(id: number): Promise<Evaluation> {
        const key = this.datastore.key([this.kind, id]);
        const [result] = await this.datastore.get(key);
        result.id = id;
        return result;
    }
}