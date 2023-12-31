const DEBUG = location.hostname === "localhost";

const userQuery = `query ($page: Int = 1, $id: Int, $search: String, $sort: [UserSort] = [SEARCH_MATCH]) {
	Page(page: $page, perPage: 20) {
		pageInfo {
			total
			perPage
			currentPage
			lastPage
			hasNextPage
		}
		users(id: $id, search: $search, sort: $sort) {
			id
			name
			statistics {
				anime {
					count
					meanScore
					minutesWatched
				}
				manga {
					count
					meanScore
					chaptersRead
				}
			}
			avatar {
				medium
			}
		}
	}
}
`;

const userVariable = {
	page: 1,
	type: "USERS",
	search: "user_name",
	sort: "SEARCH_MATCH",
};

const fetchedUsers = {};

export async function fetchUsers(userName) {
	userName = userName.toLowerCase();
	if (userName === "") return [];
	const debugKey = "ani" + userName + "Search";
	if (fetchedUsers[userName] instanceof Promise) {
		await fetchedUsers[userName];
		return fetchedUsers[userName];
	}
	if (fetchedUsers[userName]) return fetchedUsers[userName];

	if (DEBUG) {
		const data = JSON.parse(localStorage.getItem(debugKey));
		if (data) return (fetchedUsers[userName] = data);
	}

	let fetchingDone;
	fetchedUsers[userName] = new Promise((resolve) => (fetchingDone = resolve));

	const option = optionHandler(userQuery, { ...userVariable, search: userName });
	const response = await fetch("https://graphql.anilist.co", option);
	const json = await response.json();
	fetchedUsers[userName] = json.data.Page.users;
	if (DEBUG) localStorage.setItem(debugKey, JSON.stringify(fetchedUsers[userName]));
	fetchingDone();
	return fetchedUsers[userName];
}

export const optionHandler = (query, variables = {}) => ({
	method: "POST",
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
	},
	body: JSON.stringify({
		query,
		variables,
	}),
});

export const fetchedUserMedias = {};
const userMediaQuery = `query ($userId: Int, $userName: String, $type: MediaType) {
	MediaListCollection(userId: $userId, userName: $userName, type: $type) {
		lists {
			name
			isCustomList
			isCompletedList: isSplitCompletedList
			entries {
				...mediaListEntry
			}
		}
		user {
			id
			name
			avatar {
				medium
			}
			mediaListOptions {
				scoreFormat
				rowOrder
			}
		}
	}
}

fragment mediaListEntry on MediaList {
	score(format: POINT_10_DECIMAL)
	repeat
	customLists
	media {
		id
		title {
			userPreferred
			romaji
			english
			native
		}
		coverImage {
			large
			color
		}
		season
		type
		format
		episodes
		chapters
		averageScore
		bannerImage
		nextAiringEpisode {
			episode
		}
		startDate {
			year
			month
			day
		}
	}
}
`;

const userMediaVariable = {
	userId: 0,
	type: "ANIME",
};

export async function fetchUserMedia({ id, name }, type = "ANIME") {
	if (name === "") return [];
	const key = name + type;
	const debugKey = "ani" + id + type;
	if (fetchedUserMedias[key] instanceof Promise) {
		await fetchedUserMedias[key];
		return fetchedUserMedias[key];
	}
	if (fetchedUserMedias[key]) return fetchedUserMedias[key];

	if (DEBUG) {
		const data = JSON.parse(localStorage.getItem(debugKey));
		if (data) return (fetchedUserMedias[key] = data);
	}

	let fetchingDone;
	fetchedUserMedias[key] = new Promise((resolve) => (fetchingDone = resolve));

	const option = optionHandler(userMediaQuery, { ...userMediaVariable, userId: id, type });
	const response = await fetch("https://graphql.anilist.co", option);
	const json = await response.json();
	fetchedUserMedias[key] = json.data.MediaListCollection.lists;
	if (DEBUG) localStorage.setItem(debugKey, JSON.stringify(fetchedUserMedias[key]));
	fetchingDone();
	return fetchedUserMedias[key];
}
