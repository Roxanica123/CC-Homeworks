import { Datastore } from '@google-cloud/datastore';


export class FilesRepository {
    private readonly datastore;
    private readonly kind = "Problem";
    constructor() {
        this.datastore = new Datastore();
    }
    async quickstart() {

        // The Cloud Datastore key for the new entity
        const taskKey = this.datastore.key(this.kind);
        console.log("uuuuuuuuuuuuuuuuuuuuuuuuuuu");
        console.log(taskKey);
        console.log(taskKey.path)
      
        // Prepares the new entity
        const task = {
          key: taskKey,
          data: {
            description: 'Buy milk',
          },
        };
      
        // Saves the entity
        await this.datastore.save(task);
        console.log(`Saved ${task.key.name}: ${task.data.description}`);
        console.log(task.key.id)
    }
}