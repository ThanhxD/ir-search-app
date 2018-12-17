import json
from elasticsearch import Elasticsearch
from os import listdir

files = listdir('./crawl-data');
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

# Create index
body = {
    "settings": {
        "analysis": {
            "analyzer": {
                "autocomplete": {
                    "tokenizer": "autocomplete",
                    "filter": [
                        "lowercase"
                    ]
                },
                "autocomplete_search": {
                    "tokenizer": "lowercase"
                }
            },
            "tokenizer": {
                "autocomplete": {
                    "type": "edge_ngram",
                    "min_gram": 2,
                    "max_gram": 10,
                    "token_chars": [
                        "letter"
                    ]
                }
            }
        }
    },
    "mappings": {
        "_doc": {
            "properties": {
                "title": {
                    "type": "text",
                    "analyzer": "autocomplete",
                    "search_analyzer": "autocomplete_search"
                }
            }
        }
    }
}

es.indices.create(index='kenh14ngram', body=body)

i = 1; # Start from 1

for file in files:
    with open('./crawl-data/' + file, encoding='utf8') as fp:
        lines = fp.readlines()
    for line in lines:
        parts = line.split('|')
        news = {
            'title': parts[2]
        }
        es.index(index='kenh14ngram', doc_type='_doc', id=i, body=json.loads(json.dumps(news)))
        i = i + 1
        print("EdgeNGram Indexing.. %d" % i)

es.indices.refresh(index='kenh14ngram')
