import { ArtistsCollection } from "./collections";
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
    },
    {
        route: "/artists",
        method: "PUT",
        routeHandleFunction: ArtistsCollection.putArtists
    },
    {
        route: /\/artists\/[\w]+/,
        method: "GET",
        routeHandleFunction: ArtistsCollection.getArtist
    },
    {
        route: /\/artists\/[\w]+/,
        method: "DELETE",
        routeHandleFunction: ArtistsCollection.deleteArtist
    },
    {
        route: /\/artists\/[\w]+/,
        method: "PUT",
        routeHandleFunction: ArtistsCollection.putArtist
    }
    ],
    database_options: {
        mongoUri: mongoUri,
        poolSize: 10
    }
}
start(app);