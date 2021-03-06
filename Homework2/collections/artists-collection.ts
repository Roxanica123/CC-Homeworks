import { Cursor } from "mongodb";
import { Connection } from "../persistence";
import { BadRequest, EmptyBody, HttpActionResult, Ok, ServerError } from "../simple-teddy";
import { Created } from "../simple-teddy/action_results/created";

export class ArtistsCollection {
    static async getArtists(): Promise<HttpActionResult> {
        try {
            const cursor: Cursor | null = (await new Connection().executeFind("CloudSongs", "artists", {}, {})).cursor;
            if (cursor !== null) {
                return new Ok(JSON.stringify(await cursor.toArray()))
            }
            else {
                return new ServerError("Cannot get the artists");
            }
        }
        catch (e) {
            return new ServerError(e);
        }
    }
    static async postArtists(_query: string, body: any): Promise<HttpActionResult> {
        try {
            let doc;
            try {
                doc = { name: body.name, genres: body.genres };
            }
            catch {
                return new BadRequest("Invalid artist body");
            }
            const result = await (await new Connection().executeInsert("CloudSongs", "artists", doc)).cursor;
        
            if (result !== null) {
                return new Created(EmptyBody, result.insertedId);
            }
            else {
                return new ServerError("Cannot insert artist");
            }
        }
        catch (e) {
            console.log(e);
            return new ServerError("Something went wrong");
        }
    }
}