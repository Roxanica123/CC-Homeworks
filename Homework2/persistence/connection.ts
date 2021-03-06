import { compileFunction } from "node:vm";
import { DatabaseOptions, SimpleTeddyDatabaseConnection } from "../simple-teddy";
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
    public async executeCount(database: string, collection: string, query: any, options: any): Promise<DatabaseResponse> {
        try {
            const db = await this.client.db(database);
            const dbCollection = await db.collection(collection);
            const cursor = dbCollection.count(query, options);
            return { cursor: cursor, error: false }
        }
        catch (e) {
            return { cursor: null, error: true }
        }
    }
    public async executeInsertOne(database: string, collection: string, doc: any): Promise<DatabaseResponse> {
        try {
            const db = await this.client.db(database);
            const dbCollection = await db.collection(collection);
            const cursor = dbCollection.insertOne(doc);
            return { cursor: cursor, error: false }
        }
        catch (e) {
            return { cursor: null, error: true }
        }
    }
    public async executeInsertMany(database: string, collection: string, doc: any[]): Promise<DatabaseResponse> {
        try {
            const db = await this.client.db(database);
            const dbCollection = await db.collection(collection);
            const cursor = dbCollection.insert(doc);
            return { cursor: cursor, error: false }
        }
        catch (e) {
            return { cursor: null, error: true }
        }
    }
    public async executeDeleteMany(database: string, collection: string, query: any): Promise<DatabaseResponse> {
        try {
            const db = await this.client.db(database);
            const dbCollection = await db.collection(collection);
            const cursor = dbCollection.deleteMany(query);
            return { cursor: cursor, error: false }
        }
        catch (e) {
            return { cursor: null, error: true }
        }
    }
    public async executeUpdate(database: string, collection: string, query: any, update: any): Promise<DatabaseResponse> {
        try {
            const db = await this.client.db(database);
            const dbCollection = await db.collection(collection);
            const cursor = dbCollection.updateOne(query, { $set: update });
            return { cursor: cursor, error: false }
        }
        catch (e) {
            return { cursor: null, error: true }
        }
    }
}