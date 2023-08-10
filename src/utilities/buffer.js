let timeout;

export function setWidthBuffer(set, value) {
	clearTimeout(timeout);
	timeout = setTimeout(() => {
		set(value);
	}, 100);
}