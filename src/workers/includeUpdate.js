// import test from "../utilities/test.js";

onmessage = async (array) => {
	console.log(array.data);
	const [usersT, listTypes, type, sortType] = array.data;

	const mediaArray = [];
	const checkedArray = {};

	await updateMediaInfoObject();

	for (const user of usersT) {
		const userMedia = await fetchUserMedia(user, type);
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

					for (const user of usersT) {
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
							list: userLisrOrder[isOnSelectedList],
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
	return mediaArray;
};

export async function includeUpdate(usersT, listTypes, type, sortType) {
	const mediaArray = [];
	const checkedArray = {};

	await updateMediaInfoObject();

	for (const user of usersT) {
		const userMedia = await fetchUserMedia(user, type);
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

					for (const user of usersT) {
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
							list: userLisrOrder[isOnSelectedList],
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
	return mediaArray;
}

function sortArray(array, type = "score", clone = false) {
	const sorts = {
		score: (a, b) => b.score - a.score || a.english.localeCompare(b.english),
		repeat: (a, b) => b.repeat - a.repeat || b.score - a.score || a.english.localeCompare(b.english),
		title: (a, b) => a.english.localeCompare(b.english),
	};

	if (clone) return array.toSorted(sorts[type]);
	return array.sort(sorts[type]);
}

// onmessage = (e) => {
// 	// console.log("Message received from main script");
// 	// const workerResult = `Result: ${e.data[0] * e.data[1]}`;
// 	// console.log("Posting message back to main script");
// 	console.log(e.data);
// 	postMessage("asdasd");
// };
