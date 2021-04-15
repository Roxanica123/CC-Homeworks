import { Query } from "./query";

export interface DatabaseConnection {
    executeQuery(query: Query): Promise<any[] | undefined>;
    insert(item: any): Promise<any | undefined>;
}