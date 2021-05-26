import { Datastore } from "@google-cloud/datastore";
import { ProblemData, PROBLEM_STATUS } from "../upload_handlers";

export class ProblemRepository {
  private readonly datastore;
  private readonly kind = "Problem";
  constructor() {
    this.datastore = new Datastore();
  }

  getDatastoreKeySymbol() {
    return this.datastore.KEY;
  }

  async saveProblem(problem: ProblemData) {
    const poblemKey = this.datastore.key(this.kind);
    const problemToInsert = {
      key: poblemKey,
      data: problem,
    };
    await this.datastore.save(problemToInsert);
    return problemToInsert.key.id;
  }
  async getAllProblems(status: PROBLEM_STATUS): Promise<any[]> {
    const query = this.datastore
      .createQuery(this.kind)
      .filter("status", "=", status);
    const [result] = await this.datastore.runQuery(query);
    return result;
  }
  async getProblemById(id: number): Promise<any> {
    const key = this.datastore.key([this.kind, id]);
    const [result] = await this.datastore.get(key);
    return result;
  }
}
