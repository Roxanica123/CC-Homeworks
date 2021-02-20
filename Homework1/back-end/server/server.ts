import * as  http from "http";
import * as fs from "fs"
import { HttpActionResult } from "../action_results";
import { Handler } from "../routing";

export class Server {
    public static readonly log_stream = fs.createWriteStream("log.txt", { flags: 'a' });

    public static async handle(req: http.IncomingMessage, res: http.ServerResponse): Promise<void> {
        const startTime = Date.now();
        const response: HttpActionResult = await Handler.getInstance().handleRequest(req);
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.statusCode = response.statusCode;
        res.on('finish', () => {
            Server.writeLog(req, response, startTime, Date.now())
        })
        res.end(response.body);
    }

    public static writeLog(req: http.IncomingMessage, res: HttpActionResult, startTime: number, timestamp: number): void {
        const log = {
            request: { method: req.method, url: req.url },
            response: { statusCode: res.statusCode, body: res.body },
            timestamp: timestamp,
            latency: (timestamp - startTime)
        }
        Server.log_stream.write(JSON.stringify(log) + "\n");
    }
}