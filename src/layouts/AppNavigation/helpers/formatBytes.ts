// copied from https://stackoverflow.com/a/18650828/12487403
const formatBytes = (bytes: number, decimals = 2) => {
	if (bytes === 0) return '0 B';
	if (decimals < 0) {
		throw new Error(`\`${decimals}\` is not a valid amount of decimals.`);
	}

	const bytesInAKilobyte = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

	const sizeIndex = Math.floor(Math.log(bytes) / Math.log(bytesInAKilobyte));

	return (
		parseFloat(
			(bytes / Math.pow(bytesInAKilobyte, sizeIndex)).toFixed(decimals)
		) +
		' ' +
		sizes[sizeIndex]
	);
};

export default formatBytes;
