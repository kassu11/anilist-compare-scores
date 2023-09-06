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
	const [usersT, listTypes, sortType, userMediaData, mediaInfo] = array.data;

	const mediaArray = [];
	const checkedArray = {};

	const excludeUsers = [];
	const includeUsersIndex = [];

	usersT.forEach((u, i) => {
		if (u.exclude) excludeUsers.push(u);
		else includeUsersIndex.push(i);
	});

	for (const iUserIndex of includeUsersIndex) {
		const userMedia = userMediaData[iUserIndex];
		for (const type of listTypes) {
			for (const list of userMedia) {
				const listKey = list.isCustomList ? "Custom" : list.name;
				if (listKey !== type) continue;

				list.entries.forEach((entry) => {
					const mediaKey = entry.media.id;
					if (checkedArray[mediaKey]) return;
					checkedArray[mediaKey] = true;

					let totalUserCount = 0;
					let totalUserWhoScored = 0;
					let totalScore = 0;
					let repeat = 0;
					const users = [];
					const media = mediaInfo[mediaKey];

					for (const eUser of excludeUsers) {
						if (eUser.name in media.userLists) return;
					}

					for (const userIndex of includeUsersIndex) {
						const user = usersT[userIndex];
						const userKey = user.name;
						const isOnSelectedList = listTypes.find((type) => media.userLists[userKey]?.[type]);
						if (!isOnSelectedList) continue;

						totalUserCount++;
						repeat += media.userRepeats[userKey];
						users.push({
							name: user.name,
							avatar: user.avatar.medium,
							score: media.userScores[userKey],
							repeat: media.userRepeats[userKey],
							list: userListOrder[isOnSelectedList],
						});

						if (media.userScores[userKey] > 0) {
							totalScore += media.userScores[userKey];
							totalUserWhoScored++;
						}
					}

					const score = totalScore ? (totalScore / totalUserWhoScored).toFixed(2) : 0;

					mediaArray.push({
						info: media,
						english: media.title.english || media.title.userPreferred,
						native: media.title.native || media.title.userPreferred,
						romaji: media.title.romaji || media.title.userPreferred,
						coverImage: media.coverImage.large,
						color: media.coverImage.color,
						banner: media.bannerImage,
						episodes: media.episodes || media.nextAiringEpisode?.episode || media.chapters || "TBA",
						score,
						repeat,
						percentage: totalUserCount / includeUsersIndex.length,
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
	};

	if (clone) return array.toSorted(sorts[type]);
	return array.sort(sorts[type]);
}
