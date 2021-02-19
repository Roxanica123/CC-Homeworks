import { throws } from "assert";
import * as  http from "http";
import * as  https from "https";

export class MyRequest {
    private options: object;
    private http;
    constructor(method: "GET" | "POST" | "PUT" | "DELETE", host: string, path: string, headers: object | null = null, protocol: "http" | "https" = "http") {
        this.http = protocol === "http" ? http : https
        this.options = { method: method, host: host, path: path, headers: headers }
    }
    send(): Promise<object> {
        return new Promise((resolve, reject) => {
            let data = ""
            const request = this.http.request(this.options, res => {
                res.on('data', d => {
                    data += d;
                })
                res.on('end', () => {
                    resolve({
                        data: data,
                        code: res.statusCode,
                    });
                })
                res.on('error', err => {
                    reject({ error: err })
                })
            })
            request.end();
        });
    }
}