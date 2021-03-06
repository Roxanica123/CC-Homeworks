import { MongoClient } from "mongodb";
import { DatabaseOptions } from "./database-options";

export class SimpleTeddyDatabaseConnection {

    private client: any;
    private static simpleTeddyConnectionInstance: SimpleTeddyDatabaseConnection;

    constructor(options: DatabaseOptions) {
        this.client=new MongoClient(options.mongoUri, {  
            poolSize: options.poolSize,
            useUnifiedTopology: true
          });
    }

    public static async init(options: DatabaseOptions) {
        this.simpleTeddyConnectionInstance = new SimpleTeddyDatabaseConnection(options);
        try {
            await this.simpleTeddyConnectionInstance.client.connect();
            await this.simpleTeddyConnectionInstance.client.db("admin").command({ ping: 1 });
            console.log("Connected successfully to database server");
          }
        finally {
        }
    }

    public static getInstance() {
        return this.simpleTeddyConnectionInstance;
    }

    public getClient() {
        return this.client;
    }
}