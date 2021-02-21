import { Ok, ServerError } from "../action_results";
import { MyRequest, ResponseObject } from "../server";
import { azure_key, twitter_bearer_token } from "../secrets";

export class HomePage {
    static async get_response() {
        const response_iss = new MyRequest("GET", "api.open-notify.org", "/iss-now.json").send();
        const response_twitter = HomePage.get_tweet_location();

        let locations = {}
        let tweeit_id = {}
        try {
            locations = HomePage.extract_locations(await response_iss, await response_twitter);
            tweeit_id = HomePage.extract_tweet_id(await response_twitter);
        }
        catch { return new ServerError("Something went wrong :(. Could not extract locations or tweet id"); }

        //const response = { location: locations, tweet_id: tweeit_id }
        const response_azure = await HomePage.get_azure_distance(locations)
        if (response_azure.is_error === true || response_azure.code !== 200)
            return new ServerError("Something went wrong :(. Could not get distance");
        const response = { map_info: JSON.parse(response_azure.data), tweet_id: tweeit_id }
        

        return new Ok(JSON.stringify(response))
    }
    private static async get_tweet_location(): Promise<ResponseObject> {
        const tweetQuery: string = "?ids=1362823946148732931&tweet.fields=geo&expansions=geo.place_id&place.fields=geo,contained_within";
        const header = {
            "Authorization": "Bearer " + twitter_bearer_token
        };
        const path = "/2/tweets" + tweetQuery;
        const response_twitter: ResponseObject = await new MyRequest("GET", "api.twitter.com", path, header, "https").send();
        return response_twitter
    }
    private static async get_azure_distance(location: any): Promise<ResponseObject> {
        const azure_query: string = `?&subscription-key=${azure_key}&api-version=1.0&query=${location.iss.latitude},${location.iss.longitude}:${location.tweet.latitude},${location.tweet.longitude}`
        const path = "/spatial/greatCircleDistance/json" + azure_query;
        const response_bing: ResponseObject = await new MyRequest("GET", "atlas.microsoft.com", path, null, "https").send()
        return response_bing;

    }

    private static extract_locations(response_iss: ResponseObject, response_twitter: ResponseObject) {
        const tweet_data = JSON.parse(response_twitter.data);
        const iss_data = JSON.parse(response_iss.data);

        const tweet_bbox = tweet_data.includes.places[0].geo.bbox;
        const tweet_location = { longitude: tweet_bbox[0], latitude: tweet_bbox[1] }

        const iss_location_obj = iss_data.iss_position;
        const iss_location = { longitude: parseFloat(iss_location_obj.longitude), latitude: parseFloat(iss_location_obj.latitude) }
        return { tweet: tweet_location, iss: iss_location }
    }

    private static extract_tweet_id(response_twitter: ResponseObject): string {
        const tweet_data = JSON.parse(response_twitter.data);
        const tweet_id = tweet_data.data[0].id;
        return tweet_id;
    }
}