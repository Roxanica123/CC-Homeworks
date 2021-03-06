import { DatabaseOptions } from "../database";
import { RouteHandler } from "../routing";

export interface Application {
    routes : Array<RouteHandler>
    database_options: DatabaseOptions
}
