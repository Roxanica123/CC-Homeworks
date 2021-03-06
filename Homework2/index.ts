import { ArtistsCollection } from "./collections";
import { Connection } from "./persistence";
import { mongoUri } from "./secrets"
import { start } from "./simple-teddy"

const app = {
    routes: [{
        route: "/artists",
        method: "GET",
        routeHandleFunction: ArtistsCollection.getArtists
    },
    {
        route: "/artists",
        method: "POST",
        routeHandleFunction: ArtistsCollection.postArtists
    },
    {
        route: "/artists",
        method: "DELETE",
        routeHandleFunction: ArtistsCollection.deleteArtists
    }
    ],
    database_options: {
        mongoUri: mongoUri,
        poolSize: 10
    }
}
start(app);