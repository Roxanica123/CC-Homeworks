export interface HttpActionResult {
    statusCode: number;
    body: string;
    redirectLocation?:string;
}

export const EmptyBody = "{}";