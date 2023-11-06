import { createSignal } from "solid-js";

export const [mediaType, setMediaType] = createSignal("ANIME");

export const [percentage, setPercentage] = createSignal(1);
export const [sortValue, setSortValue] = createSignal("score");

export const [userTable, setUserTable] = createSignal([]);

export const [searchIndex, setSearchIndex] = createSignal(0);

export const [mediaLoading, setMediaLoading] = createSignal(false);

export const [allUserLists, setAllUserLists] = createSignal([]);
export const [selectedLists, setSelectedLists] = createSignal([]);

const memoryObject = { ANIME: { global: {} }, MANGA: { global: {} } };
export const memory = (scope, listName) => memoryObject[mediaType()][scope]?.[listName];
export const setMemory = (scope, listName, value) => {
	memoryObject[mediaType()][scope] ??= {};
	memoryObject[mediaType()][scope][listName] = value;
};

let test_syntax = {
	ANIME: {
		global: {
			Watching: true,
			Completed: true,
			Paused: true,
			Dropped: true,
			Planning: true,
			Repeating: true,
			Custom: true,
		},
		u_kassu: {
			Watching: true,
			Completed: true,
			Paused: true,
			Dropped: true,
			Planning: true,
			Repeating: true,
			Custom: true,
		},
	},
};
