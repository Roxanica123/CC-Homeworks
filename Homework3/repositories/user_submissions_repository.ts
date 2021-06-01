import { Datastore } from "@google-cloud/datastore";

import { UserSubmissions } from "../evaluations_handlers/userSubmissions";

export class UserSubmissionsRepository {
    private readonly datastore;
    private readonly kind = "UserSubmissions";

    constructor() {
        this.datastore = new Datastore();
    }

    async getUserSubmissions(email: string): Promise<UserSubmissions | null> {
        let query = this.datastore
            .createQuery(this.kind)
            .filter('email', '=', email);
        
        const results = await this.datastore.runQuery(query);
        if (results[0].length == 0) {
            return null;
        }

        const userSubmissions: UserSubmissions = {
            id: results[0][0].id,
            email: results[0][0].email,
            submissions: results[0][0].submissions
        };
        return userSubmissions;
    }
}
