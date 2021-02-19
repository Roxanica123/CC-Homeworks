import { Ok } from "./action_results"
import { HomePage } from "./home-page";
import { start } from "./server";

export * from "./server"
export * from "./application"

const app = {routes: [{route: "/home", routeHandleFunction: HomePage.instance.get_response}]}

start(app)