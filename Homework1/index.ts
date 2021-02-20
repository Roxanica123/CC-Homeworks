import { Ok } from "./action_results"
import { HomePage } from "./home-page";
import { MetricsPage } from "./metrics-page";
import { start } from "./server";

export * from "./server"
export * from "./application"

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