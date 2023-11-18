import csv
import os
import requests

filename = 'dummy_logs.csv'
url = 'http://localhost:3000/logger'

file_path = os.path.join(os.path.dirname(__file__), filename)
dummy_data_file = open(file_path, 'r')
dummy_data_reader = csv.DictReader(dummy_data_file)

for row in dummy_data_reader:
    formatted_data = {
            "level": row["level"],
            "message": row["message"],
            "resourceId": row["resourceId"],
            "timestamp": row["timestamp"],
            "traceId": row["traceId"],
            "spanId": row["spanId"],
            "commit": row["commit"],
            "metadata": {
                "parentResourceId": row.get("parentResourceId", "")
            }
        }
    response = requests.post(url, json=formatted_data)

    print(f"Status Code: {response.status_code}, Response Text: {response.text}")

