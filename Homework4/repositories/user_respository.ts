import { User } from "../entities/user";
import { UserData } from "../entities/user_data";
import { CosmosConnection, DatabaseConnection, Query } from "../persistance";

export class UserRepository {
    private readonly connection: DatabaseConnection;
    constructor() {
        this.connection = CosmosConnection.getInstance();
    }

    public async exists(user: UserData): Promise<boolean | undefined> {
        const query: Query = {
            query: `SELECT COUNT(1) from c WHERE c.email = "${user.email}"`
        };
        const result: any[] | undefined = await this.connection.executeQuery(query)
        if (result !== undefined) {
            return result[0]['$1'] == 1;
        }
        return undefined;
    }
    public async save(user: User): Promise<User | undefined> {
        const result: User | undefined = await this.connection.insert(user);
        return result;
    }
    public findByEmail(userEmail: string): User | undefined {
        return undefined;
    }
}