import { Cursor, ObjectId } from "mongodb";
import { Connection } from "../persistence";
import { BadRequest, EmptyBody, HttpActionResult, NoContent, NotFound, Ok, ServerError, Created } from "../simple-teddy";

export class SongsCollection {

    static async postSong(_query: string, body: any, path: string): Promise<HttpActionResult> {
        const id = path.split('/')[2];
        try {
            body.artist_id = id;
            const existent = await (await new Connection().executeCount("CloudSongs", "artists", { _id: id }, {})).cursor;
            if (existent !== 1)
                return new NotFound();
            const result = await (await new Connection().executeInsertOne("CloudSongs", "songs", body)).cursor;
            if (result !== null) {
                return new Created(EmptyBody, result.insertedId);
            }
            else { return new ServerError(JSON.stringify({ error: "Cannot insert song" })); }
        }
        catch (e) {
            return new ServerError(JSON.stringify({ error: "Somethig went wrong" }));
        }
    }
    static async getSongs(_query: string, _body: any, path: string): Promise<HttpActionResult> {
        const id = path.split('/')[2];
        try {
            const existent = await (await new Connection().executeCount("CloudSongs", "artists", { _id: id }, {})).cursor;
            if (existent !== 1)
                return new NotFound();
            const cursor: any[] = await (await new Connection().executeFind("CloudSongs", "songs", { artist_id: id }, {})).cursor.toArray();
            if (cursor != null) {
                return new Ok(JSON.stringify(cursor));
            }
            return new ServerError(JSON.stringify({ error: "Cannot get the songs" }));
        }
        catch (e) { console.log(e); return new ServerError(JSON.stringify({ error: "Somethig went wrong" })); }
    }

    static async deleteSong(_query: string, _body: any, path: string): Promise<HttpActionResult> {
        const id_artist = path.split('/')[2];
        const id = path.split('/')[4];
        try {
            const existent = await (await new Connection().executeCount("CloudSongs", "artists", { _id: id_artist }, {})).cursor;
            if (existent !== 1)
                return new NotFound();
            const result: any | null = (await new Connection().executeDeleteMany("CloudSongs", "songs", { _id: new ObjectId(id) })).cursor;
            if (result == null) return new ServerError(JSON.stringify({ error: "Cannot delete the song" }));
            const deletedCount = (await result).deletedCount;
            if (deletedCount == 0) {
                return new NotFound();
            }
            return new Ok();
        }
        catch (e) { return new ServerError(JSON.stringify({ error: "Somethig went wrong" })); }
    }
}