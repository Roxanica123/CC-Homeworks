import * as  http from "http";
import { Server} from '.';
import { Application, SimpleTeddyDatabaseConnection } from "..";
import { Handler } from "../routing";

export async function start(app: Application):Promise<void>{
    Handler.init(app.routes);
    await SimpleTeddyDatabaseConnection.init(app.database_options);
    const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
        Server.handle(req, res);
    });
    server.listen(5000, "127.0.0.1");    
}
