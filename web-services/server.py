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

@app.route('/suggest/edge_ngram')
def suggest_edge_ngram():
    query = request.args.get('query')
    # results = es.search(index="kenh14", body={"query": {"match_phrase_prefix" : { "title" : query }}})
    # results = es.search(index="kenh14", body={"query": {"prefix" : { "title" : query }}})
    results = do_suggest_ngram(query)
    titles = []
    for record in results['hits']['hits']:
        titles.append(record['_source']['title'])
    return jsonify(titles)

@app.route('/suggest/match_phrase_prefix')
def suggest_phrase_prefix():
    query = request.args.get('query')
    results = es.search(index="kenh14", body={"query": {"match_phrase_prefix" : { "title" : query }}})
    titles = []
    for record in results['hits']['hits']:
        titles.append(record['_source']['title'])
    return jsonify(titles)

@app.route('/suggest/prefix')
def suggest_prefix():
    query = request.args.get('query')
    results = es.search(index="kenh14", body={"query": {"prefix" : { "title" : query }}})
    titles = []
    for record in results['hits']['hits']:
        titles.append(record['_source']['title'])
    return jsonify(titles)

def do_suggest_ngram(query):
    body = {
        "query": {
            "match": {
                "title": {
                    "query": query,
                    "operator": "and"
                }
            }
        }
    }
    results = es.search(index="kenh14ngram", body=body)
    return results

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
