import { Ok } from "./action_results"
import { start } from "./server";

export * from "./server"
export * from "./application"

const get = function get(_query:any, _body:any) {
    return new Ok("Am ajuns aiiiici");
}

const app = {routes: [{route: "/", routeHandleFunction: get}]}

start(app)