const getWrongTypeMessage = (variableName: string, value: unknown) =>
	`Found an unexpected value of \`${value}\` for \`${variableName}\`.`;

export default getWrongTypeMessage;
