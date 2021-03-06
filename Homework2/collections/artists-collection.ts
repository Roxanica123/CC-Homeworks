import { Cursor } from "mongodb";
import { Connection } from "../persistence";
import { HttpActionResult, Ok, ServerError } from "../simple-teddy";

export class ArtistsCollection{
    static async getArtists():Promise<HttpActionResult> {
        try{
            const cursor:Cursor|null = (await new Connection().executeFind("CloudSongs", "artists", {}, {})).cursor;
            if (cursor !==null){
                return new Ok(JSON.stringify(await cursor.toArray()))
            }
            else{
                return new  ServerError("Cannot get the artists");
            }
        }
        catch(e){
            return new ServerError(e);
        }
    }
    static async postArtists():Promise<HttpActionResult> {
        return new Ok("created");
    }
}