import { User } from "../entities/user";
import { UserData } from "../entities/user_data";
import { CosmosConnection, DatabaseConnection, Query } from "../persistance";

export class UserRepository {
    private readonly connection: DatabaseConnection;
    private containerId: string = "users";
    constructor() {
        this.connection = CosmosConnection.getInstance();
    }

    public async exists(user: UserData): Promise<boolean | undefined> {
        const query: Query = {
            query: `SELECT COUNT(1) from c WHERE c.email = "${user.email}"`
        };
        const result: any[] | undefined = await this.connection.executeQuery(query, this.containerId)
        if (result !== undefined) {
            return result[0]['$1'] == 1;
        }
        return undefined;
    }
    public async save(user: User): Promise<User | undefined> {
        const result: User | undefined = await this.connection.insert(user, this.containerId);
        return result;
    }
    public async findByEmail(userEmail: string): Promise<User | undefined | null> {
        const query: Query = {
            query: `SELECT * from c WHERE c.email = "${userEmail}"`
        };
        const result: any[] | undefined = await this.connection.executeQuery(query, this.containerId)
        if (result === undefined) return undefined;
        if (result.length === 0) return null;
        return result[0];
    }
}