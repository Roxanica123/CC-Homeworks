import { Ok } from "./action_results";
import { MyRequest } from "./request";
import { twitter_bearer_token } from "./secrets";


export class HomePage {
    public static readonly instance: HomePage = new HomePage()
    constructor() {
    }
    async get_response() {
        const response_iss = await new MyRequest("GET", "api.open-notify.org", "/iss-now.json").send();
        console.log(response_iss)
        HomePage.get_tweet();
        return new Ok("?")
    }
    private static async get_tweet() {
        const tweetQuery: string = "?ids=1362823946148732931&tweet.fields=geo&expansions=geo.place_id&place.fields=geo,contained_within";
        const header = {
            "Authorization": "Bearer " + twitter_bearer_token
        };
        const path = "/2/tweets" + tweetQuery;
        const response_twitter = await new MyRequest("GET", "api.twitter.com", path, header, "https").send();
        console.log(response_twitter);
    }
}