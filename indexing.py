import requests
import json
from elasticsearch import Elasticsearch

# cine: 1347
# doisong: 630
# sport: 808
# xahoi: 709

with open('./crawl-data/xahoi_kenh14_docs.txt', encoding='utf8') as fp:
    lines = fp.readlines()

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

### crawl data from swapi.co
r = requests.get('http://localhost:9200')
i = 0
while r.status_code == 200 and (i < len(lines)):
    parts = lines[i].split('|')
    news = {
        'timestamp': parts[0],
        'category': parts[1],
        'title': parts[2],
        'content': parts[3]
    }
    es.index(index='kenh14', doc_type='news', id=i+1347+630+808, body=json.loads(json.dumps(news)))
    i=i+1
    print(i)

### test query
# q = es.get(index='kenh14', doc_type='news', id=5)
# q = es.search(index="swapi", body={"query": {"prefix" : { "name" : "Darth Vader" }}})
# q = es.count(index="swapi", doc_type="people")
# q = es.search(index="swapi", body={"query": {"fuzzy_field" : { "name" : {"like_text": "lu", "max_query_terms":5}}}})

# print(q)
