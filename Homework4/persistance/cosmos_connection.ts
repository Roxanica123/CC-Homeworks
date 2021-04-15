import { DatabaseConnection, config, Query } from ".";
const CosmosClient = require("@azure/cosmos").CosmosClient;

export class CosmosConnection implements DatabaseConnection {
    private client: any;
    private database: any;
    private static instance: CosmosConnection | null = null;
    constructor() {
        const endpoint = config.endpoint;
        const key = config.key;
        this.client = new CosmosClient({ endpoint, key });
        this.database = this.client.database(config.databaseId);
    }
    public async executeQuery(query: Query, containerId: string): Promise<any[] | undefined> {
        try {
            const { resources: items } = await this.database.container(config.containerId).items
                .query(query)
                .fetchAll();
            return items;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }
    public async insert(item: any, containerId: string): Promise<any | undefined> {
        try {
            const { resource: createdItem } = await this.database.container(config.containerId).items.create(item);
            return createdItem;
        }
        catch (err) {
            console.log(err)
            return undefined;
        }
    }
    public static getInstance() {
        if (CosmosConnection.instance === null) {
            CosmosConnection.instance = new CosmosConnection();
        }
        return CosmosConnection.instance;
    }
}

