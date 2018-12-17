from elasticsearch import Elasticsearch

es = Elasticsearch([{'host': 'localhost', 'port': 9200}])

# q = es.get(index='kenh14', doc_type='news', id=5)
# # print("Result 1");
# print(q);

q = es.search(index="kenh14", body={"query": {"prefix" : { "title" : "sau" }}})
for hit in q['hits']['hits']:
	print(hit['_source']['title'])
