const startMockingRequests = async () => {
	if (typeof window === 'undefined') {
		const { default: server } = await import('./server');
		server.listen();
	} else {
		const { default: worker } = await import('./browser');
		worker.start();
	}
};

startMockingRequests();

export {};
