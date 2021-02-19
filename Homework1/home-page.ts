import { Ok, ServerError } from "./action_results";
import { MyRequest } from "./server/request";
import { bing_key, twitter_bearer_token } from "./secrets";
import { ResponseObject } from "./server/request_response_object";


export class HomePage {
    static async get_response() {
        const response_iss = await new MyRequest("GET", "api.open-notify.org", "/iss-now.json").send();
        if (response_iss.is_error === true || response_iss.code !== 200)
            return new ServerError("Something went wrong :(. Could not get the iss location");

        const response_twitter = await HomePage.get_tweet_location();
        if (response_twitter.is_error === true || response_twitter.code !== 200)
            return new ServerError("Something went wrong :(. Could not get the tweet location");

        let locations = {}
        try { locations = HomePage.extract_locations(response_iss, response_twitter); }
        catch { return new ServerError("Something went wrong :(. Could not extract locations"); }

        const bing_response = await HomePage.get_bing_route(locations);
        console.log(bing_response)
        return new Ok("?")
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

    private static async get_bing_route(location: any): Promise<ResponseObject> {
        const bing_query: string = `?wp.0=${location.tweet.latitude},${location.tweet.longitude}&wp.1=${location.iss.latitude},${location.iss.longitude}&ra=regionTravelSummary&key=${bing_key}`
        const path: string = "/REST/V1/Routes" + bing_query;
        const response_bing: ResponseObject = await new MyRequest("GET", "dev.virtualearth.net", path).send()
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
}