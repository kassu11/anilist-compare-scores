let timeout;

export function setWithBuffer(set, value) {
	clearTimeout(timeout);
	timeout = setTimeout(() => {
		set(value);
	}, 100);
}