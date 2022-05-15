/* eslint-disable @typescript-eslint/no-var-requires */

const startMockingRequests = async () => {
	if (typeof window === 'undefined') {
		const { default: server } = require('../mocks/server');
		server.listen();
	} else {
		const { default: worker } = require('../mocks/browser');
		worker.start();
	}
};

export default startMockingRequests;
