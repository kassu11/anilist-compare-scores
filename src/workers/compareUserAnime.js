onmessage = async (array) => {
	const [users, sortMode, userLists] = array.data;
	users.forEach((u, i) => (u["lists"] = userLists[i]));

	const mediaArray = [];
	const checkedArray = {};

	const excludeUsers = users.filter((user) => user.exclude);
	const includeUsers = users.filter((user) => !user.exclude);
	const userCount = includeUsers.length;
	console.log(includeUsers);

	for (const { searchListNames, lists } of includeUsers) {
		for (const listName of searchListNames) {
			for (const list of lists) {
				if (!(list.isCustomList && listName === "Custom") && listName !== list.name) continue;

				list.entries.forEach((anime) => {
					if (checkedArray[anime.id]) return;
					checkedArray[anime.id] = true;
					for (const { name, searchListNames } of excludeUsers) {
						if (searchListNames === "all" && name in anime.userLists) return;
						else {
							for (const listName of searchListNames) {
								if (listName in anime.userLists[name]) return;
							}
						}
					}

					let totalUserWhoScored = 0;
					let totalScore = 0;
					let repeat = 0;
					const users = [];

					for (const user of includeUsers) {
						const userKey = user.name;
						const isOnSelectedList = user.searchListNames.find((type) => anime.userLists[userKey]?.[type])?.replace("c-", "");
						if (isOnSelectedList === undefined) continue;

						repeat += anime.userRepeats[userKey];
						users.push({
							name: user.name,
							avatar: user.avatar.medium,
							score: anime.userScores[userKey],
							repeat: anime.userRepeats[userKey],
							list: isOnSelectedList,
						});

						if (anime.userScores[userKey] > 0) {
							totalScore += anime.userScores[userKey];
							totalUserWhoScored++;
						}
					}

					const score = totalScore ? (totalScore / totalUserWhoScored).toFixed(2) : 0;

					mediaArray.push({
						info: anime,
						english: anime.title.english,
						native: anime.title.native,
						romaji: anime.title.romaji,
						coverImage: anime.coverImage.large,
						color: anime.coverImage.color,
						banner: anime.bannerImage,
						episodes: anime.episodes,
						score,
						repeat,
						percentage: users.length / userCount,
						users: users.sort((a, b) => {
							return a.list > b.list ? 1 : a.list === b.list ? b.score - a.score : -1;
						}),
					});
				});
			}
		}
	}

	sortArray(mediaArray, sortMode);
	postMessage(mediaArray);
};

function sortArray(array, type = "score", clone = false) {
	const sorts = {
		score: (a, b) => b.score - a.score || a.english.localeCompare(b.english),
		repeat: (a, b) => b.repeat - a.repeat || b.score - a.score || a.english.localeCompare(b.english),
		title: (a, b) => a.english.localeCompare(b.english),
		averageScore: (a, b) => b.info.averageScore - a.info.averageScore || a.english.localeCompare(b.english),
		user: (a, b) => b.users.length - a.users.length || b.score - a.score || a.english.localeCompare(b.english),
	};

	if (clone) return array.toSorted(sorts[type]);
	return array.sort(sorts[type]);
}
