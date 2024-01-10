const timeouts = new Map();

export function setWithBuffer(set, value) {
	if (timeouts.has(set)) clearTimeout(timeouts.get(set));

	timeouts.set(
		set,
		setTimeout(() => {
			set(value);
			timeouts.delete(set);
		}, 100)
	);
}
