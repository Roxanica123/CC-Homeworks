import requests
import argparse
import sys
import time
from multiprocessing import Pool


def send_request(param):
    url = param[0]
    i = param[1]
    start = time.time()
    response = requests.request("GET", url)
    end = time.time()
    latency_time = float(end - start)
    print("Request: ", i, "---- Latency time:", latency_time)
    return latency_time


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--number_of_batches', '-b',
                        default=2, help="The number of batches")
    parser.add_argument('--number_of_concurrent_requests', '-c',
                        default=2, help="The number of concurrent requests")
    parser.add_argument('--url', '-u', default="http://localhost:5000/metrics")
    args = parser.parse_args(sys.argv[1:])

    batches_results = []
    for i in range(int(args.number_of_batches)):
        print("-------------------------------------------------\nBatch ", i)
        with Pool(int(args.number_of_concurrent_requests)) as p:
            times = p.map(send_request, [(args.url, i) for i in range(
                int(args.number_of_concurrent_requests))])
            batches_results = batches_results + times
            print("--- Average latency: ", sum(times)/len(times), "\n")
    print("Agerage latency: ", sum(batches_results)/len(batches_results))
