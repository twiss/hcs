function onResponseBody(request, response) {
	if (request.status >= 400 && request.destination === "document") {
		return; // let response through
	}
	let pairs = request.associatedCertificate.extensions.httpsContentSignatures; // ID: 2.5.29.66
	if (!pairs) {
		return; // let response through
	}
	let hashSpecified = false;
	let hashMatched = false;
	for (let pair of pairs) {
		if(pair.path === request.url || pair.path === request.path) {
			hashSpecified = true;
			if(pair.hash === response.hash) {
				hashMatched = true;
			}
		}
	}
	if (hashSpecified && (!hashMatched || (request.status !== 200 && request.status !== 302 && request.status < 400))) {
		request.abort();
		// show security error in browsing context
	}
}


// Note: the order of pairs is not defined, so the user agent may
// optimize the above code by, for example, collecting all the hashes
// for each path in arrays and put those in a hash table, and look up
// the hashes in that table by path and by url for each request, for
// example as follows:

function onCertificateReceived(certificate) {
	let pairs = certificate.extensions.httpsContentSignatures; // ID: 2.5.29.66
	if (pairs) {
		let table = {};
		for (let pair of pairs) {
			if(!table[pair.path]) {
				table[pair.path] = [];
			}
			table[pair.path].push(pair.hash);
		}
		certificate.httpsContentSignaturesTable = table;
	}
}

function onResponseBodyReceived(request, response) {
	if (request.status >= 400 && request.destination === "document") {
		return; // let response through
	}
	let table = request.associatedCertificate.httpsContentSignaturesTable;
	if (!table) {
		return; // let response through
	}
	let hashes = table[request.url] || table[request.path];
	if (hashes && (!hashes.contains(response.hash) || (request.status !== 200 && request.status !== 302 && request.status < 400))) {
		request.abort();
		// show security error in browsing context
	}
}