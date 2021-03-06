import { Cursor, ObjectId } from "mongodb";
import { Connection } from "../persistence";
import { BadRequest, EmptyBody, HttpActionResult, NoContent, Ok, ServerError } from "../simple-teddy";
import { Created } from "../simple-teddy/action_results/created";

export class ArtistsCollection {
    static async getArtists(): Promise<HttpActionResult> {
        try {
            const cursor: Cursor | null = (await new Connection().executeFind("CloudSongs", "artists", {}, {})).cursor;
            if (cursor !== null) {
                return new Ok(JSON.stringify(await cursor.toArray()))
            }
            else { return new ServerError(JSON.stringify({ error: "Cannot get the artists" })); }
        }
        catch (e) { return new ServerError(JSON.stringify({ error: "Somethig went wrong" })); }
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
            const result = await (await new Connection().executeInsertOne("CloudSongs", "artists", doc)).cursor;

            if (result !== null) {
                return new Created(EmptyBody, result.insertedId);
            }
            else { return new ServerError(JSON.stringify({ error: "Cannot insert artist" })); }
        }
        catch (e) {
            return new ServerError(JSON.stringify({ error: "Somethig went wrong" }));
        }
    }
    static async deleteArtists(): Promise<HttpActionResult> {
        try {
            const result: Cursor | null = (await new Connection().executeDeleteMany("CloudSongs", "artists", {})).cursor;
            if (result !== null) {
                return new Ok();
            }
            else { return new ServerError(JSON.stringify({ error: "Cannot delete the artists" })); }
        }
        catch (e) { return new ServerError(JSON.stringify({ error: "Somethig went wrong" })); }
    }
    static async putArtists(_query: string, body: any): Promise<HttpActionResult> {
        try {
            const result: Cursor | null = (await new Connection().executeDeleteMany("CloudSongs", "artists", {})).cursor;
            if (result !== null) {
                const result: Cursor | null = (await new Connection().executeInsertMany("CloudSongs", "artists", body)).cursor;
                if (result !== null) {
                    return new NoContent();
                }
            }
            return new ServerError(JSON.stringify({ error: "Cannot delete the artists" }));
        }
        catch (e) { return new ServerError(JSON.stringify({ error: "Somethig went wrong" })); }
    }
}