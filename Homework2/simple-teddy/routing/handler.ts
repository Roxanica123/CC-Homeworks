import { IncomingMessage } from "http";
import { BadRequest, HttpActionResult } from "../action_results";
import { RouteHandler } from ".";

export class Handler {
    private static handlerInstance: Handler;
    private readonly routes: Array<RouteHandler>;

    private constructor(routes: Array<RouteHandler>) {
        this.routes = routes;
    }

    public static init(routes: Array<RouteHandler>) {
        this.handlerInstance = new Handler(routes);
    }

    public static getInstance() {
        return this.handlerInstance;
    }

    public async handleRequest(request: IncomingMessage): Promise<HttpActionResult> {
        const baseURL: string = 'http://' + request.headers.host + '/';
        const path: string = new URL(request.url ? request.url : "", baseURL).pathname;
        const routeHandler = this.routes.find(routeHandler => {
            return ((typeof (routeHandler.route) === "string" && routeHandler.route === path) ||
                (typeof (routeHandler.route) === "object") && routeHandler.route.test(path))
                && request.method === routeHandler.method
        });
        if (routeHandler === undefined)
            return new BadRequest("Nothing to see here");
        return await this.execute(routeHandler, request);
    }
    public async execute(routeHandler: RouteHandler, request: IncomingMessage): Promise<HttpActionResult> {
        const baseURL: string = 'http://' + request.headers.host + '/';
        const path: string = new URL(request.url ? request.url : "", baseURL).pathname;

        let bodyString: string = "";
        let body: any = new Promise((resolve) => {
            request.on('data', chunk => { bodyString = bodyString + chunk; });
            request.on('end', () => {
                let bodyJson;
                try {
                    bodyJson = JSON.parse(bodyString !== "" ? bodyString : "{}");
                }
                catch {
                    bodyJson = null;
                }
                resolve(bodyJson);
            });
        });
        body = await body;
        if (body === null) return new BadRequest(JSON.stringify({ error: "Cannot parse body" }));
        let query: string = "";
    
        return await routeHandler.routeHandleFunction.apply(null, [query, body, path]);
    }
}