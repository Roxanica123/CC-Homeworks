import { CosmosConnection, DatabaseConnection, Query } from "../persistance";

export class JwtRepository {
    private readonly connection: DatabaseConnection;
    private containerId: string = "tokens";
    constructor() {
        this.connection = CosmosConnection.getInstance();
    }
    public async exists(token: string): Promise<boolean | undefined> {
        const query: Query = {
            query: `SELECT COUNT(1) from c WHERE c.refresh_token = "${token}"`
        };
        const result: any[] | undefined = await this.connection.executeQuery(query, this.containerId)
        if (result !== undefined) {
            return result[0]['$1'] == 1;
        }
        return undefined;
    }
    public async save(token: string, email: string): Promise<void> {
        const result = await this.connection.insert({ refresh_token: token, email: email }, this.containerId);
    }
}