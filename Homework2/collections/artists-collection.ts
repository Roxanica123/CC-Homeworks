import { Cursor, ObjectId } from "mongodb";
import { Connection } from "../persistence";
import { BadRequest, EmptyBody, HttpActionResult, NoContent, NotFound, Ok, ServerError } from "../simple-teddy";
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
    static async getArtist(_query: string, _body: any, path: string): Promise<HttpActionResult> {
        const id = path.split('/')[2];
        try {
            const cursor: any[] = await (await new Connection().executeFind("CloudSongs", "artists", { _id: id }, {})).cursor.toArray();
            if (cursor.length == 1) {
                return new Ok(JSON.stringify(cursor[0]));
            }
            if (cursor.length == 0) {
                return new NotFound();
            }
            return new ServerError(JSON.stringify({ error: "Cannot get the artist" }));
        }
        catch (e) { console.log(e); return new ServerError(JSON.stringify({ error: "Somethig went wrong" })); }
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
    static async deleteArtist(_query: string, _body: any, path: string): Promise<HttpActionResult> {
        const id = path.split('/')[2];
        try {
            const result: any | null = (await new Connection().executeDeleteMany("CloudSongs", "artists", { _id: id })).cursor;
            if (result == null) return new ServerError(JSON.stringify({ error: "Cannot delete the artist" }));
            const deletedCount = (await result).deletedCount;
            
            if (deletedCount == 0) {
                return new NotFound();
            }
            return new Ok();
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
    static async putArtist(_query: string, body: any, path: string): Promise<HttpActionResult>{
        const id = path.split('/')[2];
        try {
            const result: any | null = (await new Connection().executeUpdate("CloudSongs", "artists", { _id: id }, body)).cursor;
            if (result == null) return new ServerError(JSON.stringify({ error: "Cannot delete the artist" }));
            console.log(await result);
            const modifiedCount = (await result).modifiedCount;
            
            if (modifiedCount == 0) {
                return new NotFound();
            }
            return new NoContent();
        }
        catch (e) { return new ServerError(JSON.stringify({ error: "Somethig went wrong" })); }
    }
}