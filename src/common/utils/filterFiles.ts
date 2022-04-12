export interface Options {
	maxSize?: number;
}

const filterFiles = (files: File[], { maxSize }: Options) => {
	let filteredFiles = files;
	let filesFilteredOutCount = 0;

	if (typeof maxSize !== 'undefined') {
		filteredFiles = [];
		files.forEach((file) => {
			if (file.size > maxSize) {
				filesFilteredOutCount++;
			} else {
				filteredFiles.push(file);
			}
		});
	}

	return {
		filteredFiles,
		filesFilteredOutCount,
	};
};

export default filterFiles;
