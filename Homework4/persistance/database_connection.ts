import { Query } from ".";

export interface DatabaseConnection {
    executeQuery(query: Query, containerId: string): Promise<any[] | undefined>;
    deleteQuery(query: Query, containerId: string): Promise<any | undefined>;
    insert(item: any, containerId: string): Promise<any | undefined>;
    update(item: any, containerId: string): Promise<any | undefined>;
}
