import { HomePage, MetricsPage } from "./pages";
import { start } from "./server";

export * from "./server"
export * from "./server/application"

const app = {
    routes: [
        {
            route: "/home",
            routeHandleFunction: HomePage.get_response
        },
        {
            route: "/metrics",
            routeHandleFunction: MetricsPage.get_response
        }
    ]
}

start(app)