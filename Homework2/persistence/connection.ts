import { SimpleTeddyDatabaseConnection } from "../simple-teddy";
import { DatabaseResponse } from "./database-response";


export class Connection {
    private readonly client: any;

    constructor() {
        this.client = SimpleTeddyDatabaseConnection.getInstance().getClient();
    }

    public async executeFind(database: string, collection: string, query: any, options: any): Promise<DatabaseResponse> {
        try {
            const db = await this.client.db(database);
            const dbCollection = await db.collection(collection);
            const cursor = dbCollection.find(query, options);
            return { cursor: cursor, error: false }
        }
        catch (e) {
            return { cursor: null, error: true }
        }
    }
}