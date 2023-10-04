const userListOrder = {
	Completed: 1,
	Watching: 2,
	Reading: 3,
	Rewatched: 4,
	Paused: 5,
	Dropped: 6,
	Planning: 7,
	Custom: 8,
	1: "Completed",
	2: "Watching",
	3: "Reading",
	4: "Rewatched",
	5: "Paused",
	6: "Dropped",
	7: "Planning",
	8: "Custom",
};

onmessage = async (array) => {
	const [usersT, listTypes, sortType, userMediaData] = array.data;

	const mediaArray = [];
	const checkedArray = {};

	for (const userMedia of userMediaData) {
		for (const type of listTypes) {
			for (const list of userMedia) {
				const listKey = list.name;
				if (!(list.isCustomList && type === "Custom") && listKey !== type) continue;

				list.entries.forEach((anime) => {
					if (checkedArray[anime.id]) return;
					checkedArray[anime.id] = true;

					let totalUserCount = 0;
					let totalUserWhoScored = 0;
					let totalScore = 0;
					let repeat = 0;
					const users = [];

					for (const user of usersT) {
						const userKey = user.name;
						const isOnSelectedList = listTypes.find((type) => anime.userLists[userKey]?.[type]);
						if (!isOnSelectedList) continue;

						totalUserCount++;
						repeat += anime.userRepeats[userKey];
						users.push({
							name: user.name,
							avatar: user.avatar.medium,
							score: anime.userScores[userKey],
							repeat: anime.userRepeats[userKey],
							list: userListOrder[isOnSelectedList],
						});

						if (anime.userScores[userKey] > 0) {
							totalScore += anime.userScores[userKey];
							totalUserWhoScored++;
						}
					}

					const score = totalScore ? (totalScore / totalUserWhoScored).toFixed(2) : 0;

					mediaArray.push({
						info: anime,
						english: anime.title.english || anime.title.userPreferred,
						native: anime.title.native || anime.title.userPreferred,
						romaji: anime.title.romaji || anime.title.userPreferred,
						coverImage: anime.coverImage.large,
						color: anime.coverImage.color,
						banner: anime.bannerImage,
						episodes: anime.episodes || anime.nextAiringEpisode?.episode || anime.chapters || "TBA",
						score,
						repeat,
						percentage: totalUserCount / usersT.length,
						users: users.sort((a, b) => {
							return a.list - b.list || b.score - a.score;
						}),
					});
				});
			}
		}
	}

	sortArray(mediaArray, sortType);
	postMessage(mediaArray);
};

function sortArray(array, type = "score", clone = false) {
	const sorts = {
		score: (a, b) => b.score - a.score || a.english.localeCompare(b.english),
		repeat: (a, b) => b.repeat - a.repeat || b.score - a.score || a.english.localeCompare(b.english),
		title: (a, b) => a.english.localeCompare(b.english),
		averageScore: (a, b) => b.info.averageScore - a.info.averageScore || a.english.localeCompare(b.english),
	};

	if (clone) return array.toSorted(sorts[type]);
	return array.sort(sorts[type]);
}
