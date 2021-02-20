import { Ok, ServerError } from "./action_results";
import lineByLine from 'n-readlines';


export class MetricsPage {
    static async get_response() {
        let logsList;
        try {
            logsList = MetricsPage.readLogs();
        }
        catch {
            return new ServerError("Could not read metrics");
        }
        return new Ok(JSON.stringify(logsList))
    }

    static readLogs() {
        const liner = new lineByLine('./log.txt');
        let result: Map<string, any> = new Map()
        let line;
        let number = 0;
        let latency = 0;
        while (line = liner.next()) {
            const log = JSON.parse(line.toString())
            const key = log.request.method + " " + log.request.url;
            if (result.has(key)) {
                let data: any = result.get(key);
                data.number = data.number + 1;
                data.latency = data.latency + log.latency;
                result.set(key, data);
            }
            else {
                result.set(key, { number: 1, latency: log.latency });
            }
            number += 1;
            latency += log.latency;
        }
        return { per_request_metrics: Object.fromEntries(result), latency: latency, number: number };
    }
}