/**
 * Determines if an object (`obj`) has a property (`prop`.)
 */
const hasOwnProperty = <Y extends PropertyKey>(
	obj: unknown,
	prop: Y
): obj is Record<Y, unknown> => Object.prototype.hasOwnProperty.call(obj, prop);

export default hasOwnProperty;
