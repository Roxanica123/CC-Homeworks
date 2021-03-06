const CosmosClient = require("@azure/cosmos").CosmosClient;

import { DatabaseConnection, config, Query } from ".";

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
            const { resources: items } = await this.database.container(containerId).items
                .query(query)
                .fetchAll();
            return items;
        }
        catch (err) {
            console.log(err);
            return undefined;
        }
    }

    public async deleteQuery(query: Query, containerId: string): Promise<any | undefined> {
        const result: any[] | undefined = await this.executeQuery(query, containerId)
        if (result !== undefined) {
            try {
                return await Promise.all(result.map(element => this.database.container(containerId).item(element.id, element.email).delete()))
            }
            catch (err) {
                return undefined;
            }
        }
        return undefined;
    }

    public async insert(item: any, containerId: string): Promise<any | undefined> {
        try {
            const { resource: createdItem } = await this.database.container(containerId).items.create(item);
            return createdItem;
        }
        catch (err) {
            console.log(err)
            return undefined;
        }
    }
    
    public async update(item: any, containerId: string): Promise<any | undefined> {
        try {
            const { resource: updatedItem } = await this.database.container(containerId).item(item.id, item.email).replace(item);
            return updatedItem;
        } catch (e) {
            console.log(e);
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

