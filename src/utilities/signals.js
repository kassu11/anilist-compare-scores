import { createSignal } from "solid-js";

export const [listType, setListType] = createSignal([]);
export const [mediaType, setMediaType] = createSignal("ANIME");

export const [percentage, setPercentage] = createSignal(1);
export const [sortValue, setSortValue] = createSignal("score");

export const [userTable, setUserTable] = createSignal([]);

export const [searchIndex, setSearchIndex] = createSignal(0);

export const [mediaLoading, setMediaLoading] = createSignal(false);
