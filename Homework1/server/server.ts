import * as  http from "http";
import { HttpActionResult } from "../action_results";
import { Handler } from "../routing";

export class Server {
    public static async handle(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        const response: HttpActionResult = await Handler.getInstance().handleRequest(req);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.statusCode = response.statusCode;
        res.end(response.body);
    }
}