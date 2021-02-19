import * as  http from "http";
import { Ok } from "./action_results";
import { MyRequest } from "./request";


export class HomePage {
    public static readonly instance: HomePage = new HomePage()
    private static readonly issLocationUrl = "http://api.open-notify.org/iss-now.json"
    constructor() {
    }
    async get_response() {
        const options = { host: "api.open-notify.org", path: "/iss-now.json", method: 'GET' }
        const response = await new MyRequest("GET", "api.open-notify.org","/iss-now.json").send();
        console.log(response)
        return new Ok("?")
    }
}