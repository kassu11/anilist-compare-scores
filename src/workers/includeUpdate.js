onmessage = async (array) => {
	const [usersT, listTypes, sortType, userMediaData] = array.data;

	const mediaArray = [];
	const checkedArray = {};

	for (const userMedia of userMediaData) {
		for (const type of listTypes) {
			for (const list of userMedia) {
				if (!(list.isCustomList && type === "Custom") && list.name !== type) continue;

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
						const isOnSelectedList = listTypes.find((type) => anime.userLists[userKey]?.[type])?.replace("c-", "");
						if (isOnSelectedList === undefined) continue;

						totalUserCount++;
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
						percentage: totalUserCount / usersT.length,
						users: users.sort((a, b) => {
							return a.list > b.list ? 1 : a.list === b.list ? b.score - a.score : -1;
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
