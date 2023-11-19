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
    return 'Welcome to the Flask Elasticsearch App!'


@app.route('/search', methods=['GET'])
def search():
    query = request.args.get('q', '')
    if not query:
        return jsonify(error='Query parameter "q" is required'), 400

    try:
        # Perform a simple match query against the 'your_index_name' index
        result = es.search(
            index='your_index_name', 
            body={
                'query': {
                    'match': {
                        'your_field_name': query
                        }
                    }
            })
        hits = result['hits']['hits']
        response = [{'_id': hit['_id'], '_source': hit['_source']} for hit in hits]
        return jsonify(response)
    except Exception as e:
        return jsonify(error=str(e)), 500

if __name__ == '__main__':
    API_PORT = os.getenv('QUERY_API_PORT') or 3002
    app.run(debug=True, port=int(API_PORT))

