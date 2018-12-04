import requests
import json
from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

### crawl data from swapi.co
# r = requests.get('http://localhost:9200')
# i = 18
# while r.status_code == 200:
#     r = requests.get('http://swapi.co/api/people/'+ str(i))
#     # es.index(index='swapi', doc_type='people', id=i, body=json.loads(r.content))
#     i=i+1
#     print(i)

### test query
# q = es.get(index='swapi', doc_type='people', id=5))
# q = es.search(index="swapi", body={"query": {"prefix" : { "name" : "Darth Vader" }}})
q = es.count(index="swapi", doc_type="people")
# q = es.search(index="swapi", body={"query": {"fuzzy_field" : { "name" : {"like_text": "lu", "max_query_terms":5}}}})

print(q)