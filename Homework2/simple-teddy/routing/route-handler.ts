export interface RouteHandler {
    route: string | RegExp;
    method: string;
    routeHandleFunction: Function
}