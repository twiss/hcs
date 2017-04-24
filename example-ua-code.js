function onResponseBody(request, response) {
	if (response.status >= 400 && request.destination !== "document") { // Defined by the Fetch spec (https://fetch.spec.whatwg.org/)
		return; // let response through
	}
	let pairs = request.associatedCertificate.extensions.httpsContentSignatures; // ID: 2.5.29.66
	if (!pairs) {
		return; // let response through
	}
	for (let pair of pairs) {
		if (pair.path === request.url || pair.path === request.path) {
			if (!match(pair.hash, response.body)) { // Defined by Subresource Integrity (https://www.w3.org/TR/SRI/)
				request.abort();
				// show security error in browsing context
			}
			break;
		}
	}
	return; // let response through
}

// Note 1: the above code does not explicitly handle redirects.

// Note 2: the order of pairs is not defined, so the user agent may
// optimize the above code to, for example, a pair of hash table
// lookups.