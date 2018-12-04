if (process.argv.length < 4) {
	console.log("Usage: node crawl <url> <job-name> <start-page = 1>");
	process.exit(0);
}
const url = process.argv[2];
const jobName = process.argv[3];
const startPage = parseInt(process.argv[4] || 1);
const https = require('https');
const fs = require('fs');

(async function() {
	try {
		let page = startPage;
		let next = `${url}?format=json&page=${page}`;
		while (next) {
			res = await get(next);
			fs.writeFile(`data/${jobName}/${page}.json`, res, 'utf8', (err) => {
				if (err) {
					console.error(err);
				}
			});
			next = JSON.parse(res).next;
			page++;
		}
	} catch (err) {
		console.error(err);
		process.exit(0);
	}
})();


function get(url) {
	console.log('[GET] ' + url);
	return new Promise((resolve, reject) => {
		https.get(url, res => {
			const data = [];
			res.on('data', chunk => {
				data.push(chunk);
			});
			res.on('end', () => {
				resolve(data.join(''));
			});
		})
		.on('error', err => {
			reject(err);
		});
	});
}
