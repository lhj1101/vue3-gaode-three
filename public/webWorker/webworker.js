self.onmessage = function(event) {
	console.log('self.onmessage-event', event.data);
	let count = 0;
	for (let i = 0; i < 1e9; i++) {
		count += i;
	}
	self.postMessage(count);
};

self.onerror = function(event) {
	console.log('self.onerror-event', event);
	self.postMessage('error' + event);
};
