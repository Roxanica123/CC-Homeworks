import * as  http from "http";
import { Server} from '.';
import { Application } from "..";
import { Handler } from "../routing";

export function start(app: Application):void{
    Handler.init(app.routes);
    const server: http.Server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
        Server.handle(req, res);
    });
    server.listen(5000, "127.0.0.1");    
}
