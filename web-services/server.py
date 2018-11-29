from flask import Flask, render_template, request
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
    results = es.search(index="swapi", body={"query": {"prefix" : { "name" : query }}})
    print(results)
    return render_template('index.html', results={
        "detail": {
            "query": query,
            "total": results['hits']['total'],
            "took": results['took']
        },
        "hits": results['hits']['hits']
    })


if __name__ == '__main__':
    app.config['SEND_FILE_MAX_AGE_DEFAULT'] = 10
    app.run(debug=True)
