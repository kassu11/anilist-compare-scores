export const allProcessedMedia = {};
export const allMediaLists = [];

function updateAllProcessedMedia(entries, mediaList, userName) {
	for (const entry of entries) {
		newEntry: {
			if (entry.media.id in allProcessedMedia) break newEntry;
			allProcessedMedia[entry.media.id] = entry.media;

			entry.media.format = mediaFormat(entry.media.format);
			entry.media.season = mediaSeason(entry.media.season);

			entry.media.title.english ??= entry.media.title.userPreferred;
			entry.media.title.native ??= entry.media.title.userPreferred;
			entry.media.title.romaji ??= entry.media.title.userPreferred;

			entry.media.allLists = {};
			entry.media.userLists = {};
			entry.media.userScores = {};
			entry.media.userRepeats = {};
		}

		const media = allProcessedMedia[entry.media.id];

		addEntryToMediaList: {
			if (media.allLists[mediaList.name]) break addEntryToMediaList;
			media.allLists[mediaList.name] = true;

			mediaList.entries.push(media);
		}

		media.userLists[userName] ??= {};
		media.userLists[userName][mediaList.name] = true;
		media.userScores[userName] = entry.score;
		media.userRepeats[userName] = entry.repeat;
	}
}

function mediaFormat(format) {
	if (format === "TV_SHORT") return "TV Short";
	if (format == "TV" || format == "ONA" || format == "OVA") return format;
	return capitalize(format);
}

function mediaSeason(season) {
	if (!season) return "";
	return capitalize(season);
}

function capitalize(string) {
	return string[0].toUpperCase() + string.substring(1).toLowerCase();
}

function getMediaList({ name, isCustomList }) {
	const match = (list) => list.name === name && list.isCustomList === isCustomList;
	const selectedList = allMediaLists.find(match);
	if (selectedList) return selectedList;

	const newList = { name, renderName: name.replace("c-", ""), isCustomList, entries: [] };
	allMediaLists.push(newList);
	return newList;
}
