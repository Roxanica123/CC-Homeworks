import { Connection } from "./persistence";
import { mongoUri } from "./secrets"
import { start } from "./simple-teddy"

const app = {
    routes: [],
    database_options: {
        mongoUri: mongoUri,
        poolSize: 10
    }
}
async function cv(){
    await start(app);
    const contor = (await new Connection().executeFind("CloudSongs", "songs", {}, {})).cursor
    contor.forEach((element: any) => {
        console.log(element);
    });
}
cv()