from flask import Flask, render_template, request, url_for, redirect, jsonify
from elasticsearch import Elasticsearch
from dotenv import load_dotenv
import requests
import os
load_dotenv()

app = Flask(__name__)
ELASTIC_SEARCH_HOST = os.getenv('ELASTIC_SEARCH_HOST')
es = Elasticsearch([f'http://{ELASTIC_SEARCH_HOST}:9200']) 

@app.route('/')
def index():
    return render_template('index.html')



@app.route('/search', methods=['GET'])
def search():
    base_search = request.args.get('base_search', '')
    query = request.args.get('q', '')
    query_level = request.args.get('level', '')
    query_start_time = request.args.get('start_time', '')
    query_end_time = request.args.get('end_time', '')
    query_trace_id = request.args.get('trace_id', '')
    query_span_id = request.args.get('spanid', '')
    query_parent_resource_id = request.args.get('parentResourceId', '')
    query_commit = request.args.get('commit', '')
    query_resource_id = request.args.get('resource_id', '')
    query_message = request.args.get('message', '')

    print(request.args)

    # Initialize the base query
    base_query = {"query": {"bool": {"must": []}}}


    if query_level:
        base_query["query"]["bool"]["must"].append({"term": {"level": query_level}})
    if query_start_time and query_end_time:
        base_query["query"]["bool"]["must"].append({"range": {"timestamp": {"gte": query_start_time, "lte": query_end_time}}})
    if query_trace_id:
        base_query["query"]["bool"]["must"].append({"match": {"traceId": query_trace_id}})
    if query_span_id:
        base_query["query"]["bool"]["must"].append({"match": {"spanId": query_span_id}})
    if query_parent_resource_id:
        base_query["query"]["bool"]["must"].append({"match": {"metadata.parentResourceId": query_parent_resource_id}})
    if query_commit:
        base_query["query"]["bool"]["must"].append({"match": {"commit": query_commit}})
    if query_resource_id:
        base_query["query"]["bool"]["must"].append({"match": {"resourceId": query_resource_id}})
    if query_message:
        base_query["query"]["bool"]["must"].append({"match": {"message": query_message}})

    # Check if at least one condition is specified
    if not any(base_query["query"]["bool"]["must"]):
        base_query = {
            "query": {
                "query_string": {
                    "query": "*"
                }
            },
            "size": 10,
            "from": 0,
            "sort": [
                {
                    "resourceId.keyword": {
                        "unmapped_type": "keyword",
                        "order": "desc"
                    }
                }
            ]
        }

    if query:
        base_query["query"]["query_string"]["query"] = query

    print(base_query)

    try:
        ELASTIC_INDEX = os.getenv('ELASTICSEARCH_INDEX')
        # Execute the Elasticsearch query
        result = es.search(index=ELASTIC_INDEX, body=base_query)
        # print(result)
        hits = result['hits']['hits']
        response = [{'_id': hit['_id'], '_source': hit['_source']} for hit in hits]
        return jsonify(response)
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':  
    API_PORT = os.getenv('QUERY_API_PORT') or 3002
    app.run(debug=True, port=int(API_PORT))

