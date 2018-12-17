from flask import Flask, render_template, request, jsonify
import requests
import json
from datetime import datetime
from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
app = Flask(__name__)


@app.route('/')
def index():
    return render_template('index.html', results=None)


@app.route('/search')
def search():
    query = request.args.get('query')
    result = {}
    if es.indices.exists(index="kenh14"):
        results = do_search(query)
    else:
        results = es.search(index="_all", body={"query": {"match_all": {}}})

    return render_template('index.html', results={
        "detail": {
            "query": query,
            "total": results['hits']['total'],
            "took": results['took']
        },
        "hits": results['hits']['hits']
    })

@app.route('/suggest')
def suggest():
    query = request.args.get('query')
    result = es.search(index="kenh14", body={"query": {"prefix" : { "title" : query }}})
    titles = [];
    for record in result['hits']['hits']:
        titles.append(record['_source']['title'])
    return jsonify(titles)

def do_search(query):
    results = es.search(index="kenh14", body={
        "query": {
            "multi_match": {
                "query": query,
                "fields": ["title", "content"]
            }
        }
    })

    return results

if __name__ == '__main__':
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 10
    app.run(debug=True)
