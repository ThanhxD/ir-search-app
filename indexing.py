import json
from elasticsearch import Elasticsearch
from os import listdir

# cine: 1347
# doisong: 630
# sport: 808
# xahoi: 709
files = listdir('./crawl-data');
es = Elasticsearch([{'host': 'localhost', 'port': 9200}])
i = 1; # Start from 1

for file in files:
    with open('./crawl-data/' + file, encoding='utf8') as fp:
        lines = fp.readlines()
    for line in lines:
        parts = line.split('|')
        news = {
            'timestamp': parts[0],
            'category': parts[1],
            'title': parts[2],
            'content': parts[3]
        }
        es.index(index='kenh14', doc_type='news', id=i, body=json.loads(json.dumps(news)))
        i = i + 1
        print("Indexing.. %d" % i)

### test query
# q = es.get(index='kenh14', doc_type='news', id=5)
# q = es.search(index="swapi", body={"query": {"prefix" : { "name" : "Darth Vader" }}})
# q = es.count(index="swapi", doc_type="people")
# q = es.search(index="swapi", body={"query": {"fuzzy_field" : { "name" : {"like_text": "lu", "max_query_terms":5}}}})

# print(q)
