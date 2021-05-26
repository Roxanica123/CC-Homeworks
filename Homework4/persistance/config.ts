export interface CosmosConfig {
  endpoint: string,
  key: string,
  databaseId: string,
  containerId: string,
  partitionKey: { kind: string, paths: string[] }
}

export const config: CosmosConfig = {
  endpoint: process.env.COSMOS_ENDPOINT ?? "",
  key: process.env.COSMOS_KEY ?? "",
  databaseId: "hw4",
  containerId: "users",
  partitionKey: { kind: "Hash", paths: ["/category"] }
};
